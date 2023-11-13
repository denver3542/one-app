import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { Table, TableBody, TableCell, TableContainer, TableRow, Select, MenuItem, InputLabel, Box, FormControl, TextField, Typography, FormGroup, IconButton, Button, Icon, TablePagination } from '@mui/material'
import moment from 'moment'
import PageHead from '../../components/Table/PageHead'
import { getComparator, stableSort } from '../../components/utils/tableUtils'
import axiosInstance, { getJWTHeader } from '../../utils/axiosConfig'
import PageToolbar from '../../components/Table/PageToolbar'
import PayrollModal from '../../components/Modals/PayrollModal'
import ApplicationAddListModal from '../../components/Modals/ApplicationAddListModal'
import axios from 'axios'
import ApplicationEditListModal from '../../components/Modals/ApplicationEditListModal'
import Swal from 'sweetalert2'

const headCells = [
    {
        id: 'idx',
        label: '#',
    },
    {
        id: 'Title',
        label: 'Title',
        sortable: true,
    },
    {
        id: 'Percentage',
        label: 'Percentage',
        sortable: true,
    },
    {
        id: 'Date Created',
        label: 'Date Created',
        sortable: true,
    },
 


];

const HrApplicationList = () => {
    const [appList, setAppList] = useState([]);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const storedUser = localStorage.getItem("nasya_user");
    const headers = getJWTHeader(JSON.parse(storedUser));
    const [appListData, setAppListData] = useState({
        applist_id: '',
        list_name: '',
        percentage: 0
    });

    useEffect(() => {
        axiosInstance.get('/applications_list', { headers }).then((response) => {
            setAppList(response.data.applicationList)
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

    const handleList = (app_list) => {
        setAppListData(app_list)
    }
    const handleDeleteList = (applist_id) => {
        const formData = new FormData();
        formData.append('applist_id', applist_id);

        new Swal({
            title: "Are you sure?",
            text: "You want to update this application?",
            icon: "warning",
            dangerMode: true,
        }).then(res => {
            if (res.isConfirmed) {
                axiosInstance.post('/delete_type_application', formData, { headers }).then((response) => {
                    if (response.data.message === 'Success') {
                        Swal.fire(
                            'Success!',
                            'Application has been deleted successfully',
                            'success'
                        ).then(function (response) {
                            location.reload();
                        });
                    } else {
                        alert("Error! try again");
                    }
                })
            }
        });
    }

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - appList.length) : 0;

    return (
        <Layout>
            <div className="content-heading d-flex justify-content-between p-0">
                <h5 className='pt-3'>Type of Applications</h5>
                <button type="button" className="btn btn-sm btn-light mx-5 h-50 mt-15" data-toggle="modal" data-target="#add_new_list" id="new_report" >Add New
                </button>
            </div>
            <div className="row g-2">
                <div className="col-lg-12 col-sm-12 ">
                    <div className="p-3 border bg-light" style={{ boxShadow: 'rgba(149, 157, 165, 0.2)O 0px 8px 24px' }}>
                        <div className='d-flex justify-content-lg-end p-3'>
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
                                    {stableSort(appList, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((app_list, index) => {
                                            return (
                                                <TableRow key={index} hover
                                                    role="checkbox"
                                                    tabIndex={-1}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{app_list.list_name}</TableCell>
                                                    <TableCell>{(app_list.percentage * 100).toFixed(0) + '%'}</TableCell>
                                                    <TableCell>{moment(app_list.date_created).format('MMM. D, YYYY')}</TableCell>
                                                    <TableCell>  <div className='d-flex justify-content-end p-0 m-0'><button type="button" className="btn btn-success btn-sm mr-2" data-toggle="modal" data-target="#edit_new_list" id="new_report" onClick={() => handleList(app_list)}><i className="fa fa-pencil"></i>
                                                    </button>
                                                        <button type="button" className="btn btn-danger btn-sm mr-2" id="new_report" onClick={() => handleDeleteList(app_list.applist_id)}>
                                                            <li className='fa fa-trash' style={{ fontSize: 14 }}></li>
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
                            count={appList.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage} />
                    </div>
                </div>


            </div>
            <ApplicationAddListModal modalID="add_new_list" />
            <ApplicationEditListModal modalID="edit_new_list" data={appListData} />
        </Layout>
    )
}

export default HrApplicationList