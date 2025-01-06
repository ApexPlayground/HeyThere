import { create } from "zustand"
import toast from "react-hot-toast"
import { axiosInstance } from "../lib/axios"
import { useAuthStore } from "./useAuthStore"



export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    //get users for sidebar
    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },


    // get messages per users
    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    subscribeToMessages: () => {
        // Get the currently selected user
        const { selectedUser } = get();

        // Exit early if no user is selected (no need to subscribe to messages)
        if (!selectedUser) return;

        // Retrieve the socket instance from the auth store
        const socket = useAuthStore.getState().socket;

        // Set up a listener for new messages from the server
        socket.on("newMessage", (newMessage) => {
            // Check if the new message is from the currently selected user
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;

            // Ignore the message if it is not from the selected user
            if (!isMessageSentFromSelectedUser) return;

            // Add the new message to the current list of messages
            set({
                messages: [...get().messages, newMessage],
            });
        });
    },


    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },
    setSelectedUser: (selectedUser) => set({ selectedUser }),
}))