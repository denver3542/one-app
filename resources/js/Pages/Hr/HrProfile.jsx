import { Box, Button, Divider, Grid, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import PageHead from '../../components/Table/PageHead'
import axiosInstance, { getJWTHeader } from '../../utils/axiosConfig'
import { getComparator, stableSort } from '../../components/utils/tableUtils'
import moment from 'moment/moment'
import HomeLogo from '../../../images/home-logo.png'
import '../../../../resources/css/calendar.css'
import PayrollHistory from '../../components/Modals/PayrollHistory'
const headCells = [

    {
        id: 'payroll_fromdate',
        label: 'DATE OF PAYROLL',
        sortable: true,
    },
    {
        id: 'total_contribution',
        label: 'EMPLOYEE CONTRIBUTION',
        sortable: true,
    },
    {
        id: 'total_deduction',
        label: 'TOTAL DEDUCTION',
        sortable: true,
    },
    {
        id: 'net_pay',
        label: 'NETPAY',
        sortable: true,
    },
    {
        id: 'payroll_cutoff',
        label: 'Cutoff',
        sortable: true,
    },
    {
        id: 'payroll_status',
        label: 'Status',
        sortable: true,
    },
    {
        id: ' ',
        label: 'ACTION',
        sortable: false,
    }



];

const HrProfile = () => {
    const queryParameters = new URLSearchParams(window.location.search)
    const [searchParams, setSearchParams] = useSearchParams()
    const empID = searchParams.get('employeeID')
    const storedUser = localStorage.getItem("nasya_user");
    const headers = getJWTHeader(JSON.parse(storedUser));
    const [userData, setUserData] = useState([])
    const [payrollRecord, setPayrollRecord] = useState([])
    const [filterPayroll, setFilterPayroll] = useState([]);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openRecord, setOpenRecord] = useState(false);
    const [recordData, setRecordData] = useState([]);
    const [payslip, setPayslip] = useState([]);
    const [present, setPresent] = useState([]);
    const [application, setApplication] = useState([]);

    useEffect(() => {
        axiosInstance.get(`/profile/userData/${empID}`, { headers })
            .then((response) => {
                setUserData(response.data.userData);
                setPayslip(response.data.payslip);
                setPresent(response.data.present);
                setApplication(response.data.application);
            })
            .catch((error) => {
                console.log('error', error.response)
            })
    }, [])

    const handleBacktoProccess = () => {
        window.location.replace('/hr/employees')
    }

    useEffect(() => {
        getPayrolls(empID)
    }, [empID])

    const getPayrolls = async (empID) => {
        await axiosInstance.get(`/payrollHistory/${empID}`, { headers })
            .then((response) => {
                setPayrollRecord(response.data.payrollHistory);
                setFilterPayroll(response.data.payrollHistory);
                // console.log(response.data.test);
            })
    }

    // FOR TABLE SORTING DATA ETC..
    const handleRequestSort = (_event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (_event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
        setPage(0);
    };
    const handleFilter = (event) => {
        const filtered = payrollRecord.filter(application => `${application?.payroll_fromdate}`.toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase()));
        if (event.target.value != '') {
            setPayrollRecord(filtered);
        } else {
            setPayrollRecord(filterPayroll);
        }
    }
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - payrollRecord.length) : 0;
    // END

    const handleOpenModal = (data) => {
        setOpenRecord(true)
        setRecordData(data)
    }

    const handleCloseModal = () => {
        setOpenRecord(false)
    }

    const profile = userData.profile_pic ? "https://nasyaportal.ph/assets/media/upload/" + userData.profile_pic : HomeLogo
    return (
        <Layout>
            <div className="content-heading d-flex justify-content-start p-0">
                <div style={{ marginTop: 10, marginBottom: 5, marginRight: 2 }}>
                    <Button
                        type="submit"
                        variant="outlined"
                        onClick={handleBacktoProccess}
                    >
                        <i className="fa fa-arrow-left mr-2"></i>Back
                    </Button>
                </div>
                <h5 className='pt-3 pl-10'>User Profile</h5>
            </div>
            <Grid container columnSpacing={{ xs: 1, sm: 2, md: 5 }}>
                <Grid item lg={12} xs={12}>
                    <Box component="div" className="block" sx={{ padding: 0 }}>
                        <Box component="div" className="block-content" sx={{ padding: 0, height: '300px' }}>
                            <Grid container columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
                                <Grid item lg={2} xs={12} sx={{ padding: 0 }}>
                                    <img src={profile} style={{
                                        width: '100%', height: '300px', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px', objectFit: 'fill'
                                    }} />
                                </Grid>
                                <Grid item lg={10} xs={12} sx={{ padding: 2 }}>
                                    <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                        <Grid item lg={5} xs={12} className='d-flex justify-content-between' sx={{ height: '270px' }}>
                                            <Box component="div" className='p-4'>
                                                <Typography variant="subtitle2" sx={{ color: '#619d49', marginBottom: 2 }}>{'Employee #' + userData.user_id}</Typography>
                                                <Typography variant='h6'>{userData.fname + ' ' + userData.mname + ' ' + userData.lname}</Typography>
                                                <Typography sx={{ fontSize: 14, fontWeight: 'bold' }}>{userData.category}</Typography>
                                                <Typography variant="subtitle2" sx={{ color: '#8d8a8a' }}>{'Date Hired'}</Typography>
                                                <Typography sx={{ fontSize: 14 }}>{userData.date_hired ? moment(userData.date_hired).format('MMMM DD, YYYY') : 'n/a'}</Typography>
                                                <Typography variant="subtitle2" sx={{ color: '#8d8a8a' }}>{'Email'}</Typography>
                                                <Typography sx={{ fontSize: 14 }}>{userData.email ? userData.email : 'n/a'}</Typography>
                                            </Box>
                                            <Box component="div" className='p-4'>
                                                <Typography variant="subtitle2" sx={{ color: '#8d8a8a', marginTop: 4 }}>{'Status'}</Typography>
                                                <Typography sx={{ fontSize: 14 }}>{userData.status ? userData.status : 'n/a'}</Typography>
                                                <Typography variant="subtitle2" sx={{ color: '#8d8a8a' }}>{'Department'}</Typography>
                                                <Typography sx={{ fontSize: 14 }}>{userData.department ? userData.department : 'n/a'}</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item lg={7} xs={12} sx={{ borderLeft: 2, borderColor: '#f0f2f5', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', height: '270px' }}>
                                            <Box component="div" className='d-flex justify-content-around text-center' sx={{ width: '100%' }}>
                                                <Box component="div">
                                                    <Box component="div" style={{ width: '100px', height: '100px', backgroundColor: '#7eb73d', borderRadius: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                                                        <Typography variant='h4' className='text-white'>{payslip}</Typography>
                                                    </Box>
                                                    <Typography variant="subtitle2" sx={{ color: '#8d8a8a', width: '100px' }}>{'Signed Payroll Slips'}</Typography>
                                                </Box>
                                                <Box component="div">
                                                    <Box component="div" style={{ width: '100px', height: '100px', backgroundColor: '#eab000', borderRadius: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                                                        <Typography variant='h4' className='text-white'>{present}</Typography>
                                                    </Box>
                                                    <Typography variant="subtitle2" sx={{ color: '#8d8a8a', width: '100px' }}>{'Total Present Attendance'}</Typography>
                                                </Box>
                                                <Box component="div">
                                                    <Box component="div" style={{ width: '100px', height: '100px', backgroundColor: '#de5146', borderRadius: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                                                        <Typography variant='h4' className='text-white'>{application}</Typography>
                                                    </Box>
                                                    <Typography variant="subtitle2" sx={{ color: '#8d8a8a', width: '100px' }}>{'Total Applications'}</Typography>
                                                </Box>

                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
                <Grid item lg={12} xs={12} className="pt-10 pb-10">
                    <Box component="div" className="block">
                        <Box component="div" className="block-content" sx={{ padding: 0 }}>
                            <Box component="div" sx={{ padding: 2 }}>
                                <div className='content-heading  d-flex justify-content-lg-between pt-2 pb-3 pl-2'>
                                    <Typography variant="h6" sx={{ paddingTop: 3 }}>Payroll History</Typography>
                                    {/* <PageToolbar handleSearch={handleFilter} /> */}
                                    {/* handleSearch={handleFilter}  */}
                                    {/* <button type="button" className="btn btn-sm btn-primary mx-5 h-50 mt-10" data-toggle="modal" data-target="#add_attendance" id="new_report" >Add Atttendance
                            </button> */}
                                </div>
                                <TableContainer>
                                    <Table className="table table-md  table-striped  table-vcenter">
                                        <PageHead
                                            order={order}
                                            orderBy={orderBy}
                                            onRequestSort={handleRequestSort}
                                            headCells={headCells}
                                        />
                                        <TableBody>
                                            {stableSort(payrollRecord, getComparator(order, orderBy))
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((payrollList, index) => {
                                                    return (
                                                        <TableRow key={index} hover
                                                            role="checkbox"
                                                            tabIndex={-1}>

                                                            <TableCell>{moment(payrollList.payroll_fromdate).format('MMM.DD') + ' - ' + moment(payrollList.payroll_todate).format('MMM.DD')}</TableCell>
                                                            <TableCell>{'₱' + payrollList.total_contribution}</TableCell>
                                                            <TableCell>{'₱' + payrollList.total_deduction}</TableCell>
                                                            <TableCell>{'₱' + payrollList.net_pay}</TableCell>
                                                            <TableCell>
                                                                <div className=' p-1rounded-lg' sx={{ display: 'flex', flexDirection: 'column' }}>
                                                                    {payrollList.payroll_cutoff != 2 ? 'First' : 'Second'}
                                                                    <Typography variant='subtitle2' className='text-white rounded-lg' style={{
                                                                        backgroundColor: payrollList.payroll_cutoff != 2 ? '#0c3c73' : '#e84b45', width: '50px',padding:'2px'
                                                                    }}> </Typography></div></TableCell>
                                                            <TableCell>
                                                                <div className='d-flex justify-content-start p-1 text-white rounded-lg'>
                                                                    <Typography variant='subtitle2' className='p-1 text-white rounded-lg' style={{
                                                                        backgroundColor: payrollList.signature != null ? 'green' : payrollList.payroll_status === 1 ? '#eab000' : payrollList.payroll_status === 3 ? '#197ed1' : '#808080'
                                                                    }}>{payrollList.signature != null ? 'Signed' : payrollList.payroll_status === 1 ? 'Received' : payrollList.payroll_status === 3 ? 'Sent' : 'Saved'}</Typography></div>
                                                            </TableCell>
                                                            <TableCell>  <div className='d-flex justify-content-start p-0 m-0'><button type="button" onClick={() => handleOpenModal(payrollList)} className="btn btn-primary btn-sm mr-2" id="new_report" ><i className="fa fa-search"></i>
                                                            </button></div></TableCell>
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
                                    count={payrollRecord.length}
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
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            {openRecord &&
                <PayrollHistory open={openRecord} close={handleCloseModal} data={recordData} />
            }
        </Layout>
    )
}

export default HrProfile