import { useQuery } from "@tanstack/react-query";
import axiosInstance, { getJWTHeader } from "../../../utils/axiosConfig";

async function getDashboard() {
    try {
        const storedUser = localStorage.getItem("nasya_user");
        const headers = storedUser ? getJWTHeader(JSON.parse(storedUser)) : {};
        const { data } = await axiosInstance.get("/dashboard1", {
            headers,
        });
        return data;
    } catch (err) {
        console.log(err);
    }
}

export function useDashboard() {
    return useQuery(["dashboard"], () => getDashboard());
}

async function getAssignedTasks() {
    try {
        const storedUser = localStorage.getItem("nasya_user");
        const headers = storedUser ? getJWTHeader(JSON.parse(storedUser)) : {};
        const { data } = await axiosInstance.get("/dashboard/assignedTasks", {
            headers,
        });
        return data;
    } catch (err) {
        console.log(err);
    }
}

export function useAssignedTasks() {
    return useQuery(["assignedTasks"], () => getAssignedTasks());
}
