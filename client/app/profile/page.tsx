"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code2, Trophy, Users } from "lucide-react"

export default function ProfilePage() {
  const stats = [
    { label: "Challenges Solved", value: 127, icon: Code2 },
    { label: "Points Earned", value: 15420, icon: Trophy },
    { label: "Friends", value: 42, icon: Users },
  ]

  return (
    <div className="ml-64 min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
                  <h1 className="text-3xl font-bold text-white">vinayd8596</h1>
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                    Pro Member
                  </Badge>
                </div>
                <p className="mb-4 text-white/70">100+ repo</p>

                <div className="mb-6 grid grid-cols-3 gap-4">
                  {stats.map((stat) => (
                    <div key={stat.label} className="flex flex-col items-center rounded-lg bg-white/5 p-4">
                      <stat.icon className="mb-2 h-6 w-6 text-white/70" />
                      <div className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</div>
                      <div className="text-xs text-white/50">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                >
                  CP Head Map
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card className="border-white/20 bg-black/40 backdrop-blur-xl">
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-bold text-white">Recent Activity</h2>
              <div className="space-y-3">
                {[
                  { title: "Solved Binary Search Tree", time: "2 hours ago", points: 250 },
                  { title: "Completed Graph Traversal", time: "5 hours ago", points: 300 },
                  { title: "Solved Two Sum Problem", time: "1 day ago", points: 100 },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                    <div>
                      <div className="font-medium text-white">{activity.title}</div>
                      <div className="text-sm text-white/50">{activity.time}</div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">+{activity.points}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/20 bg-black/40 backdrop-blur-xl">
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-bold text-white">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {["Python", "JavaScript", "TypeScript", "React", "Node.js", "C++", "Java", "Algorithms"].map(
                  (skill) => (
                    <Badge key={skill} variant="secondary" className="bg-blue-500/20 text-blue-300">
                      {skill}
                    </Badge>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
