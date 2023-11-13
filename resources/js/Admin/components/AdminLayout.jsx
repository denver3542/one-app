import React, { useState } from "react";
import Header from "../../Layouts/AccountingLayouts/Header";
import MainContainer from "../../Layouts/AccountingLayouts/MainContainer";
import Sidebar from "./Sidebar";

const AdminLayout = ({ children, title, differentSidebar = true }) => {
    const [showSidebar, setShowSidebar] = useState(true);
    const [showSidebarMini, setShowSidebarMini] = useState(false);
    const handleToggleSidebar = () => {
        setShowSidebar(!showSidebar);
        setShowSidebarMini(showSidebar);
    };
    const handleCloseMini = () => {
        setShowSidebarMini(!showSidebarMini);
    };

    return (
        <div
            id="page-container"
            className={`enable-page-overlay side-scroll side-trans-enabled main-content-narrow ${
                showSidebar ? "sidebar-o" : ""
            } ${showSidebarMini ? "sidebar-o-xs" : ""}`}
        >
            <Sidebar showSidebar={showSidebar} closeMini={handleCloseMini} />
            <Header toogleSidebar={handleToggleSidebar} />
            <MainContainer>{children}</MainContainer>
            <aside id="side-overlay">
                <div className="content-header content-header-fullrow">
                    <div className="content-header-section align-parent">
                        <button
                            type="button"
                            className="btn btn-circle btn-dual-secondary align-v-r"
                            data-toggle="layout"
                            data-action="side_overlay_close"
                        >
                            <i className="fa fa-times text-danger"></i>
                        </button>

                        <div className="content-header-item">
                            <a className="img-link mr-5">
                                <img
                                    className="img-avatar img-avatar32"
                                    src="{{ asset('media/avatars/avatar15.jpg') }}"
                                    alt=""
                                />
                            </a>
                            <a className="align-middle link-effect text-primary-dark font-w600">
                                John Smith
                            </a>
                        </div>
                    </div>
                </div>

                <div className="content-side">
                    <p>Content..</p>
                </div>
            </aside>
        </div>
    );
};

export default AdminLayout;
