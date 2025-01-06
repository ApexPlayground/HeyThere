import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO server
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL
    },
});

// Handle socket connection
io.on("connection", (socket) => {
    console.log("User connected to socket:", socket.id);

    // Handle socket disconnection
    socket.on("disconnect", () => {
        console.log("User disconnected from socket:", socket.id);
    });
});

// Export objects
export { io, app, server };
