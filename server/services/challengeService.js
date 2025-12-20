import axios from 'axios';
import Challenge from '../models/Challenge.js';
import User from '../models/User.js';

export const checkChallenges = async () => {
    console.log('Running challenge check cron job...');
    try {
        const activeChallenges = await Challenge.find({ status: 'active' })
            .populate('creator')
            .populate('participants.user');

        for (const challenge of activeChallenges) {
            try {
                const creator = challenge.creator;
                const challengeStartTime = new Date(challenge.createdAt).getTime() / 1000;
                const challengeDeadline = new Date(challenge.deadline).getTime() / 1000;
                const isDeadlinePassed = new Date() > new Date(challenge.deadline);

                // Helper to check progress for a user
                const checkUserProgress = async (user) => {
                    if (!user || !user.codeforces || !user.codeforces.handle) return 0;
                    try {
                        const response = await axios.get(`https://codeforces.com/api/user.status?handle=${user.codeforces.handle}&from=1&count=100`);
                        if (response.data.status !== 'OK') return 0;

                        const submissions = response.data.result;
                        const validSubmissions = submissions.filter(sub => {
                            return (
                                sub.creationTimeSeconds > challengeStartTime &&
                                sub.creationTimeSeconds <= challengeDeadline &&
                                sub.verdict === 'OK' &&
                                sub.problem.rating >= challenge.minRating
                            );
                        });

                        const solvedProblems = new Set();
                        validSubmissions.forEach(sub => {
                            solvedProblems.add(`${sub.problem.contestId}-${sub.problem.index}`);
                        });

                        return solvedProblems.size;
                    } catch (e) {
                        console.error(`Error checking progress for ${user.codeforces.handle}:`, e.message);
                        return 0;
                    }
                };

                // 1. Update Creator Progress
                if (creator) {
                    const creatorProgress = await checkUserProgress(creator);
                    challenge.currentSolved = creatorProgress;
                }

                // 2. Update Participants Progress
                for (const p of challenge.participants) {
                    if (p.user) {
                        const progress = await checkUserProgress(p.user);
                        p.progress = progress;
                        if (progress >= challenge.questions) {
                            p.status = 'completed';
                        } else {
                            p.status = 'active'; // or 'failed' if deadline passed (handled below)
                        }
                    }
                }

                await challenge.save();

                // 3. Handle Deadline / Completion
                if (isDeadlinePassed) {
                    let winners = [];

                    // Check Creator
                    if (challenge.currentSolved >= challenge.questions) {
                        winners.push(creator);
                    }

                    // Check Participants
                    challenge.participants.forEach(p => {
                        if (p.progress >= challenge.questions && p.user) {
                            winners.push(p.user);
                            p.status = 'completed';
                        } else {
                            p.status = 'failed';
                        }
                    });

                    if (winners.length > 0) {
                        const share = challenge.totalPool / winners.length;
                        for (const winner of winners) {
                            // Fetch FRESH user to ensure atomic update or just save
                            const winnerDoc = await User.findById(winner._id);
                            if (winnerDoc) {
                                winnerDoc.tokens += share;
                                await winnerDoc.save();
                                console.log(`Distributed ${share} tokens to winner ${winnerDoc.name}`);
                            }
                        }
                        challenge.status = 'completed';
                        console.log(`Challenge ${challenge._id} completed. Pool ${challenge.totalPool} distributed among ${winners.length} winners.`);
                    } else {
                        challenge.status = 'failed';
                        console.log(`Challenge ${challenge._id} failed. Pool ${challenge.totalPool} burned.`);
                    }

                    await challenge.save();
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
