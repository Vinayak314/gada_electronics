"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, User, PlusCircle, Code, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/friends", label: "Add Friends", icon: Users },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/challenge", label: "Add Challenge", icon: PlusCircle },
  { href: "/editor", label: "Code Editor", icon: Code },
]

export function Navigation() {
  const pathname = usePathname()

  // Don't show navigation on signup/login pages
  if (pathname === "/" || pathname === "/login") {
    return null
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card/50 backdrop-blur-xl border-r border-border p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/50">
          <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-lg font-bold text-foreground">GadaElectronics</h1>
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
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <Link
        href="/"
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200 mt-auto"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Logout</span>
      </Link>
    </aside>
  )
}
