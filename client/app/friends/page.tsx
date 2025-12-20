"use client"

import { useState, useEffect } from "react"
import { Search, UserPlus, Check, X, User as UserIcon, Clock } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { BackgroundGradientAnimation } from "@/components/background-gradient-animation"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth, UserProfile } from "@/context/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
interface FriendUser {
  _id: string
  name: string
  photoURL?: string
  codeforces?: {
    handle: string
    avatar?: string
    rating?: number
  }
}

export default function FriendsPage() {
  const { user, profile } = useAuth()
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [friends, setFriends] = useState<FriendUser[]>([])
  const [requests, setRequests] = useState<FriendUser[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFriendsAndRequests = async () => {
    if (!user) return
    try {
      const token = await user.getIdToken()
      const headers = { Authorization: `Bearer ${token}` }

      const [friendsRes, requestsRes] = await Promise.all([
        fetch("http://localhost:5000/api/friends", { headers }),
        fetch("http://localhost:5000/api/friends/requests", { headers })
      ])

      if (friendsRes.ok) {
        const data = await friendsRes.json()
        setFriends(data)
      }
      if (requestsRes.ok) {
        const data = await requestsRes.json()
        setRequests(data)
      }
    } catch (error) {
      console.error("Failed to fetch friends data", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFriendsAndRequests()
  }, [user])

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    if (val.length < 2) {
      setSearchResults([])
      return
    }

    if (!user) return

    try {
      const token = await user.getIdToken()
      const res = await fetch(`http://localhost:5000/api/users/search?query=${encodeURIComponent(val)}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setSearchResults(data)
      }
    } catch (error) {
      console.error("Search failed", error)
    }
  }

  const sendRequest = async (receiverId: string) => {
    if (!user) return
    try {
      const token = await user.getIdToken()
      const res = await fetch(`http://localhost:5000/api/friends/request/${receiverId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.ok) {
        // Optimistically update UI or re-search
        // For search results, we can mark this user as 'pending' locally to avoid refresh
        setSearchResults(prev => prev.map(u =>
          u._id === receiverId
            ? { ...u, friendRequests: { ...u.friendRequests, incoming: [...(u.friendRequests?.incoming || []), profile?._id] } }
            : u
        ))
      } else {
        const err = await res.json()
        console.error(err.message)
      }
    } catch (error) {
      console.error("Failed to send request", error)
    }
  }

  const acceptRequest = async (senderId: string) => {
    if (!user) return
    try {
      const token = await user.getIdToken()
      const res = await fetch(`http://localhost:5000/api/friends/accept/${senderId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.ok) {
        fetchFriendsAndRequests() // Refresh lists
      }
    } catch (error) {
      console.error("Failed to accept request", error)
    }
  }

  const rejectRequest = async (senderId: string) => {
    if (!user) return
    try {
      const token = await user.getIdToken()
      const res = await fetch(`http://localhost:5000/api/friends/reject/${senderId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.ok) {
        setRequests(prev => prev.filter(req => req._id !== senderId))
      }
    } catch (error) {
      console.error("Failed to reject request", error)
    }
  }

  // Helper to determine relationship status from search result
  const getStatus = (targetUser: any) => {
    if (!profile) return "unknown"

    // Check if already friends
    // targetUser.friends is a list of IDs (from our search projection) or updated locally
    // Actually, search projection for 'friends' returns IDs if not populated? 
    // Wait, User.find().select() returns the array. By default it's IDs unless populated.
    // In searchUsers controller, I selected "friends" but didn't populate it. So it is [ObjectId] (strings).

    if (targetUser.friends && targetUser.friends.includes(profile._id)) {
      return "friend"
    }

    // Check if I sent a request (My ID is in their incoming requests)
    if (targetUser.friendRequests?.incoming?.includes(profile._id)) {
      return "sent"
    }

    // Check if they sent me a request (Their ID is in MY incoming requests)
    // We can check our 'requests' state
    if (requests.some(req => req._id === targetUser._id)) {
      return "received"
    }

    return "none"
  }

  return (
    <ProtectedRoute>
      <BackgroundGradientAnimation>
        <div className="min-h-screen bg-black/40 p-10 text-white">
          <div className="container mx-auto px-6 py-8">
            <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <h1 className="text-4xl font-bold text-white">Add Friends</h1>
              <div className="relative w-full max-w-md">
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={query}
                  onChange={handleSearch}
                  className="w-full rounded-2xl border border-white/30 bg-white/20 px-5 py-3 pr-12 text-white placeholder-white/70 backdrop-blur-xl focus:ring-2 focus:ring-white/50 focus-visible:ring-white/50"
                />
                <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/70" />
              </div>
            </div>

            {/* Friend Requests Section */}
            {!query && requests.length > 0 && (
              <Card className="mb-8 border-white/20 bg-black/40 p-6 backdrop-blur-xl">
                <p className="mb-4 text-sm font-medium text-white/70">Friend Requests</p>
                <div className="space-y-3">
                  {requests.map((req) => (
                    <div
                      key={req._id}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white/10">
                          <AvatarImage src={req.photoURL} referrerPolicy="no-referrer" />
                          <AvatarFallback className="bg-indigo-500/20 text-indigo-300">
                            {(req.name || "?").charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold text-white">{req.name || "User"}</p>
                          <p className="text-xs text-white/60">{req.codeforces?.handle || "No handle"}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => acceptRequest(req._id)} className="rounded-full bg-white text-black hover:bg-white/90 border-none h-7 text-xs">
                          <Check className="mr-1 h-4 w-4" /> Accept
                        </Button>
                        <Button size="sm" onClick={() => rejectRequest(req._id)} className="rounded-full border border-white/40 bg-transparent text-white hover:bg-white/10 h-7 text-xs">
                          <X className="mr-1 h-4 w-4" /> Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Search Results / Friends List */}
            <Card className="border-white/20 bg-black/40 p-6 backdrop-blur-xl">
              <p className="mb-4 text-sm font-medium text-white/70">
                {query ? "Search Results" : "Your Friends"}
              </p>
              <div className="space-y-3">
                {query ? (
                  searchResults.length === 0 ? (
                    <p className="text-sm text-white/50">No users found.</p>
                  ) : (
                    searchResults.map((user) => {
                      const status = getStatus(user)
                      return (
                        <div
                          key={user._id}
                          className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-white/10">
                              <AvatarImage src={user.photoURL} referrerPolicy="no-referrer" />
                              <AvatarFallback className="bg-blue-500/20 text-blue-300">
                                {(user.name || "?").charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-semibold text-white">{user.name || "User"}</p>
                              <p className="text-xs text-white/60">{user.codeforces?.handle || "No handle"}</p>
                            </div>
                          </div>

                          {status === "friend" && (
                            <span className="flex items-center gap-1 text-sm text-green-400">
                              <Check className="h-4 w-4" /> Friends
                            </span>
                          )}
                          {status === "sent" && (
                            <span className="flex items-center gap-1 text-sm text-yellow-400">
                              <Clock className="h-4 w-4" /> Pending
                            </span>
                          )}
                          {status === "received" && (
                            <Button size="sm" onClick={() => acceptRequest(user._id)} className="rounded-full bg-white text-black hover:bg-white/90 h-8 px-4">
                              Accept Request
                            </Button>
                          )}
                          {status === "none" && (
                            <Button size="sm" onClick={() => sendRequest(user._id)} className="rounded-full bg-white text-black hover:bg-white/90 border-none">
                              <UserPlus className="mr-2 h-4 w-4" /> Add Friend
                            </Button>
                          )}
                        </div>
                      )
                    })
                  )
                ) : (
                  friends.length === 0 ? (
                    <p className="text-sm text-white/50">You haven't added any friends yet.</p>
                  ) : (
                    friends.map((friend) => (
                      <div
                        key={friend._id}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-white/10">
                            <AvatarImage src={friend.photoURL} referrerPolicy="no-referrer" />
                            <AvatarFallback className="bg-purple-500/20 text-purple-300">
                              {(friend.name || "?").charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-semibold text-white">{friend.name}</p>
                            <p className="text-xs text-white/60">{friend.codeforces?.handle}</p>
                          </div>
                        </div>
                        {/* <p className="text-xs text-white/60">Online</p>  -- We don't have realtime status yet */}
                      </div>
                    ))
                  )
                )}
              </div>
            </Card>
          </div>
        </div>
      </BackgroundGradientAnimation >
    </ProtectedRoute >
  )
}
