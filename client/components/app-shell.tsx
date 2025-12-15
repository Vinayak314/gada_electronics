"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Navigation } from "@/components/navigation"

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isAuthPage = pathname === "/"

  return (
    <>
      {/* Navigation already hides itself on auth pages, but we only need it when not on auth routes */}
      {!isAuthPage && <Navigation />}
      <main
        className={
          isAuthPage
            ? "min-h-screen transition-all duration-200"
            : "min-h-screen pl-[var(--sidebar-width,16rem)] transition-all duration-200"
        }
      >
        {children}
      </main>
    </>
  )
}
