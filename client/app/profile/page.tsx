"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { BackgroundGradientAnimation } from "@/components/background-gradient-animation"
import SplashCursor from "@/components/splash-cursor"
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

  const handleLink = async () => {
    if (!cfHandle.trim()) return;

    setIsLinking(true);
    setError("");
    try {
      const token = await user?.getIdToken();
      const res = await fetch('http://localhost:5000/api/users/codeforces/link', {
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
      <SplashCursor />
      <BackgroundGradientAnimation>
        <div className="min-h-screen bg-black/40 p-10 text-white">
          <div className="container mx-auto px-6 py-12">
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

                    <div className="mb-6 flex items-center gap-4">
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

                    {profile?.codeforces?.handle ? (
                      <div className="mt-6">
                        <p className="mb-2 text-sm text-white/60">Submission Activity</p>
                        <CodeforcesHeatmap handle={profile.codeforces.handle} />
                      </div>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </BackgroundGradientAnimation>
    </ProtectedRoute>
  )
}
