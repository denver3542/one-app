import avatar from "../../../images/admin.png";
import nasya_logo from "../../../images/logo.png";
import { useUser } from "../../hooks/useUser";
import {
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    capitalize,
} from "@mui/material";
import { useState } from "react";
import moment from "moment/moment";
import { Link, NavLink, useNavigate } from "react-router-dom";
// import { Nav, NavItem, Card, CardBody } from "reactstrap";
// import SubMenuCollapse from "../../components/SubMenuCollapse";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PaymentsIcon from "@mui/icons-material/Payments";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SummarizeIcon from "@mui/icons-material/Summarize";
import AddchartIcon from "@mui/icons-material/Addchart";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import SubMenuCollapse from "../../components/SubMenuCollapse";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import EngineeringIcon from "@mui/icons-material/Engineering";

const sidebarItems = [
    {
        id: 1,
        title: "Dashboard",
        url: "/admin",
        icon: <DashboardIcon />,
    },
    {
        id: 123,
        title: "Schedules",
        url: "/schedules",
        icon: <EditCalendarIcon />,
    },
    {
        id: 2,
        title: "Operations",
        icon: <EngineeringIcon />,
        isOpen: false,
        subMenu: [
            {
                url: "/admin/sales",
                title: "Email Template",
                icon: "fa fa-dollar",
            },
            {
                url: "/admin/invoice",
                title: "Email Campaign",
                icon: "fa fa-file-pdf-o ",
            },
            {
                url: "/admin/contacts",
                title: "Payment",
                icon: "fa fa-address-card",
            },
            {
                url: "/admin/payment",
                title: "My Reports",
                icon: "fa fa-credit-card",
            },
            {
                url: "/admin/clients",
                title: "My Clients",
                icon: "fa fa-money",
            },
            {
                url: "/admin/services",
                title: "My Services",
                icon: "fa fa-wrench",
            },
            {
                url: "/admin/services",
                title: "My Support",
                icon: "fa fa-wrench",
            },
            {
                url: "/admin/services",
                title: "Publish Updates",
                icon: "fa fa-wrench",
            },
            {
                url: "/admin/services",
                title: "Settings",
                icon: "fa fa-wrench",
            },
        ],
    },
    {
        id: 3,
        title: "Financials",
        icon: <PaymentsIcon />,
        isOpen: false,
        subMenu: [
            {
                url: "/accounting/expenses/service",
                title: "Service Expenses",
                icon: "fa fa-wrench",
            },
            {
                url: "/accounting/expenses/personalize",
                title: "Personalize Expenses",
                icon: "fa fa-wrench",
            },
        ],
    },
    {
        id: 4,
        title: "Human Resource",
        url: "/",
        icon: <ReceiptIcon />,
    },
    {
        id: 5,
        title: "Sign Out",
        url: "/accounting/accounts",
        icon: <AddchartIcon />,
    },
];

const Sidebar = ({ children, closeMini }) => {
    const { user } = useUser();
    const navigate = useNavigate();
    const dayToday = moment().format("DD");
    const handleNavigate = (link) => {
        navigate(link);
    };

    return (
        <nav id="sidebar" style={{ zIndex: 1 }}>
            <div className="sidebar-content">
                <div className="content-header content-header-fullrow px-15">
                    <div className="content-header-section sidebar-mini-visible-b">
                        <span className="content-header-item font-w700 font-size-xl float-left animated fadeIn">
                            <span className="text-dual-primary-dark">c</span>
                            <span className="text-primary">b</span>
                        </span>
                    </div>
                    <div className="content-header-section text-center align-parent sidebar-mini-hidden">
                        <button
                            type="button"
                            className="btn btn-circle btn-dual-secondary d-lg-none align-v-r"
                            data-toggle="layout"
                            data-action="sidebar_close"
                            onClick={closeMini}
                        >
                            <i className="fa fa-times text-danger"></i>
                        </button>
                        <div className="content-header-item">
                            <img
                                src={nasya_logo}
                                style={{ height: "40px", marginBottom: "20px" }}
                            />
                        </div>
                    </div>
                </div>
                <div
                    className="content-side content-side-full content-side-user px-10 align-parent"
                    style={{
                        backgroundImage:
                            "linear-gradient(190deg, rgb(234, 28, 24,0.8), rgb(58, 181, 74,1))",
                    }}
                >
                    <div className="sidebar-mini-visible-b align-v animated fadeIn">
                        <img
                            className="img-avatar img-avatar32"
                            src={avatar}
                            alt=""
                        />
                    </div>
                    <div className="sidebar-mini-hidden-b text-center">
                        <a className="img-link">
                            <img
                                className="img-avatar"
                                src={
                                    "https://nasyaportal.ph/assets/media/upload/" +
                                    user.profile_pic
                                }
                                alt=""
                            />
                        </a>
                        <ul className="list-inline mt-10">
                            <li className="list-inline-item">
                                <a className="link-effect text-white font-size-xs font-w600">
                                    {capitalize(user.fname)}{" "}
                                    {capitalize(user.lname)}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="content-side content-side-full p-0">
                    {/* <Nav vertical className="nav-main">
                        {sidebarItems.map((item, index) => {
                            const open = item.isOpen;
                            return item.subMenu ? (
                                <SubMenuCollapse item={item} key={item.id} />
                            ) : (
                                <NavItem key={item.id}>
                                    <NavLink to={item.url}>
                                        <i className={item.icon}></i>
                                        {item.title}
                                    </NavLink>
                                </NavItem>
                            );
                        })}
                    </Nav> */}

                    <List
                        sx={{
                            width: "100%",
                            maxWidth: 360,
                            bgcolor: "background.paper",
                        }}
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                    >
                        {sidebarItems.map((item, index) => {
                            return item.subMenu ? (
                                <SubMenuCollapse item={item} key={item.title} />
                            ) : (
                                <Link
                                    to={item.url}
                                    key={item.id}
                                    className="text-muted"
                                >
                                    <ListItemButton>
                                        <ListItemIcon sx={{ paddingRight: 0 }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={item.title} />
                                    </ListItemButton>
                                </Link>
                            );
                        })}
                    </List>
                </div>
            </div>
        </nav>
    );
};

export default Sidebar;
