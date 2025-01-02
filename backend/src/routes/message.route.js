import express from 'express';
import { protectRoute } from '../middleware/auth.middlware.js';
import { getUsersForSidebar, getMessages, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

// get users for sidebar 
router.get("/user", protectRoute, getUsersForSidebar)

// get messages 
router.get("/:id", protectRoute, getMessages)

// send messages
router.post("/send/:id", protectRoute, sendMessage)

export default router;