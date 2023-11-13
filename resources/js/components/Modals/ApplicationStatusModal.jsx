import React, { useEffect, useState } from 'react'
import { Select, MenuItem, Button, InputLabel, Box, FormControl, Typography, FormGroup, IconButton, Icon, Divider } from '@mui/material'
import axiosInstance, { getJWTHeader } from '../../utils/axiosConfig';
import Swal from 'sweetalert2';

const ApplicationStatusModal = ({ modalID, appData: { status, color, user_id, application_id, workday_id }, triggerChange, setTriggerChange }) => {
    const storedUser = localStorage.getItem("nasya_user");
    const headers = getJWTHeader(JSON.parse(storedUser));
    const [appStatus, setAppStatus] = useState([]);
    const [updateStatus, setUpdateStatus] = useState({
        status: '',
        color: ''
    });

    useEffect(() => {
        axiosInstance.get('/get_appplication_status', { headers }).then((response) => {
            setAppStatus(response.data.status);
        });
    }, [])
    const handleSubmitApplication = (e) => {
        e.preventDefault();
        $("#edit_application_modal").hide();
        new Swal({
            title: "Are you sure?",
            text: "Confirm to Update this application?",
            icon: "warning",
            allowOutsideClick: false,
            showCancelButton: true,
        }).then(res => {
            if (res.isConfirmed) {
                axiosInstance.post('/update-application', { user_id: user_id, workday_id: workday_id, application_id: application_id, status: updateStatus.status ? updateStatus.status : status, color: updateStatus.color ? updateStatus.color : color }, { headers })
                    .then((response) => {
                        if (response.data.editApplication === 'Success') {
                            Swal.fire({
                                text: "Application has been updated successfully",
                                icon: "success",
                                timer: 1000,
                                showConfirmButton: false
                            }).then(function (response) {
                                console.log(response);
                                location.reload();
                            });
                        } else {
                            Swal.fire({
                                    text: "There was an error updating the application",
                                    icon: "warning",
                                    timer: 1000,
                                    showConfirmButton: false
                                }).then(function (response) {
                                console.log(response);
                                location.reload();
                            });
                        }
                    })
                    .catch((error) => {
                        console.log('error', error.response)
                    })
            } else {
                location.reload()
            }
        });
    }
    const handleChangeButton = (e) => {
        e.preventDefault();
        setTriggerChange(true);
    }
    const handleCloseModal = () => {
        setUpdateStatus({ ...updateStatus, status: '' })
        setUpdateStatus({ ...updateStatus, color: '' })
    }
    return (
        <div className="modal fade" id={modalID} role="dialog" aria-labelledby="add_file_modal" aria-hidden="true">
            <div className="modal-dialog modal-md" role="document">
                <div className="modal-content">
                    <div className="block block-themed block-transparent mb-0 mt-2 ">
                        <IconButton sx={{ float: 'right', marginRight: 2, color: 'red' }} data-dismiss="modal" aria-label="Close" onClick={handleCloseModal}><i className="si si-close"></i></IconButton>
                        <input type="text" className="form-control" id="register_ais_deleted" readOnly hidden value="0" name="is_deleted" />
                        <div className="block block-themed block-rounded block-shadow p-3">
                            <div className="block-content my-20">
                                <Typography className="text-center" style={{ marginBottom: '50px' }}>Application</Typography>
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
                                            marginBottom: 3, width: '20%'
                                        }}>
                                            <input type="color" style={{ width: '100%', height: '50px' }} value={updateStatus.color || color} disabled={triggerChange ? false : true} onChange={(e) => setUpdateStatus({ ...updateStatus, color: e.target.value })} />
                                        </FormControl>
                                        <FormControl sx={{
                                            marginBottom: 3, width: '75%', '& label.Mui-focused': {
                                                color: '#97a5ba',
                                            },
                                            '& .MuiOutlinedInput-root': {

                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#97a5ba',
                                                },
                                            },
                                        }}>
                                            <InputLabel id="demo-simple-select-label" shrink={true} sx={{ borderColor: '#97a5ba', }}>Status</InputLabel>
                                            <Select
                                                id="demo-simple-select"
                                                label="Status"
                                                value={updateStatus.status || status}
                                                readOnly={triggerChange ? false : true}
                                                onChange={(e) => setUpdateStatus({ ...updateStatus, status: e.target.value })}
                                                notched={true}
                                                sx={{ width: '100%', }}
                                            >
                                                {appStatus.map((statusList) => (
                                                    <MenuItem value={statusList.app_status_name} key={statusList.app_status_id}>{statusList.app_status_name}</MenuItem>
                                                ))}

                                            </Select>

                                        </FormControl>
                                    </FormGroup>
                                    <div className="d-flex justify-content-center">
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            onClick={triggerChange ? handleSubmitApplication : handleChangeButton}
                                        >
                                            {triggerChange ? <p className='m-0'><i className="fa fa-plus mr-2 mt-1"></i> Submit</p> : <p className='m-0'><i className="fa fa-pencil mr-2 mt-1"></i> Edit</p>}

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

export default ApplicationStatusModal