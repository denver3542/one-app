import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import axiosInstance, { getJWTHeader } from "../../utils/axiosConfig";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Select,
    MenuItem,
    InputLabel,
    Box,
    FormControl,
    TextField,
    Typography,
    FormGroup,
    IconButton,
    Button,
    Icon,
    TablePagination,
    TableHead,
} from "@mui/material";
import moment from "moment";
import PageHead from "../../components/Table/PageHead";
import { getComparator, stableSort } from "../../components/utils/tableUtils";
import PageToolbar from "../../components/Table/PageToolbar";
import PayrollModal from "../../components/Modals/PayrollModal";
import SummaryUpdateModal from "../../components/Modals/SummaryUpdateModal";
import SummarySaveModal from "../../components/Modals/SummarySaveModal";
import Swal from "sweetalert2";

const headCells = [
    {
        id: "fname",
        label: "Name",
        sortable: true,
    },
    {
        id: "monthly_rate",
        label: "Grosspay",
        sortable: true,
    },
    {
        id: "department",
        label: "Department",
        sortable: true,
    },
    {
        id: "payroll_fromdate",
        label: "Payroll Date",
        sortable: true,
    },
    {
        id: "date_from",
        label: "Payroll Cut-Off",
        sortable: false,
    },
    {
        id: "grosspay",
        label: "Grosspay",
        sortable: false,
    },
];

const years = () => {
    const now = new Date().getUTCFullYear();
    return Array(now - (now - 20))
        .fill("")
        .map((v, idx) => now - idx);
};

