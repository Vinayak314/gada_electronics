import type React from "react"
import type { Metadata } from "next"
import { VT323 } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/context/auth-context"
import { AppShell } from "@/components/app-shell"
import "./globals.css"

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
})

export const metadata: Metadata = {
  title: "FeetCode",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${vt323.variable} font-sans`} suppressHydrationWarning>
        <AuthProvider>
          <AppShell>{children}</AppShell>
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
