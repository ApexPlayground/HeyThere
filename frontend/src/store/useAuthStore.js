import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";


const URL = "http://localhost:5001"

// Create a store to manage authentication state
export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

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

            get().connectSocket()
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
            get().disconnectSocket()
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    // update user profile
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("Error updating profile:", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        // Get the current authenticated user from the state
        const { authUser } = get();

        // If the user is not authenticated or already connected, do nothing
        if ((!authUser) || get().socket?.connected) return;

        // Create a new socket connection and pass the userId as a query parameter
        const socket = io(URL, {
            query: {
                userId: authUser._id, // The user's ID
            },
        });

        // Establish the socket connection
        socket.connect();

        // Save the socket instance in the state for later use
        set({ socket: socket });

        // Listen for the "getOnlineUsers" event from the server
        socket.on("getOnlineUsers", (userIds) => {
            // Update the state with the list of online users
            set({ onlineUsers: userIds });
        });
    },

    disconnectSocket: () => {
        // If the socket is connected, disconnect it
        if (get().socket?.connected) get().socket.disconnect();
    },
}));