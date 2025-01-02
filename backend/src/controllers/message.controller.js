import User from "../models/user.model.js";
import Message from "../models/message.model.js";

// get users for sidebar
export const getUsersForSidebar = async (req, res) => {
    try {
        // get myself as logged in user
        const loggedInuserId = req.user._id;

        // get all users except me and dont show password
        const filterUser = await User.find({ _id: { $ne: loggedInuserId } }).select("-password");

        // send filtered users to client
        res.status(200).json(filterUser);
    } catch (error) {
        console.error("Error in get users for sidebar controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }

}

// get messages
export const getMessages = async (req, res) => {
    try {

        // get user to chat id
        const { id: userToChatId } = req.params;

        // get my id
        const myId = req.user._id;

        // get messages between me and user to chat
        const message = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })

        // send messages to client
        res.status(200).json(message);


    } catch (error) {
        console.error("Error in get messages controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });

    }
}

// send messages
export const sendMessage = async (req, res) => {
    try {
        // get message from request body
        const { text, image } = req.body;

        // get receiver id
        const { id: receiverId } = req.params;

        // get sender id
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            // upload image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        // create message
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        // save message
        await newMessage.save();

        //todo: real time functionality here

        // send message to client
        res.status(201).json(newMessage);

    } catch (error) {
        console.error("Error in send message controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}