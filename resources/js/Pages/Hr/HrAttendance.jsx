import { Table, TableBody, TableCell, TableContainer, TableRow, Select, MenuItem, InputLabel, Box, FormControl, TextField, Typography, FormGroup, IconButton, Button, Icon, TablePagination } from '@mui/material'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import AttendanceAddAbsence from '../../components/Modals/AttendanceAddAbsence'
import AttendanceViewModal from '../../components/Modals/AttendanceViewModal'
import PageHead from '../../components/Table/PageHead'
import PageToolbar from '../../components/Table/PageToolbar'
import { getComparator, stableSort } from '../../components/utils/tableUtils'
import axiosInstance, { getJWTHeader } from '../../utils/axiosConfig'

const headCells = [

    {
        id: 'fname',
        label: 'Name',
        sortable: true,
    },
    {
        id: 'category',
        label: 'Designation',
        sortable: true,
    },
    {
        id: 'department',
        label: 'Department',
        sortable: true,
    },
    {
        id: 'dutyHours',
        label: 'Duty Hours',
        sortable: true,
    },
    {
        id: 'attdn_date',
        label: 'Tardiness',
        sortable: false,
    },
    {
        id: 'attdn_date',
        label: 'Absences',
        sortable: false,
    },
    {
        id: 'attdn_date',
        label: 'Total Hours',
        sortable: false,
    },



];

const years = () => {
    const now = new Date().getUTCFullYear();
    return Array(now - (now - 20)).fill('').map((v, idx) => now - idx);
}

