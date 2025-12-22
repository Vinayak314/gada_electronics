"use client"

import { useState, useMemo } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, ExternalLink } from "lucide-react"

const VERIFICATION_PROBLEMS = [
    { contestId: 4, index: 'A', name: "Watermelon" },
    { contestId: 71, index: 'A', name: "Way Too Long Words" },
    { contestId: 231, index: 'A', name: "Team" },
    { contestId: 158, index: 'A', name: "Next Round" },
    { contestId: 118, index: 'A', name: "String Task" }
];

export function CodeforcesOnboarding() {
    const { user, profile, refreshProfile, loading } = useAuth()
    const [handle, setHandle] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    // Calculate verification problem based on UID (must match server logic)
    const verificationProblem = useMemo(() => {
        if (!user?.uid) return VERIFICATION_PROBLEMS[0];
        const problemIndex = user.uid.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % VERIFICATION_PROBLEMS.length;
        return VERIFICATION_PROBLEMS[problemIndex];
    }, [user?.uid]);

    // Don't show if loading, no user, or already linked
    if (loading) return null
    if (!user) return null
    if (profile?.codeforces?.handle) {
        return null
    }

    const handleLink = async () => {
        if (!handle.trim()) return
        setIsLoading(true)
        setError("")

        try {
            const token = await user.getIdToken()
            const res = await fetch("https://gada-electronics-gzcv.onrender.com/api/users/codeforces/link", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ handle }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Failed to verify")
            }

            await refreshProfile()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const problemUrl = `https://codeforces.com/problemset/problem/${verificationProblem.contestId}/${verificationProblem.index}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <Card className="w-full max-w-md border-white/20 bg-slate-900 shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl text-white">Welcome to FeetCode!</CardTitle>
                    <CardDescription className="text-white/60">
                        To get started, please verify and link your Codeforces account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white">1. Enter your Codeforces Handle</label>
                        <Input
                            placeholder="e.g. tourist"
                            value={handle}
                            onChange={(e) => setHandle(e.target.value)}
                            className="border-white/20 bg-white/5 text-white placeholder:text-white/30"
                        />
                    </div>

                    <div className="space-y-4 rounded-lg bg-indigo-900/40 p-4 border border-indigo-500/30">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-indigo-200">2. Verify Ownership</label>
                            <p className="text-xs text-indigo-300">
                                Submit <strong>ANY</strong> code (even a Compilation Error) to the following problem within the last 10 minutes:
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 rounded bg-black/30 p-3">
                            <div className="text-xs text-indigo-400 uppercase tracking-wider font-semibold">Problem to Submit</div>
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-lg text-white font-bold">
                                    {verificationProblem.contestId}{verificationProblem.index} - {verificationProblem.name}
                                </span>
                                <a
                                    href={problemUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded transition-colors"
                                >
                                    Open <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                        </div>

                        <p className="text-xs text-indigo-300/80 italic">
                            * You don't need to solve it correctly! Even an empty file or "Hello World" works, as long as it registers as a submission.
                        </p>
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-900/20 p-3 text-sm text-red-400 border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <Button
                        className="w-full rounded-full bg-white text-black hover:bg-white/90 font-semibold"
                        onClick={handleLink}
                        disabled={isLoading || !handle}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            "I Have Submitted - Verify Now"
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
