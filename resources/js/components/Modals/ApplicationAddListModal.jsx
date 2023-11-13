import { Box, Button, FormControl, FormGroup, IconButton, InputLabel, TableBody, Table, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useEffect, useReducer, useState } from 'react'
import axiosInstance, { getJWTHeader } from '../../utils/axiosConfig';
import Swal from 'sweetalert2';

const ApplicationAddListModal = ({ modalID }) => {
    const [addTitle, setAddTitle] = useState({
        title: '',
        percentage: 0
    });
    const storedUser = localStorage.getItem("nasya_user");
    const headers = getJWTHeader(JSON.parse(storedUser));

    const handleSubmitStatus = (e) => {
        e.preventDefault();
        console.log(addTitle.percentage / 100);
        const formData = new FormData();
        formData.append('title', addTitle.title);
        formData.append('percentage', addTitle.percentage / 100);

        new Swal({
            title: "Are you sure?",
            text: "You want to add this Application?",
            icon: "warning",
            dangerMode: true,
        }).then(res => {
            if (res.isConfirmed) {
                axiosInstance.post('/add-applications-list', formData, { headers })
                    .then((response) => {
                        if(response.data.message === 'Success') {
                            Swal.fire({
                                title: "Success!",
                                text: "Application has been added successfully",
                                icon: "success",
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
            }
        });
    }

    const handleDeleteStatus = (id) => {
        new Swal({
            title: "Are you sure?",
            text: "You want to delete this status?",
            icon: "warning",
            dangerMode: true,
            allowOutsideClick: false,
            showCancelButton: true,
        }).then(res => {
            if (res.isConfirmed) {
                axiosInstance.put(`/delete-application-status/${id}`, { is_deleted: '1' }, { headers })
                    .then((response) => {
                        console.log(response.data.delete_app);
                        forceUpdate();
                    })
                    .catch((error) => {
                        alert('error', error.response)
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
                                <Typography className="text-center" style={{ marginBottom: '50px' }}>Add New Application List</Typography>
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
                                            <InputLabel id="demo-simple-select-label" shrink={true} sx={{ backgroundColor: 'white', paddingLeft: 1, paddingRight: 1, borderColor: '#97a5ba' }}>Title</InputLabel>
                                            <input id="demo-simple-select" className='form-control' onChange={(e) => setAddTitle({ ...addTitle, title: e.target.value })}  type="text" style={{ height: 40 }} />
                                        </FormControl>
                                        <FormControl sx={{
                                            marginBottom: 3, width: '20%'
                                        }}>
                                            <InputLabel id="demo-simple-select-label" shrink={true} sx={{ backgroundColor: 'white', paddingLeft: 1, paddingRight: 1, borderColor: '#97a5ba' }}>%</InputLabel>
                                            <input id="demo-simple-select" className='form-control'  onChange={(e) => setAddTitle({ ...addTitle, percentage: e.target.value })} type="number" style={{ height: 40 }} min={1} max={100} />
                                        </FormControl>

                                    </FormGroup>
                                    <div className='d-flex justify-content-center mt-20'>
                                    <Button
                                            type="submit"
                                            variant="contained"
                                            onClick={handleSubmitStatus}
                                        >
                                            <i className="fa fa-plus mr-2 mt-1"></i>Submit
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

export default ApplicationAddListModal