import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './lib/db.js';
import cors from 'cors';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';

dotenv.config();

const app = express();

const port = process.env.PORT

// express middlewares to parse incoming requests
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

// routes for the app
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// start the server and database connection
app.listen(port, () => {
    console.log('Server is running on port: ' + port);
    connectDB();
    console.log('client url: ' + process.env.CLIENT_URL);
});