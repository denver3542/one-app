import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableRow, TablePagination, Box, Typography } from '@mui/material'
import Layout from '../../components/Layout/Layout'
import axiosInstance, { getJWTHeader } from '../../utils/axiosConfig';
import PageHead from '../../components/Table/PageHead'
import PageToolbar from '../../components/Table/PageToolbar'
import { getComparator, stableSort } from '../../components/utils/tableUtils';
import moment from 'moment';
import HrEmployeeAddModal from '../../components/Modals/HrEmployeeAddModal';
import HrEmployeeEditModal from '../../components/Modals/HrEmployeeEditModal';
import HrEmployeeWorkdayModal from '../../components/Modals/HrEmployeeWorkdayModal';
import HrEmployeeBenefits from '../../components/Modals/HrEmployeeBenefits';
import HrEmployeeLoans from '../../components/Modals/HrEmployeeLoans';
import HrEmployeeContributions from '../../components/Modals/HrEmployeeContributions';
import HomeLogo from '../../../images/home-logo.png'
import { useNavigate } from 'react-router-dom';
const headCells = [
    {
        id: 'fname',
        label: 'Name',
        sortable: true,
    },
    {
        id: 'email',
        label: 'Email',
        sortable: true,
    },
    {
        id: 'contact_number',
        label: 'Contact Number',
        sortable: true,
    },
    {
        id: 'date_hired',
        label: 'Date Hired',
        sortable: true,
    },
    {
        id: 'department',
        label: 'Department',
        sortable: true,
    },

    {
        id: 'address',
        label: 'Complete Address',
        sortable: true,
    },
    {
        id: 'status',
        label: 'Status',
        sortable: true,
    },

];

