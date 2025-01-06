import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";


const URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/"

// Create a store to manage authentication state
export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    // Check if the user is authenticated
    checkAuth: async () => {
        try {
            // Check for an existing user session
            const storedUser = JSON.parse(localStorage.getItem("authUser"));
            if (storedUser) {
                set({ authUser: storedUser });
                get().connectSocket(); // Reconnect WebSocket
                return;
            }

            // Send a request to the server to check if the user is authenticated
            const res = await axiosInstance.get("/auth/check");

            // If the user is authenticated, set the authUser
            set({ authUser: res.data });
            localStorage.setItem("authUser", JSON.stringify(res.data)); // Persist user data
            get().connectSocket(); // Reconnect WebSocket
        } catch (error) {
            // If there is an error, clear localStorage and set authUser to null
            localStorage.removeItem("authUser");
            set({ authUser: null });
            console.log("Error checking auth:", error);
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    // User signup
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            toast.success("Account created successfully");

            // Set the authUser state with the user data
            set({ authUser: res.data });
            localStorage.setItem("authUser", JSON.stringify(res.data)); // Persist user data
            get().connectSocket(); // Connect WebSocket
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    // User login
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");

            localStorage.setItem("authUser", JSON.stringify(res.data)); // Persist user data
            get().connectSocket(); // Connect WebSocket
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    // User logout
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
            localStorage.removeItem("authUser"); // Clear persisted data
            get().disconnectSocket(); // Disconnect WebSocket
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    // Update user profile
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
            localStorage.setItem("authUser", JSON.stringify(res.data)); // Update persisted data
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
        if (!authUser || get().socket?.connected) return;

        // Create a new socket connection and pass the userId as a query parameter
        const socket = io(URL, {
            query: {
                userId: authUser._id, // The user's ID
            },
            reconnection: true, // Enable auto-reconnection
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
        });

        // Save the socket instance in the state for later use
        set({ socket });

        // Listen for the "getOnlineUsers" event from the server
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });

        socket.on("disconnect", (reason) => {
            console.warn("Socket disconnected:", reason);
        });

        socket.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
        });
    },

    disconnectSocket: () => {
        const { socket } = get();
        if (socket?.connected) {
            socket.disconnect();
            console.log("Socket disconnected.");
            set({ socket: null, onlineUsers: [] }); // Reset state
        }
    },
}));
