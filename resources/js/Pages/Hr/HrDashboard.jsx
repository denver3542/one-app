import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import axiosInstance, { getJWTHeader } from "../../utils/axiosConfig";
import "../../../../resources/css/calendar.css";
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
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Input,
    TableHead,
} from "@mui/material";
import PageHead from "../../components/Table/PageHead";
import PageToolbar from "../../components/Table/PageToolbar";
import { getComparator, stableSort } from "../../components/utils/tableUtils";
import LineGraph from "../../components/utils/LineGraph";
import VerticalBarGraph from "../../components/utils/VerticalBarGraph";
import HomeLogo from "../../../images/home-logo.png";

const headCells = [
    {
        id: "firstname",
        label: "Name",
        sorable: true,
    },
    {
        id: " ",
        label: "Time Arrived",
        sortable: false,
    },
    {
        id: " ",
        label: "Time Out",
        sortable: false,
    },
];

const years = () => {
    const now = new Date().getUTCFullYear();
    return Array(now - (now - 20))
        .fill("")
        .map((v, idx) => now - idx);
};

const HrDashboard = () => {
    const queryParameters = new URLSearchParams(window.location.search);
    const [searchParams, setSearchParams] = useSearchParams();
    const [absencesChart, setAbsencesChart] = useState([]);
    const [applicationsChart, setApplicationsChart] = useState([]);
    const [tardinessChart, setTardinessChart] = useState([]);
    const [underTimeChart, setUnderTimeChart] = useState([]);
    const [workDayChart, setWorkDayChart] = useState([]);
    const [salariesChart, setSalariesChart] = useState([]);
    const [deductionChart, setDeductionChart] = useState([]);
    const [benefitsChart, setBenefitsChart] = useState([]);
    const [netpayChart, setNetpayChart] = useState([]);
    const [totalUsersChart, setTotalUsersChart] = useState([]);
    const [totalEmployee, setTotalEmployee] = useState([]);
    const [totalPresent, setTotalPresent] = useState();
    const [totalAbsent, setTotalAbsent] = useState();
    const [recentAttendances, setRecentAttendances] = useState([]);
    const [filterAttendance, setFilterAttendance] = useState([]);
    const [recentApplication, setRecentApplication] = useState([]);
    const [selectYear, setSelectYear] = useState(
        searchParams.get("year")
            ? searchParams.get("year")
            : moment().format("YYYY")
    );
    const [selectMonth, setSelectMonth] = useState(
        searchParams.get("month")
            ? searchParams.get("month")
            : moment().format("M")
    );
    const allYears = years();
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("calories");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const dateToday = moment().format("YYYY-MM-D 00:00:00");
    const applicationDates = moment().format("YYYY-MM-D 00:00:00");
    const [expandedAttendance, setExpandedAttendance] = useState(true);
    const [expandedWorkdays, setExpandedWorkdays] = useState(true);
    const [expandedHistory, setExpandedHistory] = useState(true);
    const storedUser = localStorage.getItem("nasya_user");
    const headers = getJWTHeader(JSON.parse(storedUser));
    const navigate = useNavigate();
    const colors = ["#9fcbff", "#3acc3f", "#fff800", "#ff634d"];

    useEffect(() => {
        getAnalaytics(selectMonth, selectYear);

        axiosInstance.get("/employees", { headers }).then((response) => {
            setTotalEmployee(response.data.employee);
        });
        axiosInstance
            .get(`/dashboard_employees/${dateToday}`, { headers })
            .then((response) => {
                setTotalPresent(response.data.present);
                setTotalAbsent(response.data.absent);
            });
        axiosInstance
            .get(`/dashboard_recentAttendance/${dateToday}`, { headers })
            .then((response) => {
                setRecentAttendances(response.data.attendances);
                setFilterAttendance(response.data.attendances);
            });
        axiosInstance
            .get(`/dashboard_recentApplication/${dateToday}`, { headers })
            .then((response) => {
                setRecentApplication(response.data.applications);
            });
    }, [selectMonth, selectYear]);

    const getAnalaytics = (month, year) => {
        let dates = [];
        dates = [month, year];

        axiosInstance
            .get(`/dashboard_Analytics/${dates}`, { headers })
            .then((response) => {
                setAbsencesChart(response.data.totalAbsences);
                setApplicationsChart(response.data.totalApplications);
                setTardinessChart(response.data.totalTardiness);
                setUnderTimeChart(response.data.totalUndertime);
                setWorkDayChart(response.data.totalWorkdays);
                setSalariesChart(response.data.totalSalaries);
                setDeductionChart(response.data.totalDeduction);
                setNetpayChart(response.data.totalNetpay);
                setBenefitsChart(response.data.totalBenefits);
                setTotalUsersChart(response.data.totalUsers);
            });
    };
    const handleNavigateAttendance = (user_id) => {
        const month = moment().month() + 1;
        const year = moment().year();
        navigate(
            `/hr/attendance?month=${
                month != 10 && month != 11 && month != 12 ? "0" + month : month
            }&year=${year}&user_id=${user_id}`
        );
    };

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
        const filtered = recentAttendances.filter((attdn) =>
            `${attdn?.fname} ${attdn?.lname}`
                .toLocaleLowerCase()
                .includes(event.target.value.toLocaleLowerCase())
        );
        if (event.target.value != "") {
            setRecentAttendances(filtered);
        } else {
            setRecentAttendances(filterAttendance);
        }
    };
    const emptyRows =
        page > 0
            ? Math.max(0, (1 + page) * rowsPerPage - recentAttendances.length)
            : 0;

    const handleChangeYear = (e) => {
        const newYear = e.target.value;
        setSelectYear(newYear);
        setSearchParams({
            ["year"]: newYear,
        });
    };
    const handleChangeExpandAttendance = () => {
        if (expandedAttendance === true) {
            setExpandedAttendance(false);
        } else {
            setExpandedAttendance(true);
        }
    };
    const handleChangeExpandWorkdays = () => {
        if (expandedWorkdays === true) {
            setExpandedWorkdays(false);
        } else {
            setExpandedWorkdays(true);
        }
    };
    const handleChangeExpandHistory = () => {
        if (expandedHistory === true) {
            setExpandedHistory(false);
        } else {
            setExpandedHistory(true);
        }
    };
    const handleChangeMonth = (e) => {
        const newMonth = e.target.value;
        setSelectMonth(newMonth);
    };
    const handleChangeCutoff = (e) => {
        const newCutoff = e.target.value;
        setSelectCutoff(newCutoff);
    };

    const usersProfile = (user_id) => {
        navigate(`hr/profile?employeeID=` + user_id);
    };

    return (
        <Layout>
            <div className="content-heading  d-flex justify-content-between p-0">
                <h5 className="pt-3">Overview</h5>
                <div className="font-size-h5 font-w600" style={{ margin: 0 }}>
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
                                <MenuItem value={year} key={year}>
                                    {year}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div
                className="row g-2"
                style={{ marginBottom: 30, marginTop: 25 }}
            >
                <div className="col-lg-4 col-sm-12">
                    <div
                        className="block"
                        style={{
                            backgroundColor: "white",
                            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                        }}
                    >
                        <div className="block-content block-content-full">
                            <Link
                                to="/hr/employees"
                                style={{ color: "#777777" }}
                            >
                                <div className="d-flex justify-content-between text-center">
                                    <div
                                        className="d-flex"
                                        style={{ marginLeft: 10 }}
                                    >
                                        <div style={{ paddingTop: 5 }}>
                                            <i
                                                className="fa fa-users text-white"
                                                style={{
                                                    padding: 8,
                                                    width: "30px",
                                                    backgroundColor: "#ff9601",
                                                    borderRadius: 50,
                                                }}
                                            ></i>
                                        </div>
                                        <div
                                            className="font-size-h4 text-mute"
                                            style={{
                                                marginLeft: 10,
                                                padding: 2,
                                            }}
                                        >
                                            {totalEmployee.length}
                                        </div>
                                    </div>
                                    <div>
                                        <div
                                            className="font-size-h5 font-w600"
                                            style={{ paddingTop: 5 }}
                                        >
                                            Total Employees
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-sm-12">
                    <div
                        className="block"
                        style={{
                            backgroundColor: "white",
                            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                        }}
                    >
                        <div className="block-content block-content-full">
                            <Link
                                to="/hr/attendance"
                                style={{ color: "#777777" }}
                            >
                                <div className="d-flex justify-content-between text-center">
                                    <div
                                        className="d-flex"
                                        style={{ marginLeft: 10 }}
                                    >
                                        <div style={{ paddingTop: 5 }}>
                                            <i
                                                className="fa fa-check-square-o text-white"
                                                style={{
                                                    padding: 8,
                                                    width: "30px",
                                                    backgroundColor: "#3ab54a",
                                                    borderRadius: 50,
                                                }}
                                            ></i>
                                        </div>
                                        <div
                                            className="font-size-h4 text-mute"
                                            style={{
                                                marginLeft: 10,
                                                padding: 2,
                                            }}
                                        >
                                            {totalPresent ? totalPresent : 0}
                                        </div>
                                    </div>
                                    <div>
                                        <div
                                            className="font-size-h5 font-w600"
                                            style={{ paddingTop: 5 }}
                                        >
                                            Present Employees
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-sm-12">
                    <div
                        className="block"
                        style={{
                            backgroundColor: "white",
                            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                        }}
                    >
                        <div className="block-content block-content-full">
                            <Link
                                to="/hr/attendance"
                                style={{ color: "#777777" }}
                            >
                                <div className="d-flex justify-content-between text-center">
                                    <div
                                        className="d-flex"
                                        style={{ marginLeft: 10 }}
                                    >
                                        <div style={{ paddingTop: 5 }}>
                                            <i
                                                className="fa fa-info-circle text-white"
                                                style={{
                                                    padding: 8,
                                                    width: "30px",
                                                    backgroundColor: "#e24e45",
                                                    borderRadius: 50,
                                                }}
                                            ></i>
                                        </div>
                                        <div
                                            className="font-size-h4 text-mute"
                                            style={{
                                                marginLeft: 10,
                                                padding: 2,
                                            }}
                                        >
                                            {totalAbsent ? totalAbsent : 0}
                                        </div>
                                    </div>
                                    <div>
                                        <div
                                            className="font-size-h5 font-w600"
                                            style={{ paddingTop: 5 }}
                                        >
                                            Absent Employees
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div
                    className="col-lg-6 col-sm-12"
                    style={{ marginBottom: 30 }}
                >
                    <div
                        className="block"
                        style={{
                            backgroundColor: "white",
                            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                        }}
                    >
                        <div className="block-content block-content-full">
                            <Accordion
                                expanded={expandedAttendance === true}
                                onChange={handleChangeExpandAttendance}
                                sx={{
                                    boxShadow: "0px 0px 0px 0px",
                                    color: "#777777",
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            width="24"
                                        >
                                            <path
                                                d="M0 0h24v24H0z"
                                                fill="none"
                                            />
                                            <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
                                        </svg>
                                    }
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <div
                                        className="font-size-h5 font-w600"
                                        style={{ margin: 0 }}
                                    >
                                        Attendance Analytics
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <LineGraph
                                        titlePosition={"top"}
                                        labels={[
                                            "January",
                                            "February",
                                            "March",
                                            "April",
                                            "May",
                                            "June",
                                            "July",
                                            "August",
                                            "September",
                                            "October",
                                            "November",
                                            "December",
                                        ]}
                                        datasets={[
                                            {
                                                label: "Applications",
                                                data: applicationsChart,
                                                borderColor: "#6ef669",
                                                backgroundColor: "#6cff71",
                                            },
                                            {
                                                label: "Absences",
                                                data: absencesChart,
                                                borderColor: "#ff6d4b",
                                                backgroundColor: "#ff634d",
                                            },
                                            {
                                                label: "Tardiness",
                                                data: tardinessChart,
                                                borderColor: "#99d0f5",
                                                backgroundColor: "#9fd2ff",
                                            },
                                            {
                                                label: "Undertime",
                                                data: underTimeChart,
                                                borderColor: "#ffd800",
                                                backgroundColor: "#ffe800",
                                            },
                                        ]}
                                        height="450px"
                                    />
                                </AccordionDetails>
                            </Accordion>
                        </div>
                    </div>
                </div>
                <div
                    className="col-lg-6 col-sm-12"
                    style={{ marginBottom: 30 }}
                >
                    <div
                        className="block"
                        style={{
                            backgroundColor: "white",
                            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                        }}
                    >
                        <div className="block-content block-content-full">
                            <Accordion
                                expanded={expandedWorkdays === true}
                                onChange={handleChangeExpandWorkdays}
                                sx={{
                                    boxShadow: "0px 0px 0px 0px",
                                    color: "#777777",
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            width="24"
                                        >
                                            <path
                                                d="M0 0h24v24H0z"
                                                fill="none"
                                            />
                                            <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
                                        </svg>
                                    }
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <div
                                        className="font-size-h5 font-w600"
                                        style={{ margin: 0 }}
                                    >
                                        Workdays Analytics
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <LineGraph
                                        titlePosition={"top"}
                                        labels={[
                                            "January",
                                            "February",
                                            "March",
                                            "April",
                                            "May",
                                            "June",
                                            "July",
                                            "August",
                                            "September",
                                            "October",
                                            "November",
                                            "December",
                                        ]}
                                        datasets={[
                                            {
                                                label: "Workdays",
                                                data: workDayChart,
                                                borderColor: "#6ef669",
                                                backgroundColor: "#6cff71",
                                            },
                                        ]}
                                        height="450px"
                                    />
                                </AccordionDetails>
                            </Accordion>
                        </div>
                    </div>
                </div>
                <div
                    className="col-lg-12 col-sm-12"
                    style={{ marginBottom: 30 }}
                >
                    <div className="block" style={{ backgroundColor: "white" }}>
                        <div className="block-content block-content-full">
                            <Accordion
                                expanded={expandedHistory === true}
                                onChange={handleChangeExpandHistory}
                                sx={{
                                    boxShadow: "0px 0px 0px 0px",
                                    color: "#777777",
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            width="24"
                                        >
                                            <path
                                                d="M0 0h24v24H0z"
                                                fill="none"
                                            />
                                            <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
                                        </svg>
                                    }
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <div
                                        className="font-size-h5 font-w600"
                                        style={{ margin: 0 }}
                                    >
                                        Payroll Summary Analytics
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails className="row">
                                    <div className="col-lg-10 col-sm-12">
                                        <div>
                                            <VerticalBarGraph
                                                // Title="History Analytics"
                                                titlePosition={"top"}
                                                labels={[
                                                    "January",
                                                    "February",
                                                    "March",
                                                    "April",
                                                    "May",
                                                    "June",
                                                    "July",
                                                    "August",
                                                    "September",
                                                    "October",
                                                    "November",
                                                    "December",
                                                ]}
                                                datasets={[
                                                    {
                                                        label: "Salaries",
                                                        data: salariesChart,
                                                        borderColor: "#6ef669",
                                                        backgroundColor:
                                                            "#6cff71",
                                                    },
                                                    {
                                                        label: "Benefits",
                                                        data: benefitsChart,
                                                        borderColor: "#ff6d4b",
                                                        backgroundColor:
                                                            "#ff634d",
                                                    },
                                                    {
                                                        label: "Deductions",
                                                        data: deductionChart,
                                                        borderColor: "#99d0f5",
                                                        backgroundColor:
                                                            "#9fd2ff",
                                                    },
                                                    {
                                                        label: "Netpay",
                                                        data: netpayChart,
                                                        borderColor: "#ffd800",
                                                        backgroundColor:
                                                            "#ffe800",
                                                    },
                                                ]}
                                                height="600px"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-2 col-sm-12">
                                        <div
                                            style={{
                                                marginTop: 25,
                                                width: "100%",
                                            }}
                                        >
                                            <TableContainer>
                                                <Table className="table table-md  table-borderless table-vcenter">
                                                    <TableBody
                                                        sx={{
                                                            cursor: "pointer",
                                                            marginTop: 20,
                                                        }}
                                                    >
                                                        {totalUsersChart.length !=
                                                        0 ? (
                                                            stableSort(
                                                                totalUsersChart,
                                                                getComparator(
                                                                    order,
                                                                    orderBy
                                                                )
                                                            )
                                                                .slice(
                                                                    page *
                                                                        rowsPerPage,
                                                                    page *
                                                                        rowsPerPage +
                                                                        rowsPerPage
                                                                )
                                                                .map(
                                                                    (
                                                                        users,
                                                                        index
                                                                    ) => {
                                                                        return (
                                                                            <TableRow
                                                                                key={
                                                                                    index
                                                                                }
                                                                                hover
                                                                                role="checkbox"
                                                                                tabIndex={
                                                                                    -1
                                                                                }
                                                                            >
                                                                                <TableCell
                                                                                    className="text-right"
                                                                                    onClick={() =>
                                                                                        usersProfile(
                                                                                            users.user_id
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <div
                                                                                        style={{
                                                                                            backgroundColor:
                                                                                                colors[
                                                                                                    index %
                                                                                                        colors.length
                                                                                                ],
                                                                                            borderRadius: 50,
                                                                                            padding: 5,
                                                                                            marginLeft:
                                                                                                "auto",
                                                                                            marginRight: 0,
                                                                                        }}
                                                                                    >
                                                                                        {
                                                                                            users.fname
                                                                                        }{" "}
                                                                                        {
                                                                                            users.lname
                                                                                        }
                                                                                        {users.profile_pic ? (
                                                                                            <img
                                                                                                src={
                                                                                                    "https://nasyaportal.ph/assets/media/upload/" +
                                                                                                    users.profile_pic
                                                                                                }
                                                                                                style={{
                                                                                                    height: 30,
                                                                                                    width: 30,
                                                                                                    borderRadius: 50,
                                                                                                    objectFit:
                                                                                                        "cover",
                                                                                                    marginLeft: 10,
                                                                                                }}
                                                                                            />
                                                                                        ) : (
                                                                                            <img
                                                                                                src={
                                                                                                    HomeLogo
                                                                                                }
                                                                                                style={{
                                                                                                    height: 35,
                                                                                                    width: 35,
                                                                                                    borderRadius: 50,
                                                                                                    objectFit:
                                                                                                        "cover",
                                                                                                    marginLeft: 10,
                                                                                                }}
                                                                                            />
                                                                                        )}
                                                                                    </div>
                                                                                </TableCell>
                                                                                {/* <TableCell>
                                                                        {users.category ? users.category : 'Not yet Assigned'}
                                                                        </TableCell> */}
                                                                            </TableRow>
                                                                        );
                                                                    }
                                                                )
                                                        ) : (
                                                            <TableRow
                                                                hover
                                                                role="checkbox"
                                                                tabIndex={-1}
                                                            >
                                                                <TableCell>
                                                                    {" "}
                                                                    {
                                                                        "No Data Found"
                                                                    }
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                            <TablePagination
                                                rowsPerPageOptions={[5, 10, 25]}
                                                component="div"
                                                count={totalUsersChart.length}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                onPageChange={handleChangePage}
                                                onRowsPerPageChange={
                                                    handleChangeRowsPerPage
                                                }
                                                sx={{
                                                    ".MuiTablePagination-actions":
                                                        {
                                                            marginBottom:
                                                                "20px",
                                                        },
                                                    ".MuiInputBase-root": {
                                                        display: "none",
                                                    },
                                                    ".MuiTablePagination-selectLabel":
                                                        {
                                                            display: "none",
                                                        },
                                                }}
                                            />
                                        </div>
                                    </div>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                    </div>
                </div>
                <div
                    className="col-lg-8 col-sm-12"
                    style={{ marginBottom: 30 }}
                >
                    <div className="block" style={{ backgroundColor: "white" }}>
                        <div className="block-content block-content-full">
                            <div style={{ marginLeft: 10 }}>
                                <Box
                                    component={"div"}
                                    className="d-flex justify-content-between"
                                >
                                    <div
                                        className="font-size-h5 font-w600"
                                        style={{
                                            marginTop: 12,
                                            marginBottom: 10,
                                        }}
                                    >
                                        Attendance Today
                                    </div>
                                    <PageToolbar handleSearch={handleFilter} />
                                </Box>
                                <div
                                    style={{
                                        height: "560px",
                                        overflow: "auto",
                                    }}
                                >
                                    <TableContainer>
                                        <Table className="table table-md table-striped table-vcenter">
                                            <PageHead
                                                order={order}
                                                orderBy={orderBy}
                                                onRequestSort={
                                                    handleRequestSort
                                                }
                                                headCells={headCells}
                                            />
                                            <TableBody
                                                sx={{ cursor: "pointer" }}
                                            >
                                                {recentAttendances.length !=
                                                0 ? (
                                                    stableSort(
                                                        recentAttendances,
                                                        getComparator(
                                                            order,
                                                            orderBy
                                                        )
                                                    )
                                                        .slice(
                                                            page * rowsPerPage,
                                                            page * rowsPerPage +
                                                                rowsPerPage
                                                        )
                                                        .map(
                                                            (
                                                                attendance,
                                                                index
                                                            ) => {
                                                                return (
                                                                    <TableRow
                                                                        key={
                                                                            index
                                                                        }
                                                                        hover
                                                                        role="checkbox"
                                                                        tabIndex={
                                                                            -1
                                                                        }
                                                                        onClick={() =>
                                                                            handleNavigateAttendance(
                                                                                attendance.user_id
                                                                            )
                                                                        }
                                                                    >
                                                                        <TableCell className="text-left">
                                                                            <img
                                                                                src={
                                                                                    "https://nasyaportal.ph/assets/media/upload/" +
                                                                                    attendance.profile_pic
                                                                                }
                                                                                style={{
                                                                                    height: 35,
                                                                                    width: 35,
                                                                                    borderRadius: 50,
                                                                                    objectFit:
                                                                                        "cover",
                                                                                    marginRight: 30,
                                                                                }}
                                                                            />{" "}
                                                                            {attendance.fname +
                                                                                " " +
                                                                                attendance.lname}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <div className="d-flex justify-content-end">
                                                                                <Typography
                                                                                    variant="subtitle2"
                                                                                    className="p-1 ml-2 text-center text-white rounded-lg"
                                                                                    style={{
                                                                                        backgroundColor:
                                                                                            "#3f9ce8",
                                                                                    }}
                                                                                >
                                                                                    {moment(
                                                                                        attendance.morning_in
                                                                                    ).format(
                                                                                        "hh:mm a"
                                                                                    )}
                                                                                </Typography>
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <div className="d-flex justify-content-start">
                                                                                <Typography
                                                                                    variant="subtitle2"
                                                                                    className="p-1 ml-2 text-center text-white rounded-lg"
                                                                                    style={{
                                                                                        backgroundColor:
                                                                                            attendance.afternoon_out
                                                                                                ? "#e24e45"
                                                                                                : "#808080",
                                                                                    }}
                                                                                >
                                                                                    {" "}
                                                                                    {attendance.afternoon_out
                                                                                        ? moment(
                                                                                              attendance.afternoon_out
                                                                                          ).format(
                                                                                              "hh:mm a"
                                                                                          )
                                                                                        : "Ongoing.."}
                                                                                </Typography>
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                );
                                                            }
                                                        )
                                                ) : (
                                                    <TableRow
                                                        hover
                                                        role="checkbox"
                                                        tabIndex={-1}
                                                        onClick={() =>
                                                            handleNavigateAttendance(
                                                                attendance.user_id
                                                            )
                                                        }
                                                    >
                                                        <TableCell colSpan={4}>
                                                            {" "}
                                                            {"No Data Found"}
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                                {emptyRows > 0 && (
                                                    <TableRow
                                                        style={{
                                                            height:
                                                                53 * emptyRows,
                                                        }}
                                                    >
                                                        <TableCell
                                                            colSpan={6}
                                                        />
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={recentAttendances.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={
                                            handleChangeRowsPerPage
                                        }
                                        sx={{
                                            ".MuiTablePagination-actions": {
                                                marginBottom: "20px",
                                            },
                                            ".MuiInputBase-root": {
                                                marginBottom: "20px",
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="col-lg-4 col-sm-12"
                    style={{ marginBottom: 30 }}
                >
                    <div
                        className="block"
                        style={{ backgroundColor: "white", height: "664px" }}
                    >
                        <Link
                            to="/hr/applications"
                            style={{ color: "#777777" }}
                        >
                            <div className="block-content block-content-full">
                                <div style={{ marginLeft: 10 }}>
                                    <div
                                        className="font-size-h5 font-w600"
                                        style={{
                                            paddingTop: 5,
                                            marginBottom: 10,
                                        }}
                                    >
                                        New Applications
                                    </div>
                                    <div
                                        style={{
                                            height: "560px",
                                            overflow: "auto",
                                        }}
                                    >
                                        <TableContainer>
                                            <Table className="table table-md table-striped table-vcenter">
                                                <TableBody
                                                    sx={{ cursor: "pointer" }}
                                                >
                                                    {recentApplication.length !=
                                                    0 ? (
                                                        recentApplication.map(
                                                            (
                                                                application,
                                                                index
                                                            ) => {
                                                                return (
                                                                    <TableRow
                                                                        key={
                                                                            index
                                                                        }
                                                                        hover
                                                                        role="checkbox"
                                                                        tabIndex={
                                                                            -1
                                                                        }
                                                                        onClick={() =>
                                                                            handleNavigateAttendance(
                                                                                attendance.user_id
                                                                            )
                                                                        }
                                                                    >
                                                                        <TableCell className="text-left">
                                                                            <img
                                                                                src={
                                                                                    "https://nasyaportal.ph/assets/media/upload/" +
                                                                                    application.profile_pic
                                                                                }
                                                                                style={{
                                                                                    height: 35,
                                                                                    width: 35,
                                                                                    borderRadius: 50,
                                                                                    objectFit:
                                                                                        "cover",
                                                                                    marginRight: 10,
                                                                                }}
                                                                            />{" "}
                                                                            {
                                                                                application.fname
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {
                                                                                application.leave_type
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Typography
                                                                                variant="subtitle2"
                                                                                className="p-1 ml-2 text-center text-white rounded-lg"
                                                                                style={{
                                                                                    backgroundColor:
                                                                                        application.AppColor,
                                                                                }}
                                                                            >
                                                                                {
                                                                                    application.AppStatus
                                                                                }
                                                                            </Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                );
                                                            }
                                                        )
                                                    ) : (
                                                        <TableRow
                                                            hover
                                                            role="checkbox"
                                                            tabIndex={-1}
                                                        >
                                                            <TableCell
                                                                colSpan={3}
                                                            >
                                                                {" "}
                                                                {
                                                                    "No Data Found"
                                                                }
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default HrDashboard;
