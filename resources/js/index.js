import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import HrDashboard from "./Pages/Hr/HrDashboard";
import HrEmployees from "./Pages/Hr/HrEmployees";
import HrAttendance from "./Pages/Hr/HrAttendance";
import HrApplications from "./Pages/Hr/HrApplications";
import AccountingDashboard from "./Pages/Accounting/AccountingDashboard";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { queryClient } from "./utils/queryClient";
import { useUser } from "./hooks/useUser";
import HrApplicationList from "./Pages/Hr/HrApplicationList";
import HrEmployeesCalendar from "./Pages/Hr/HrEmployeesCalendar";
import HrEmployeesBenefits from "./Pages/Hr/HrEmployeesBenefits";
import HrPayrollProcess from "./Pages/Hr/HrPayrollProcess";
import HrPayrollProcessUnextended from "./Pages/Hr/HrPayrollProcessUnextended";
import HrPayrollProcessExtended from "./Pages/Hr/HrPayrollProcessExtended";
import HrProfile from "./Pages/Hr/HrProfile";

import HrPayrollRecords from "./Pages/Hr/HrPayrollRecords";
import HrPayrollSummary from "./Pages/Hr/HrPayrollSummary";
import Sales from "./Pages/Accounting/Sales";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Invoice from "./Pages/Accounting/Invoice";
import Dashboard from "./Admin/Pages/Dashboard";
import { green, red } from "@mui/material/colors";
import { ThemeProvider, createTheme } from "@material-ui/core";
import Services from "./Admin/Pages/Services";
import Clients from "./Admin/Pages/Clients";
import Homepage from "./Pages/Homepage";

const theme = createTheme({
    palette: {
        primary: {
            main: green[800],
        },
        secondary: {
            main: red[900],
        },
        adminPrimary: {
            main: "#0E9594",
        },
        adminSecondary: {
            main: "#F2542D",
        },
    },
});

function App() {
    const { user, isFetching } = useUser();
    return (
        !isFetching && (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/"
                    element={user ? <HrDashboard /> : <Homepage />}
                />
                <Route
                    path="/hr/employees"
                    element={user ? <HrEmployees /> : <Login />}
                />
                <Route
                    path="/hr/employees-workdays"
                    element={user ? <HrEmployeesCalendar /> : <Login />}
                />
                <Route
                    path="/hr/employees-benefits"
                    element={user ? <HrEmployeesBenefits /> : <Login />}
                />
                <Route
                    path="/hr/attendance/"
                    element={user ? <HrAttendance /> : <Login />}
                />
                <Route
                    path="/hr/attendance/:month/:year/:empID"
                    element={user ? <HrAttendance /> : <Login />}
                />
                <Route
                    path="/hr/applications"
                    element={user ? <HrApplications /> : <Login />}
                />
                <Route
                    path="/hr/applications-list"
                    element={user ? <HrApplicationList /> : <Login />}
                />
                <Route
                    path="/hr/profile"
                    element={user ? <HrProfile /> : <Login />}
                />
                <Route
                    path="/hr/payroll-process"
                    element={user ? <HrPayrollProcess /> : <Login />}
                />
                <Route
                    path="/hr/payroll-process/unextended"
                    element={user ? <HrPayrollProcessUnextended /> : <Login />}
                />
                <Route
                    path="/hr/payroll-process/extended"
                    element={user ? <HrPayrollProcessExtended /> : <Login />}
                />
                <Route
                    path="/hr/payroll-records"
                    element={user ? <HrPayrollRecords /> : <Login />}
                />
                <Route
                    path="/hr/payroll-summary"
                    element={user ? <HrPayrollSummary /> : <Login />}
                />
                <Route
                    path="/accounting"
                    element={user ? <AccountingDashboard /> : <Login />}
                />
                <Route
                    path="/accounting/dashboard"
                    element={user ? <AccountingDashboard /> : <Login />}
                />
                <Route
                    path="/accounting/sales"
                    element={user ? <Sales /> : <Login />}
                />
                <Route
                    path="/accounting/invoice"
                    element={user ? <Invoice /> : <Login />}
                />
                {/* Admin Routes */}
                <Route
                    path="/admin"
                    element={user ? <Dashboard /> : <Login />}
                />
                <Route
                    path="/admin/dashboard"
                    element={user ? <Dashboard /> : <Login />}
                />
                <Route
                    path="/admin/clients"
                    element={user ? <Clients /> : <Login />}
                />
                <Route
                    path="/admin/services"
                    element={user ? <Services /> : <Login />}
                />
            </Routes>
        )
    );
}

export default App;

if (document.getElementById("app")) {
    const container = document.getElementById("app");
    const root = createRoot(container);
    root.render(
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </QueryClientProvider>
        </ThemeProvider>
    );
}
