import { Box, Button, FormControl, FormGroup, IconButton, InputLabel, TableBody, Table, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useEffect, useReducer, useState } from 'react'
import axiosInstance, { getJWTHeader } from '../../utils/axiosConfig';
import Swal from 'sweetalert2';

const ApplicationEditListModal = ({ modalID, data: { applist_id, list_name, percentage } }) => {
    const storedUser = localStorage.getItem("nasya_user");
    const headers = getJWTHeader(JSON.parse(storedUser));
    const [appType, setAppType] = useState({
        title: '',
        percentage: 0
    });
    const handleSubmitType = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('appID', applist_id);
        formData.append('title', appType.title);
        formData.append('old_title', list_name);
        formData.append('old_percentage', percentage);
        formData.append('percentage', appType.percentage / 100);
        new Swal({
            title: "Are you sure?",
            text: "You want to update this application?",
            icon: "warning",
            dangerMode: true,
        }).then(res => {
            if (res.isConfirmed) {
                axiosInstance.post('/add_type_application', formData, { headers }).then((response) => {
                    if (response.data.message === 'Success') {
                        Swal.fire({
                            title: "Success!",
                            text: "Application has been updated successfully",
                            icon: "success",
                            timer: 1000,
                            showConfirmButton: false
                        }).then(function () {
                            location.reload();
                        });
                    }
                })
            }
        });

    }
    const handleCloseModal = () => {
        setAppType({
            ...appType,
            title: '',
            percentage: 0
        })
    }
    return (
        <div className="modal fade" id={modalID} role="dialog" data-backdrop='static' data-keyboard='false' aria-labelledby="add_file_modal" aria-hidden="true">
            <div className="modal-dialog modal-md" role="document">
                <div className="modal-content">
                    <div className="block block-themed block-transparent mb-0 mt-2 ">
                        <IconButton sx={{ float: 'right', marginRight: 2, color: 'red' }} onClick={handleCloseModal} data-dismiss="modal" aria-label="Close"><i className="si si-close"></i></IconButton>
                        <input type="text" className="form-control" id="register_ais_deleted" readOnly hidden value="0" name="is_deleted" />
                        <div className="block block-themed block-rounded block-shadow p-3">
                            <div className="block-content my-20">
                                <Typography className="text-center" style={{ marginBottom: '50px' }}>Edit List</Typography>
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
                                            <input id="demo-simple-select" className='form-control' value={appType.title} placeholder={list_name} onChange={(e) => setAppType({ ...appType, title: e.target.value })} type="text" style={{ height: 40 }} />
                                        </FormControl>
                                        <FormControl sx={{
                                            marginBottom: 3, width: '20%'
                                        }}>
                                            <InputLabel id="demo-simple-select-label" shrink={true} sx={{ backgroundColor: 'white', paddingLeft: 1, paddingRight: 1, borderColor: '#97a5ba' }}>%</InputLabel>
                                            <input id="demo-simple-select" className='form-control' value={appType.percentage} placeholder={percentage} onChange={(e) => setAppType({ ...appType, percentage: e.target.value })} type="number" style={{ height: 40 }} min={1} max={100} />
                                        </FormControl>

                                    </FormGroup>
                                    <div className='d-flex justify-content-center mt-20'>
                                        <Button
                                            disabled={(appType.title || appType.percentage != '') ? false : true}
                                            type="submit"
                                            variant="contained"
                                            onClick={handleSubmitType}
                                        >
                                            <i className="fa fa-plus mr-2 mt-1"></i>Update
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

export default ApplicationEditListModal