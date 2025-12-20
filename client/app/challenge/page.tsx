"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { BackgroundGradientAnimation } from "@/components/background-gradient-animation"
import SplashCursor from "@/components/splash-cursor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AddChallengePage() {
  const { user, profile, refreshProfile } = useAuth()
  const router = useRouter()
  const [questions, setQuestions] = useState<number | string>(5)
  const [rating, setRating] = useState<number | string>(800)
  const [timeframe, setTimeframe] = useState<number | string>(7)
  const [stake, setStake] = useState<number | string>(100)
  const [loading, setLoading] = useState(false)

  const handleCreateChallenge = async () => {
    if (!user) return
    setLoading(true)
    if (Number(questions) < 1) {
      alert("Number of questions must be at least 1")
      setLoading(false)
      return
    }
    if (Number(rating) < 800) {
      alert("Minimum rating must be at least 800")
      setLoading(false)
      return
    }
    if (Number(timeframe) < 1) {
      alert("Timeframe must be at least 1 day")
      setLoading(false)
      return
    }

    try {
      const token = await user.getIdToken()
      const res = await fetch("http://localhost:5000/api/challenges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          questions,
          minRating: rating,
          timeframe,
          stake,
        }),
      })

      if (res.ok) {
        await refreshProfile()
        router.push("/home")
      } else {
        const data = await res.json()
        alert(data.message || "Failed to create challenge")
      }
    } catch (error) {
      console.error(error)
      alert("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <SplashCursor />
      <BackgroundGradientAnimation>
        <div className="min-h-screen bg-black/40 p-10 text-white">
          <div className="container mx-auto max-w-3xl">
            <Card className="border-white/20 bg-black/40 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-white">Add a Challenge</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="questions" className="text-white">
                    No. of Questions
                  </Label>
                  <Input
                    id="questions"
                    type="number"
                    min={1}
                    value={questions}
                    onChange={(e) => setQuestions(e.target.value === '' ? '' : parseInt(e.target.value))}
                    className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rated" className="text-white">
                    Min Rating
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="rated"
                      type="number"
                      min={800}
                      step={100}
                      value={rating}
                      onChange={(e) => setRating(e.target.value === '' ? '' : parseInt(e.target.value))}
                      className="w-32 border-white/30 bg-white/10 text-white placeholder:text-white/50"
                    />
                    <span className="text-sm text-white">within</span>
                    <div className="flex items-center gap-2">
                      <Input
                        id="timeframe"
                        type="number"
                        min={1}
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value === '' ? '' : parseInt(e.target.value))}
                        className="w-24 border-white/30 bg-white/10 text-white placeholder:text-white/50"
                      />
                      <span className="text-sm text-white">days</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stake" className="text-white">
                    At Stake
                  </Label>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-white">◆</span>
                      <Input
                        id="stake"
                        type="number"
                        value={stake}
                        onChange={(e) => setStake(e.target.value === '' ? '' : parseInt(e.target.value))}
                        className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className={Number(stake) > (profile?.tokens ?? 0) ? "text-red-400" : "text-white/60"}>
                        Available: ◆ {profile?.tokens ?? 0}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full rounded-full bg-white text-black hover:bg-white/90"
                  size="lg"
                  onClick={handleCreateChallenge}
                  disabled={loading || Number(stake) > (profile?.tokens ?? 0)}
                >
                  {loading ? "Creating..." : "Create Challenge"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </BackgroundGradientAnimation>
    </ProtectedRoute>
  )
}