const HrAttendance = () => {
    // const now = new Date().getUTCFullYear();    
    // const years = Array(now - (now - 20)).fill('').map((v, idx) => now - idx);
    const allYears = years();
    const { empID, month, year } = useParams();
    const queryParameters = new URLSearchParams(window.location.search)
    const [searchParams, setSearchParams] = useSearchParams()

    const [totalAttendance, setTotalAttendance] = useState([]);
    const [filterAttendance, setFilterAttendance] = useState([]);
    const [selectMonth, setSelectMonth] = useState(searchParams.get('month'))
    const [selectYear, setSelectYear] = useState(searchParams.get('year'))
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const storedUser = localStorage.getItem("nasya_user");
    const headers = getJWTHeader(JSON.parse(storedUser));
    const [open, setOpen] = useState(false);
    const [openView, setOpenView] = useState(false)
    const [selectedAttendnace, setSelectedAttendnace] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (searchParams.get('month') && searchParams.get('year') && searchParams.get('user_id') && !openView) {
            setSelectedAttendnace({
                'month': searchParams.get('month'),
                'year': searchParams.get('year'),
                'user_id': searchParams.get('user_id'),
            });
            setOpenView(true);
            
        }
    }, [empID, openView]);

    const handleOpen = (attdn) => {
        setOpen(true);
        setSelectedAttendnace({ attdn });
    };
    const handleOpenView = (attdn, month, year) => {
        setOpenView(true);
        setSelectedAttendnace({
            'month': month,
            'year': year,
            'user_id': attdn,
        });
        navigate(`/hr/attendance?month=${month}&year=${year}&user_id=${attdn}`)

    };

    const handleCloseAbsences = () => {
        setOpen(false)
    }
    const handleCloseView = () => {
        setOpenView(false)
        navigate(`/hr/attendance?month=${selectMonth}&year=${selectYear}`)
        setSelectMonth(selectMonth)
        setSelectYear(selectYear)
    }
    useEffect(() => {
        filterChangeMonth(selectMonth, selectYear)

    }, [selectMonth, selectYear])

    const filterChangeMonth = (month_val, year_val) => {
        axiosInstance.post('/get-attendance', { month: month_val, year: year_val }, { headers })
            .then((response) => {
                setTotalAttendance(response.data.attendance);
                setFilterAttendance(response.data.attendance);
                // location.reload();
            })
    }

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
        const filtered = totalAttendance.filter(attdn => `${attdn?.fname} ${attdn?.lname}`.toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase()));
        if (event.target.value != '') {
            setTotalAttendance(filtered);
        } else {
            setTotalAttendance(filterAttendance);
        }
    }
    
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - totalAttendance.length) : 0;

    
    const handleChangeMonth = (e) => {
        const newMonth = e.target.value
        setSelectMonth(newMonth)
        setSearchParams({
            ['month']: newMonth,
            ['year']: queryParameters.get('year')
        })
    }
    const handleChangeYear = (e) => {
        const newYear = e.target.value
        setSelectYear(newYear)
        setSearchParams({
            ['month']: queryParameters.get('month'),
            ['year']: newYear
        })
    }

    return (
        <Layout>
            <div className="content-heading d-flex justify-content-between p-0">
                <div><h5 className='pt-3'>List of Attendance</h5></div>
                <div>
                    <FormControl size="small">
                        <InputLabel id="demo-simple-select-label">Month</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="month_attendance"
                            value={selectMonth}
                            label="Month"
                            onChange={handleChangeMonth}
                            sx={{ width: '120px', marginRight: '10px' }}
                        >
                            <MenuItem value={'01'}>January</MenuItem>
                            <MenuItem value={'02'}>February</MenuItem>
                            <MenuItem value={'03'}>March</MenuItem>
                            <MenuItem value={'04'}>April</MenuItem>
                            <MenuItem value={'05'}>May</MenuItem>
                            <MenuItem value={'06'}>June</MenuItem>
                            <MenuItem value={'07'}>July</MenuItem>
                            <MenuItem value={'08'}>August</MenuItem>
                            <MenuItem value={'09'}>September</MenuItem>
                            <MenuItem value={'10'}>October</MenuItem>
                            <MenuItem value={'11'}>November</MenuItem>
                            <MenuItem value={'12'}>December</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small">
                        <InputLabel id="demo-simple-select-label">Year</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="month_attendance"
                            value={selectYear}
                            label="Year"
                            onChange={handleChangeYear}
                            sx={{ width: '120px', marginRight: '10px' }}
                        >
                            {allYears.map((year) => (
                                <MenuItem value={year}>{year}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            </div>

            <div className='block'>
                <div className=" block-content col-sm-12 ">
                        <div className='d-flex justify-content-lg-end p-3'>
                            <PageToolbar handleSearch={handleFilter} />
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
                                    {totalAttendance.length != 0 ?

                                        stableSort(totalAttendance, getComparator(order, orderBy))
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((attdn, index) => {
                                                if (attdn.is_deleted != 1) {
                                                    return (
                                                        <TableRow key={index} hover
                                                            role="checkbox"
                                                            tabIndex={-1}>

                                                            <TableCell>
                                                                <img src={"https://nasyaportal.ph/assets/media/upload/" + attdn.profile_pic} style={{
                                                                    height: 35, width: 35, borderRadius: 50, objectFit: 'cover', marginRight: 10
                                                                }} />
                                                                {attdn.fname} {attdn.lname}</TableCell>
                                                            <TableCell>{attdn.category}</TableCell>
                                                            <TableCell>{attdn.department}</TableCell>
                                                            <TableCell>{attdn.dutyHours}</TableCell>
                                                            <TableCell>{attdn.tardiness}</TableCell>
                                                            <TableCell>{attdn.absences}</TableCell>
                                                            <TableCell>{attdn.totalHours}</TableCell>
                                                            <TableCell><div className='border-0 d-flex justify-content-end'><button className='text-red btn btn-primary btn-sm mr-2' onClick={() => handleOpenView(attdn.user_id, attdn.MonthVal, attdn.YearVal)
                                                            } data-toggle="modal" data-target="#view_attendance"><i className="fa fa-search"></i></button>
                                                                <button className='text-red btn btn-success btn-sm' onClick={() => handleOpen(attdn)
                                                                } data-toggle="modal" data-target="#add_absences"><i className="si si-pencil"></i></button>
                                                            </div></TableCell>
                                                        </TableRow>
                                                    )
                                                }
                                            })

                                        :

                                        <TableRow hover
                                            role="checkbox"
                                            tabIndex={-1}>
                                            <TableCell colSpan={8} className="text-center">No data Found</TableCell>
                                        </TableRow>

                                    }

                                    {emptyRows > 0 && (
                                        <TableRow
                                            style={{
                                                height: 53 * emptyRows,
                                            }}
                                        >
                                            <TableCell colSpan={6} >No data Found</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={totalAttendance.length}
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
            {openView && (
                <AttendanceViewModal
                    open={openView}
                    close={handleCloseView}
                    attendance_data={selectedAttendnace}
                />
            )}
            {open && (
                <AttendanceAddAbsence modalID="add_absences" open={open} close={handleCloseAbsences} attendance_data={selectedAttendnace} />
            )}
        </Layout >
    )
}

export default HrAttendance