"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BackgroundGradientAnimation } from "@/components/background-gradient-animation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Login attempt with:", { email, password })
  }

  return (
    <BackgroundGradientAnimation>
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md border-white/20 bg-black/40 backdrop-blur-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-white">Login</CardTitle>
            <CardDescription className="text-white/70">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-white/30 bg-white/10 text-white placeholder:text-white/50 focus:border-white/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-white/30 bg-white/10 text-white placeholder:text-white/50 focus:border-white/50"
                />
              </div>
              <Button type="submit" className="w-full bg-white text-black hover:bg-white/90">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </BackgroundGradientAnimation>
  )
}
