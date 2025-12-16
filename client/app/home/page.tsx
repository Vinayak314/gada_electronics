"use client"

import { BackgroundGradientAnimation } from "@/components/background-gradient-animation"
import SplashCursor from "@/components/splash-cursor"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/protected-route"
import Link from "next/link"

import { useAuth } from "@/context/auth-context"

// ... (Challenge types and data omitted for brevity if not modifying, but I'll need to keep them or wrap wisely)
// Since replace_file_content works on chunks, I will target the imports and the component body start.

type Challenge = {
  id: number
  title: string
  timeframe: string
  stakePerFriend: number
}

const yourChallenges: Challenge[] = [
  {
    id: 1,
    title: "Solve 4 Problems in a week",
    timeframe: "in a week",
    stakePerFriend: 50,
  },
]

const friendsChallenges: Challenge[] = [
  {
    id: 1,
    title: "Solve 4 Problems in a week",
    timeframe: "in a week",
    stakePerFriend: 20,
  },
  {
    id: 2,
    title: "Solve 4 Problems in a week",
    timeframe: "in a week",
    stakePerFriend: 20,
  },
]

export default function HomePage() {
  const { profile } = useAuth()
  const totalCoins = profile?.tokens ?? 0

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
                  {yourChallenges.map((challenge) => (
                    <div
                      key={challenge.id}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{challenge.title}</p>
                        <p className="text-xs text-white/60">{challenge.timeframe}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <span className="text-white/70">You put</span>
                        <span className="rounded-full bg-white/10 px-3 py-1">◆ {challenge.stakePerFriend}</span>
                      </div>
                    </div>
                  ))}
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

                {friendsChallenges.map((challenge, index) => (
                  <div
                    key={challenge.id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{index === 0 ? "Samaira" : "Dhanya"}</p>
                      <p className="text-xs text-white/60">{challenge.title}</p>
                    </div>
                    <div className="flex flex-col items-end text-sm">
                      <span className="mt-1 rounded-full bg-white/10 px-3 py-1 font-semibold">
                        ◆ {challenge.stakePerFriend}
                      </span>
                    </div>
                  </div>
                ))}

                <p className="mt-2 text-xs text-white/60">
                  NOTE: If you put 100 coins here and have 5 friends, each friend will get 20.
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
