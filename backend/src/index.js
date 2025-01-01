import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './lib/db.js';

import authRoutes from './routes/auth.route.js';

dotenv.config();

const app = express();

const port = process.env.PORT

// express middlewares to parse incoming requests
app.use(express.json());
app.use(cookieParser());

// routes for the app
app.use("/api/auth", authRoutes);

// start the server and database connection
app.listen(port, () => {
    console.log('Server is running on port: ' + port);
    connectDB();
});