const HrEmployees = () => {
    const [employeeDetails, setEmployeeDetails] = useState([]);
    const [numberWorkdays, setNumberWorkdays] = useState();
    const [filterEmployee, setFilterEmployee] = useState([]);
    const [openBenefit, setOpenBenefit] = useState(false)
    const [openLoan, setOpenLoan] = useState(false)
    const [openContri, setOpenContri] = useState(false)
    const [open, setOpen] = useState(false);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const storedUser = localStorage.getItem("nasya_user");
    const [empEdit, setEmpEdit] = useState(false);
    const headers = getJWTHeader(JSON.parse(storedUser));
    const [modalData, setModalData] = useState({
        user_id: '',
        fname: '',
        mname: '',
        lname: '',
        address: '',
        contact_number: '',
        email: '',
        bdate: '',
        user_type: '',
        status: '',
        hourly_rate: '',
        daily_rate: '',
        monthly_rate: '',
        department: '',
        category: '',
        date_hired: '',
    });
    const navigate = useNavigate();
    useEffect(() => {
        axiosInstance.get('/employees', { headers }).then((response) => {
            setEmployeeDetails(response.data.employee);
            setFilterEmployee(response.data.employee);
            setNumberWorkdays(response.data.workdays);
        });
    }, [])

    const handleOpenBenefit = () => {
        setOpenBenefit(true)
    }
    const handleOpenLoan = () => {
        setOpenLoan(true)
    }
    const handleOpenContribution = () => {
        setOpenContri(true)
    }
    const handleCloseBenefit = () => {
        setOpenBenefit(false)
    }
    const handleCloseLoan = () => {
        setOpenLoan(false)
    }
    const handleCloseContribution = () => {
        setOpenContri(false)
    }
    const handleRequestSort = (_event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSearch = async (id) => {
        const empdetails = await axiosInstance.get(`/search-employees/${id}`, { headers })
        setModalData(empdetails.data.update_employee)
        setEmpEdit(true);
    }

    const handleChangePage = (_event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleFilter = (event) => {
        const filtered = employeeDetails.filter(employee => `${employee?.fname} ${employee?.lname} ${employee?.date_hired} ${employee?.department} ${employee?.category} `.toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase()));
        if (event.target.value != '') {
            setEmployeeDetails(filtered);
        } else {
            setEmployeeDetails(filterEmployee);
        }
    }
    const handleLoadCalendar = () => {
        setOpen(true);
    }
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - employeeDetails.length) : 0;

    const handleProfile = (id) => {
        navigate('/hr/profile?employeeID=' + id)
    }
    return (<Layout title={"Employees"}>
        <div className="content-heading d-flex justify-content-between p-0">
            <h5 className='pt-3'>Employees</h5>
            <div>
                <div className="btn-group" role="group">
                    <button type="button" className="btn btn-sm btn-light mx-5 h-50 mt-15  dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i className="fa fa-gear"></i> Add Task
                    </button>
                    <div className="dropdown-menu dropdown-menu-right" x-placement="bottom-end" aria-labelledby="btnGroupVerticalDrop1">
                        <a className="dropdown-item" style={{ cursor: 'pointer' }} data-toggle="modal" data-target="#add_new_status" id="new_report">
                            <i className="	fa fa-file-text mr-5"></i>Add Status
                        </a>

                        <a className="dropdown-item" style={{ cursor: 'pointer' }} data-toggle="modal" data-target="#add_new_workday" id="new_report" onClick={handleLoadCalendar} >
                            <i className="fa fa-calendar mr-5"></i>Set Work Days
                        </a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" style={{ cursor: 'pointer' }} onClick={handleOpenBenefit}>
                            <i className="fa fa-plus mr-5"></i>Additional Benefits
                        </a>
                        <a className="dropdown-item" style={{ cursor: 'pointer' }} onClick={handleOpenLoan}>
                            <i className="fa fa-plus mr-5"></i>Additional Loans
                        </a>
                        <a className="dropdown-item" style={{ cursor: 'pointer' }} onClick={handleOpenContribution}>
                            <i className="fa fa-plus mr-5"></i>Employer Contributions
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div className='block'>
            <div className=" block-content bg-light" style={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}>
                <div className='d-flex justify-content-end p-3'>

                    <PageToolbar handleSearch={handleFilter} />
                    {/* <button type="button" className="btn btn-sm btn-primary mx-5 h-50 mt-10" data-toggle="modal" data-target="#add_new_file" id="new_report" onClick={() => setShowEdit(false)}>New Report
                    </button> */}
                </div>
                <TableContainer>
                    <Table className="table table-md  table-striped  table-vcenter " >
                        <PageHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            headCells={headCells}
                        />
                        <TableBody>
                            {stableSort(employeeDetails, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((emp, index) => {

                                    return (
                                        <TableRow key={index} hover
                                            role="checkbox"
                                            tabIndex={-1}
                                        >
                                            <TableCell>
                                            {emp.profile_pic ? <img src={"https://nasyaportal.ph/assets/media/upload/" + emp.profile_pic} style={{
                                                height: 35, width: 35, borderRadius: 50, objectFit: 'cover', marginRight: 10
                                            }} /> : <img src={HomeLogo} style={{
                                                height: 35, width: 35, borderRadius: 50, objectFit: 'cover', marginRight: 10
                                            }} />}
                                                 {emp.fname} {emp.lname}</TableCell>
                                            <TableCell>{emp.email}</TableCell>
                                            <TableCell>{emp.contact_number}</TableCell>
                                            <TableCell>{emp.date_hired ? moment(emp.date_hired).format('MMMM D, YYYY') : 'n/a'}</TableCell>
                                            <TableCell>{emp.department ? emp.department : "Not yet assign!"}</TableCell>
                                            <TableCell>{emp.address}</TableCell>
                                            <TableCell>
                                                <div className='d-flex justify-content-start p-1 text-white rounded-lg'><Typography variant='subtitle2'  className={(emp.status == "Active") ? "d-flex justify-content-start p-1 text-white rounded-lg bg-success text-center text-white pt-1 pb-1 rounded-lg" : (emp.status == "Terminated") ? "d-flex justify-content-start p-1 text-white rounded-lg bg-warning text-center text-white pt-1 pb-1 rounded-lg" : (emp.status == "Suspended") ? "d-flex justify-content-start p-1 text-white rounded-lg bg-danger text-center text-white pt-1 pb-1 rounded-lg" : "d-flex justify-content-start p-1 text-white rounded-lg bg-dark text-center text-white pt-1 pb-1 rounded-lg"}>{emp.status ?? 'Not yet assign!'}</Typography></div>
                                            </TableCell>
                                            <TableCell>
                                                <div className='border-0 d-flex justify-content-center'>

                                                    <button className='btn btn-success btn-sm mr-2' onClick={() => handleSearch(emp.user_id)} data-toggle="modal" data-target="#add_new_file">
                                                        <i className="fa fa-pencil"></i>
                                                    </button>
                                                    <button className='btn btn-primary btn-sm mr-2' onClick={() => handleProfile(emp.user_id)}>
                                                        <i className="fa fa-arrow-right"></i>
                                                    </button>

                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )

                                })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: 53 * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={employeeDetails.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage} 
                sx={{
                    '.MuiTablePagination-actions': {
                        marginBottom: '20px'
                    },
                    '.MuiInputBase-root': {
                        marginBottom: '20px'
                    }
                }} 
                />
            </div>


        </div>
        <HrEmployeeAddModal modalID="add_new_status" />
        <HrEmployeeBenefits open={openBenefit} close={handleCloseBenefit} />
        <HrEmployeeLoans open={openLoan} close={handleCloseLoan} />
        <HrEmployeeContributions open={openContri} close={handleCloseContribution} />
        <HrEmployeeEditModal modalID="add_new_file" data={modalData} wkdays={numberWorkdays} empEdit={setEmpEdit} />
        <HrEmployeeWorkdayModal modalID="add_new_workday" open={open} setOpen={setOpen} />


    </Layout >

    )
}

export default HrEmployees