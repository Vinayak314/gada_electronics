"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { CodeforcesOnboarding } from "@/components/codeforces-onboarding"
import SplashCursor from "@/components/splash-cursor"

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isAuthPage = pathname === "/"

  return (
    <>
      {/* Navigation already hides itself on auth pages, but we only need it when not on auth routes */}
      {!isAuthPage && <Navigation />}
      {!isAuthPage && <SplashCursor />}
      <main
        className={
          isAuthPage
            ? "min-h-screen transition-all duration-200"
            : "min-h-screen pl-0 md:pl-[var(--sidebar-width,16rem)] transition-all duration-200"
        }
      >
        {!isAuthPage && <CodeforcesOnboarding />}
        {children}
      </main>
    </>
  )
}
