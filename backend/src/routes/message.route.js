import express from 'express';
import { protectRoute } from '../middleware/auth.middlware.js';
import { getUsersForSidebar, getMessages } from '../controllers/message.controller.js';

const router = express.Router();

router.get("/user", protectRoute, getUsersForSidebar)
router.get("/:id", protectRoute, getMessages)

export default router;