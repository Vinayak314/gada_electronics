import type { ReactNode } from "react"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/context/auth-context"
import { AppShell } from "@/components/app-shell"

export default function ProductionLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppShell>{children}</AppShell>
      <Analytics />
    </AuthProvider>
  )
}
