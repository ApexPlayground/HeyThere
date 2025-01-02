import axios from "axios";

// Create an axios instance to send cookies with requests
export const axiosInstance = axios.create({
    baseURL: "http://localhost:5001/api/",
    withCredentials: true,
});