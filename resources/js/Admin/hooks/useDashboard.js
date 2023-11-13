import { useQuery } from "@tanstack/react-query";
import axiosInstance, { getJWTHeader } from "../../utils/axiosConfig";

async function getDashboard() {
    try {
        const storedUser = await AsyncStorage.getItem("nasya_user");
        const headers = storedUser ? getJWTHeader(JSON.parse(storedUser)) : {};
        const { data } = await axiosInstance.get("/dashboard", {
            headers,
        });
        return data;
    } catch (error) {
        console.error(error);
    }
}

export function useDashboard() {
    return useQuery(["dashboard"], () => getDashboard());
}
