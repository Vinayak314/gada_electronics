"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { signOut } from "firebase/auth"
import { Home, Users, User, LogOut, Menu, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { auth } from "@/firebase"
import { useAuth } from "@/context/auth-context"

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/friends", label: "Add Friends", icon: Users },
  { href: "/profile", label: "Profile", icon: User },
]



export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { profile } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty(
        "--sidebar-width",
        collapsed ? "5rem" : "16rem",
      )
    }
  }, [collapsed])

  // Don't show navigation on signup (landing) page
  if (pathname === "/") {
    return null
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-20 flex h-screen flex-col border-r border-border bg-card/50 p-4 backdrop-blur-xl transition-all duration-200",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="mb-6 flex items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/50">
            <svg className="h-6 w-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          {!collapsed && <h1 className="text-lg font-bold text-foreground">GadaElectronics</h1>}
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center px-0",
              )}
            >
              <Icon className="h-5 w-5" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {!collapsed && (
        <div className="mb-3 space-y-2">
          {profile?.name && (
            <div className="px-1">
              <div className="text-xs text-muted-foreground">Signed in as</div>
              <div className="font-medium truncate" title={profile.name}>{profile.name}</div>
            </div>
          )}
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground">
            <span className="font-medium">Total coins</span>
            <span className="flex items-center gap-1 font-semibold">
              <span>◆</span>
              <span>{profile?.tokens ?? 0}</span>
            </span>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={async () => {
          await signOut(auth)
          router.push("/")
        }}
        className={cn(
          "mt-auto flex items-center gap-3 rounded-lg px-4 py-3 text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-accent-foreground",
          collapsed && "justify-center px-0",
        )}
      >
        <LogOut className="h-5 w-5" />
        {!collapsed && <span className="font-medium">Logout</span>}
      </button>

      <button
        type="button"
        onClick={() => setCollapsed((prev) => !prev)}
        className="absolute right-[-12px] top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground shadow-md hover:bg-accent hover:text-accent-foreground"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  )
}
