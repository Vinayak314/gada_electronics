"use client"

import { SignupForm } from "@/components/signup-form"
import { useEffect, useRef } from "react"

export default function AuthPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const interactiveRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const gradient1 = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 300,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }

    const gradient2 = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 350,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }

    const gradient3 = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 280,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
    }

    const gradient4 = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 320,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }

    const animate = () => {
      ctx.fillStyle = "#1C1C1C"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Update positions
        ;[gradient1, gradient2, gradient3, gradient4].forEach((grad) => {
          grad.x += grad.vx
          grad.y += grad.vy

          // Bounce off edges
          if (grad.x < 0 || grad.x > canvas.width) grad.vx *= -1
          if (grad.y < 0 || grad.y > canvas.height) grad.vy *= -1
        })

      // Draw gradients with color scheme
      const drawGradient = (x: number, y: number, radius: number, color: string) => {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
        gradient.addColorStop(0, color)
        gradient.addColorStop(1, "rgba(28, 28, 28, 0)")
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      ctx.globalCompositeOperation = "lighter"

      drawGradient(gradient1.x, gradient1.y, gradient1.radius, "rgba(77, 163, 255, 0.15)") // #4DA3FF
      drawGradient(gradient2.x, gradient2.y, gradient2.radius, "rgba(102, 204, 255, 0.12)") // #66CCFF
      drawGradient(gradient3.x, gradient3.y, gradient3.radius, "rgba(255, 179, 71, 0.1)") // #FFB347
      drawGradient(gradient4.x, gradient4.y, gradient4.radius, "rgba(255, 140, 66, 0.08)") // #FF8C42

      ctx.globalCompositeOperation = "source-over"

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
    }
  }, [])

  useEffect(() => {
    const canvas = interactiveRef.current
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

    const colors = [
      "rgba(77, 163, 255, 0.8)",
      "rgba(102, 204, 255, 0.8)",
      "rgba(255, 179, 71, 0.8)",
      "rgba(255, 140, 66, 0.8)",
    ]

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.isMoving = true

      clearTimeout(mouseTimeout)
      mouseTimeout = setTimeout(() => {
        mouse.isMoving = false
      }, 100)

      for (let i = 0; i < 2; i++) {
        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * 30 + 10
        const speed = Math.random() * 0.3 + 0.1

        particles.push({
          x: mouse.x + Math.cos(angle) * distance,
          y: mouse.y + Math.sin(angle) * distance,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          size: Math.random() * 2 + 1,
          opacity: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 0,
          maxLife: 120 + Math.random() * 80,
        })
      }

      if (particles.length > 100) {
        particles.splice(0, particles.length - 100)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      particles.forEach((particle, i) => {
        particles.forEach((otherParticle, j) => {
          if (i !== j) {
            const dx = particle.x - otherParticle.x
            const dy = particle.y - otherParticle.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 100) {
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              const opacity = (1 - distance / 100) * particle.opacity * otherParticle.opacity * 0.2
              ctx.strokeStyle = `rgba(102, 204, 255, ${opacity})`
              ctx.lineWidth = 1
              ctx.stroke()
            }
          }
        })
      })

      // Draw and update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i]

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color.replace(/[\d.]+\)$/g, `${particle.opacity})`)
        ctx.shadowBlur = 15
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
          if (dist > 0 && dist < 150) {
            particle.vx += (dx / dist) * 0.03
            particle.vy += (dy / dist) * 0.03
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
    <div className="min-h-screen w-full relative overflow-hidden bg-[#1C1C1C]">
      <canvas ref={canvasRef} className="absolute inset-0" />

      <canvas ref={interactiveRef} className="absolute inset-0 pointer-events-none" />

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
            <SignupForm />
          </div>

        </div>
      </div>
    </div>
  )
}
