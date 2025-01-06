import axios from "axios";

// Create an axios instance to send cookies with requests
export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api/" : "/api/",
    withCredentials: true,
});