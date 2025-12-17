import Challenge from "../models/Challenge.js";
import User from "../models/User.js";

export const createChallenge = async (req, res) => {
    try {
        const { questions, minRating, timeframe, stake } = req.body;
        const uid = req.user.uid;

        const user = await User.findById(uid);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.tokens < stake) {
            return res.status(400).json({ message: "Insufficient tokens" });
        }

        // Deduct tokens
        user.tokens -= stake;
        await user.save();

        // Calculate deadline (timeframe is in days)
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + parseInt(timeframe));

        const newChallenge = new Challenge({
            creator: uid,
            title: `Solve ${questions} Problems (Rated ${minRating}+)`,
            questions,
            minRating,
            timeframe,
            stake,
            deadline
        });

        await newChallenge.save();

        res.status(201).json(newChallenge);
    } catch (error) {
        console.error("Error creating challenge:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getChallenges = async (req, res) => {
    try {
        const uid = req.user.uid;
        // Get user's active challenges
        const challenges = await Challenge.find({ creator: uid }).sort({ createdAt: -1 });
        res.status(200).json(challenges);
    } catch (error) {
        console.error("Error getting challenges:", error);
        res.status(500).json({ message: error.message });
    }

};

export const joinChallenge = async (req, res) => {
    try {
        const { id } = req.params;
        const uid = req.user.uid;

        const challenge = await Challenge.findById(id);
        if (!challenge) {
            return res.status(404).json({ message: "Challenge not found" });
        }

        if (challenge.status !== 'active') {
            return res.status(400).json({ message: "Challenge is not active" });
        }

        if (challenge.creator.toString() === uid) {
            return res.status(400).json({ message: "Cannot join your own challenge" });
        }

        if (challenge.participants.includes(uid)) {
            return res.status(400).json({ message: "Already joined" });
        }

        challenge.participants.push(uid);
        await challenge.save();

        res.status(200).json(challenge);
    } catch (error) {
        console.error("Error joining challenge:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getFriendsChallenges = async (req, res) => {
    try {
        const uid = req.user.uid;
        const user = await User.findById(uid);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Get friends' active challenges
        // Assuming user.friends contains friend UIDs
        const challenges = await Challenge.find({
            creator: { $in: user.friends },
            status: 'active' // Optional: only show active challenges
        })
            .populate('creator', 'name photoURL')
            .populate('participants', 'name photoURL')
            .sort({ createdAt: -1 });

        res.status(200).json(challenges);
    } catch (error) {
        console.error("Error getting friends challenges:", error);
        res.status(500).json({ message: error.message });
    }
};
