import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInuserId = req.user._id;
        const filterUser = await User.find({ _id: { $ne: loggedInuserId } }).select("-password");

        res.status(200).json(filterUser);
    } catch (error) {
        console.error("Error in get users for sidebar controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }

}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const message = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })

        res.status(200).json(message);


    } catch (error) {
        console.error("Error in get messages controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });

    }
}