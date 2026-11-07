"use client"

import { useEffect, useState, type FormEvent } from "react"
import { HomeDashboard, type Challenge } from "@/components/home-dashboard"
import SplashCursor from "@/components/splash-cursor"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const demoUser = { _id: "demo-mira", name: "Mira Chen", photoURL: "" }
const friend = { _id: "demo-ravi", name: "Ravi Patel", photoURL: "" }
const teammate = { _id: "demo-jo", name: "Jo Rivera", photoURL: "" }

function makeChallenge(id: string, title: string, timeframe: number, stake: number): Challenge {
  const deadline = new Date()
  deadline.setDate(deadline.getDate() + timeframe)
  return { _id: id, title, timeframe, stake, totalPool: stake, deadline: deadline.toISOString(), status: "active" }
}

type DemoDashboard = { coins: number; own: Challenge[]; friends: Challenge[] }

function initialDashboard(): DemoDashboard {
  return {
    coins: 450,
    own: [
      {
        ...makeChallenge("arrays", "Solve 5 array problems rated 1000+", 4, 60),
        participants: [
          { user: demoUser, progress: 3, status: "active" },
          { user: teammate, progress: 2, status: "active" },
        ],
        totalPool: 120,
      },
    ],
    friends: [
      { ...makeChallenge("graphs", "Solve 4 graph problems rated 1200+", 7, 80), creator: friend },
      { ...makeChallenge("binary-search", "Solve 3 binary search problems rated 900+", 3, 40), creator: teammate },
    ],
  }
}

export default function DemoPage() {
  // Populate relative deadlines in the browser so server and client dates never disagree.
  const [dashboard, setDashboard] = useState<DemoDashboard | null>(null)
  const [creating, setCreating] = useState(false)
  const [message, setMessage] = useState("")
  useEffect(() => setDashboard(initialDashboard()), [])

  function join(id: string) {
    if (!dashboard) return
    const challenge = dashboard.friends.find(item => item._id === id)
    if (!challenge || challenge.participants?.some(p => p.user._id === demoUser._id)) return
    if (challenge.stake > dashboard.coins) {
      setMessage("You need more demo coins to join this challenge.")
      return
    }
    setDashboard({
      ...dashboard,
      coins: dashboard.coins - challenge.stake,
      friends: dashboard.friends.map(item => item._id === id ? {
        ...item,
        totalPool: (item.totalPool ?? item.stake) + item.stake,
        participants: [...(item.participants ?? []), { user: demoUser, progress: 0, status: "active" }],
      } : item),
    })
    setMessage("Challenge joined with demo coins.")
  }

  function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!dashboard) return
    const data = new FormData(event.currentTarget)
    const [questions, rating, days, stake] = ["questions", "rating", "days", "stake"].map(name => Number(data.get(name)))
    if (![questions, rating, days, stake].every(Number.isSafeInteger) ||
        questions < 1 || rating < 800 || days < 1 || days > 365 || stake < 1 || stake > dashboard.coins) return

    const challenge = makeChallenge(crypto.randomUUID(), `Solve ${questions} problems rated ${rating}+`, days, stake)
    challenge.participants = [{ user: demoUser, progress: 0, status: "active" }]
    setDashboard({ ...dashboard, own: [...dashboard.own, challenge], coins: dashboard.coins - stake })
    setCreating(false)
    setMessage("Challenge created with demo coins.")
  }

  return (
    <>
      <SplashCursor />
      <HomeDashboard
        totalCoins={dashboard?.coins ?? 0}
        viewerId={demoUser._id}
        yourChallenges={dashboard?.own ?? []}
        friendsChallenges={dashboard?.friends ?? []}
        loading={!dashboard}
        onJoin={join}
        progressLabel={challenge => {
          const participant = challenge.participants?.find(p => p.user._id === demoUser._id)
          return participant && <> · {participant.progress} solved</>
        }}
        notice={
          <>
            <span className="text-xs text-white/70">Demo Mode · {demoUser.name} · Sample data resets on refresh</span>
            <nav aria-label="Demo dashboard" className="flex flex-wrap gap-3 text-xs text-white/70">
              <a className="underline" href="#your-challenges">Your Challenges</a>
              <a className="underline" href="#friends-challenges">Friend&apos;s Challenges</a>
            </nav>
            <p role="status" className="text-xs text-white/70">{message}</p>
          </>
        }
        addChallenge={
          <Dialog open={creating} onOpenChange={setCreating}>
            <DialogTrigger asChild>
              <Button disabled={!dashboard} className="rounded-full bg-white text-black hover:bg-white/90">
                + Add a Challenge
              </Button>
            </DialogTrigger>
            <DialogContent className="border-white/20 bg-black/90 text-white">
              <DialogHeader>
                <DialogTitle>Add a Challenge</DialogTitle>
                <DialogDescription className="text-white/70">
                  Use sample coins to try creating a challenge. Available · ◆ {dashboard?.coins ?? 0}
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4" onSubmit={create}>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: "questions", label: "No. of Questions", min: 1, value: 5 },
                    { name: "rating", label: "Min Rating", min: 800, value: 800 },
                    { name: "days", label: "Days", min: 1, max: 365, value: 7 },
                    { name: "stake", label: "Demo Stake", min: 1, max: dashboard?.coins ?? 0, value: Math.min(100, dashboard?.coins ?? 0) },
                  ].map(({ name, label, min, max, value }) => (
                    <div key={name} className="space-y-2">
                      <Label htmlFor={`demo-${name}`}>{label}</Label>
                      <Input className="border-white/30 bg-white/10" id={`demo-${name}`} name={name}
                        type="number" min={min} max={max} defaultValue={value} required />
                    </div>
                  ))}
                </div>
                <Button type="submit" disabled={!dashboard?.coins} className="w-full rounded-full bg-white text-black hover:bg-white/90">
                  Create Challenge
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        }
        editor={<p className="text-xs text-white/70">Code execution is unavailable in Demo Mode.</p>}
      />
    </>
  )
}
