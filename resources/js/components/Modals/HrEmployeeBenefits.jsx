import { Box, Button, FormControl, FormGroup, IconButton, InputLabel, TableBody, Table, TableCell, TableContainer, TableHead, TableRow, Typography, Select, MenuItem, Dialog, DialogTitle, DialogContent } from '@mui/material';
import React, { useEffect, useReducer, useState } from 'react'
import axiosInstance, { getJWTHeader } from '../../utils/axiosConfig';
import Swal from 'sweetalert2';

const HrEmployeeBenefits = ({ open, close }) => {
    const [listBenefits, setListBenefits] = useState([]);
    const [listAddtionalBenefits, setListAddtionalBenefits] = useState([]);
    const [benefitsData, setBenefitsData] = useState({
        list_id: '',
        amount: ''
    })
    const [reducerValue, forceUpdate] = useReducer(x => x + 1, 0);
    const storedUser = localStorage.getItem("nasya_user");
    const headers = getJWTHeader(JSON.parse(storedUser));

    useEffect(() => {
        axiosInstance.get(`/additional_benefits/${1}`, { headers }).then((response) => {
            setListAddtionalBenefits(response.data.data);
        });
    }, [])

    useEffect(() => {
        axiosInstance.get('/benefits', { headers }).then((response) => {
            setListBenefits(response.data.benefits);
        });
    }, [reducerValue])

    const handleSubmitBenefits = (e) => {
        e.preventDefault();
        // const formData = new FormData();
        // formData.append('status_name', addStatus);

        new Swal({
            title: "Are you sure?",
            text: "You want to add this benefits?",
            icon: "warning",
            dangerMode: true,
        }).then(res => {
            if (res.isConfirmed) {
                axiosInstance.post('/add_benefits', {
                    benefitlist_id: benefitsData.list_id,
                    amount: benefitsData.amount,
                    type: 1
                }, { headers })
                    .then((response) => {
                        console.log('response', response.data)
                        // location.reload();
                        forceUpdate();
                    })
                    .catch((error) => {
                        console.log('error', error.response)
                    })
            }
        });
    }
    const handleDeleteBenefits = (id) => {
        console.log(id);
        new Swal({
            title: "Are you sure?",
            text: "You want to delete this benefit?",
            icon: "warning",
            dangerMode: true,
            allowOutsideClick: false,
            showCancelButton: true,
        }).then(res => {
            if (res.isConfirmed) {
                axiosInstance.post('/delete_benefits', { benefits_id: id }, { headers })
                    .then((response) => {
                        console.log(response);
                        forceUpdate();
                    })
                    .catch((error) => {
                        alert('error', error.response)
                    })
            }
        });
    }

    const handleClose = () => {
        close()
      }

    return (
        <>
            <Dialog sx={{
                "& .MuiDialog-container": {
                    justifyContent: "flex-center",
                    alignItems: "flex-start"
                }
            }}
                open={open} fullWidth maxWidth="sm">
                <Box className="d-flex justify-content-between" >
                    <DialogTitle>
                        <Typography className="text-center">Add new Benefits</Typography>
                    </DialogTitle>
                    <IconButton sx={{ float: 'right', marginRight: 2, color: 'red' }} data-dismiss="modal" aria-label="Close" onClick={handleClose}><i className="si si-close"></i></IconButton>
                </Box>
                <DialogContent>
                    <div className="block-content my-20">
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
                                    marginBottom: 3, width: '65%', '& label.Mui-focused': {
                                        color: '#97a5ba',
                                    },
                                    '& .MuiOutlinedInput-root': {

                                        '&.Mui-focused fieldset': {
                                            borderColor: '#97a5ba',
                                        },
                                    },
                                }}>
                                    <InputLabel id="demo-simple-select-label" shrink={true} sx={{ borderColor: 'white', backgroundColor: 'white' }}>Description</InputLabel>
                                    <Select
                                        id="demo-simple-select"
                                        label="Status"
                                        value={benefitsData.list_id}
                                        onChange={(e) => setBenefitsData({ ...benefitsData, list_id: e.target.value })}
                                        notched={true}
                                        sx={{ width: '100%', }}
                                    >
                                        {listAddtionalBenefits.map((list, index) => (
                                            <MenuItem value={list.benefitlist_id} key={index}>{list.title}</MenuItem>
                                        ))}

                                    </Select>
                                </FormControl>
                                <FormControl sx={{
                                    marginBottom: 3, width: '30%'
                                }}>
                                    <InputLabel id="demo-simple-select-label" shrink={true} sx={{ backgroundColor: 'white', paddingLeft: 1, paddingRight: 1, borderColor: '#97a5ba' }}>Amount</InputLabel>
                                    <input id="demo-simple-select" className='form-control' type="number" value={benefitsData.amount}
                                        onChange={(e) => setBenefitsData({ ...benefitsData, amount: e.target.value })} style={{ height: 52 }} />
                                </FormControl>
                            </FormGroup>
                            <FormControl className='d-flex justify-content-center' sx={{
                                marginBottom: 3,
                            }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    style={{ width: '50%', marginLeft: '25%', marginRight: '25%' }}
                                    onClick={handleSubmitBenefits}
                                >
                                    <i className="fa fa-plus mr-2 mt-1"></i> Submit
                                </Button>
                            </FormControl>
                        </Box>
                    </div>
                    <TableContainer>
                        <Table className="table table-md  table-striped  table-vcenter">
                            <TableHead>
                                <TableRow>
                                    <TableCell className='text-center'> #</TableCell>
                                    <TableCell > Description</TableCell>
                                    <TableCell > Amount</TableCell>
                                    <TableCell className='text-center'> ACTION</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {listBenefits.map((res, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell className='text-center'> {index + 1}</TableCell>
                                            <TableCell > {res.description}</TableCell>
                                            <TableCell > {res.amount}</TableCell>
                                            <TableCell className='text-center'>
                                                <Button
                                                    type="submit"
                                                    variant="text"
                                                    style={{ color: 'red' }}
                                                    onClick={() => handleDeleteBenefits(res.benefits_id)}
                                                >
                                                    <li className='fa fa-trash' style={{ fontSize: 14 }}></li>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}


                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default HrEmployeeBenefits