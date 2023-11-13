import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { Table, TableBody, TableCell, TableContainer, TableRow, Select, MenuItem, InputLabel, Box, FormControl, Typography, Button,Grid, Input } from '@mui/material'
import moment from 'moment'

import { useNavigate, useSearchParams } from 'react-router-dom'

const headCells = [
    {
        id: 'idx',
        label: '',
    },
    {
        id: 'firstname',
        label: 'Name',
        sortable: true,
    },
    {
        id: 'designation',
        label: 'Designation',
        sortable: true,
    },
    {
        id: 'department',
        label: 'Department',
        sortable: true,
    },
    {
        id: 'leave_type',
        label: 'Payroll Date',
        sortable: false,
    },
    {
        id: 'date_from',
        label: 'Payroll Cut-Off',
        sortable: false,
    },
    {
        id: 'date_to',
        label: 'Gross Pay',
        sortable: true,
    },
    {
        id: 'remarks',
        label: 'Status',
        sortable: false,
    },



];

const getDaysByMonth = (month) => {
    const daysInMonth = moment(month).daysInMonth();
    return Array.from({ length: daysInMonth }, (v, k) => k + 1)
};

const years = () => {
    const now = new Date().getUTCFullYear();
    return Array(now - (now - 20)).fill('').map((v, idx) => now - idx);
}

