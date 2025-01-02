import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { data } from "react-router-dom";

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

    },
}));