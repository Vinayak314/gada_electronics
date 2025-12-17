"use client"

import { useEffect, useState } from "react"
import { BackgroundGradientAnimation } from "@/components/background-gradient-animation"
import SplashCursor from "@/components/splash-cursor"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/protected-route"
import Link from "next/link"

import { useAuth } from "@/context/auth-context"

type Challenge = {
  _id: string
  title: string
  timeframe: number
  stake: number
  deadline: string
  creator?: {
    _id: string
    name: string
    photoURL: string
  }
}

export default function HomePage() {
  const { user, profile } = useAuth()
  const totalCoins = profile?.tokens ?? 0
  const [yourChallenges, setYourChallenges] = useState<Challenge[]>([])
  const [friendsChallenges, setFriendsChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChallenges = async () => {
      if (!user) return
      try {
        const token = await user.getIdToken()

        // Fetch your challenges
        const resYour = await fetch("http://localhost:5000/api/challenges", {
          headers: { Authorization: `Bearer ${token}` },
        })

        // Fetch friends' challenges
        const resFriends = await fetch("http://localhost:5000/api/challenges/friends", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (resYour.ok && resFriends.ok) {
          const dataYour = await resYour.json()
          const dataFriends = await resFriends.json()
          setYourChallenges(dataYour)
          setFriendsChallenges(dataFriends)
        }
      } catch (error) {
        console.error("Failed to fetch challenges", error)
      } finally {
        setLoading(false)
      }
    }

    fetchChallenges()
  }, [user])

  return (
    <ProtectedRoute>
      <SplashCursor />
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
                    <div className="text-sm text-white/50">Loading challenges...</div>
                  ) : yourChallenges.length === 0 ? (
                    <div className="text-sm text-white/50">No active challenges. Add one!</div>
                  ) : (
                    yourChallenges.map((challenge) => (
                      <div
                        key={challenge._id}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-medium">{challenge.title}</p>
                          <p className="text-xs text-white/60">
                            in {challenge.timeframe} days
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <span className="rounded-full bg-white/10 px-3 py-1">◆ {challenge.stake}</span>
                        </div>
                      </div>
                    ))
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
                  <div className="text-sm text-white/50">Loading friends' challenges...</div>
                ) : friendsChallenges.length === 0 ? (
                  <div className="text-sm text-white/50">No friends' challenges yet.</div>
                ) : (
                  friendsChallenges.map((challenge) => (
                    <div
                      key={challenge._id}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{challenge.creator?.name || "Friend"}</p>
                        <p className="text-xs text-white/60">{challenge.title}</p>
                      </div>
                      <div className="flex flex-col items-end text-sm">
                        <span className="mt-1 rounded-full bg-white/10 px-3 py-1 font-semibold">
                          ◆ {Math.floor(challenge.stake / 5)}
                        </span>
                      </div>
                    </div>
                  ))
                )}

                <p className="mt-2 text-xs text-white/60">
                  NOTE: The reward is calculated based on the stake.
                </p>
              </section>

              <div className="mt-8 flex items-center justify-between">
                <Link href="/editor">
                  <Button variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20">
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