const HrPayrollSummary = () => {
    const queryParameters = new URLSearchParams(window.location.search);
    const [searchParams, setSearchParams] = useSearchParams();
    const [payrollRecord, setPayrollRecord] = useState([]);
    const [filterPayroll, setFilterPayroll] = useState([]);
    const [payrollFrom, setPayrollFrom] = useState();
    const [payrollTo, setPayrollTo] = useState();
    const [payrollSummary, setPayrollSummary] = useState(false);
    const [payrollSave, setPayrollSave] = useState(false);
    const [totalGrosspay, setTotalGrossPay] = useState();
    const [totalSSSEmps, setTotalSSSEmps] = useState();
    const [totalSSSEmpr, setTotalSSSEmpr] = useState();
    const [totalPhilEmps, setTotalPhilEmps] = useState();
    const [totalPhilEmpr, setTotalPhilEmpr] = useState();
    const [totalPGIBIGEmps, setTotalPGIBIGEmps] = useState();
    const [totalPGIBIGEmpr, setTotalPGIBIGEmpr] = useState();
    const [totalDeduction, setTotalDeduction] = useState();
    const [totalNetpay, setTotalNetpay] = useState();
    const [selectMonth, setSelectMonth] = useState(searchParams.get("month"));
    const [selectYear, setSelectYear] = useState(searchParams.get("year"));
    const [selectCutoff, setSelectCutoff] = useState(
        searchParams.get("cutoff")
    );
    const allYears = years();
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("calories");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const storedUser = localStorage.getItem("nasya_user");
    const headers = getJWTHeader(JSON.parse(storedUser));

    useEffect(() => {
        getPayrolls(selectCutoff, selectMonth, selectYear);
    }, [selectCutoff, selectMonth, selectYear]);

    const getPayrolls = async (selectCutoff, month_val, year_val) => {
        let dates = [];
        dates = [selectCutoff, month_val, year_val];
        console.log(dates);
        await axiosInstance
            .get(`/getPayrollSummary/${dates.join(",")}`, { headers })
            .then((response) => {
                setPayrollRecord(response.data.payrollRecords);
                setFilterPayroll(response.data.payrollRecords);
                setPayrollFrom(response.data.payroll_from);
                setPayrollTo(response.data.payroll_to);
                setTotalGrossPay(response.data.total_grosspay);
                setTotalSSSEmps(response.data.total_sss_emps);
                setTotalSSSEmpr(response.data.total_sss_empr);
                setTotalPhilEmps(response.data.total_phil_emps);
                setTotalPhilEmpr(response.data.total_phil_empr);
                setTotalPGIBIGEmps(response.data.total_pgbig_emps);
                setTotalPGIBIGEmpr(response.data.total_pgbig_empr);
                setTotalDeduction(response.data.total_all_deduct);
                setTotalNetpay(response.data.total_all_pay);
            });
    };

    // FOR TABLE SORTING DATA ETC..
    const handleRequestSort = (_event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleChangePage = (_event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
        setPage(0);
    };
    const handleFilter = (event) => {
        const filtered = payrollRecord.filter((application) =>
            `${application?.fname} ${application?.lname}`
                .toLocaleLowerCase()
                .includes(event.target.value.toLocaleLowerCase())
        );
        if (event.target.value != "") {
            setPayrollRecord(filtered);
        } else {
            setPayrollRecord(filterPayroll);
        }
    };
    const emptyRows =
        page > 0
            ? Math.max(0, (1 + page) * rowsPerPage - payrollRecord.length)
            : 0;
    // END

    const handleOpenSummary = () => {
        setPayrollSummary(true);
    };

    const handleCloseSummary = () => {
        setPayrollSummary(false);
    };

    const handleOpenSave = () => {
        setPayrollSave(true);
    };

    const handleCloseSave = () => {
        setPayrollSave(false);
    };

    const handleChangeMonth = (e) => {
        const newMonth = e.target.value;
        setSelectMonth(newMonth);
        setSearchParams({
            ["month"]: newMonth,
            ["cutoff"]: selectCutoff,
            ["year"]: queryParameters.get("year"),
        });
    };

    const handleChangeCutoff = (e) => {
        const newCutoff = e.target.value;
        setSelectCutoff(newCutoff);
        setSearchParams({
            ["month"]: selectMonth,
            ["cutoff"]: newCutoff,
            ["year"]: queryParameters.get("year"),
        });
    };

    const handleChangeYear = (e) => {
        const newYear = e.target.value;
        setSelectYear(newYear);
        setSearchParams({
            ["month"]: selectMonth,
            ["cutoff"]: selectCutoff,
            ["year"]: newYear,
        });
    };

    const handleDeleteSummary = (payroll_id) => {
        new Swal({
            customClass: {
                container: "my-swal",
            },
            title: "Are you sure?",
            text: "Delete this Employee?",
            icon: "question",
            dangerMode: true,
            showCancelButton: true,
        }).then((res) => {
            if (res.isConfirmed) {
                axiosInstance
                    .post(
                        "/delete_payroll_summary_employee",
                        {
                            payroll_id: payroll_id,
                        },
                        { headers }
                    )
                    .then((response) => {
                        if (response.data.delete === "Success") {
                            close();
                            Swal.fire({
                                customClass: {
                                    container: "my-swal",
                                },
                                title: "Success!",
                                text: "Employee has been Removed",
                                icon: "success",
                                timer: 1000,
                                showConfirmButton: false,
                            }).then(() => {
                                location.reload();
                            });
                        } else {
                            alert("Something went wrong");
                        }
                    });
            }
        });
    };
    return (
        <Layout>
            <div className="content-heading d-flex justify-content-between p-0">
                <h5 className="pt-3">Summary of Payrolls</h5>
                <div>
                    <FormControl size="small">
                        <InputLabel id="demo-simple-select-label">
                            Month
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="month_attendance"
                            value={selectMonth}
                            label="Month"
                            onChange={handleChangeMonth}
                            sx={{ width: "120px", marginRight: "10px" }}
                        >
                            <MenuItem value={1}>January</MenuItem>
                            <MenuItem value={2}>February</MenuItem>
                            <MenuItem value={3}>March</MenuItem>
                            <MenuItem value={4}>April</MenuItem>
                            <MenuItem value={5}>May</MenuItem>
                            <MenuItem value={6}>June</MenuItem>
                            <MenuItem value={7}>July</MenuItem>
                            <MenuItem value={8}>August</MenuItem>
                            <MenuItem value={9}>September</MenuItem>
                            <MenuItem value={10}>October</MenuItem>
                            <MenuItem value={11}>November</MenuItem>
                            <MenuItem value={12}>December</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small">
                        <InputLabel id="demo-simple-select-label">
                            CutOff
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="cutoff"
                            value={selectCutoff}
                            label="Cutoff"
                            onChange={handleChangeCutoff}
                            sx={{ width: "120px", marginRight: "10px" }}
                        >
                            <MenuItem value={1}>First</MenuItem>
                            <MenuItem value={2}>Second</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small">
                        <InputLabel id="demo-simple-select-label">
                            Year
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="month_attendance"
                            value={selectYear}
                            label="Year"
                            onChange={handleChangeYear}
                            sx={{ width: "120px", marginRight: "10px" }}
                        >
                            {allYears.map((year) => (
                                <MenuItem value={year}>{year}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div className="block">
                <div className=" block-content col-sm-12 ">
                    <div className="d-flex justify-content-lg-end p-3">
                        <PageToolbar handleSearch={handleFilter} />
                        {/* handleSearch={handleFilter}  */}
                        {/* <button type="button" className="btn btn-sm btn-primary mx-5 h-50 mt-10" data-toggle="modal" data-target="#add_attendance" id="new_report" >Add Atttendance
                            </button> */}
                    </div>
                    <TableContainer>
                        <Table className="table table-md  table-striped  table-vcenter table-bordered">
                            {/* <PageHead
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={handleRequestSort}
                                    headCells={headCells}
                                /> */}
                            <TableHead>
                                <TableRow>
                                    <TableCell className="text-center">
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
                                    <TableCell className="text-center">
                                        Total Deduction
                                    </TableCell>
                                    <TableCell className="text-center">
                                        Net Take Home Pay
                                    </TableCell>
                                </TableRow>
                                <TableRow
                                    sx={{
                                        borderTop: 1,
                                        borderColor: "#e4e7ed",
                                    }}
                                >
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
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
                                    <TableCell className="text-center font-weight-bold">
                                        Employee's Share
                                    </TableCell>
                                    <TableCell className="text-center font-weight-bold">
                                        Employer's Share
                                    </TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {stableSort(
                                    payrollRecord,
                                    getComparator(order, orderBy)
                                )
                                    .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                    )
                                    .map((payrollList, index) => {
                                        return (
                                            <TableRow
                                                key={index}
                                                hover
                                                tabIndex={-1}
                                            >
                                                <TableCell>
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{
                                                            height: 35,
                                                            padding: 0,
                                                            margin: 0,
                                                            paddingTop: 1,
                                                        }}
                                                    >
                                                        {payrollList.fname}{" "}
                                                        {payrollList.lname}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    {"₱" +
                                                        payrollList?.monthly_rate?.toLocaleString(
                                                            undefined,
                                                            {
                                                                maximumFractionDigits: 2,
                                                            }
                                                        )}
                                                </TableCell>
                                                <TableCell>
                                                    {payrollList?.sss_employee?.toLocaleString(
                                                        undefined,
                                                        {
                                                            maximumFractionDigits: 2,
                                                        }
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {payrollList?.sss_employers?.toLocaleString(
                                                        undefined,
                                                        {
                                                            maximumFractionDigits: 2,
                                                        }
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {payrollList?.phil_employee?.toLocaleString(
                                                        undefined,
                                                        {
                                                            maximumFractionDigits: 2,
                                                        }
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {payrollList?.phil_employers?.toLocaleString(
                                                        undefined,
                                                        {
                                                            maximumFractionDigits: 2,
                                                        }
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {payrollList?.pbg_employee?.toLocaleString(
                                                        undefined,
                                                        {
                                                            maximumFractionDigits: 2,
                                                        }
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {payrollList?.pbg_employers?.toLocaleString(
                                                        undefined,
                                                        {
                                                            maximumFractionDigits: 2,
                                                        }
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {"₱" +
                                                        payrollList?.total_deduction?.toLocaleString(
                                                            undefined,
                                                            {
                                                                maximumFractionDigits: 2,
                                                            }
                                                        )}
                                                </TableCell>
                                                <TableCell>
                                                    <Box
                                                        component="div"
                                                        className="d-flex justify-content-between"
                                                        sx={{
                                                            padding: 0,
                                                            margin: 0,
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="subtitle2"
                                                            sx={{
                                                                height: 35,
                                                                padding: 0,
                                                                margin: 0,
                                                                paddingTop: 1,
                                                            }}
                                                        >
                                                            {"₱" +
                                                                payrollList?.net_pay?.toLocaleString(
                                                                    undefined,
                                                                    {
                                                                        maximumFractionDigits: 2,
                                                                    }
                                                                )}
                                                        </Typography>
                                                        {payrollList.processtype ===
                                                        4 ? (
                                                            <IconButton
                                                                sx={{
                                                                    color: "red",
                                                                    fontSize: 14,
                                                                }}
                                                                onClick={() =>
                                                                    handleDeleteSummary(
                                                                        payrollList.payroll_id
                                                                    )
                                                                }
                                                            >
                                                                <i className="fa fa-trash-o"></i>
                                                            </IconButton>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow>
                                        <TableCell colSpan={10} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div className="d-flex justify-content-lg-between p-3">
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={payrollRecord.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            sx={{
                                ".MuiTablePagination-actions": {
                                    marginBottom: "20px",
                                },
                                ".MuiInputBase-root": {
                                    marginBottom: "20px",
                                },
                            }}
                        />
                        <div className="mt-10">
                            <button
                                type="button"
                                className="updateBtn btn btn-primary btn-md mr-2"
                                onClick={handleOpenSummary}
                            >
                                Update
                            </button>
                            <button
                                type="button"
                                className="hideBtn btn btn-success btn-md mr-2"
                                onClick={handleOpenSave}
                            >
                                {" "}
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {payrollSummary && (
                <SummaryUpdateModal
                    open={payrollSummary}
                    close={handleCloseSummary}
                    data={payrollRecord}
                    cutoff={selectCutoff}
                    from={payrollFrom}
                    to={payrollTo}
                    year={selectYear}
                />
            )}
            {payrollSave && (
                <SummarySaveModal
                    open={payrollSave}
                    close={handleCloseSave}
                    data={payrollRecord}
                    cutoff={selectCutoff}
                    from={payrollFrom}
                    to={payrollTo}
                    year={selectYear}
                    totalGrosspay={totalGrosspay}
                    totalSSSEmps={totalSSSEmps}
                    totalSSSEmpr={totalSSSEmpr}
                    totalPhilEmps={totalPhilEmps}
                    totalPhilEmpr={totalPhilEmpr}
                    totalPGIBIGEmps={totalPGIBIGEmps}
                    totalPGIBIGEmpr={totalPGIBIGEmpr}
                    totalDeduction={totalDeduction}
                    totalNetpay={totalNetpay}
                />
            )}
        </Layout>
    );
};

export default HrPayrollSummary;
