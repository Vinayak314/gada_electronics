"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SignupForm } from "@/components/signup-form"
import { LoginForm } from "@/components/login-form"
import { useEffect, useRef } from "react"

export default function AuthPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
      color: string
      life: number
      maxLife: number
    }> = []

    const mouse = { x: 0, y: 0, isMoving: false }
    let mouseTimeout: NodeJS.Timeout

    const neonColors = [
      "rgba(0, 255, 255, 0.8)", // Cyan
      "rgba(255, 0, 255, 0.8)", // Magenta
      "rgba(57, 255, 20, 0.8)", // Neon green
      "rgba(255, 0, 110, 0.8)", // Hot pink
      "rgba(0, 150, 255, 0.8)", // Electric blue
      "rgba(255, 215, 0, 0.8)", // Neon yellow
    ]

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.isMoving = true

      clearTimeout(mouseTimeout)
      mouseTimeout = setTimeout(() => {
        mouse.isMoving = false
      }, 100)

      for (let i = 0; i < 1; i++) {
        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * 30 + 10
        const speed = Math.random() * 0.3 + 0.1

        particles.push({
          x: mouse.x + Math.cos(angle) * distance,
          y: mouse.y + Math.sin(angle) * distance,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          size: Math.random() * 2 + 1, // Reduced particle size
          opacity: 1,
          color: neonColors[Math.floor(Math.random() * neonColors.length)],
          life: 0,
          maxLife: 120 + Math.random() * 80, // Increased life span for smoother fade
        })
      }

      if (particles.length > 80) {
        particles.splice(0, particles.length - 80)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)

    const animate = () => {
      ctx.fillStyle = "rgba(15, 15, 20, 0.15)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, i) => {
        particles.forEach((otherParticle, j) => {
          if (i !== j) {
            const dx = particle.x - otherParticle.x
            const dy = particle.y - otherParticle.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 80) {
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              const opacity = (1 - distance / 80) * particle.opacity * otherParticle.opacity * 0.15
              ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        })
      })

      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i]

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color.replace(/[\d.]+\)$/g, `${particle.opacity})`)
        ctx.fill()

        ctx.shadowBlur = 10
        ctx.shadowColor = particle.color
        ctx.fill()
        ctx.shadowBlur = 0

        particle.x += particle.vx
        particle.y += particle.vy
        particle.life++

        particle.opacity = Math.max(0, 1 - particle.life / particle.maxLife)

        if (mouse.isMoving) {
          const dx = mouse.x - particle.x
          const dy = mouse.y - particle.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist > 0) {
            particle.vx += (dx / dist) * 0.02
            particle.vy += (dy / dist) * 0.02
          }
        }

        particle.vx *= 0.98
        particle.vy *= 0.98

        if (particle.life >= particle.maxLife) {
          particles.splice(i, 1)
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      clearTimeout(mouseTimeout)
    }
  }, [])

  return (
    <div className="min-h-screen w-full grid-pattern relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse [animation-delay:1s]" />

      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-2 mb-8 group">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/50">
              <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground">GadaElectronics</h1>
          </div>

          <div className="backdrop-blur-xl bg-card/50 border border-border rounded-2xl p-8 shadow-2xl holographic-border relative overflow-hidden">
            <div className="shimmer-overlay" />

            <Tabs defaultValue="login" className="w-full relative z-10">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <LoginForm />
              </TabsContent>

              <TabsContent value="signup">
                <SignupForm />
              </TabsContent>
            </Tabs>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Secure authentication powered by next-gen technology
          </p>
        </div>
      </div>
    </div>
  )
}
