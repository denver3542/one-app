import axios from "axios";
import axiosInstance, { getJWTHeader } from "../utils/axiosConfig";
import { useUser } from "./useUser";

export function useAuth() {
    const SERVER_ERROR = "There was an error contacting the server.";
    const { clearUser } = useUser();

    async function authServerCall(urlEndpoint, userDetails) {
        try {
            const { data } = await axiosInstance({
                url: urlEndpoint,
                method: "POST",
                data: userDetails,
                headers: { "Content-Type": "application/json" },
            });

            return data;
        } catch (errorResponse) {
            console.log(errorResponse);
            const title =
                axios.isAxiosError(errorResponse) &&
                errorResponse?.response?.data?.message
                    ? errorResponse?.response?.data?.message
                    : SERVER_ERROR;
            console.log({ errorResponse, title });
        }
    }

    async function login(userDetails) {
        return authServerCall("/login", userDetails);
    }
    async function signup(userDetails) {
        return authServerCall("/signup", userDetails);
    }
    async function verifyCode(details) {
        return authServerCall("/verify", details);
    }

    async function logout() {
        try {
            // clear user from stored user data
            const storedUser = localStorage.getItem("nasya_user");
            if (storedUser) {
                const headers = getJWTHeader(JSON.parse(storedUser));
                await axiosInstance.post("/logout", {}, { headers });
            }
            clearUser();
        } catch (err) {
            clearUser();
            console.log(err);
        }
    }

    // Return the user object and auth methods
    return {
        login,
        signup,
        logout,
        verifyCode,
    };
}
