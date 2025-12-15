"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-6 py-12">
          <Card className="border-white/20 bg-black/40 backdrop-blur-xl">
            <CardContent className="p-8">
              <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
                <Avatar className="h-32 w-32 border-4 border-white/20">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-2xl text-white">
                    JD
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left">
                  <div className="mb-2 flex flex-col items-center gap-2 md:flex-row md:items-center">
                    <h1 className="text-3xl font-bold text-white">Vinayak314</h1>
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                      CF: vinpai
                    </Badge>
                  </div>
                  <p className="mb-6 text-white/70">Competitive programming with friends</p>

                  <div className="mb-6 flex items-center gap-4">
                    <div className="rounded-xl bg-white/5 px-4 py-3 text-left">
                      <p className="text-xs text-white/60">Coins</p>
                      <p className="text-2xl font-bold text-white">◆ 1000</p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                  >
                    CF HeatMap
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
