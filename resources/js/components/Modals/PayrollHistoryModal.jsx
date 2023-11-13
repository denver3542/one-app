import React, { useEffect, useState } from 'react'
import { InputLabel, FormControl, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Divider, Typography } from '@mui/material';
import axiosInstance, { getJWTHeader } from '../../utils/axiosConfig';


const PayrollHistoryModal = ({ data, handleToPrint }) => {
    const storedUser = localStorage.getItem("nasya_user");
    const headers = getJWTHeader(JSON.parse(storedUser));
    const [earningsData, setEarningsData] = useState([])
    const [benefitsData, setBenefitsData] = useState([])
    const [loanData, setLoanData] = useState([])
    const [contributionData, setContributionData] = useState([])
    const [totalAddionBenefit, setTotalAddionBenefit] = useState([])
    const mrate = data.monthly_rate / 2;
    const basic_rate = mrate / data.workdays;
    const hourly_rate = basic_rate / 8;

    useEffect(() => {
        handleGetRecords()
    }, [])

    const handleGetRecords = () => {
        axiosInstance.get(`/payrollRecordBenefits/${data.payroll_id}`, { headers }).then((response) => {
            setEarningsData(response.data.earnings_data)
            setBenefitsData(response.data.benefitsRecords)
            setLoanData(response.data.loan_data)
            setContributionData(response.data.contribution_data)
        });
    }
    let earnings_showData = []
    if (earningsData != undefined) {
        earnings_showData = earningsData.map((list, index) => {
            let count = 0
            return (
                <>
                    <TableRow key={count++}>
                        <TableCell className='text-center  bg-light' sx={{ width: '50%' }}>{list.list_name}</TableCell>
                        <TableCell className='text-center  bg-light'>
                            <input id="demo-simple-select" style={{ height:20, backgroundColor: 'white' }} className='form-control' type="text" name={list.list_name} disabled={true} value={list.totalAmount != 0 ? list.totalAmount.toFixed(2) : ''}  />
                        </TableCell>
                    </TableRow>
                </>
            )

        })
    }
    let benefit_showData = []
    let totalAddiotionalBenefit = []
    if (benefitsData != undefined) {
        benefit_showData = benefitsData.map((list, index) => {
            let count = 0
            totalAddiotionalBenefit.push(list.totalAmount ? Number(list.totalAmount) : 0)
            return (
                <>
                    <TableRow key={count++}>
                        <TableCell className='text-center  bg-light' sx={{ width: '50%' }}>{list.list_name}</TableCell>
                        <TableCell className='text-center  bg-light'>
                            <input id="demo-simple-select" style={{ height: 20, backgroundColor: 'white' }} className='form-control' type="text" name={list.list_name} value={list.totalAmount != 0 ? list.totalAmount.toFixed(2) : ''} disabled={true} />
                        </TableCell>
                    </TableRow>
                </>
            )
        })
    }
    let loan_showData = []
    if (loanData != undefined) {
        loan_showData = loanData.map((list, index) => {
            let count = 0
            return (
                <>
                    <TableRow key={count++}>
                        <TableCell className='text-center  bg-light' sx={{ width: '50%' }}>{list.list_name}</TableCell>
                        <TableCell className='text-center  bg-light'>
                            <input id="demo-simple-select" style={{ height: 20, backgroundColor: 'white' }} className='form-control' type="text" name={list.list_name} value={list.totalAmount != 0 ? list.totalAmount.toFixed(2) : ''} disabled={true} />
                        </TableCell>
                    </TableRow>
                </>
            )
        })

    }

    let contri_showData = []
    if (contributionData != undefined) {
        contri_showData = contributionData.map((list, index) => {
            let count = 0
            return (
                <>
                    <TableRow key={count++}>
                        <TableCell className='text-center  bg-light' sx={{ width: '50%' }}>{list.list_name}</TableCell>
                        <TableCell className='text-center  bg-light'>
                            <input id="demo-simple-select" style={{ height: 20, backgroundColor: 'white' }} className='form-control' type="text" name={list.list_name} value={list.totalAmount != 0 ? list.totalAmount.toFixed(2) : ''} disabled />
                        </TableCell>
                    </TableRow>
                </>
            )
        })
    }

    useEffect(() => {
        handleTotalAdiiotionalBenefit(totalAddiotionalBenefit)
    }, [totalAddiotionalBenefit])

    const handleTotalAdiiotionalBenefit = (totalAddiotionalBenefit) => {
        setTotalAddionBenefit(Object.values(totalAddiotionalBenefit).reduce((acc, curr) => acc += Number(curr), 0))
    }

    return (
        <>
            <div className='row' style={{ marginTop: '10px' }}>
                <div className='col-4 d-flex justify-content-center'>
                    <FormControl sx={{
                        marginBottom: 2, width: '100%', '& label.Mui-focused': {
                            color: '#97a5ba',
                        },
                        '& .MuiOutlinedInput-root': {

                            '&.Mui-focused fieldset': {
                                borderColor: '#97a5ba',
                            },
                        },
                    }}>
                        <InputLabel id="demo-simple-select-label" shrink={true} sx={{ backgroundColor: 'white', paddingLeft: 1, paddingRight: 1, borderColor: '#97a5ba' }}>Basic Rate</InputLabel>
                        <input id="demo-simple-select" className='form-control' type="text" defaultValue={basic_rate.toFixed(2)} style={{ height: 30 }} />
                    </FormControl>
                </div>
                <div className='col-4 d-flex justify-content-center'>
                    <FormControl sx={{
                        marginBottom: 2, width: '100%', '& label.Mui-focused': {
                            color: '#97a5ba',
                        },
                        '& .MuiOutlinedInput-root': {

                            '&.Mui-focused fieldset': {
                                borderColor: '#97a5ba',
                            },
                        },
                    }}>
                        <InputLabel id="demo-simple-select-label" shrink={true} sx={{ backgroundColor: 'white', paddingLeft: 1, paddingRight: 1, borderColor: '#97a5ba' }}>Monthly Rate</InputLabel>
                        <input id="demo-simple-select" className='form-control' type="text" defaultValue={data.monthly_rate} style={{ height: 30 }} />
                    </FormControl>
                </div>
                <div className='col-4 d-flex justify-content-center'>
                    <FormControl sx={{
                        marginBottom: 2, width: '100%', '& label.Mui-focused': {
                            color: '#97a5ba',
                        },
                        '& .MuiOutlinedInput-root': {

                            '&.Mui-focused fieldset': {
                                borderColor: '#97a5ba',
                            },
                        },
                    }}>
                        <InputLabel id="demo-simple-select-label" shrink={true} sx={{ backgroundColor: 'white', paddingLeft: 1, paddingRight: 1, borderColor: '#97a5ba' }}>Hourly Rate</InputLabel>
                        <input id="demo-simple-select" className='form-control' type="text" style={{ height: 30 }} defaultValue={hourly_rate.toFixed(2)} />
                    </FormControl>
                </div>
            </div>
            <div>
                <div className='row' >
                    <div className='col-4'>
                        <TableContainer>
                            <Table className="table table-md table-vcenter table-bordered" >
                                <TableHead>
                                    <TableRow>
                                        <TableCell colSpan={2} className='text-center '> Earnings</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className='text-center  bg-light' sx={{ width: '50%' }}>Gross Pay</TableCell>
                                        <TableCell className='text-center  bg-light'>
                                            <input id="demo-simple-select" style={{ backgroundColor: 'white', height: 20 }} disabled className='form-control' defaultValue={data.monthly_rate / 2} type="text" />
                                        </TableCell>
                                    </TableRow>
                                    {earnings_showData}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    <div className='col-4'>
                        <TableContainer>
                            <Table className="table table-md table-vcenter table-bordered">
                                <TableHead>
                                    <TableRow>
                                        <TableCell colSpan={2} className='text-center'> Additional Benefits</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {benefit_showData}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <FormControl sx={{
                            marginBottom: 2, width: '100%', marginTop: '10px', '& label.Mui-focused': {
                                color: '#97a5ba',
                            },
                            '& .MuiOutlinedInput-root': {

                                '&.Mui-focused fieldset': {
                                    borderColor: '#97a5ba',
                                },
                            },
                        }}>
                            <InputLabel id="demo-simple-select-label" shrink={true} sx={{ backgroundColor: 'white', paddingLeft: 1, paddingRight: 1, borderColor: '#97a5ba' }}>Total Additional Benefits</InputLabel>
                            <input id="demo-simple-select" className='form-control' type="text" defaultValue={totalAddionBenefit} style={{ height: 30 }} />
                        </FormControl>
                        <TableContainer sx={{ marginTop: '145px' }}>
                            <Table className="table table-md table-vcenter table-bordered">
                                <TableHead>
                                    <TableRow>
                                        <TableCell colSpan={2} className='text-center '> LOANS</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loan_showData}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    <div className='col-4'>
                        <TableContainer>
                            <Table className="table table-md table-vcenter table-bordered">
                                <TableHead>
                                    <TableRow>
                                        <TableCell colSpan={2} className='text-center '> EMPLOYEE CONTRIBUTION</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {contri_showData}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <FormControl sx={{
                            marginBottom: 2, width: '100%', marginTop: '10px', '& label.Mui-focused': {
                                color: '#97a5ba',
                            },
                            '& .MuiOutlinedInput-root': {

                                '&.Mui-focused fieldset': {
                                    borderColor: '#97a5ba',
                                },
                            },
                        }}>
                            <InputLabel id="demo-simple-select-label" shrink={true} sx={{ backgroundColor: 'white', paddingLeft: 1, paddingRight: 1, borderColor: '#97a5ba' }}>Total Contribution</InputLabel>
                            <input id="demo-simple-select" className='form-control bg-white' disabled type="text" defaultValue={data.total_contribution} readOnly style={{ height: 30 }} />
                        </FormControl>

                    </div>
                </div>
                <div className='row' style={{ marginTop: 10 }}>
                    <div className='col-4'>
                        <FormControl sx={{
                            marginBottom: 2, width: '100%', marginTop: '10px', '& label.Mui-focused': {
                                color: '#97a5ba',
                            },
                            '& .MuiOutlinedInput-root': {

                                '&.Mui-focused fieldset': {
                                    borderColor: '#97a5ba',
                                },
                            },
                        }}>
                            <InputLabel id="demo-simple-select-label" shrink={true} sx={{ backgroundColor: 'white', paddingLeft: 1, paddingRight: 1, borderColor: '#97a5ba' }}>Total Earnings</InputLabel>
                            <input id="demo-simple-select" className='form-control bg-white' type="text" readOnly defaultValue={data.total_earnings} style={{ height: 30 }} />
                        </FormControl>
                    </div>
                    <div className='col-4'>
                        <FormControl sx={{
                            marginBottom: 2, width: '100%', marginTop: '10px', '& label.Mui-focused': {
                                color: '#97a5ba',
                            },
                            '& .MuiOutlinedInput-root': {

                                '&.Mui-focused fieldset': {
                                    borderColor: '#97a5ba',
                                },
                            },
                        }}>
                            <InputLabel id="demo-simple-select-label" shrink={true} sx={{ backgroundColor: 'white', paddingLeft: 1, paddingRight: 1, borderColor: '#97a5ba' }}>Total Deductions</InputLabel>
                            <input id="demo-simple-select" className='form-control bg-white' type="text" defaultValue={data.total_deduction} readOnly  style={{ height: 30 }} />
                        </FormControl>
                    </div>
                    <div className='col-4'>

                        <FormControl sx={{
                            marginBottom: 2, width: '100%', marginTop: '10px', '& label.Mui-focused': {
                                color: '#97a5ba',
                            },
                            '& .MuiOutlinedInput-root': {

                                '&.Mui-focused fieldset': {
                                    borderColor: '#97a5ba',
                                },
                            },
                        }}>
                            <InputLabel id="demo-simple-select-label" shrink={true} sx={{ backgroundColor: 'white', paddingLeft: 1, paddingRight: 1, borderColor: '#97a5ba' }}>Net Pay</InputLabel>
                            <input id="demo-simple-select" className='form-control bg-white' type="text" defaultValue={data.net_pay} readOnly  style={{ height: 30 }} />
                        </FormControl>
                    </div>
                </div>
                <div className='row' style={{ marginTop: 10 }}>
                    <div className='col-4'>
                        <FormControl sx={{
                            marginBottom: 2, width: '100%', marginTop: '10px', '& label.Mui-focused': {
                                color: '#97a5ba',
                            },
                            '& .MuiOutlinedInput-root': {

                                '&.Mui-focused fieldset': {
                                    borderColor: '#97a5ba',
                                },
                            },
                        }}>
                            {data.signature ? <img className="d-flex justify-content-center" src={"https://nasyaportal.ph/assets/media/upload/" + data.signature} style={{
                                height: 70, width: 100, margin: '0 auto', display: 'block'
                            }} /> : <></>}
                            {/* https://nasyaportal.ph/assets/media/upload/
                            http://localhost/Nasya/assets/media/upload/ */}

                            <Divider sx={{ marginTop: 2, border: '0.5px solid' }} />
                            <Typography sx={{ fontStyle: 'italic', textAlign: 'center' }}>Employee Signature</Typography>
                        </FormControl>
                    </div>
                   
                </div>
                <div className="d-flex justify-content-end">
                <button type="button" className="printBtn btn btn-warning btn-md mr-2" onClick={handleToPrint}>Print
                </button>
                </div>
            </div>
        </>
    )
}

export default PayrollHistoryModal