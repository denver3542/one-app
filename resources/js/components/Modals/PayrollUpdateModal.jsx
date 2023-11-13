import React, { useEffect, useState, useRef } from 'react';
import { InputLabel, FormControl, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Divider, Typography } from '@mui/material';
import axiosInstance, { getJWTHeader } from '../../utils/axiosConfig';
import Swal from 'sweetalert2';
import '../../../../resources/css/customcss.css'

const loading1 = function () {
    Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: "Please Wait...",
        allowOutsideClick: false,
        showConfirmButton: false,
    }),
        Swal.showLoading()
}

const PayrollUpdateModal = ({ data, handleToPrint, close, cutoff }) => {
    const storedUser = localStorage.getItem("nasya_user");
    const headers = getJWTHeader(JSON.parse(storedUser));
    const [allRecords, setAllRecords] = useState({
        total_earnings_val: 0,
        total_deductions_val: 0,
        total_netpay_val: 0,
        total_contribution_val: 0,
    })
    const [computeUpdateContribution, setComputeUpdateContribution] = useState(0)
    const [computeUpdateEarnings, setComputeUpdateEarnings] = useState(0)
    const [computeUpdateDeduction, setComputeUpdateDeduction] = useState(0)
    const [earningsData, setEarningsData] = useState([])
    const [benefitsData, setBenefitsData] = useState([])
    const [loanData, setLoanData] = useState([])
    const [contributionData, setContributionData] = useState()
    const [totalAddionBenefit, setTotalAddionBenefit] = useState()
    const [userRate, setUserRate] = useState({
        mrate: data.monthly_rate / 2,
        basic_rate: (data.monthly_rate / 2) / data.workdays,
        hourly_rate: (data.monthly_rate / 2) / data.workdays / 8
    })
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
    // earnings Data
    let submitEarningsData = []
    let earnings_showData = []
    let incentives_data = 0
    let totalAddiotionalBenefit = []
    const totalEarnings = []
    const totalDeductAmount = []
    if (earningsData != undefined) {
        const earnState = (index) => (e) => {
            const earningArray = earningsData.map((list, i) => {
                if (index === i) {
                    return { ...list, ['totalAmount']: e.target.value };
                } else {
                    return list;
                }
            });
            setEarningsData(earningArray);
        };
        earnings_showData = earningsData.map((list, index) => {
            let count = 0
            // totalEarnings.push(list.totalAmount ? Number(list.totalAmount) : 0)
           if(list.list_name == 'Absences' || list.list_name == 'Tardiness' || list.list_name == 'Undertime'){
                totalDeductAmount.push(list.totalAmount ? Number(list.totalAmount) : 0)
            }else{
                totalEarnings.push(list.totalAmount ? Number(list.totalAmount) : 0)
                if(list.list_name == 'Incentives'){
                    incentives_data = list.totalAmount;
                }else{
                    submitEarningsData.push({
                        ['applist_id']: list.applist_id,
                        ['total_earnings']: list.totalAmount
                    })
                }
            }
                return (
                    <>
                        <TableRow key={count++}>
                            <TableCell className='text-center  bg-light' sx={{ width: '50%' }}>{list.list_name}</TableCell>
                            <TableCell className='text-center  bg-light'>
                                <input id="demo-simple-select" style={{ height: 30, backgroundColor: 'white' }} className='form-control' type="text" name={list.list_name} disabled={false} value={list.totalAmount != 0 ? list.totalAmount : ''} onChange={earnState(index)} />
                            </TableCell>
                        </TableRow>
                    </>
                )
        })
        useEffect(() => {
            handleTotalEarn(totalEarnings, totalDeductAmount);
        }, [totalEarnings, totalDeductAmount])

        const handleTotalEarn = (totalEarnings, totalDeductAmount) => {
            const earnings = Object.values(totalEarnings).reduce((acc, curr) => acc += Number(curr), 0);
            const deduction = Object.values(totalDeductAmount).reduce((acc, curr) => acc += Number(curr), 0);
            const total = earnings - deduction
           setComputeUpdateEarnings((data.monthly_rate / 2) + total);
        }
    }
    // END earnings Data

    // benefit Data
    let benefit_showData = []
    const totalBenefitAmount = []
    let loan_showData = []
    const totalLoanAmount = []
    let benefitDataSubmit = []
    if (benefitsData != undefined) {
        const benefitState = (index) => (e) => {
            const benefitArray = benefitsData.map((list, i) => {
                if (index === i) {
                    return { ...list, ['totalAmount']: e.target.value };
                } else {
                    return list;
                }
            });

            setBenefitsData(benefitArray);
        };
        benefit_showData = benefitsData.map((list, index) => {
            let count = 0
            benefitDataSubmit.push(list)
            // totalBenefitAmount.push(list.totalAmount ? Number(list.totalAmount) : 0)
            totalAddiotionalBenefit.push(list.totalAmount ? Number(list.totalAmount) : 0)
            // totalEarnAmount.push(list.totalAmount ? Number(list.totalAmount) : 0)
            // submitBenefitData.push({
            //     ['benefitlist_id']: list.benefitlist_id, ['totalAmount']: list.totalAmount ? list.totalAmount : 0, ['type']: list.type
            // })
            return (
                <>
                    <TableRow key={count++}>
                        <TableCell className='text-center  bg-light' sx={{ width: '50%' }}>{list.list_name}</TableCell>
                        <TableCell className='text-center  bg-light'>
                            <input id="demo-simple-select" style={{ height: 30, backgroundColor: 'white' }} className='form-control' type="text" name={list.list_name} value={list.totalAmount != 0 ? list.totalAmount : ''} onChange={benefitState(index)} />
                        </TableCell>
                    </TableRow>
                </>
            )
        })
    }
    if (loanData != undefined) {
        const loanState = (index) => (e) => {
            const loanArray = loanData.map((list, i) => {
                if (index === i) {
                    return { ...list, ['totalAmount']: e.target.value };
                } else {
                    return list;
                }
            });

            setLoanData(loanArray);
        };
        loan_showData = loanData.map((list, index) => {
            let count = 0
            benefitDataSubmit.push(list)
            totalLoanAmount.push(list.totalAmount ? Number(list.totalAmount) : 0)
            // totalEarnAmount.push(list.totalAmount ? Number(list.totalAmount) : 0)
            // submitBenefitData.push({
            //     ['benefitlist_id']: list.benefitlist_id, ['totalAmount']: list.totalAmount ? list.totalAmount : 0, ['type']: list.type
            // })
            return (
                <>
                    <TableRow key={count++}>
                        <TableCell className='text-center  bg-light' sx={{ width: '50%' }}>{list.list_name}</TableCell>
                        <TableCell className='text-center  bg-light'>
                            <input id="demo-simple-select" style={{ height: 30, backgroundColor: 'white' }} className='form-control' type="text" name={list.list_name} value={list.totalAmount != 0 ? list.totalAmount : ''} onChange={loanState(index)} />
                        </TableCell>
                    </TableRow>
                </>
            )
        })

    }

    // END benefit Data

    // Contribution Data
    let contri_showData = []
    const contri_showAmount = []
    const totalContriAmount = []
    if (contributionData != undefined) {
        const contriState = (index) => (e) => {
            const contriArray = contributionData.map((list, i) => {
                if (index === i) {
                    return { ...list, ['totalAmount']: e.target.value };
                } else {
                    return list;
                }
            });

            setContributionData(contriArray);
        };
        contri_showData = contributionData.map((list, index) => {
            let count = 0
            benefitDataSubmit.push(list)
            contri_showAmount.push(list.totalAmount ? Number(list.totalAmount) : 0)
            if (cutoff != 2) {
                totalContriAmount.push(list.totalAmount ? Number(list.totalAmount) : 0)
            }else{
                totalContriAmount.push(0)
            }
            // submitBenefitData.push({
            //     ['benefitlist_id']: list.benefitlist_id, ['totalAmount']: list.totalAmount ? list.totalAmount : 0, ['type']: list.type
            // })
            return (
                <>
                    <TableRow key={count++}>
                        <TableCell className='text-center  bg-light' sx={{ width: '50%' }}>{list.list_name}</TableCell>
                        <TableCell className='text-center  bg-light'>
                            <input id="demo-simple-select" style={{ height: 30, backgroundColor: 'white' }} className='form-control' type="text" name={list.list_name} value={list.totalAmount != 0 ? list.totalAmount : ''} onChange={contriState(index)} />
                        </TableCell>
                    </TableRow>
                </>
            )
        })
    }
    if (contri_showAmount != []) {
        useEffect(() => {
            handleTotalContri(contri_showAmount);
        }, [contri_showAmount])

        const handleTotalContri = (contri_showAmount) => {
            const totalUpdateEarnings = Object.values(contri_showAmount).reduce((acc, curr) => acc += Number(curr), 0)
            setComputeUpdateContribution(totalUpdateEarnings)
            // if (computedBenefit != []) {
            //     const totalUpdateEarnings = Object.values(computedBenefit).reduce((acc, curr) => acc += Number(curr), 0)
            //     setComputeUpdateDeduction(totalUpdateEarnings)
            // }else{
            //     setComputeUpdateDeduction(benefitsData.total_deductions_val)
            // }

        }
    }
    // END Contribution Data


    useEffect(() => {
        handleTotalAdiiotionalBenefit(totalAddiotionalBenefit)
    }, [totalAddiotionalBenefit])

    const handleTotalAdiiotionalBenefit = (totalAddiotionalBenefit) => {
        setTotalAddionBenefit(Object.values(totalAddiotionalBenefit).reduce((acc, curr) => acc += Number(curr), 0))
    }

    useEffect(() => {
        handleTotalBenefit(cutoff != 2 ? totalContriAmount : [], totalLoanAmount);
    }, [cutoff != 2 ? totalContriAmount : [], totalLoanAmount])

    const handleTotalBenefit = (totalContriAmount, totalLoanAmount) => {
        const computedBenefit = totalContriAmount.concat(totalLoanAmount)
        if (computedBenefit != []) {
            const totalUpdateEarnings = Object.values(computedBenefit).reduce((acc, curr) => acc += Number(curr), 0)
            setComputeUpdateDeduction(totalUpdateEarnings)
        } else {
            setComputeUpdateDeduction(benefitsData.total_deductions_val)
        }
    }

    const additionalVal = cutoff != 1 ? Object.values(totalAddiotionalBenefit).reduce((acc, curr) => acc += Number(curr), 0) : 0;

    const handleUpdatePayroll = (e) => {
        e.preventDefault();
        close()
        new Swal({
            customClass: {
                container: 'my-swal'
            },
            title: "Are you sure?",
            text: "You want to Update this Payroll Details?",
            icon: "warning",
            dangerMode: true,
            showCancelButton: true,
        }).then(res => {
            console.log(res);
            if (res.isConfirmed) {
                axiosInstance.put(`/update_payroll/${data.payroll_id}`, {
                    earningsData: submitEarningsData,
                    incentives: incentives_data,
                    benefitsData: benefitDataSubmit,
                    total_earnings: computeUpdateEarnings,
                    total_deduction: computeUpdateDeduction,
                    total_contribution: computeUpdateContribution,
                    net_pay: computeUpdateEarnings - computeUpdateDeduction
                }, { headers })
                    .then((response) => {
                        if (response.data.updatePayroll === 'Success') {
                            Swal.fire({
                                customClass: {
                                    container: 'my-swal'
                                },
                                title: "Success!",
                                text: "Payroll Details has been Saved successfully",
                                icon: "success",
                                timer: 1000,
                                showConfirmButton: false
                            }).then(function () {
                                location.reload();
                            });
                        } else {
                            alert("Something went wrong")
                        }
                    })
                    .catch((error) => {
                        console.log('error', error.response)
                    })
            }
        });
    }
    const handleSendPayroll = (e) => {
        e.preventDefault()
        close()
        new Swal({
            customClass: {
                container: 'my-swal'
            },
            title: "Are you sure?",
            text: "You want to Send this Payroll to this Employee?",
            icon: "warning",
            dangerMode: true,
            showCancelButton: true,
        }).then(res => {
            if (res.isConfirmed) {
                loading1()
                axiosInstance.put(`/update_payrollVisibility/${data.payroll_id}`, {
                    payroll_status: 1
                }, { headers })
                    .then((response) => {
                        if (response.data.payrollStatus === 'Success') {
                            axiosInstance.get(`/sendPayrollMail/${data.payroll_id}`, { headers })
                                .then((response) => {
                                    if (response.data.userData === 'Success') {
                                        close()
                                        Swal.fire({
                                            customClass: {
                                                container: 'my-swal'
                                            },
                                            title: "Success!",
                                            text: "Payroll Details has been Sent!",
                                            icon: "success",
                                            timer: 1000,
                                            showConfirmButton: false
                                        }).then(function(){
                                            location.reload()
                                        });
                                    } else {
                                        alert("Something went wrong")
                                        console.log(response)
                                    }
                                })
                                .catch((error) => {
                                    console.log('error', error.response)
                                })
                        } else {
                            alert("Something went wrong")
                            console.log(response)
                        }
                    })
                    .catch((error) => {
                        console.log('error', error.response)
                    })
            }
        });
    }
    const handleHidePayroll = (e) => {
        e.preventDefault()
        close()
        new Swal({
            customClass: {
                container: 'my-swal'
            },
            title: "Are you sure?",
            text: "You want to Hide this Payroll to this Employee?",
            icon: "warning",
            dangerMode: true,
            showCancelButton: true,
        }).then(res => {
            if (res.isConfirmed) {
                axiosInstance.put(`/update_payrollHide/${data.payroll_id}`, {
                    payroll_status: 0
                }, { headers })
                    .then((response) => {
                        if (response.data.payrollStatus === 'Success') {
                            close()
                            Swal.fire({
                                customClass: {
                                    container: 'my-swal'
                                },
                                title: "Success!",
                                text: "Payroll Details has been Hide!",
                                icon: "success",
                                timer: 1000,
                                showConfirmButton: false
                            })
                            .then(function () {
                                location.reload();
                            })
                        } else {
                            alert("Something went wrong")
                        }
                    })
                    .catch((error) => {
                        console.log('error', error.response)
                    })
            }
        });
    }
    const handleDeletePayroll = (e) => {
        e.preventDefault()
        close()
        new Swal({
            title: "Are you sure?",
            text: "You want to Delete this Payroll to this Employee?",
            icon: "warning",
            dangerMode: true,
            showCancelButton: true,
        }).then(res => {
            if (res.isConfirmed) {
                axiosInstance.put(`/update_payrollDelete/${data.payroll_id}`, {
                    payroll_status: 0
                }, { headers })
                    .then((response) => {
                        if (response.data.payrollStatus === 'Success') {
                            close()
                            Swal.fire({
                                customClass: {
                                    container: 'my-swal'
                                },
                                title: "Success!",
                                text: "Payroll Details has been Deleted!",
                                icon: "success",
                                timer: 1000,
                                showConfirmButton: false
                            }).then(function(){
                                location.reload()
                            });
                        } else {
                            alert("Something went wrong")
                        }
                    })
                    .catch((error) => {
                        console.log('error', error.response)
                    })
            }
        });
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
                        <input id="demo-simple-select" className='form-control' type="text" defaultValue={userRate.basic_rate.toFixed(2)} style={{ height: 40 }} />
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
                        <input id="demo-simple-select" className='form-control' type="text" defaultValue={data.monthly_rate} style={{ height: 40 }} />
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
                        <input id="demo-simple-select" className='form-control' type="text" defaultValue={userRate.hourly_rate.toFixed(2)} style={{ height: 40 }} />
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
                                            <input id="demo-simple-select" style={{ backgroundColor: 'white', height: 30 }} disabled className='form-control' type="text" defaultValue={data.monthly_rate / 2} />
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
                            <input id="demo-simple-select" className='form-control' type="text" defaultValue={totalAddionBenefit} style={{ height: 40 }} />
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
                            <input id="demo-simple-select" className='form-control bg-white' disabled type="text" value={computeUpdateContribution.toFixed(2)} readOnly style={{ height: 40 }} />
                        </FormControl>

                    </div>
                </div>
                <div className='row' style={{ marginTop: 50 }}>
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
                            <input id="demo-simple-select" className='form-control bg-white' type="text" readOnly value={computeUpdateEarnings.toFixed(2)} onChange={(e) => setAllRecords({ ...allRecords, total_earnings_val: e.target.value })} style={{ height: 40 }} />
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
                            <input id="demo-simple-select" className='form-control bg-white' type="text" readOnly value={computeUpdateDeduction.toFixed(2)} onChange={(e) => setAllRecords({ ...allRecords, total_deductions_val: e.target.value })} style={{ height: 40 }} />
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
                            <input id="demo-simple-select" className='form-control bg-white' type="text" value={(computeUpdateEarnings - computeUpdateDeduction + additionalVal).toFixed(2)} readOnly />
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
            </div>
            <div className='d-flex justify-content-end' style={{ marginTop: 20 }}>
                <button type="button" className="updateBtn btn btn-primary btn-md mr-2" onClick={handleUpdatePayroll}>Update
                </button>
                <button type="button" className="printBtn btn btn-warning btn-md mr-2" onClick={handleToPrint}>Print
                </button>
                <button type="button" className="hideBtn btn btn-success btn-md mr-2" onClick={data.payroll_status != 1 ? handleSendPayroll : handleHidePayroll}>{data.payroll_status != 1 ? 'Send' : 'Hide'}
                </button>
                <button type="button" className="hideBtn btn btn-danger btn-md mr-2" onClick={handleDeletePayroll}> Delete
                </button>


            </div>
        </>
    )
}

export default PayrollUpdateModal