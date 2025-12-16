"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AddChallengePage() {
  const { profile } = useAuth()
  const [questions, setQuestions] = useState(5)
  const [rating, setRating] = useState("800")
  const [timeframe, setTimeframe] = useState("week")
  const [stake, setStake] = useState(100)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-6">
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
                  value={questions}
                  onChange={(e) => setQuestions(Number.parseInt(e.target.value) || 0)}
                  className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rated" className="text-white">
                  Rated
                </Label>
                <div className="flex items-center gap-3">
                  <Select value={rating} onValueChange={setRating}>
                    <SelectTrigger
                      id="rated"
                      className="w-28 border-white/30 bg-white/10 text-white focus:ring-white/50 [&>span]:text-white"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-white/20 bg-black/90 text-white">
                      <SelectItem value="800">800</SelectItem>
                      <SelectItem value="1000">1000</SelectItem>
                      <SelectItem value="1200">1200</SelectItem>
                      <SelectItem value="1400">1400</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-white">in</span>
                  <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger className="w-32 border-white/30 bg-white/10 text-white [&>span]:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-white/20 bg-black/90 text-white">
                      <SelectItem value="week">a week</SelectItem>
                      <SelectItem value="2weeks">2 weeks</SelectItem>
                      <SelectItem value="month">a month</SelectItem>
                    </SelectContent>
                  </Select>
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
                      onChange={(e) => setStake(Number.parseInt(e.target.value) || 0)}
                      className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className={stake > (profile?.tokens ?? 0) ? "text-red-400" : "text-white/60"}>
                      Available: ◆ {profile?.tokens ?? 0}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                size="lg"
              >
                Create Challenge
              </Button>
            </CardContent>
          </Card>

          <div className="mt-6 text-center text-sm text-white/70">
            NOTE: If you put 100 here and have 5 friends, each friend will get 20.
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
