import axios from 'axios';
import Challenge from '../models/Challenge.js';
import User from '../models/User.js';

export const checkChallenges = async () => {
    console.log('Running challenge check cron job...');
    try {
        const activeChallenges = await Challenge.find({ status: 'active' })
            .populate('creator')
            .populate('participants');

        for (const challenge of activeChallenges) {
            try {
                const creator = challenge.creator;
                if (!creator) {
                    // Creator deleted? Maybe fail challenge or ignore?
                    console.log(`Challenge ${challenge._id} has no creator.`);
                    continue;
                }

                if (!creator.codeforces || !creator.codeforces.handle) {
                    console.log(`Creator ${creator.name} has no Codeforces handle`);
                    continue;
                }

                const handle = creator.codeforces.handle;
                const response = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=100`);

                if (response.data.status !== 'OK') {
                    console.log(`Failed to fetch submissions for ${handle}`);
                    continue;
                }

                const submissions = response.data.result;
                const challengeStartTime = new Date(challenge.createdAt).getTime() / 1000;
                const challengeDeadline = new Date(challenge.deadline).getTime() / 1000;

                const validSubmissions = submissions.filter(sub => {
                    return (
                        sub.creationTimeSeconds > challengeStartTime &&
                        sub.creationTimeSeconds <= challengeDeadline &&
                        sub.verdict === 'OK' &&
                        sub.problem.rating >= challenge.minRating
                    );
                });

                // Unique problems
                const solvedProblems = new Set();
                validSubmissions.forEach(sub => {
                    solvedProblems.add(`${sub.problem.contestId}-${sub.problem.index}`);
                });

                const count = solvedProblems.size;

                // Update progress
                challenge.currentSolved = count;
                await challenge.save();

                // Check Completion
                if (count >= challenge.questions) {
                    // Success!
                    challenge.status = 'completed';
                    creator.tokens += challenge.stake;
                    await creator.save();
                    await challenge.save();
                    console.log(`Challenge ${challenge._id} completed by ${creator.name}`);
                } else if (new Date() > new Date(challenge.deadline)) {
                    // Failed
                    challenge.status = 'failed';
                    await challenge.save();

                    const validParticipants = challenge.participants.filter(p => p);
                    const numParticipants = validParticipants.length;
                    if (numParticipants > 0) {
                        const share = challenge.stake / numParticipants;
                        for (const participant of validParticipants) {
                            participant.tokens += share;
                            await participant.save();
                        }
                        console.log(`Challenge ${challenge._id} failed. ${challenge.stake} distributed to ${numParticipants} friends.`);
                    } else {
                        console.log(`Challenge ${challenge._id} failed. No participants to distribute stake.`);
                        // Stake is lost (burned)
                    }
                }
            } catch (err) {
                console.error(`Error processing challenge ${challenge._id}:`, err.message);
            }
        }
    } catch (error) {
        console.error("Error in checkChallenges cron:", error);
    }
};

export const checkPenalties = async () => {
    console.log('Running penalty check cron job...');
    try {
        const users = await User.find({});
        const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

        for (const user of users) {
            // Skip new users (less than 2 weeks old)
            if (user.createdAt > twoWeeksAgo) continue;

            // Avoid double penalizing in the same 2-week period
            if (user.lastPenaltyDate && user.lastPenaltyDate > twoWeeksAgo) {
                continue;
            }

            // Check Inactivity
            const isInactive = !user.lastActiveAt || user.lastActiveAt < twoWeeksAgo;

            // Check Challenge Creation
            const lastChallenge = await Challenge.findOne({ creator: user._id }).sort({ createdAt: -1 });
            let hasNoRecentChallenge = false;

            if (!lastChallenge) {
                // User exists > 2 weeks and no challenge ever created
                hasNoRecentChallenge = true;
            } else if (lastChallenge.createdAt < twoWeeksAgo) {
                // Last challenge was created more than 2 weeks ago
                hasNoRecentChallenge = true;
            }

            if (isInactive || hasNoRecentChallenge) {
                const penalty = user.tokens * 0.05;
                if (penalty > 0) {
                    user.tokens -= penalty;
                    user.lastPenaltyDate = new Date();
                    await user.save();
                    console.log(`Penalized user ${user.name} (${user._id}) by ${penalty} tokens.`);
                }
            }
        }
    } catch (error) {
        console.error("Error in checkPenalties:", error);
    }
};
