"use client"

import { useEffect, useState } from "react"
import { BackgroundGradientAnimation } from "@/components/background-gradient-animation"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ProtectedRoute } from "@/components/protected-route"
import Link from "next/link"

import { useAuth } from "@/context/auth-context"

type Challenge = {
  _id: string
  title: string
  timeframe: number
  stake: number
  totalPool?: number
  deadline: string
  participants?: {
    user: {
      _id: string
      name: string
      photoURL: string
    }
    progress: number
    status: string
  }[]
  // ... existing creator ...
  creator?: {
    _id: string
    name: string
    photoURL: string
  }
  status: 'active' | 'completed' | 'failed'
}

export default function HomePage() {
  const { user, profile } = useAuth()
  const totalCoins = profile?.tokens ?? 0
  const [yourChallenges, setYourChallenges] = useState<Challenge[]>([])
  const [friendsChallenges, setFriendsChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)

  const fetchChallenges = async () => {
    if (!user) return
    try {
      const token = await user.getIdToken()

      // Fetch your challenges
      const resYour = await fetch("https://gada-electronics-gzcv.onrender.com/api/challenges", {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Fetch friends' challenges
      const resFriends = await fetch("https://gada-electronics-gzcv.onrender.com/api/challenges/friends", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (resYour.ok && resFriends.ok) {
        const dataYour = await resYour.json()
        const dataFriends = await resFriends.json()
        setYourChallenges(dataYour.filter((c: Challenge) => c.status === 'active'))
        setFriendsChallenges(dataFriends.filter((c: Challenge) => c.status === 'active'))
      }
    } catch (error) {
      console.error("Failed to fetch challenges", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChallenges()
  }, [user])

  const handleJoin = async (challengeId: string) => {
    if (!user) return
    try {
      const token = await user.getIdToken()
      const res = await fetch(`https://gada-electronics-gzcv.onrender.com/api/challenges/${challengeId}/join`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        fetchChallenges()
      } else {
        const data = await res.json()
        alert(data.message || "Failed to join challenge")
      }
    } catch (error) {
      console.error("Failed to join challenge", error)
    }
  }

  return (
    <ProtectedRoute>

      <BackgroundGradientAnimation>
        <div className="min-h-screen bg-black/40 p-10 text-white">
          <div className="mx-auto flex max-w-4xl flex-col gap-8">
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Home</h1>
                <p className="text-sm text-white/70">Challenge your friends and track progress</p>
              </div>
              <div className="flex flex-col items-end rounded-xl bg-white/10 px-4 py-3 text-right">
                <span className="text-xl font-bold">◆ {totalCoins}</span>
              </div>
            </header>

            <main className="rounded-2xl bg-black/60 p-6 shadow-lg backdrop-blur-xl">
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Your Challenges</h2>
                  <span className="text-sm text-white/70">You&apos;ll earn coins if you finish on time</span>
                </div>

                <div className="space-y-3">
                  {loading ? (
                    <div className="space-y-3">
                      {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-16 w-full rounded-xl bg-white/5" />
                      ))}
                    </div>
                  ) : yourChallenges.length === 0 ? (
                    <div className="text-sm text-white/50">No active challenges. Add one!</div>
                  ) : (
                    yourChallenges.map((challenge) => {
                      const participantCount = challenge.participants?.length || 0
                      return (
                        <div
                          key={challenge._id}
                          className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                        >
                          <div>
                            <p className="text-sm font-medium">{challenge.title}</p>
                            <p className="text-xs text-white/60">
                              {challenge.timeframe} days • Ends {new Date(challenge.deadline).toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}
                            </p>
                            <p className="text-xs text-white/60 mt-1">
                              {participantCount} Friends Joined
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2 text-sm font-semibold">
                            <span className="rounded-full bg-white/10 px-3 py-1">
                              Prize Pool: ◆ {challenge.totalPool || challenge.stake}
                            </span>
                            <span className="text-xs text-white/50 pr-1">
                              Stake: ◆ {challenge.stake}
                            </span>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>

                <div className="flex justify-center">
                  <Link href="/challenge">
                    <Button className="rounded-full bg-white text-black hover:bg-white/90">
                      + Add a Challenge
                    </Button>
                  </Link>
                </div>
              </section>

              <section className="mt-8 space-y-3">
                <h2 className="text-lg font-semibold">Friend&apos;s Challenges</h2>

                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-20 w-full rounded-xl bg-white/5" />
                    ))}
                  </div>
                ) : friendsChallenges.length === 0 ? (
                  <div className="text-sm text-white/50">No friends' challenges yet.</div>
                ) : (
                  friendsChallenges.map((challenge) => {
                    const isJoined = challenge.participants?.some(p => p.user?._id === profile?._id)
                    const participantCount = challenge.participants?.length || 0
                    const share = participantCount > 0 ? Math.floor(challenge.stake / participantCount) : challenge.stake

                    return (
                      <div
                        key={challenge._id}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-medium">{challenge.creator?.name || "Friend"}</p>
                          <p className="text-xs text-white/60">{challenge.title}</p>
                          <p className="text-xs text-white/60 mt-1">
                            {challenge.timeframe} days • Ends {new Date(challenge.deadline).toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}
                          </p>
                          <p className="text-xs text-white/60 mt-0.5">{participantCount} Joined</p>
                        </div>
                        <div className="flex flex-col items-end gap-2 text-sm">
                          <span className="rounded-full bg-white/10 px-3 py-1 font-semibold">
                            Prize Pool: ◆ {challenge.totalPool || challenge.stake}
                          </span>
                          {!isJoined ? (
                            <Button size="sm" onClick={() => handleJoin(challenge._id)} className="rounded-full bg-white text-black hover:bg-white/90 border-none h-7 text-xs">
                              Participate
                            </Button>
                          ) : (
                            <span className="text-green-400 text-xs font-semibold pr-2">Checked In</span>
                          )}
                          <span className="text-xs text-white/50 pr-2">Entry: ◆ {challenge.stake}</span>
                        </div>
                      </div>
                    )
                  })
                )}

                <p className="mt-2 text-xs text-white/60">
                  NOTE: The reward is calculated based on the stake.
                </p>
              </section>

              <div className="mt-8 flex items-center justify-between">
                <Link href="/editor">
                  <Button variant="outline" className="rounded-full border-white/40 bg-white/10 text-white hover:bg-white/20">
                    Editor &lt;/&gt;
                  </Button>
                </Link>
              </div>
            </main>
          </div>
        </div>
      </BackgroundGradientAnimation>
    </ProtectedRoute>
  )
}
