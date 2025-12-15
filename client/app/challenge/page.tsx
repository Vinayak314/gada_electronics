"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export default function AddChallengePage() {
  const [questions, setQuestions] = useState(5)
  const [timeLimit, setTimeLimit] = useState(3600)

  return (
    <div className="ml-64 min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-6">
      <div className="container mx-auto max-w-3xl">
        <Card className="border-white/20 bg-black/40 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white">Add a Challenge</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="questions" className="text-white">
                Number of Questions: {questions}
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
              <Label htmlFor="badge" className="text-white">
                Badge
              </Label>
              <Select>
                <SelectTrigger
                  id="badge"
                  className="border-white/30 bg-white/10 text-white focus:ring-white/50 [&>span]:text-white"
                >
                  <SelectValue placeholder="Select badge level" />
                </SelectTrigger>
                <SelectContent className="border-white/20 bg-black/90 text-white">
                  <SelectItem value="bronze">Bronze</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label htmlFor="slider" className="text-white">
                Number of Sticker: 50-90
              </Label>
              <Slider
                id="slider"
                defaultValue={[70]}
                max={90}
                min={50}
                step={1}
                className="[&_[role=slider]]:border-white/50 [&_[role=slider]]:bg-white"
              />
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
          After clicking "Create Challenge", you'll be redirected to setup individual questions
        </div>
      </div>
    </div>
  )
}
