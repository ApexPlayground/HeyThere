import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

import toast from "react-hot-toast";

// Create a store to manage authentication state
export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    // check if the user is authenticated
    checkAuth: async () => {
        try {
            // Send a request to the server to check if the user is authenticated
            const res = await axiosInstance.get("/auth/check");

            // If the user is authenticated, set the authUser
            set({ authUser: res.data });
        } catch (error) {
            // If there is an error, set the authUser to null
            set({ authUser: null });
            console.log("Error checking auth:", error);
        } finally {
            // finaly 
            set({ isCheckingAuth: false });
        }
    },

    // user signup
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            toast.success("Account created successfully");

            // Set the authUser state with the user data
            set({ authUser: res.data });

        } catch (error) {
            toast.error(error.response.data.message);

        } finally {
            set({ isSigningUp: false });
        }

    },

    // user login
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },


    // user logout
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
}));