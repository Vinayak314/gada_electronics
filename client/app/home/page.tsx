"use client"

import { BackgroundGradientAnimation } from "@/components/background-gradient-animation"
import CardSwap, { Card } from "@/components/card-swap"

export default function HomePage() {
  const challenges = [
    {
      title: "Code 5 Problems in a week",
      difficulty: "Easy",
      points: 100,
      badge: "🏆",
      description: "Complete 5 coding challenges within 7 days",
      participants: 234,
      timeLimit: "1 week",
    },
    {
      title: "Binary Search Tree",
      difficulty: "Medium",
      points: 250,
      badge: "🌳",
      description: "Implement BST insertion and traversal",
      participants: 189,
      timeLimit: "45 min",
    },
    {
      title: "Dynamic Programming",
      difficulty: "Hard",
      points: 500,
      badge: "💎",
      description: "Solve the knapsack problem using DP",
      participants: 97,
      timeLimit: "60 min",
    },
    {
      title: "Graph Traversal",
      difficulty: "Medium",
      points: 300,
      badge: "🗺️",
      description: "Implement DFS and BFS algorithms",
      participants: 156,
      timeLimit: "50 min",
    },
    {
      title: "Linked List Reversal",
      difficulty: "Easy",
      points: 150,
      badge: "🔗",
      description: "Reverse a singly linked list in-place",
      participants: 312,
      timeLimit: "20 min",
    },
    {
      title: "Merge Sort Implementation",
      difficulty: "Medium",
      points: 280,
      badge: "🔀",
      description: "Implement merge sort algorithm",
      participants: 203,
      timeLimit: "40 min",
    },
  ]

  return (
    <BackgroundGradientAnimation>
      <div className="ml-64 flex min-h-screen items-center justify-between p-8">
        <div className="z-10 max-w-2xl">
          <h1 className="mb-4 text-6xl font-bold text-white">
            Show what's been
            <br />
            done and have it
            <br />
            get judged
          </h1>
          <p className="text-xl text-white/70">Challenge yourself and compete with friends</p>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold text-white">127</div>
              <div className="text-sm text-white/60">Active Challenges</div>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold text-white">2.4k</div>
              <div className="text-sm text-white/60">Total Users</div>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold text-white">8.9k</div>
              <div className="text-sm text-white/60">Submissions</div>
            </div>
          </div>
        </div>

        <CardSwap width={400} height={500} cardDistance={40} verticalDistance={50} delay={4000} pauseOnHover={true}>
          {challenges.map((challenge, index) => (
            <Card key={index} className="flex flex-col justify-between p-8">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-4xl">{challenge.badge}</span>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      challenge.difficulty === "Easy"
                        ? "bg-green-500/20 text-green-400"
                        : challenge.difficulty === "Medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {challenge.difficulty}
                  </span>
                </div>
                <h3 className="mb-2 text-2xl font-bold text-white">{challenge.title}</h3>
                <p className="mb-4 text-sm text-white/60">{challenge.description}</p>

                <div className="flex items-center gap-4 text-sm text-white/50">
                  <div className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    {challenge.participants}
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {challenge.timeLimit}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-3xl font-bold text-blue-400">{challenge.points}</span>
                <span className="text-sm text-white/50">points</span>
              </div>
            </Card>
          ))}
        </CardSwap>
      </div>
    </BackgroundGradientAnimation>
  )
}
