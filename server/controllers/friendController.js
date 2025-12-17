import User from "../models/User.js";

// Send Friend Request
export const sendFriendRequest = async (req, res) => {
    const { receiverId } = req.params;
    const senderId = req.user.uid;

    if (senderId === receiverId) {
        return res.status(400).json({ message: "You cannot send a friend request to yourself" });
    }

    try {
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if they are already friends
        if (receiver.friends.includes(senderId)) {
            return res.status(400).json({ message: "You are already friends" });
        }

        // Check if request already sent
        if (receiver.friendRequests.incoming.includes(senderId)) {
            return res.status(400).json({ message: "Friend request already sent" });
        }

        await User.findByIdAndUpdate(receiverId, {
            $addToSet: { "friendRequests.incoming": senderId }
        });

        await User.findByIdAndUpdate(senderId, {
            $addToSet: { "friendRequests.outgoing": receiverId }
        });

        res.status(200).json({ message: "Friend request sent successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Accept Friend Request
export const acceptFriendRequest = async (req, res) => {
    const { senderId } = req.params; // The person who sent the request
    const receiverId = req.user.uid; // The person accepting (logged in user)

    try {
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if request exists
        if (!receiver.friendRequests.incoming.includes(senderId)) {
            return res.status(400).json({ message: "No friend request from this user" });
        }

        await User.findByIdAndUpdate(receiverId, {
            $pull: { "friendRequests.incoming": senderId },
            $addToSet: { friends: senderId }
        });

        await User.findByIdAndUpdate(senderId, {
            $pull: { "friendRequests.outgoing": receiverId },
            $addToSet: { friends: receiverId }
        });

        res.status(200).json({ message: "Friend request accepted" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// Reject Friend Request
export const rejectFriendRequest = async (req, res) => {
    const { senderId } = req.params;
    const receiverId = req.user.uid;

    try {
        await User.findByIdAndUpdate(receiverId, {
            $pull: { "friendRequests.incoming": senderId }
        });

        await User.findByIdAndUpdate(senderId, {
            $pull: { "friendRequests.outgoing": receiverId }
        });

        res.status(200).json({ message: "Friend request rejected" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const getFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user.uid).populate("friends", "name codeforces.handle photoURL codeforces.rating");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user.friends);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getFriendRequests = async (req, res) => {
    try {
        const user = await User.findById(req.user.uid).populate("friendRequests.incoming", "name codeforces.handle photoURL");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user.friendRequests.incoming);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
