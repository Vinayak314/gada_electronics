"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// This route is kept only to avoid broken links; it immediately redirects to the main sign-in page.
export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/")
  }, [router])

  return null
}
