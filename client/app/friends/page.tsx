"use client"

import CircularGallery from "@/components/circular-gallery"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function FriendsPage() {
  return (
    <div className="ml-64 min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
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

        <div className="relative" style={{ height: "600px" }}>
          <CircularGallery bend={3} textColor="#ffffff" borderRadius={0.05} scrollEase={0.02} />
        </div>

        <div className="mt-8 text-center text-white/70">
          <p>Scroll or drag to browse through friend suggestions</p>
        </div>
      </div>
    </div>
  )
}
