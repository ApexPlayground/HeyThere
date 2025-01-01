import express from 'express';
import dotenv from 'dotenv';
import connectDB from './lib/db.js';

import authRoutes from './routes/auth.route.js';

dotenv.config();

const app = express();

const port = process.env.PORT

// express middleware that con
app.use(express.json());

// routes for the app
app.use("/api/auth", authRoutes);

// start the server and database connection
app.listen(port, () => {
    console.log('Server is running on port: ' + port);
    connectDB();
});