import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    try {
        // get token from cookies
        const token = req.cookies.jwt;

        // if no token, return error
        if (!token) {
            return res.status(401).json({ message: "Not authorized - No token provided" });
        }

        // verify token 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // if token is invalid, return error
        if (!decoded) {
            return res.status(401).json({ message: "Not authorized - Invalid Token" });
        }

        // find user by id and exclude password field
        const user = await User.findById(decoded.userId).select("-password");

        // if user not found, return error
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error in protectRoute middleware", error.message);
        res.status(500).json({ message: " Internal server error" });

    }
}