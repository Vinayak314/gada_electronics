"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, CheckCircle2, Copy } from "lucide-react"

export function CodeforcesOnboarding() {
    const { user, profile, refreshProfile, loading } = useAuth()
    const [handle, setHandle] = useState("")
    const [isLoading, setIsLoading] = useState(false) // renamed from loading to avoid conflict
    const [error, setError] = useState("")
    const [verificationToken, setVerificationToken] = useState("")

    // Don't show if loading, no user, or already linked
    if (loading) return null
    if (!user) return null
    if (profile?.codeforces?.handle) {
        return null
    }

    // Calculate local token to show in UI
    const localToken = `Gada-${user.uid.substring(0, 6)}`

    const handleLink = async () => {
        if (!handle.trim()) return
        setIsLoading(true)
        setError("")

        try {
            const token = await user.getIdToken()
            const res = await fetch("http://localhost:5000/api/users/codeforces/link", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ handle }),
            })

            const data = await res.json()

            if (!res.ok) {
                if (data.expectedName) {
                    setVerificationToken(data.expectedName)
                }
                throw new Error(data.message || "Failed to verify")
            }

            await refreshProfile()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const copyToken = () => {
        navigator.clipboard.writeText(localToken);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <Card className="w-full max-w-md border-white/20 bg-slate-900 shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl text-white">Welcome to GadaElectronics!</CardTitle>
                    <CardDescription className="text-white/60">
                        To get started, please verify and link your Codeforces account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white">1. Enter your Codeforces Handle</label>
                        <Input
                            placeholder="e.g. tourist"
                            value={handle}
                            onChange={(e) => setHandle(e.target.value)}
                            className="border-white/20 bg-white/5 text-white placeholder:text-white/30"
                        />
                    </div>

                    <div className="space-y-2 rounded-lg bg-indigo-900/40 p-4 border border-indigo-500/30">
                        <label className="text-sm font-medium text-indigo-200">2. Verify Ownership</label>
                        <p className="text-xs text-indigo-300 mb-2">
                            Go to Codeforces Settings → Social → Organization and set it to:
                        </p>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 rounded bg-black/30 px-2 py-1.5 font-mono text-sm text-white">
                                {localToken}
                            </code>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-indigo-300 hover:text-white" onClick={copyToken}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-900/20 p-3 text-sm text-red-400 border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <Button
                        className="w-full rounded-full bg-white text-black hover:bg-white/90"
                        onClick={handleLink}
                        disabled={isLoading || !handle}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            "Verify & Link Account"
                        )}
                    </Button>

                    <p className="text-center text-xs text-white/40">
                        You can change your organization back after verification.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
