import User from "../models/User.js";

export const linkCodeforces = async (req, res) => {
    const { handle } = req.body;
    const { uid } = req.user;

    if (!handle) {
        return res.status(400).json({ message: "Handle is required" });
    }

    try {
        const response = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
        const data = await response.json();

        if (data.status !== "OK") {
            return res.status(400).json({ message: "Codeforces handle not found" });
        }

        const cfUser = data.result[0];

        // Verification Check: Organization must be "Gada-[uid_suffix]"
        const expectedName = `Gada-${uid.substring(0, 6)}`;
        if (cfUser.organization !== expectedName) {
            return res.status(400).json({
                message: `Verification failed. Please set your Codeforces 'Organization' to: ${expectedName}`,
                expectedName
            });
        }

        // Optional: Check if this handle is already linked to another user
        const existing = await User.findOne({ "codeforces.handle": cfUser.handle });
        if (existing && existing._id !== uid) {
            return res.status(400).json({ message: "This Codeforces handle is already linked to another account" });
        }

        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.codeforces = {
            handle: cfUser.handle,
            rating: cfUser.rating,
            rank: cfUser.rank,
            maxRating: cfUser.maxRating,
            maxRank: cfUser.maxRank,
            avatar: cfUser.avatar,
            lastUpdated: new Date()
        };

        await user.save();

        res.json({ message: "Codeforces linked successfully", codeforces: user.codeforces });
    } catch (err) {
        console.error("Codeforces API Error:", err);
        res.status(500).json({ message: "Server error or Codeforces API error" });
    }
};
