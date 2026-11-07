import { NextResponse, type NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const response = NextResponse.next()
  const origin = process.env.PORTFOLIO_ORIGIN
  const isDemo = request.nextUrl.pathname === "/demo"
  const allowedOrigin = isDemo && origin && URL.canParse(origin) ? new URL(origin) : null

  if (allowedOrigin?.protocol === "https:" && allowedOrigin.origin === origin && !allowedOrigin.hostname.includes("*")) {
    response.headers.set("Content-Security-Policy", `frame-ancestors ${origin}`)
  } else {
    response.headers.set("Content-Security-Policy", "frame-ancestors 'none'")
    response.headers.set("X-Frame-Options", "DENY")
  }
  return response
}

// Next config header matching is case-insensitive. Check these paths exactly in the proxy.
export const config = { matcher: "/:path([dD][eE][mM][oO])" }
