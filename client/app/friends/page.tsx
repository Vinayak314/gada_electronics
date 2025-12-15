"use client"

import { Search } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

const friends = [
  { name: "Samaira", handle: "@samaira_cf", status: "Online" },
  { name: "Dhanya", handle: "@dhanya_cf", status: "Last seen 2h ago" },
  { name: "Rohan", handle: "@rohan_cf", status: "Competing in a challenge" },
]

export default function FriendsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-4xl font-bold text-white">Add Friends</h1>
            <div className="relative w-full max-w-md">
              <Input
                type="text"
                placeholder="Search..."
                className="w-full rounded-2xl border border-white/30 bg-white/20 px-5 py-3 pr-12 text-white placeholder-white/70 backdrop-blur-xl focus:ring-2 focus:ring-white/50 focus-visible:ring-white/50"
              />
              <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/70" />
            </div>
          </div>

          <Card className="border-white/20 bg-black/40 p-6 backdrop-blur-xl">
            <p className="mb-4 text-sm font-medium text-white/70">List of friends on this platform</p>
            <div className="space-y-3">
              {friends.map((friend) => (
                <div
                  key={friend.handle}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{friend.name}</p>
                    <p className="text-xs text-white/60">{friend.handle}</p>
                  </div>
                  <p className="text-xs text-white/60">{friend.status}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
