import React, { useRef } from "react";
import {
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Box,
    TableHead,
    Grid,
} from "@mui/material";
import HomeLogo from "../../../images/home-logo.png";
import axiosInstance, { getJWTHeader } from "../../utils/axiosConfig";
import "../../../../resources/css/profile.css";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import { makeStyles } from "@mui/styles";
import Currency from "react-currency-formatter";

const useStyles = makeStyles({
    topScrollPaper: {
        alignItems: "flex-start",
    },
    topPaperScrollBody: {
        verticalAlign: "top",
    },
});

const SummarySaveModal = ({
    open,
    data,
    close,
    cutoff,
    from,
    to,
    year,
    totalGrosspay,
    totalSSSEmps,
    totalSSSEmpr,
    totalPhilEmps,
    totalPhilEmpr,
    totalPGIBIGEmps,
    totalPGIBIGEmpr,
    totalDeduction,
    totalNetpay,
}) => {
    const classes = useStyles();
    const contentToPrint = useRef();
    const storedUser = localStorage.getItem("nasya_user");
    const headers = getJWTHeader(JSON.parse(storedUser));

    const handleToPrint = useReactToPrint({
        content: () => contentToPrint.current,
        onAfterPrint: () => {
            close();
        },
    });

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="lg"
            scroll="paper"
            classes={{
                scrollPaper: classes.topScrollPaper,
                paperScrollBody: classes.topPaperScrollBody,
            }}
        >
            <DialogContent>
                <DialogTitle className="d-flex justify-content-end">
                    {/* <Typography>Payroll Summary</Typography> */}
                    <IconButton sx={{ color: "red" }} onClick={close}>
                        <i className="si si-close"></i>
                    </IconButton>
                </DialogTitle>
                <Box
                    component="div"
                    className="payroll_details px-2"
                    ref={contentToPrint}
                    sx={{
                        "@media print": {
                            "@page": {
                                size: "12in 11in",
                            },
                        },
                    }}
                >
                    <div>
                        <img
                            className="logoNasya d-flex justify-content-center"
                            src={HomeLogo}
                            style={{
                                height: 70,
                                width: 70,
                                margin: "0 auto",
                                display: "block",
                                marginTop: "30px",
                            }}
                        />
                        <Typography
                            className="text-center"
                            sx={{ marginTop: "5px" }}
                        >
                            Nasya Business Consultancy Services
                        </Typography>
                        <Typography
                            className="text-center"
                            sx={{ marginBottom: "10px" }}
                        >
                            (
                            {moment(from).format("MMMM DD") +
                                " - " +
                                moment(to).format("MMMM DD") +
                                ", " +
                                year}
                            )
                        </Typography>
                    </div>
                    <Box component="div" className="p-10">
                        <TableContainer>
                            <Table className="table table-sm  table-striped  table-bordered">
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            className="text-center"
                                            sx={{ width: "250px" }}
                                        >
                                            Employee Name
                                        </TableCell>
                                        <TableCell className="text-center">
                                            Grosspay
                                        </TableCell>
                                        <TableCell
                                            className="text-center"
                                            colSpan={2}
                                        >
                                            SSS Contribution
                                        </TableCell>
                                        <TableCell
                                            className="text-center"
                                            colSpan={2}
                                        >
                                            Phil Health
                                        </TableCell>
                                        <TableCell
                                            className="text-center"
                                            colSpan={2}
                                        >
                                            Pag-ibig
                                        </TableCell>
                                        <TableCell
                                            className="text-center"
                                            sx={{ width: "200px" }}
                                        >
                                            Total Deduction
                                        </TableCell>
                                        <TableCell
                                            className="text-center"
                                            sx={{ width: "250px" }}
                                        >
                                            Net Take Home Pay
                                        </TableCell>
                                    </TableRow>
                                    <TableRow
                                        sx={{
                                            borderTop: 1,
                                            borderColor: "#e4e7ed",
                                        }}
                                    >
                                        <TableCell
                                            sx={{ width: "200px" }}
                                        ></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell className="text-center font-weight-bold">
                                            {" "}
                                            <Typography
                                                variant="subtitle2"
                                                sx={{ padding: 0, margin: 0 }}
                                            >
                                                Employee's Share
                                            </Typography>
                                        </TableCell>
                                        <TableCell className="text-center font-weight-bold">
                                            Employer's Share
                                        </TableCell>
                                        <TableCell className="text-center font-weight-bold">
                                            Employee's Share
                                        </TableCell>
                                        <TableCell className="text-center font-weight-bold">
                                            Employer's Share
                                        </TableCell>
                                        <TableCell className="text-center font-weight-bold">
                                            Employee's Share
                                        </TableCell>
                                        <TableCell className="text-center font-weight-bold">
                                            Employer's Share
                                        </TableCell>
                                        <TableCell
                                            sx={{ width: "200px" }}
                                        ></TableCell>
                                        <TableCell
                                            sx={{ width: "250px" }}
                                        ></TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {data.map((payrollList, index) => {
                                        return (
                                            <TableRow
                                                key={index}
                                                hover
                                                tabIndex={-1}
                                            >
                                                <TableCell
                                                    sx={{ width: "200px" }}
                                                >
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{
                                                            padding: 0,
                                                            margin: 0,
                                                        }}
                                                    >
                                                        {payrollList.fname}{" "}
                                                        {payrollList.lname}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Currency
                                                        quantity={
                                                            payrollList.monthly_rate
                                                        }
                                                        currency="Php"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Currency
                                                        quantity={
                                                            payrollList.sss_employee
                                                        }
                                                        currency="Php"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Currency
                                                        quantity={
                                                            payrollList.sss_employers
                                                        }
                                                        currency="Php"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Currency
                                                        quantity={
                                                            payrollList.phil_employee
                                                        }
                                                        currency="Php"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Currency
                                                        quantity={
                                                            payrollList.phil_employers
                                                        }
                                                        currency="Php"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Currency
                                                        quantity={
                                                            payrollList.pbg_employee
                                                        }
                                                        currency="Php"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Currency
                                                        quantity={
                                                            payrollList.pbg_employers
                                                        }
                                                        currency="Php"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Currency
                                                        quantity={
                                                            payrollList.total_deduction
                                                        }
                                                        currency="Php"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Currency
                                                        quantity={
                                                            payrollList.net_pay
                                                        }
                                                        currency="Php"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}

                                    <TableRow hover tabIndex={-1}>
                                        <TableCell
                                            className="font-weight-bold"
                                            sx={{ width: "200px" }}
                                        >
                                            TOTAL
                                        </TableCell>
                                        <TableCell className="font-weight-bold">
                                            {"₱" +
                                                totalGrosspay.toLocaleString(
                                                    undefined,
                                                    { maximumFractionDigits: 2 }
                                                )}
                                        </TableCell>
                                        <TableCell className="font-weight-bold">
                                            {"₱" +
                                                totalSSSEmps.toLocaleString(
                                                    undefined,
                                                    { maximumFractionDigits: 2 }
                                                )}
                                        </TableCell>
                                        <TableCell className="font-weight-bold">
                                            {"₱" +
                                                totalSSSEmpr.toLocaleString(
                                                    undefined,
                                                    { maximumFractionDigits: 2 }
                                                )}
                                        </TableCell>
                                        <TableCell className="font-weight-bold">
                                            {"₱" +
                                                totalPhilEmps.toLocaleString(
                                                    undefined,
                                                    { maximumFractionDigits: 2 }
                                                )}
                                        </TableCell>
                                        <TableCell className="font-weight-bold">
                                            {"₱" +
                                                totalPhilEmpr.toLocaleString(
                                                    undefined,
                                                    { maximumFractionDigits: 2 }
                                                )}
                                        </TableCell>
                                        <TableCell className="font-weight-bold">
                                            {"₱" +
                                                totalPGIBIGEmps.toLocaleString(
                                                    undefined,
                                                    { maximumFractionDigits: 2 }
                                                )}
                                        </TableCell>
                                        <TableCell className="font-weight-bold">
                                            {"₱" +
                                                totalPGIBIGEmpr.toLocaleString(
                                                    undefined,
                                                    { maximumFractionDigits: 2 }
                                                )}
                                        </TableCell>
                                        <TableCell className="font-weight-bold">
                                            {"₱" +
                                                totalDeduction.toLocaleString(
                                                    undefined,
                                                    { maximumFractionDigits: 2 }
                                                )}
                                        </TableCell>
                                        <TableCell className="font-weight-bold">
                                            {"₱" +
                                                totalNetpay.toLocaleString(
                                                    undefined,
                                                    { maximumFractionDigits: 2 }
                                                )}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box component="div" sx={{ marginBottom: 5 }}>
                            <Typography sx={{ marginBottom: 2 }}>
                                <span className="font-italic">
                                    Breakdown Summary:
                                </span>
                            </Typography>
                            <Typography>
                                <span className="font-weight-bold">
                                    Payroll:
                                </span>{" "}
                                {"₱" +
                                    (
                                        totalDeduction + totalNetpay
                                    ).toLocaleString(undefined, {
                                        maximumFractionDigits: 2,
                                    })}
                            </Typography>
                            <Typography>
                                <span className="font-weight-bold">
                                    SSS Ems
                                </span>{" "}
                                {"₱" +
                                    totalSSSEmpr.toLocaleString(undefined, {
                                        maximumFractionDigits: 2,
                                    })}
                            </Typography>
                            <Typography>
                                <span className="font-weight-bold">
                                    Philhealth Ems:
                                </span>{" "}
                                {"₱" +
                                    totalPhilEmpr.toLocaleString(undefined, {
                                        maximumFractionDigits: 2,
                                    })}
                            </Typography>
                            <Typography>
                                <span className="font-weight-bold">
                                    Pag-ibig Ems:
                                </span>{" "}
                                {"₱" +
                                    totalPGIBIGEmpr.toLocaleString(undefined, {
                                        maximumFractionDigits: 2,
                                    })}
                            </Typography>
                            <Typography>
                                <span className="font-weight-bold">Total:</span>{" "}
                                {"₱" +
                                    (
                                        totalDeduction +
                                        totalNetpay +
                                        totalSSSEmpr +
                                        totalPhilEmpr +
                                        totalPGIBIGEmpr
                                    ).toLocaleString(undefined, {
                                        maximumFractionDigits: 2,
                                    })}
                            </Typography>
                        </Box>
                        <Grid container spacing={5} maxWidth={700}>
                            <Grid item xs={6}>
                                <Box component="div">
                                    <Typography sx={{ marginBottom: 3 }}>
                                        Prepared By:
                                    </Typography>
                                    <Typography>Arlene P. Allera</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box component="div">
                                    <Typography sx={{ marginBottom: 3 }}>
                                        Approved By:
                                    </Typography>
                                    <Grid container spacing={5}>
                                        <Grid
                                            item
                                            xs={5}
                                            sx={{ width: "100%" }}
                                        >
                                            <Typography>
                                                Gillmar Padua
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={7}
                                            sx={{ width: "100%" }}
                                        >
                                            <Typography>
                                                Christopher G. Francisco
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid>
                        <Box
                            component="div"
                            className="d-flex justify-content-center"
                            sx={{ marginTop: "50px" }}
                        >
                            <button
                                type="button"
                                className="printBTN btn btn-warning btn-md mr-2"
                                onClick={handleToPrint}
                            >
                                {" "}
                                Print
                            </button>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default SummarySaveModal;
