import React, { useEffect, useState } from 'react';
import { InputLabel, FormControl, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import axiosInstance, { getJWTHeader } from '../../utils/axiosConfig';
import Swal from 'sweetalert2';
import '../../../../resources/css/customcss.css'
import PayrollSaveModalConfirmation from './PayrollSaveModalConfirmation';

const PayrollSaveModal = ({ data, close, cutoff, processtype }) => {
    const storedUser = localStorage.getItem("nasya_user");
    const headers = getJWTHeader(JSON.parse(storedUser));
    const [incentives, setIncentives] = useState(0)
    const [allEarningsData, setAllEarningsData] = useState([])
    const [allBenefitsData, setAllBenefitsData] = useState([])
    const [allLoansData, setAllLoansData] = useState([])
    const [allContributionData, setAllContributionData] = useState([])
    const [contributionAmount, setContributionAmount] = useState()
    const [totalAddionBenefit, setTotalAddionBenefit] = useState()
    const [totalDeduction, setTotalDeduction] = useState()
    const [totalNetPay, setTotalNetPay] = useState()
    const mrate = data.monthly_rate / 2;
    const basic_rate = mrate / data.workdays;
    const hourly_rate = basic_rate / 8;
    const absences = data.absences * (hourly_rate / 60);
    const tardiness = data.tardiness * (hourly_rate / 60);
    const undertime = data.undertime * (hourly_rate / 60);
    const [earnings, setEarnings] = useState({
        grosspay: data.monthly_rate / 2,
        leaveEarnings: 0,
        deductLeave: 0,
        total_earn: 0,
        deductions: absences + tardiness + undertime
    })

    const [openConfirmation, setOpenConfirmation] = useState(false)
    useEffect(() => {
        axiosInstance.post('/payroll_benefits', {
            payrollData: data,
            cutoff: cutoff,
            basic_rate: basic_rate
        }, { headers }).then((response) => {
            setAllEarningsData(response.data.earningsData)
            setAllBenefitsData(response.data.benefitsAlldata);
            setAllLoansData(response.data.loanAlldata)
            setAllContributionData(response.data.contributeAlldata)
        });
    }, [])

    // Earnings Computation 
    let submitEarningsData = []
    let totalAmountEarnings = []
    let deductLeaveAmount = []
    let submitBenefitData = []
    let total_leaves = []
    if (allEarningsData != undefined) {
        const earningState = (index) => (e) => {
            const earningArray = allEarningsData.map((list, i) => {
                if (index === i) {
                    return { ...list, ['totalAmount']: e.target.value };
                } else {
                    return list;
                }
            });
            setAllEarningsData(earningArray);
        };
        total_leaves = allEarningsData.map((list, index) => {
            submitEarningsData.push({
                ['applist_id']: list.applist_id,
                ['total_earnings']: list.totalAmount
            })
            totalAmountEarnings.push(list.totalAmount)
            deductLeaveAmount.push(list.deductLeave ? list.deductLeave : 0)
            return (
                <TableRow key={index}>
                    <TableCell className='text-center  bg-light' sx={{ width: '50%' }}>{list.list_name}</TableCell>
                    <TableCell className='text-center  bg-light'>
                        <input id="demo-simple-select" style={{ height: 30, backgroundColor: 'white' }} className='form-control' type="text" value={list.totalAmount} onChange={earningState(index)} />
                    </TableCell>
                </TableRow>
            )
        })
    }
    useEffect(() => {
        handleComputeLeave(totalAmountEarnings)
    }, [totalAmountEarnings])
    useEffect(() => {
        handleComputeDeductLeave(deductLeaveAmount)
    }, [deductLeaveAmount])

    const handleComputeDeductLeave = (deductLeaveAmount) => {
        earnings.deductLeave = Object.values(deductLeaveAmount).reduce((acc, curr) => acc += Number(curr), 0)
    }
    const handleComputeLeave = (totalAmountEarnings) => {
        earnings.leaveEarnings = Object.values(totalAmountEarnings).reduce((acc, curr) => acc += Number(curr), 0)
    }

    // const handleComputeIncentives = (e) => {
    //     const incentives = e.target.value;
    //     const partial_earn = (earnings.grosspay + earnings.leaveEarnings) - earnings.deductions - earnings.deductLeave;
    //     const resultAmount = {
    //         'partial': partial_earn,
    //         'incentives': incentives
    //     }
    //     setEarnings({
    //         ...earnings,
    //         total_earn: Object.values(resultAmount).reduce((acc, curr) => acc += Number(curr), 0)
    //     })
    // }
    // End Earnings Computation 

    // Benefits and Loans Computation 
    let total_benefit = []
    let totalAddiotionalBenefit = []
    let totalDeductionAmount = []
    let total_loan = []
    if (allBenefitsData != undefined) {
        const benefitState = (index) => (e) => {
            const benefitArray = allBenefitsData.map((list, i) => {
                if (index === i) {
                    return { ...list, ['totalAmount']: e.target.value };
                } else {
                    return list;
                }
            });
            setAllBenefitsData(benefitArray);
        };
        total_benefit = allBenefitsData.map((list, index) => {
            totalAddiotionalBenefit.push(list.totalAmount ? Number(list.totalAmount) : 0)
            submitBenefitData.push({
                ['benefitlist_id']: list.benefitlist_id, ['totalAmount']: list.totalAmount, ['type']: list.type
            })
            return (
                <TableRow key={index}>
                    <TableCell className='text-center  bg-light' sx={{ width: '50%' }}>{list.title}</TableCell>
                    <TableCell className='text-center  bg-light'>
                        <input id="demo-simple-select" style={{ height: 30 }} className='form-control' type="text" name={list.title} value={list.totalAmount} onChange={benefitState(index)} />
                    </TableCell>
                </TableRow>
            )
        })
    }

    if (allLoansData != undefined) {
        const loanState = (index) => (e) => {
            const loanArray = allLoansData.map((list, i) => {
                if (index === i) {
                    return { ...list, ['totalAmount']: e.target.value };
                } else {
                    return list;
                }
            });
            setAllLoansData(loanArray);
        };
        total_loan = allLoansData.map((list, index) => {
            totalDeductionAmount.push(list.totalAmount ? Number(list.totalAmount) : 0)
            submitBenefitData.push({
                ['benefitlist_id']: list.benefitlist_id, ['totalAmount']: list.totalAmount, ['type']: list.type
            })
            return (
                <TableRow key={index}>
                    <TableCell className='text-center  bg-light' sx={{ width: '50%' }}>{list.title}</TableCell>
                    <TableCell className='text-center  bg-light'>
                        <input id="demo-simple-select" style={{ height: 30 }} className='form-control' type="text" name={list.title} value={list.totalAmount} onChange={loanState(index)} />
                    </TableCell>
                </TableRow>
            )
        })
    }

    // END Benefits and Loans Computation 

    // Contribution Computation 
    let total_contri = []
    let totalContriAmount = []
    if (allContributionData != undefined) {
        const contriState = (index) => (e) => {
            const contriArray = allContributionData.map((list, i) => {
                if (index === i) {
                    return { ...list, ['totalAmount']: e.target.value };
                } else {
                    return list;
                }
            });

            setAllContributionData(contriArray);
        };
        total_contri = allContributionData.map((list, index) => {
            totalDeductionAmount.push(list.totalAmount ? Number(list.totalAmount) : 0)
            totalContriAmount.push(list.totalAmount ? Number(list.totalAmount) : 0)
            submitBenefitData.push({
                ['benefitlist_id']: list.benefitlist_id, ['totalAmount']: list.totalAmount, ['type']: list.type
            })
            return (
                <TableRow key={index}>
                    <TableCell className='text-center  bg-light' sx={{ width: '50%' }}>{list.title}</TableCell>
                    <TableCell className='text-center  bg-light'>
                        <input id="demo-simple-select" style={{ height: 30 }} className='form-control' type="text" name={list.title} value={list.totalAmount} onChange={contriState(index)} />
                    </TableCell>
                </TableRow>
            )
        })

    }
    useEffect(() => {
        handleTotalContribution(totalContriAmount)
    }, [totalContriAmount])

    const handleTotalContribution = (totalContriAmount) => {
        setContributionAmount(Object.values(totalContriAmount).reduce((acc, curr) => acc += Number(curr), 0))
    }
    // END Contribution Computation 

    // NET PAY COMPUTATION
    useEffect(() => {
        handleNetPay(earnings.total_earn ? earnings.total_earn : earnings.grosspay + (earnings.leaveEarnings - earnings.deductions) - earnings.deductLeave, totalDeduction, totalAddiotionalBenefit)
    }, [earnings.total_earn ? earnings.total_earn : earnings.grosspay + (earnings.leaveEarnings - earnings.deductions) - earnings.deductLeave, totalDeduction, totalAddiotionalBenefit])
    useEffect(() => {
        handleTotalAdiiotionalBenefit(totalAddiotionalBenefit)
    }, [totalAddiotionalBenefit])

    const handleTotalAdiiotionalBenefit = (totalAddiotionalBenefit) => {
        setTotalAddionBenefit(Object.values(totalAddiotionalBenefit).reduce((acc, curr) => acc += Number(curr), 0))
    }

    useEffect(() => {
        handleTotalDeduction(totalDeductionAmount)
    }, [totalDeductionAmount])

    const handleTotalDeduction = (totalDeductionAmount) => {
        setTotalDeduction(Object.values(totalDeductionAmount).reduce((acc, curr) => acc += Number(curr), 0))
    }

    const handleNetPay = (totalEarn, totalDeduction, totalAddiotionalBenefit) => {
        let totalEarnvals = totalEarn
        let additionalVal = cutoff != 1 ? Object.values(totalAddiotionalBenefit).reduce((acc, curr) => acc += Number(curr), 0) : 0
        setTotalNetPay(((totalEarnvals - totalDeduction) + additionalVal).toFixed(2))
    }
    // END NET PAY

    const handleSavePayroll = (e) => {
        e.preventDefault();
        new Swal({
            customClass: {
                container: 'my-swal'
            },
            title: "Are you sure?",
            text: "You want to save this Payroll Details?",
            icon: "warning",
            dangerMode: true,
            showCancelButton: true,
        }).then(res => {
            if (res.isConfirmed) {
                setOpenConfirmation(true)
            }
        });
    }

    const handleCloseConfirmation = () => {
        setOpenConfirmation(false)
    }

    const handleUpdatePayroll = (e) => {
        e.preventDefault();
        new Swal({
            customClass: {
                container: 'my-swal'
            },
            title: "Are you sure?",
            text: "You want to update benefits?",
            icon: "warning",
            dangerMode: true,
            showCancelButton: true,
        }).then(res => {
            if (res.isConfirmed) {
                axiosInstance.post('/update_payrollBenefits', {
                    emp_id: data.user_id,
                    isupdated: 1,
                    benefitsList: submitBenefitData
                }, { headers })
                    .then((response) => {
                        if (response.data.updatedBenefits === 'Success') {
                            close()
                            Swal.fire({
                                customClass: {
                                    container: 'my-swal'
                                },
                                title: "Success!",
                                text: "Payroll Details has been Updated successfully",
                                icon: "success",
                                timer: 1000,
                                showConfirmButton: false
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

    const handleDeleteBenefits = (e) => {
        e.preventDefault()
        new Swal({
            customClass: {
                container: 'my-swal'
            },
            title: "Are you sure?",
            text: "You want to delete benefits?",
            icon: "warning",
            dangerMode: true,
            showCancelButton: true,
        }).then(res => {
            if (res.isConfirmed) {
                axiosInstance.post('/delete_payrollBenefits', {
                    emp_id: data.user_id
                }, { headers })
                    .then((response) => {
                        if (response.data.deleteBenefits === 'Success') {
                            close()
                            Swal.fire({
                                customClass: {
                                    container: 'my-swal'
                                },
                                title: "Success!",
                                text: "Payroll Details has been Updated successfully",
                                icon: "success",
                                timer: 1000,
                                showConfirmButton: false
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
                        <input id="demo-simple-select" className='form-control' type="text" defaultValue={basic_rate.toFixed(2)} style={{ height: 40 }} />
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
                        <input id="demo-simple-select" className='form-control' type="text" defaultValue={hourly_rate.toFixed(2)} style={{ height: 40 }} />
                    </FormControl>
                </div>
            </div>
            <div className='row'>
                <div className='col-4'>
                    <TableContainer>
                        <Table className="table table-md table-vcenter table-bordered">
                            <TableHead>
                                <TableRow>
                                    <TableCell colSpan={2} className='text-center bg-light'> Earnings</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell className='text-center  bg-light' sx={{ width: '50%' }}>Gross Pay</TableCell>
                                    <TableCell className='text-center  bg-light'>
                                        <input id="demo-simple-select" style={{ backgroundColor: 'white', height: 30 }} disabled className='form-control' type="text" defaultValue={data.monthly_rate / 2} />
                                    </TableCell>
                                </TableRow>
                                {total_leaves}
                                <TableRow>
                                    <TableCell className='text-center  bg-light' sx={{ width: '50%' }}>Incentives</TableCell>
                                    <TableCell className='text-center  bg-light'>
                                        <input id="demo-simple-select" style={{ height: 30 }} className='form-control' type="text" value={incentives} onChange={(e) => setIncentives(e.target.value)} />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className='text-center  bg-light' sx={{ width: '50%' }}>Absences</TableCell>
                                    <TableCell className='text-center  bg-light'>
                                        <input id="demo-simple-select" style={{ backgroundColor: 'white', height: 30 }} disabled className='form-control' type="text" defaultValue={(data.absences == 0) ? ' ' : absences.toFixed(2)} />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className='text-center  bg-light' sx={{ width: '50%' }}>Tardiness</TableCell>
                                    <TableCell className='text-center  bg-light'>
                                        <input id="demo-simple-select" style={{ backgroundColor: 'white', height: 30 }} disabled className='form-control' type="text" defaultValue={(data.tardiness == 0) ? ' ' : tardiness.toFixed(2)} />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className='text-center  bg-light' sx={{ width: '50%' }}>Undertime</TableCell>
                                    <TableCell className='text-center  bg-light'>
                                        <input id="demo-simple-select" style={{ backgroundColor: 'white', height: 30 }} disabled className='form-control' type="text" defaultValue={(data.undertime == 0) ? ' ' : undertime.toFixed(2)} />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <div className='col-4'>
                    <TableContainer>
                        <Table className="table table-md table-vcenter table-bordered">
                            <TableHead>
                                <TableRow>
                                    <TableCell colSpan={2} className='text-center bg-light'> Additional Benefits</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {total_benefit}
                                {/* <TableRow>
                                    <TableCell className='text-center  bg-light' sx={{ width: '50%' }}>SSS</TableCell>
                                    <TableCell className='text-center  bg-light'>
                                        <input id="demo-simple-select" style={{ height: 30 }} className='form-control' type="text" value={benefitsData.sss ? benefitsData.sss : ''} onChange={(e) => setBenefitsData({ ...benefitsData, sss: e.target.value })} />
                                    </TableCell>
                                </TableRow> */}
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
                        <input id="demo-simple-select" className='form-control' type="text" readOnly defaultValue={totalAddionBenefit != 0 ? totalAddionBenefit : ''} style={{ height: 40, backgroundColor: 'white' }} />
                    </FormControl>
                    <TableContainer sx={{ marginTop: '145px' }}>
                        <Table className="table table-md table-vcenter table-bordered">
                            <TableHead>
                                <TableRow>
                                    <TableCell colSpan={2} className='text-center bg-light'> LOANS</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {total_loan}
                                {/* <TableRow>
                                    <TableCell className='text-center  bg-light' sx={{ width: '50%' }}>SSS LOAN</TableCell>
                                    <TableCell className='text-center  bg-light'>
                                        <input id="demo-simple-select" style={{ height: 30 }} className='form-control' type="text" value={loansData.sss ? loansData.sss : ''} onChange={(e) => setLoanData({ ...loansData, sss: e.target.value })} />
                                    </TableCell>
                                </TableRow> */}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <div className='col-4'>
                    <TableContainer>
                        <Table className="table table-md table-vcenter table-bordered">
                            <TableHead>
                                <TableRow>
                                    <TableCell colSpan={2} className='text-center bg-light'> EMPLOYEE CONTRIBUTION</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {total_contri ? total_contri : []}
                                {/* <TableRow>
                                    <TableCell className='text-center  bg-light' sx={{ width: '50%' }}>SSS</TableCell>
                                    <TableCell className='text-center  bg-light'>
                                        <input id="demo-simple-select" style={{ height: 30 }} className='form-control' type="text" name="sss" value={contributionData.sss ? contributionData.sss : 0} onChange={handleContribution} />
                                    </TableCell>
                                </TableRow> */}
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
                        <input id="demo-simple-select" className='form-control' type="text" readOnly defaultValue={contributionAmount != 0 ? contributionAmount : ''} style={{ height: 40, backgroundColor: 'white' }} />
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
                        <input id="demo-simple-select" className='form-control' type="text" style={{ height: 40, backgroundColor: 'white' }} readOnly value={parseFloat(earnings.grosspay + (earnings.leaveEarnings - earnings.deductions) + (incentives ? parseFloat(incentives) : 0) - earnings.deductLeave).toFixed(2)} />
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
                        <input id="demo-simple-select" className='form-control' type="text" defaultValue={totalDeduction} style={{ height: 40, backgroundColor: 'white' }} readOnly />
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
                        <input id="demo-simple-select" className='form-control' type="text" value={totalNetPay} onChange={(e) => setTotalNetPay(e.target.value)} style={{ height: 40, backgroundColor: 'white' }} readOnly />
                    </FormControl>
                </div>
            </div>
            <div className='d-flex justify-content-end' style={{ marginTop: 20 }}>
                <button type="button" className="btn btn-success btn-md mr-2" onClick={handleSavePayroll}>Save
                </button>
                <button type="button" className="btn btn-primary btn-md mr-2" onClick={handleUpdatePayroll} >Update
                </button>
                {/* <button type="button" className="btn btn-danger btn-md mr-2" onClick={handleDeleteBenefits} >Clear Benefits
                </button> */}


            </div>

            {openConfirmation && (
                <PayrollSaveModalConfirmation data={{
                    emp_id: data.user_id,
                    payroll_fromdate: data.fromDate,
                    payroll_todate: data.toDate,
                    payroll_cutoff: cutoff,
                    monthly_rate: data.monthly_rate,
                    workdays: data.workdays,
                    total_earnings: earnings.total_earn ? earnings.total_earn : earnings.grosspay + (earnings.leaveEarnings - earnings.deductions) - earnings.deductLeave,
                    total_deduction: totalDeduction,
                    total_contribution: contributionAmount,
                    net_pay: totalNetPay,
                    incentives: incentives ? parseFloat(incentives) : 0,
                    absences: absences ? absences : 0,
                    tardiness: tardiness ? tardiness : 0,
                    undertime: undertime ? undertime : 0,
                    earningsData: submitEarningsData,
                    benefitsData: submitBenefitData,
                    processtype: processtype
                }} open={openConfirmation} close={handleCloseConfirmation} closeOrigModal={close} />
            )}
        </>

    )
}

export default PayrollSaveModal