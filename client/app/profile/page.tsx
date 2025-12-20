"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { BackgroundGradientAnimation } from "@/components/background-gradient-animation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/auth-context"
import { CodeforcesHeatmap } from "@/components/heatmap"

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth()
  const [cfHandle, setCfHandle] = useState("")
  const [isLinking, setIsLinking] = useState(false)
  const [error, setError] = useState("")
  const [activeChallenges, setActiveChallenges] = useState<any[]>([])
  const [pastChallenges, setPastChallenges] = useState<any[]>([])

  useEffect(() => {
    const fetchChallenges = async () => {
      if (!user) return
      try {
        const token = await user.getIdToken()
        const res = await fetch("https://gadaelectronics-backend.vercel.app/api/challenges", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setActiveChallenges(data.filter((c: any) => c.status === 'active'))
          setPastChallenges(data.filter((c: any) => c.status !== 'active'))
        }
      } catch (error) {
        console.error("Failed to fetch challenges", error)
      }
    }
    fetchChallenges()
  }, [user])

  const handleLink = async () => {
    if (!cfHandle.trim()) return;

    setIsLinking(true);
    setError("");
    try {
      const token = await user?.getIdToken();
      const res = await fetch('https://gadaelectronics-backend.vercel.app/api/users/codeforces/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ handle: cfHandle })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to link account");
      }

      await refreshProfile();
      setCfHandle("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLinking(false);
    }
  }

  return (
    <ProtectedRoute>
      <BackgroundGradientAnimation>
        <div className="min-h-screen bg-black/40 py-0 pl-10 pr-10 text-white w-full overflow-y-auto">
          <div className="container mx-auto px-6 py-4">
            <Card className="border-white/20 bg-black/40 backdrop-blur-xl">
              <CardContent className="p-8">
                <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
                  <Avatar className="h-32 w-32 border-4 border-white/20">
                    <AvatarImage src={profile?.photoURL || profile?.codeforces?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-2xl text-white">
                      {profile?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0 text-center md:text-left">
                    <div className="mb-2 flex flex-col items-center gap-2 md:flex-row md:items-center">
                      <h1 className="text-3xl font-bold text-white">{profile?.name || "User"}</h1>
                      {profile?.codeforces ? (
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                          CodeForces: {profile.codeforces.handle}
                        </Badge>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Codeforces Handle"
                            className="h-8 w-40 bg-white/10 text-white border-white/20 text-xs"
                            value={cfHandle}
                            onChange={(e) => setCfHandle(e.target.value)}
                          />
                          <Button size="sm" className="rounded-full h-8 text-xs bg-white text-black hover:bg-white/90" onClick={handleLink} disabled={isLinking}>
                            {isLinking ? "..." : "Link"}
                          </Button>
                        </div>
                      )}
                    </div>
                    {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

                    <div className="mb-6 flex flex-wrap items-center gap-4">
                      {profile?.codeforces && (
                        <>
                          <div className="rounded-xl bg-white/5 px-4 py-3 text-left flex-1">
                            <p className="text-xs text-white/60">Rank</p>
                            <p className="text-2xl font-bold text-white capitalize">{profile.codeforces.rank || "Unrated"}</p>
                          </div>
                          <div className="rounded-xl bg-white/5 px-4 py-3 text-left flex-1">
                            <p className="text-xs text-white/60">Rating</p>
                            <p className="text-2xl font-bold text-white">{profile.codeforces.rating || "N/A"}</p>
                          </div>
                        </>
                      )}
                      <div className="rounded-xl bg-white/5 px-4 py-3 text-left flex-1">
                        <p className="text-xs text-white/60">Coins</p>
                        <p className="text-2xl font-bold text-white">◆ {profile?.tokens ?? 0}</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <p className="mb-2 text-sm text-white/60">Active Challenges</p>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {activeChallenges.length === 0 ? (
                          <p className="text-sm text-white/40">No active challenges.</p>
                        ) : (
                          activeChallenges.map((challenge: any) => {
                            const isCreator = challenge.creator?._id === profile?._id;
                            const myProgress = isCreator
                              ? challenge.currentSolved
                              : challenge.participants?.find((p: any) => p.user?._id === profile?._id)?.progress || 0;

                            return (
                              <div key={challenge._id} className="rounded-xl bg-white/5 p-4 border border-white/10">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <p className="font-semibold text-sm">{challenge.title}</p>
                                    <p className="text-xs text-white/50">Ends in {challenge.timeframe} days</p>
                                  </div>
                                  <div className="flex flex-col items-end">
                                    <Badge variant="outline" className="border-white/20 text-white/80">
                                      Pool: ◆ {challenge.totalPool || challenge.stake}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="mt-3">
                                  <div className="flex justify-between text-xs mb-1">
                                    <span className="text-white/70">Your Progress</span>
                                    <span className="font-mono">{myProgress || 0} / {challenge.questions}</span>
                                  </div>
                                  <div className="h-1.5 w-full rounded-full bg-white/10">
                                    <div
                                      className="h-full rounded-full bg-green-500 transition-all duration-500"
                                      style={{ width: `${Math.min(100, ((myProgress || 0) / challenge.questions) * 100)}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <p className="mb-2 text-sm text-white/60">Past Goals</p>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {pastChallenges.length === 0 ? (
                          <p className="text-sm text-white/40">No past goals.</p>
                        ) : (
                          pastChallenges.map((challenge: any) => {
                            const isCreator = challenge.creator?._id === profile?._id;
                            const myProgress = isCreator
                              ? challenge.currentSolved
                              : challenge.participants?.find((p: any) => p.user?._id === profile?._id)?.progress || 0;
                            const amIWinner = myProgress >= challenge.questions;

                            return (
                              <div key={challenge._id} className="rounded-xl bg-white/5 p-4 border border-white/10 opacity-80">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <p className="font-semibold text-sm">{challenge.title}</p>
                                    <p className="text-xs text-white/50">{new Date(challenge.deadline).toLocaleDateString()}</p>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className={`border-white/20 ${amIWinner ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'}`}
                                  >
                                    {amIWinner ? 'Success' : 'Failed'}
                                  </Badge>
                                </div>
                                <div className="mt-3">
                                  <div className="flex justify-between text-xs mb-1">
                                    <span className="text-white/70">Final Score</span>
                                    <span className="font-mono">{myProgress || 0} / {challenge.questions}</span>
                                  </div>
                                  <div className="h-1.5 w-full rounded-full bg-white/10">
                                    <div
                                      className={`h-full rounded-full transition-all duration-500 ${amIWinner ? 'bg-green-500' : 'bg-red-500'}`}
                                      style={{ width: `${Math.min(100, ((myProgress || 0) / challenge.questions) * 100)}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <p className="mb-2 text-sm text-white/60">Submission Activity</p>
                      {profile?.codeforces?.handle ? (
                        <CodeforcesHeatmap handle={profile.codeforces.handle} />
                      ) : (
                        <Button
                          variant="outline"
                          className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                          disabled
                        >
                          Link Codeforces to see Heatmap
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </BackgroundGradientAnimation>
    </ProtectedRoute>
  )
}
