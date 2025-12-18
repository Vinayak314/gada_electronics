import User from "../models/User.js";

export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.json([]);

        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { "codeforces.handle": { $regex: query, $options: "i" } }
            ]
        }).select("name codeforces.handle photoURL email friends friendRequests");

        const currentUserId = req.user.uid;
        const filteredUsers = users.filter(u => u._id !== currentUserId);

        res.json(filteredUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const VERIFICATION_PROBLEMS = [
    { contestId: 4, index: 'A', name: "Watermelon" },
    { contestId: 71, index: 'A', name: "Way Too Long Words" },
    { contestId: 231, index: 'A', name: "Team" },
    { contestId: 158, index: 'A', name: "Next Round" },
    { contestId: 118, index: 'A', name: "String Task" }
];

export const linkCodeforces = async (req, res) => {
    const { handle } = req.body;
    const { uid } = req.user;

    if (!handle) {
        return res.status(400).json({ message: "Handle is required" });
    }

    try {
        // 1. Check if user exists
        const infoResponse = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
        const infoData = await infoResponse.json();

        if (infoData.status !== "OK") {
            return res.status(400).json({ message: "Codeforces handle not found" });
        }
        const cfUser = infoData.result[0];

        // 2. Determine Verification Problem
        // Simple hash of uid to pick a problem deterministically
        const problemIndex = uid.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % VERIFICATION_PROBLEMS.length;
        const expectedProblem = VERIFICATION_PROBLEMS[problemIndex];

        // 3. Check Submissions
        const statusResponse = await fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=20`);
        const statusData = await statusResponse.json();

        if (statusData.status !== "OK") {
            // If status is private or error, fail
            return res.status(400).json({
                message: "Could not retrieve submissions. Ensure your profile is public.",
                verificationProblem: expectedProblem
            });
        }

        const submissions = statusData.result;
        const nowSeconds = Math.floor(Date.now() / 1000);
        const TIME_WINDOW = 600; // 10 minutes

        const validSubmission = submissions.find(s =>
            s.problem.contestId === expectedProblem.contestId &&
            s.problem.index === expectedProblem.index &&
            (nowSeconds - s.creationTimeSeconds) < TIME_WINDOW
        );

        if (!validSubmission) {
            return res.status(400).json({
                message: "Verification failed. No recent submission found for the required problem.",
                verificationProblem: expectedProblem
            });
        }

        // 4. Check for duplicate linking
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
            // avatar: cfUser.avatar, // User prefers Google photo
            lastUpdated: new Date()
        };

        await user.save();

        res.json({ message: "Codeforces linked successfully", codeforces: user.codeforces });
    } catch (err) {
        console.error("Codeforces API Error:", err);
        res.status(500).json({ message: "Server error or Codeforces API error" });
    }
};