const HrPayrollProcess = () => {
    const [extended, setExtended] = useState(false)
    const [singleDate, setSingleDate] = useState({
        month: '',
        from: '',
        to: '',
        year: moment().format('YYYY'),
        cutoff: ''
    })
    const [multiDate, setMultiDate] = useState({
        fromDate: '',
        toDate: '',
        cutoff: ''
    })

    const navigate = useNavigate()
    const allYears = years();

    // SINGLE MONTH
    const [getDays, setGetDays] = useState()
    useEffect(() => {
        handleGetDays(singleDate.month ? singleDate.month : moment().format('MM'))
    }, [singleDate.month ? singleDate.month : moment().format('MM')]);

    const handleGetDays = (days) => {
        setGetDays(getDaysByMonth(days))
    }
    // END

 

    const handleProcessSingle = () => {
        navigate(`/hr/payroll-process/unextended?month=${singleDate.month}&from=${singleDate.from}&to=${singleDate.to}&year=${singleDate.year}&cutoff=${singleDate.cutoff}`)
    }
    const handleProcessMulti = () => {
        navigate(`/hr/payroll-process/extended?fromDate=${multiDate.fromDate}&toDate=${multiDate.toDate}&cutoff=${multiDate.cutoff}`)
    }
    const extendPayroll = (extend) => {
        if (extend != 2) {
            setExtended(false)
        } else {
            setExtended(true)
        }
    }
    return (
        <Layout>
            <div className="content-heading d-flex justify-content-between p-0">
                <h5 className='pt-3'>Processing of Payroll</h5>
            </div>
            <div className="block">
                <div className="block-content" style={{ paddingTop: 90, paddingBottom: 100 }}>
                    <Typography variant="h4" sx={{ display: 'flex', justifyContent: 'center', fontFamily: '-moz-initial', marginBottom: 5 }}>Select Payroll Cut Off</Typography>
                    <Box component="form"
                        noValidate
                        autoComplete="off"
                        // onSubmit={showEdit != true ? handleSubmit : handleEdit}
                        encType="multipart/form-data"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"

                    >
                        <Grid container spacing={5} maxWidth={700} >
                            {extended ?
                                <>
                                    <Grid item xs={12}>
                                        <FormControl variant="outlined" fullWidth>
                                            <Input type='date' value={multiDate.fromDate} sx={{fontSize: 16, border: 1, borderColor: '#c4c4c4', padding: 1, paddingLeft: 2, paddingRight: 2}} onChange={(e) => setMultiDate({ ...multiDate, fromDate: e.target.value })} />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl variant="outlined" fullWidth>
                                            <Input type='date' value={multiDate.toDate} sx={{fontSize: 16, border: 1, borderColor: '#c4c4c4', padding: 1, paddingLeft: 2, paddingRight: 2}} onChange={(e) => setMultiDate({ ...multiDate, toDate: e.target.value })} />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl variant="outlined" fullWidth>
                                            <InputLabel id="cutOff" sx={{ backgroundColor: 'white' }}>Type of Cutoff</InputLabel>
                                            <Select
                                                labelId="cutOff"
                                                id="cutOff"
                                                label="Year"
                                                value={multiDate.cutoff}
                                                onChange={(e) => setMultiDate({ ...multiDate, cutoff: e.target.value })}
                                            >
                                                <MenuItem value={1}>{'First'}</MenuItem>
                                                <MenuItem value={2}>{'Second'}</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </>
                                :
                                <>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel id="select-month" sx={{ backgroundColor: 'white', paddingX: 1 }}>Select Month</InputLabel>
                                            <Select
                                                labelId="select-month"
                                                id="select-month"
                                                label="Month"
                                                value={singleDate.month}
                                                onChange={(e) => setSingleDate({ ...singleDate, month: e.target.value })}
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
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="from_date" sx={{ backgroundColor: 'white', paddingX: 1 }}>From</InputLabel>
                                            <Select
                                                labelId="from_date"
                                                id="from_date"
                                                label="From"
                                                value={singleDate.from}
                                                onChange={(e) => setSingleDate({ ...singleDate, from: e.target.value })}
                                            >

                                                {getDays && getDays.map((days) => (
                                                    <MenuItem value={days}>{days}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="to_date" sx={{ backgroundColor: 'white', paddingX: 1 }}>To</InputLabel>
                                            <Select
                                                labelId="to_date"
                                                id="to_date"
                                                label="To"
                                                value={singleDate.to}
                                                onChange={(e) => setSingleDate({ ...singleDate, to: e.target.value })}
                                            >

                                                {getDays && getDays.map((days) => (
                                                    <MenuItem value={days}>{days}</MenuItem>
                                                ))}

                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <FormControl fullWidth>
                                            <InputLabel id="select-year" sx={{ backgroundColor: 'white', paddingX: 1 }}>Select Year</InputLabel>
                                            <Select
                                                labelId="select-year"
                                                id="select-year"
                                                label="Year"
                                                value={singleDate.year}
                                                onChange={(e) => setSingleDate({ ...singleDate, year: e.target.value })}
                                            >
                                                {allYears.map((year) => (
                                                    <MenuItem value={year}>{year}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl fullWidth>
                                            <InputLabel id="select-year" sx={{ backgroundColor: 'white', paddingX: 1 }}>Type of Cutoff</InputLabel>
                                            <Select
                                                labelId="select-year"
                                                id="select-year"
                                                label="Year"
                                                value={singleDate.cutoff}
                                                onChange={(e) => setSingleDate({ ...singleDate, cutoff: e.target.value })}
                                            >
                                                <MenuItem value={1}>{'1st'}</MenuItem>
                                                <MenuItem value={2}>{'2nd'}</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </>
                            }
                        </Grid>
                    </Box>
                    <div className="d-flex flex-column align-items-center" >
                        {extended ?
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ width: '100%', maxWidth: '200px', height: '40px', marginTop: 5 }}
                                onClick={handleProcessMulti}
                                disabled={multiDate.fromMonth != '' && multiDate.toMonth != '' && multiDate.from != '' && multiDate.to != '' & multiDate.cutoff != '' ? false : true}
                            >
                                <p className='m-0'> Process payroll <i className="fa fa-arrow-right ml-2"></i></p>

                            </Button>
                            :
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ width: '100%', maxWidth: '200px', height: '40px', marginTop: 5 }}
                                onClick={handleProcessSingle}
                                disabled={singleDate.from < singleDate.to && singleDate.cutoff != '' ? false : true}
                            >
                                <p className='m-0'> Process payroll <i className="fa fa-arrow-right ml-2"></i></p>

                            </Button>
                        }

                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ width: '100%', maxWidth: '200px', height: '40px', marginTop: 2, backgroundColor: extended ? '#e54c45' : '#5d9f49' }}
                            onClick={() => extendPayroll(extended ? 1 : 2)}
                        >
                            <p className='m-0'>{extended ? 'Unextend Payroll' : 'Extend Payroll'} <i className="fa fa-plus ml-2"></i></p>

                        </Button>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default HrPayrollProcess