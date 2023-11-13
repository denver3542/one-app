import React, { useEffect, useState } from 'react'
import { Select, MenuItem, InputLabel, Box, FormControl, Typography, FormGroup, IconButton, Button, Icon, Divider } from '@mui/material'
import axiosInstance, { getJWTHeader } from '../../utils/axiosConfig';
import Swal from 'sweetalert2';

const HrEmployeeEditModal = ({ modalID, wkdays, data: { user_id, fname, mname, lname, address, contact_number, email, bdate, user_type, status, hourly_rate, daily_rate, monthly_rate, work_days, department, category, date_hired } }, empEdit) => {

    const [statusDetails, setStatusDetails] = useState([]);
    const storedUser = localStorage.getItem("nasya_user");
    const [showEdit, setShowEdit] = useState(empEdit);
    const [editedRate, setEditedRate] = useState({
        daily_rate: '',
        hourly_rate: ''
    });
    const [updateEmployee, setUpdateEmployee] = useState({
        status: '',
        date_hired: '',
        work_days: '',
        hourly_rate: '',
        daily_rate: '',
        monthly_rate: '',
    });
    const headers = getJWTHeader(JSON.parse(storedUser));
    useEffect(() => {
        axiosInstance.get('/status', { headers }).then((response) => {
            setStatusDetails(response.data.status);
        });
    }, [])
    useEffect(() => {
       handleEditrate(daily_rate, hourly_rate)
    }, [daily_rate, hourly_rate])

    const handleEditrate = (daily, hourly) => {
        setEditedRate({
            ...editedRate,
            daily_rate: daily,
            hourly_rate: hourly
        });
    }

    const handleEdit = (e) => {
        e.preventDefault();
        const id = user_id
        $("#add_new_file").hide();
        new Swal({
            title: "Are you sure?",
            text: "Confirm to Update this employee?",
            icon: "warning",
            allowOutsideClick: false,
            showCancelButton: true,
        }).then(res => {
            if (res.isConfirmed) {
                axiosInstance.put(`/edit-employees/${id}`, {
                    status: updateEmployee.status ? updateEmployee.status : status,
                    work_days: wkdays,
                    date_hired: updateEmployee.date_hired ? updateEmployee.date_hired : date_hired,
                    hourly_rate: updateEmployee.hourly_rate ? updateEmployee.hourly_rate : hourly_rate.toFixed(2),
                    daily_rate: updateEmployee.daily_rate ? updateEmployee.daily_rate : daily_rate.toFixed(2),
                    monthly_rate: updateEmployee.monthly_rate ? updateEmployee.monthly_rate : parseInt(monthly_rate.toFixed(2)),
                }, { headers }).then(function (response) {
                    console.log(response);
                    location.reload()
                })
                    .catch((error) => {
                        console.log(error)
                        // location.reload();
                    })
            } else {
                location.reload()
            }
        });


    }
    const handleRate = (e) => {
        const mrate = e.target.value;
        const val =  wkdays;
        const drate = mrate / val;
        const hrate = drate / 8;
        // const mrate = drate * val;
        setUpdateEmployee({
            ...updateEmployee,
            monthly_rate: mrate,
            hourly_rate:  hrate.toFixed(2),
            daily_rate:  drate.toFixed(2),
        })
    }

    // const handleWorkDays = (e) => {
    //     const wdays = e.target.value;
    //     const mrate = updateEmployee.monthly_rate ? updateEmployee.monthly_rate : monthly_rate;
    //     const drate =  mrate / wdays;
    //     const hrate = drate / 8;
    //     setUpdateEmployee({
    //         ...updateEmployee,
    //         work_days: wdays,
    //         hourly_rate: wdays ? hrate.toFixed(2) : hourly_rate,
    //         daily_rate: wdays ? drate.toFixed(2) : daily_rate
    //     })
    // }

    const handleCloseButton = (e) => {
        e.preventDefault();
        setShowEdit(false)
        setUpdateEmployee({
            ...updateEmployee,
            monthly_rate: '',
            hourly_rate: '',
            daily_rate: ''
        })
        
    }

    return (
        <div className="modal fade" id={modalID} data-backdrop='static' data-keyboard='false'>
            <div className="modal-dialog modal-lg" role="document" >
                <div className="modal-content">
                    <div className="block block-themed block-transparent mb-0 mt-2 ">
                        <IconButton sx={{ float: 'right', marginRight: 2, color: 'red' }} data-dismiss="modal" aria-label="Close" onClick={handleCloseButton}><i className="si si-close" ></i></IconButton>
                        <input type="text" className="form-control" id="register_ais_deleted" readOnly hidden value="0" name="is_deleted" />
                        <div className="block block-themed block-rounded block-shadow p-3">
                            <div className="block-content my-20">
                                <Typography className="text-center" style={{ marginBottom: '50px' }}>Employee Form</Typography>
                                <Box component="form"
                                    sx={{ minWidth: 120 }}
                                    noValidate
                                    autoComplete="off"
                                    // onSubmit={showEdit != true ? handleSubmit : handleEdit}
                                    encType="multipart/form-data"
                                >
                                    <FormGroup row={true} className="d-flex justify-content-between" sx={{
                                        '& label.Mui-focused': {
                                            color: '#97a5ba',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#97a5ba',
                                            },
                                        },
                                    }}>
                                        <FormControl sx={{
                                            marginBottom: 3, width: '30%', '& label.Mui-focused': {
                                                color: '#97a5ba',
                                            },
                                            '& .MuiOutlinedInput-root': {

                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#97a5ba',
                                                },
                                            },
                                        }}>
                                            <InputLabel shrink={true} sx={{ backgroundColor: 'white', paddingLeft: 1, paddingRight: 1, borderColor: '#97a5ba' }}>Firstname</InputLabel>
                                            <input className='form-control bg-white' readOnly defaultValue={fname} type="text" style={{ height: 50 }} />
                                        </FormControl>

                                        <FormControl sx={{
                                            marginBottom: 3, width: '30%', '& label.Mui-focused': {
                                                color: '#97a5ba',
                                            },
                                            '& .MuiOutlinedInput-root': {

                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#97a5ba',
                                                },
                                            },
                                        }}>
                                            <InputLabel shrink={true} sx={{ backgroundColor: 'white', paddingLeft: 1, paddingRight: 1, borderColor: '#97a5ba' }}>Middlename</InputLabel>
                                            <input className='form-control bg-white' readOnly defaultValue={mname} type="text" style={{ height: 50 }} />
                                        </FormControl>

                                        <FormControl sx={{
                                            marginBottom: 3, width: '30%', '& label.Mui-focused': {
                                                color: '#97a5ba',
                                            },
                                            '& .MuiOutlinedInput-root': {

                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#97a5ba',
                                                },
                                            },
                                        }}>
                                            <InputLabel shrink={true} sx={{ backgroundColor: 'white', paddingLeft: 1, paddingRight: 1, borderColor: '#97a5ba' }}>Lastname</InputLabel>
                                            <input className='form-control bg-white' readOnly defaultValue={lname} type="text" style={{ height: 50 }} />
                                        </FormControl>
                                    </FormGroup>

                                    <FormGroup row={true} className="d-flex justify-content-between" sx={{
                                        '& label.Mui-focused': {
                                            color: '#97a5ba',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#97a5ba',
                                            },
                                        },
                                    }}>
                                        <FormControl sx={{
                                            marginBottom: 3, width: '48%', '& label.Mui-focused': {
                                                color: '#97a5ba',
                                            },
                                            '& .MuiOutlinedInput-root': {

                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#97a5ba',
                                                },
                                            },
                                        }}>
                                            <InputLabel shrink={true} sx={{ backgroundColor: 'white', paddingLeft: 1, paddingRight: 1, borderColor: '#97a5ba' }}>Email</InputLabel>
                                            <input className='form-control bg-white' maxLength="11" readOnly defaultValue={email} type="text" style={{ height: 50 }} />
                                        </FormControl>
                                        <FormControl sx={{
                                            marginBottom: 3, width: '48%', '& label.Mui-focused': {
                                                color: '#97a5ba',
                                            },
                                            '& .MuiOutlinedInput-root': {

                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#97a5ba',
                                                },
                                            },
                                        }}>
                                            <InputLabel shrink={true} sx={{ backgroundColor: 'white', paddingLeft: 1, paddingRight: 1, borderColor: '#97a5ba' }}>Type</InputLabel>
                                            <input className='form-control bg-white' maxLength="11" readOnly defaultValue={user_type} type="text" style={{ height: 50 }} />
                                        </FormControl>
                                    </FormGroup>
                                    <FormGroup row={true} className="d-flex justify-content-between" sx={{
                                        '& label.Mui-focused': {
                                            color: '#97a5ba',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#97a5ba',
                                            },
                                        },
                                    }}>

                                        <FormControl sx={{
                                            marginBottom: 3, width: '48%', '& label.Mui-focused': {
                                                color: '#97a5ba',
                                            },
                                            '& .MuiOutlinedInput-root': {

                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#97a5ba',
                                                },
                                            },
                                        }}>
                                            <InputLabel shrink={true} sx={{ backgroundColor: 'white', paddingLeft: 1, paddingRight: 1, borderColor: '#97a5ba' }}>Contact Number</InputLabel>
                                            <input className='form-control bg-white' readOnly defaultValue={contact_number} type="number" style={{ height: 50 }} />
                                        </FormControl>

                                        <FormControl sx={{
                                            marginBottom: 3, width: '48%', '& label.Mui-focused': {
                                                color: '#97a5ba',
                                            },
                                            '& .MuiOutlinedInput-root': {

                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#97a5ba',
                                                },
                                            },
                                        }}>
                                            <InputLabel shrink={true} sx={{ backgroundColor: 'white', paddingLeft: 1, paddingRight: 1, borderColor: '#97a5ba' }}>Date of Birth</InputLabel>
                                            <input className='form-control bg-white' readOnly defaultValue={bdate} maxLength="11" type="date" style={{ height: 50 }} />
                                        </FormControl>

                                        <FormControl sx={{
                                            marginBottom: 3, width: '48%', '& label.Mui-focused': {
                                                color: '#97a5ba',
                                            },
                                            '& .MuiOutlinedInput-root': {

                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#97a5ba',
                                                },
                                            },
                                        }}>
                                            <InputLabel shrink={true} sx={{ backgroundColor: 'white', paddingLeft: 1, paddingRight: 1, borderColor: '#97a5ba' }}>Address</InputLabel>
                                            <input className='form-control bg-white' readOnly defaultValue={address} type="text" style={{ height: 50 }} />
                                        </FormControl>

                                        <FormControl sx={{
                                            marginBottom: 3, width: '48%', '& label.Mui-focused': {
                                                color: '#97a5ba',
                                            },
                                            '& .MuiOutlinedInput-root': {

                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#97a5ba',
                                                },
                                            },
                                        }}>
                                            <InputLabel shrink={true} sx={{ backgroundColor: 'white', paddingLeft: 1, paddingRight: 1, borderColor: '#97a5ba' }}>Date Hired</InputLabel>
                                            <input className='form-control bg-white'  defaultValue={updateEmployee.date_hired ? updateEmployee.date_hired : date_hired} type="date" onChange={(e) => setUpdateEmployee({ ...updateEmployee, date_hired: e.target.value })} style={{ height: 50, cursor: 'pointer' }} />
                                        </FormControl>
                                    </FormGroup>

                                    <Divider light style={{ marginBottom: 20 }} />

                                    <FormGroup row={true} className="d-flex justify-content-between" sx={{
                                        '& label.Mui-focused': {
                                            color: '#97a5ba',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#97a5ba',
                                            },
                                        },
                                    }}>

                                        <FormControl sx={{
                                            marginBottom: 3, width: '48%', '& label.Mui-focused': {
                                                color: '#97a5ba',
                                            },
                                            '& .MuiOutlinedInput-root': {

                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#97a5ba',
                                                },
                                            },
                                        }}>
                                            <InputLabel shrink={true} sx={{ backgroundColor: 'white', paddingLeft: 1, paddingRight: 1, borderColor: '#97a5ba' }}>Department</InputLabel>
                                            <input className='form-control bg-white' maxLength="11" readOnly defaultValue={department} type="text" style={{ height: 50 }} />
                                        </FormControl>
                                        <FormControl sx={{
                                            marginBottom: 3, width: '48%', '& label.Mui-focused': {
                                                color: '#97a5ba',
                                            },
                                            '& .MuiOutlinedInput-root': {

                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#97a5ba',
                                                },
                                            },
                                        }}>
                                            <InputLabel shrink={true} sx={{ borderColor: '#97a5ba', }}>Status</InputLabel>
                                            <Select
                                            
                                                label="Status"
                                                notched={true}
                                                value={updateEmployee.status ? updateEmployee.status : status}
                                                readOnly={showEdit ? false : true}
                                                onChange={(e) => setUpdateEmployee({ ...updateEmployee, status: e.target.value })}
                                                sx={{ width: '100%', }}
                                            >
                                                {statusDetails.map((res) => (
                                                    <MenuItem key={res.status_id} value={res.status_name}>{res.status_name}</MenuItem>
                                                ))}


                                            </Select>
                                        </FormControl>

                                        <FormControl sx={{
                                            marginBottom: 3, width: '48%', '& label.Mui-focused': {
                                                color: '#97a5ba',
                                            },
                                            '& .MuiOutlinedInput-root': {

                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#97a5ba',
                                                },
                                            },
                                        }}>
                                            <InputLabel shrink={true} sx={{ backgroundColor: 'white', paddingLeft: 1, paddingRight: 1, borderColor: '#97a5ba' }}>Designation</InputLabel>
                                            <input className='form-control bg-white' type="text" readOnly defaultValue={category} placeholder={category ? '' : "not yet assigned"} style={{ height: 50 }} />
                                        </FormControl>
                                        <FormControl sx={{
                                            marginBottom: 3, width: '48%', '& label.Mui-focused': {
                                                color: '#97a5ba',
                                            },
                                            '& .MuiOutlinedInput-root': {

                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#97a5ba',
                                                },
                                            },
                                        }}>
                                            <InputLabel shrink={true} sx={{ backgroundColor: 'white', paddingLeft: 1, paddingRight: 1, borderColor: '#97a5ba' }}>Monthly Rate</InputLabel>
                                            <input className='form-control bg-white bg-white' value={updateEmployee.monthly_rate} placeholder={monthly_rate } onChange={(e) => handleRate(e)} type="text" style={{ height: 50 }} />
                                        </FormControl>
                                    </FormGroup>

                                    <Divider style={{ marginBottom: 20 }} />

                                    <FormGroup row={true} className="d-flex justify-content-between" sx={{
                                        '& label.Mui-focused': {
                                            color: '#97a5ba',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#97a5ba',
                                            },
                                        },
                                    }}>
                                          <FormControl sx={{
                                            marginBottom: 3, width: '30%', '& label.Mui-focused': {
                                                color: '#97a5ba',
                                            },
                                            '& .MuiOutlinedInput-root': {

                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#97a5ba',
                                                },
                                            },
                                        }}>
                                            <InputLabel shrink={true} sx={{ backgroundColor: 'white', paddingLeft: 1, paddingRight: 1, borderColor: '#97a5ba' }}>Work Days</InputLabel>
                                            <input className='form-control bg-white' defaultValue={wkdays} placeholder={wkdays} onChange={(e) => setUpdateEmployee({ ...updateEmployee, work_days: e.target.value })} readOnly type="text" style={{ height: 50 }} />
                                        </FormControl>
                                        <FormControl sx={{
                                            marginBottom: 3, width: '30%', '& label.Mui-focused': {
                                                color: '#97a5ba',
                                            },
                                            '& .MuiOutlinedInput-root': {

                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#97a5ba',
                                                },
                                            },
                                        }}>
                                            <InputLabel shrink={true} sx={{ backgroundColor: 'white', paddingLeft: 1, paddingRight: 1, borderColor: '#97a5ba' }}>Daily Rate</InputLabel>
                                            <input className='form-control bg-white bg-white' readOnly defaultValue={updateEmployee.daily_rate ? updateEmployee.daily_rate : (editedRate.daily_rate ? parseInt(editedRate.daily_rate).toFixed(2) : '')}  type="text" onChange={(e) => setUpdateEmployee({ ...updateEmployee, daily_rate: e.target.value })} style={{ height: 50 }} />
                                        </FormControl>
                                        <FormControl sx={{
                                            marginBottom: 3, width: '30%', '& label.Mui-focused': {
                                                color: '#97a5ba',
                                            },
                                            '& .MuiOutlinedInput-root': {

                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#97a5ba',
                                                },
                                            },
                                        }}>
                                            <InputLabel shrink={true} sx={{ backgroundColor: 'white', paddingLeft: 1, paddingRight: 1, borderColor: '#97a5ba' }}>Hourly Rate</InputLabel>
                                            <input className='form-control bg-white'  defaultValue={updateEmployee.hourly_rate ? updateEmployee.hourly_rate : (editedRate.hourly_rate ? parseInt(editedRate.hourly_rate).toFixed(2) : '')} readOnly onChange={(e) => setUpdateEmployee({ ...updateEmployee, hourly_rate: e.target.value })}  type="number" style={{ height: 50 }} />
                                        </FormControl>
                                    </FormGroup>

                                    <div className='d-flex justify-content-center mt-50'>
                                        <Button
                                            type={"submit"}
                                            variant="contained"
                                            color={"primary"}
                                            onClick={handleEdit}
                                        >
                                            {'Update'}
                                        </Button>
                                    </div>
                                </Box>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </div >
    )
}

export default HrEmployeeEditModal