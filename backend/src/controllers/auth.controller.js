import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        // fill all fields
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Please fill all fields" });
        }
        // validate password
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // check if user already exists
        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // if all passed, create new user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        if (newUser) {

            //generate jwt token here
            generateToken(newUser._id, res);

            // save user to database
            await newUser.save();

            // send user data to front-end 
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });

        } else {
            res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        console.error(" Error in signup controller ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }

};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // fill all fields
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        // check if user exists
        const user = await User.findOne({ email });

        // if email is wrong
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);

        // if password is wrong
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);

        // send user data to front-end
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.error(" Error in login controller ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }


};

export const logout = (req, res) => {
    try {
        // Clear the jwt cookie by setting it with an expired maxAge
        res.cookie("jwt", "", {
            maxAge: 0, // Cookie expires immediately
        });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Update user profile picture
export const updateProfile = async (req, res) => {
    try {
        // get profile pic from request body
        const { profilePic } = req.body;

        // get user id from req object
        const userId = req.user._id;

        // check if profile pic is provided
        if (!profilePic) {
            return res.status(400).json({ message: "Please provide profile pic" });
        }

        // upload profile pic to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        // update user profile pic in database
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });

        // send updated user data to front-end
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(" Error in updateProfile controller ", error.message);
        res.status(500).json({ message: "Internal Server Error" });

    }

};

// Check if user is authenticated
export const checkAuth = (req, res) => {
    try {
        // get user data from req object
        const user = req.user;
        res.status(200).json(user);
    } catch (error) {
        console.error("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
