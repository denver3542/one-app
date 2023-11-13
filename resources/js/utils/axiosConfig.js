import axios from "axios";

// const baseURL = "http://192.168.1.139:8000/api";
// const baseURL = "http://localhost:8000/api";
const baseURL = "http://localhost:3000/api";
// const baseURL = "https://nasyamanagement.com/api";

const axiosInstance = axios.create({
    baseURL,
});

export function getJWTHeader(user) {
    return {
        Authorization: `Bearer ${user.token}`,
    };
}

export default axiosInstance;
