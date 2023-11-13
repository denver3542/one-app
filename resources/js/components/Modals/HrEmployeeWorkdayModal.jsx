import { Box, Button, FormControl, FormGroup, IconButton, InputLabel, Typography } from '@mui/material';
import React, { useState } from 'react'
import axiosInstance, { getJWTHeader } from '../../utils/axiosConfig';
import Swal from 'sweetalert2';

const HrEmployeeWorkdayModal = ({ modalID }) => {
    const [addWorkDays, setAddWorkDays] = useState();
    const storedUser = localStorage.getItem("nasya_user");
    const headers = getJWTHeader(JSON.parse(storedUser));

    const handleStatusChange = (e) => {
        setAddWorkDays(e.target.value);
    }
    const handleSubmitStatus = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('work_days', addWorkDays);

        new Swal({
            title: "Are you sure?",
            text: "You want to set this Workdays?",
            icon: "warning",
            dangerMode: true,
        }).then(res => {
            if (res.isConfirmed) {
                axiosInstance.post('/add-workdays', formData, { headers })
                    .then((response) => {
                        console.log('response', response.data)
                        // location.reload();
                    })
                    .catch((error) => {
                        console.log('error', error.response)
                    })
            }
        });
    }

    return (
        <div className="modal fade" id={modalID} role="dialog" aria-labelledby="add_file_modal" aria-hidden="true">
            <div className="modal-dialog modal-md" role="document">
                <div className="modal-content">
                    <div className="block block-themed block-transparent mb-0 mt-2 ">
                        <IconButton sx={{ float: 'right', marginRight: 2, color: 'red' }} data-dismiss="modal" aria-label="Close"><i className="si si-close"></i></IconButton>
                        <input type="text" className="form-control" id="register_ais_deleted" readOnly hidden value="0" name="is_deleted" />
                        <div className="block block-themed block-rounded block-shadow p-3">
                            <div className="block-content my-20">
                                <Typography className="text-center" style={{ marginBottom: '50px' }}>Set Work days</Typography>
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
                                            marginBottom: 3, width: '75%', '& label.Mui-focused': {
                                                color: '#97a5ba',
                                            },
                                            '& .MuiOutlinedInput-root': {

                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#97a5ba',
                                                },
                                            },
                                        }}>
                                            <InputLabel id="demo-simple-select-label" shrink={true} sx={{ backgroundColor: 'white', paddingLeft: 1, paddingRight: 1, borderColor: '#97a5ba' }}>Number of Days</InputLabel>
                                            <input id="demo-simple-select" className='form-control' onChange={handleStatusChange} type="number" style={{ height: 40 }} />
                                        </FormControl>
                                        <FormControl sx={{
                                            marginBottom: 3, width: '20%'
                                        }}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                onClick={handleSubmitStatus}
                                            >
                                                <i className="fa fa-check mr-2 mt-1"></i> Submit
                                            </Button>
                                        </FormControl>
                                    </FormGroup>
                                </Box>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </div >
    )
}

export default HrEmployeeWorkdayModal