import React from "react";
import AdminLayout from "../components/AdminLayout";
import {
    useAssignedTasks,
    useDashboard,
} from "../../Pages/Accounting/hooks/useDashboard";
import { useTheme } from "@material-ui/core";

function Dashboard() {
    const { data, isFetched } = useDashboard();
    const { data: assignedTasks, isFetched: isAssignedTasks } =
        useAssignedTasks();
    const { palette } = useTheme();
    console.log(isFetched ? data : "loading...");
    console.log(isAssignedTasks ? assignedTasks : "loading...");

    return (
        <AdminLayout>
            <h1 className="text-center">Dashboard</h1>
            <div className="block">
                <div className="block-content">
                    <div className="row" id="totalsGrid">
                        {isFetched &&
                            data.map((item, index) => (
                                <div className="col-6 col-md-3" key={index}>
                                    <a
                                        className="block block-rounded text-right"
                                        href="main_contact_assign.php"
                                        style={{
                                            backgroundColor:
                                                palette.adminSecondary.main,
                                        }}
                                    >
                                        <div className="block-content block-content-full clearfix border-black-op-b border-3x">
                                            <div className="float-left mt-10 d-none d-sm-block">
                                                <i className="si si-users fa-3x text-white"></i>
                                            </div>
                                            <div
                                                className="font-size-h3 font-w600 text-white js-count-to-enabled"
                                                data-toggle="countTo"
                                                data-speed="1000"
                                                data-to="8900"
                                            >
                                                ${item.data}
                                            </div>
                                            <div className="font-size-sm font-w600 text-uppercase text-white-op">
                                                ${item.title}
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            ))}
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped table-vcenter table-sm">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th className="d-none text-capitalize d-sm-table-cell">
                                        Task Name
                                    </th>
                                    <th className="d-none text-capitalize d-sm-table-cell">
                                        Due
                                    </th>
                                    <th className="d-none text-capitalize d-sm-table-cell">
                                        Priority
                                    </th>
                                    <th className="d-none text-capitalize d-sm-table-cell">
                                        Service
                                    </th>
                                    <th className="d-none text-capitalize d-sm-table-cell">
                                        List
                                    </th>
                                    <th className="d-none text-capitalize d-sm-table-cell">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {isAssignedTasks &&
                                    assignedTasks.assigned_tasks.map(
                                        (item, i) => (
                                            <tr key={item.task_id}>
                                                <td>{i + 1}</td>
                                                <td>
                                                    <strong>
                                                        {item.task_name}
                                                    </strong>
                                                </td>
                                                <td></td>
                                                <td>
                                                    {item.priority.slice(2)}
                                                </td>
                                                <td>{item.service}</td>
                                                <td>{item.list}</td>
                                                <td>{item.status}</td>
                                            </tr>
                                        )
                                    )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default Dashboard;
