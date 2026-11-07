"use client"

import { useEffect, useState } from "react"
import { HomeDashboard, type Challenge } from "@/components/home-dashboard"

import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/protected-route"
import Link from "next/link"

import { useAuth } from "@/context/auth-context"
import { API_BASE_URL } from "@/lib/api-config"

export default function HomePage() {
  const { user, profile } = useAuth()
  const totalCoins = profile?.tokens ?? 0
  const [yourChallenges, setYourChallenges] = useState<Challenge[]>([])
  const [friendsChallenges, setFriendsChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)

  const fetchChallenges = async () => {
    if (!user) return
    try {
      const token = await user.getIdToken()

      // Fetch your challenges
      const resYour = await fetch(`${API_BASE_URL}/api/challenges`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Fetch friends' challenges
      const resFriends = await fetch(`${API_BASE_URL}/api/challenges/friends`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (resYour.ok && resFriends.ok) {
        const dataYour = await resYour.json()
        const dataFriends = await resFriends.json()
        setYourChallenges(dataYour.filter((c: Challenge) => c.status === 'active'))
        setFriendsChallenges(dataFriends.filter((c: Challenge) => c.status === 'active'))
      }
    } catch (error) {
      console.error("Failed to fetch challenges", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChallenges()
  }, [user])

  const handleJoin = async (challengeId: string) => {
    if (!user) return
    try {
      const token = await user.getIdToken()
      const res = await fetch(`${API_BASE_URL}/api/challenges/${challengeId}/join`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        fetchChallenges()
      } else {
        const data = await res.json()
        alert(data.message || "Failed to join challenge")
      }
    } catch (error) {
      console.error("Failed to join challenge", error)
    }
  }

  return (
    <ProtectedRoute>
      <HomeDashboard
        totalCoins={totalCoins}
        viewerId={profile?._id}
        yourChallenges={yourChallenges}
        friendsChallenges={friendsChallenges}
        loading={loading}
        onJoin={handleJoin}
        addChallenge={
          <Link href="/challenge">
            <Button className="rounded-full bg-white text-black hover:bg-white/90">
              + Add a Challenge
            </Button>
          </Link>
        }
        editor={
          <Link href="/editor">
            <Button variant="outline" className="rounded-full border-white/40 bg-white/10 text-white hover:bg-white/20">
              Editor &lt;/&gt;
            </Button>
          </Link>
        }
      />
    </ProtectedRoute>
  )
}
