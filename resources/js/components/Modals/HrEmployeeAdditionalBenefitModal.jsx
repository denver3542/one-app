import React, { useState } from 'react'
import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, FormGroup, InputLabel } from "@mui/material";
import { makeStyles } from '@mui/styles';
import Swal from 'sweetalert2';
import axiosInstance, { getJWTHeader } from '../../utils/axiosConfig';
const useStyles = makeStyles({
  topScrollPaper: {
    alignItems: "flex-start"
  },
  topPaperScrollBody: {
    verticalAlign: "top"
  }
});

const HrEmployeeAdditionalBenefitModal = ({ open, close, type }) => {
  const storedUser = localStorage.getItem("nasya_user");
  const headers = getJWTHeader(JSON.parse(storedUser));
  const classes = useStyles();
  const [title, setTitle] = useState()


  const handleSubmitBenefit = (e) => {
    e.preventDefault()
    if (window.confirm('Confirm Addition of Benefits')) {
      axiosInstance.post('/add_additional_benefits', {
        title: title,
        type: type
      }, { headers }).then((response) => {
        if (response.data.message === 'Success') {
          close()
          Swal.fire({
            title: "Success!",
            text: "Added successfully",
            icon: "success",
            timer: 1000,
            showConfirmButton: false
          }).then(function () {
            location.reload();
          });
        }
      })
    }

  }
  return (
    <Dialog open={open} fullWidth maxWidth="sm" classes={{
      scrollPaper: classes.topScrollPaper,
      paperScrollBody: classes.topPaperScrollBody
    }}>
      <Box  className="d-flex justify-content-between" >
      <DialogTitle>
        Add List
      </DialogTitle>
      <li className="fa fa-close text-danger p-10" onClick={close} style={{ cursor: 'pointer' }}></li>
      </Box>
      <DialogContent>
        <div
          className="table-responsive px-20 py-20"
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
              marginBottom: 3, width: '100%', '& label.Mui-focused': {
                color: '#97a5ba',
              },
              '& .MuiOutlinedInput-root': {

                '&.Mui-focused fieldset': {
                  borderColor: '#97a5ba',
                },
              },
            }}>
              <InputLabel id="demo-simple-select-label" shrink={true} sx={{ backgroundColor: 'white', paddingLeft: 1, paddingRight: 1, borderColor: '#97a5ba' }}>Title</InputLabel>
              <input id="demo-simple-select" className='form-control' value={title} onChange={(e) => setTitle(e.target.value)} type="text" style={{ height: 40 }} />
            </FormControl>

          </FormGroup>
          <div className='d-flex justify-content-center mt-20'>
            <Button
              type="submit"
              variant="contained"
              onClick={handleSubmitBenefit}
            >
              <i className="fa fa-check mr-2 mt-1"></i>Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default HrEmployeeAdditionalBenefitModal