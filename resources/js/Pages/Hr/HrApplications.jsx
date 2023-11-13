import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { Table, TableBody, TableCell, TableContainer, TableRow, Select, MenuItem, InputLabel, Box, FormControl, TextField, Typography, FormGroup, IconButton, Button, Icon, TablePagination, Link } from '@mui/material'
import moment from 'moment'
import PageHead from '../../components/Table/PageHead'
import { getComparator, stableSort } from '../../components/utils/tableUtils'
import axiosInstance, { getJWTHeader } from '../../utils/axiosConfig'
import PageToolbar from '../../components/Table/PageToolbar'
import ApplicationStatusModal from '../../components/Modals/ApplicationStatusModal'
import ApplicationAddStatusModal from '../../components/Modals/ApplicationAddStatusModal'
import Swal from 'sweetalert2'
import '../../../../resources/css/calendar.css'
const headCells = [
    {
        id: 'fname',
        label: 'Name',
        sortable: true,
    },

    {
        id: 'leave_type',
        label: 'Application Type',
        sortable: true,
    },
    {
        id: 'date_from',
        label: 'Date of Application',
        sortable: true,
    },
    {
        id: 'date_to',
        label: 'Date of Effectivity',
        sortable: true,
    },
    {
        id: 'attdn_date',
        label: 'Number of Hours',
        sortable: true,
    },
    {
        id: 'remarks',
        label: 'Remarks',
        sortable: true,
    },
    {
        id: 'app_file',
        label: 'File Uploaded',
        sortable: true,
    },
    {
        label: 'Status',
        sortable: false,
    },



];

const HrApplications = () => {
    const [totalApplcations, setTotalApplications] = useState([]);
    const [filterApplication, setFilterApplication] = useState([]);
    const [triggerChange, setTriggerChange] = useState(false);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const storedUser = localStorage.getItem("nasya_user");
    const headers = getJWTHeader(JSON.parse(storedUser));
    const [appData, setAppData] = useState({
        user_id: '',
        application_id: '',
        workday_id: '',
        app_file: '',
        status: '',
        color: '',
    });

    useEffect(() => {
        axiosInstance.get('/applications', { headers })
            .then((response) => {
                setTotalApplications(response.data.applications);
                setFilterApplication(response.data.applications);
                // location.reload();
            })
            .catch((error) => {
                console.log('error', error.response)
            })

    }, [])

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
        const filtered = totalApplcations.filter(application => `${application?.fname} ${application?.lname}`.toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase()));
        if (event.target.value != '') {
            setTotalApplications(filtered);
        } else {
            setTotalApplications(filterApplication);
        }
    }

    const handleApplication = (data) => {
        setAppData(data)
    }
    const deleteApplication = (data) => {
        new Swal({
            customClass: {
                container: 'my-swal'
            },
            title: "Are you sure?",
            text: "to remove this application",
            icon: "warning",
            dangerMode: true,
            showCancelButton: true,
        }).then(res => {
            if (res.isConfirmed) {
                axiosInstance.post('/delete_applications', {
                    application_id: data
                }, { headers })
                    .then((response) => {
                        if (response.data.message === 'Success') {
                            Swal.fire({
                                title: "Success!",
                                text: "Applcation has been Removed",
                                icon: "success",
                                timer: 1000,
                                showConfirmButton: false
                            }).then(function () {
                                location.reload()
                            });
                        } else {
                            Swal.fire({
                                title: "danger!",
                                text: "Something went wrong",
                                icon: "warning",
                                timer: 1000,
                                showConfirmButton: false
                            });
                        }
                    })
                    .catch((error) => {
                        alert('error', error.response)
                    })
            }
        })


    }

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - totalApplcations.length) : 0;
    return (
        <Layout>
            <div className="content-heading d-flex justify-content-between p-0">
                <h5 className='pt-3'>List of Applications</h5>
                <button type="button" className="btn btn-sm btn-light mx-5 h-50 mt-15" data-toggle="modal" data-target="#add_status_modal" id="new_report" >Add Status
                </button>
            </div>
            <div className='block'>
                <div className=" block-content col-lg-12 col-sm-12 ">
                    <div className='d-flex justify-content-lg-end p-3'>
                        <PageToolbar handleSearch={handleFilter} />
                        {/* handleSearch={handleFilter}  */}
                        {/* <button type="button" className="btn btn-sm btn-primary mx-5 h-50 mt-10" data-toggle="modal" data-target="#add_attendance" id="new_report" >Add Atttendance
                            </button> */}

                    </div>
                    <TableContainer>
                        <Table className="table table-md table-striped table-vcenter">
                            <PageHead
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                                headCells={headCells}
                            />
                            <TableBody>
                                {stableSort(totalApplcations, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((attdn, index) => {
                                        if (attdn.is_deleted != 1) {
                                            console.log(attdn);
                                            return (
                                                <TableRow key={index} hover
                                                    role="checkbox"
                                                    tabIndex={-1}>
                                                    <TableCell >
                                                        <img src={"https://nasyaportal.ph/assets/media/upload/" + attdn.profile_pic} style={{
                                                            height: 35, width: 35, borderRadius: 50, objectFit: 'cover', marginRight: 10
                                                        }} />
                                                        {attdn.fname} {attdn.lname}</TableCell>
                                                    <TableCell>{attdn.leave_type}</TableCell>
                                                    <TableCell>{moment(attdn.date_from).format('MMM. DD, YYYY')}</TableCell>
                                                    <TableCell>{moment(attdn.date_to).format('MMM. DD, YYYY')}</TableCell>
                                                    <TableCell>{attdn.app_hours + 'hrs'}</TableCell>
                                                    <TableCell>{attdn.remarks ? attdn.remarks : 'n/a'}</TableCell>
                                                    <TableCell >
                                                        <Link  href={'https://nasyaportal.ph/assets/media/upload/' + attdn.app_file} target="_blank">
                                                           {attdn.app_file.substr(0, 9) + '...'}
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>
                                                        <p style={{ backgroundColor: attdn.color, borderRadius: '5%' }} className='p-1 text-center  p-0 m-0 m-1 rounded-lg text-white'>{attdn.status}</p>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className='border-0 d-flex justify-content-end gap-2'><button className='btn btn-success btn-sm mr-2' onClick={() => handleApplication(attdn)} data-toggle="modal" data-target="#edit_application_modal"><i className="fa fa-pencil"></i></button>
                                                            <button className='btn btn-danger btn-sm mr-2' onClick={() => deleteApplication(attdn.application_id)}><i className="fa fa-trash"></i></button>

                                                        </div>
                                                    </TableCell>
                                                </TableRow>

                                            )
                                        }
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
                        count={totalApplcations.length}
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
            <ApplicationStatusModal modalID="edit_application_modal" appData={appData} triggerChange={triggerChange} setTriggerChange={setTriggerChange} />
            <ApplicationAddStatusModal modalID="add_status_modal" />
        </Layout>
    )
}

export default HrApplications