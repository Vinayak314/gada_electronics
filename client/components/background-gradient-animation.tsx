"use client"

import { useEffect, useRef } from "react"

interface GradientBlob {
  x: number
  y: number
  radius: number
  vx: number
  vy: number
  color: string
  opacity: number
}

export function BackgroundGradientAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const gradientBlobs: GradientBlob[] = [
      {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 350,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        color: "77, 163, 255",
        opacity: 0.18,
      },
      {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 400,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        color: "102, 204, 255",
        opacity: 0.15,
      },
      {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 320,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        color: "255, 179, 71",
        opacity: 0.12,
      },
      {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 370,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        color: "255, 140, 66",
        opacity: 0.1,
      },
      {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 280,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        color: "51, 153, 255",
        opacity: 0.08,
      },
    ]

    const animate = () => {
      ctx.fillStyle = "#1C1C1C"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update blob positions
      gradientBlobs.forEach((blob) => {
        blob.x += blob.vx
        blob.y += blob.vy

        // Smooth bounce with easing
        if (blob.x < -blob.radius / 2 || blob.x > canvas.width + blob.radius / 2) {
          blob.vx *= -1
          blob.x = Math.max(-blob.radius / 2, Math.min(canvas.width + blob.radius / 2, blob.x))
        }
        if (blob.y < -blob.radius / 2 || blob.y > canvas.height + blob.radius / 2) {
          blob.vy *= -1
          blob.y = Math.max(-blob.radius / 2, Math.min(canvas.height + blob.radius / 2, blob.y))
        }
      })

      ctx.globalCompositeOperation = "lighter"

      // Draw gradient blobs
      gradientBlobs.forEach((blob) => {
        const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius)
        gradient.addColorStop(0, `rgba(${blob.color}, ${blob.opacity})`)
        gradient.addColorStop(0.5, `rgba(${blob.color}, ${blob.opacity * 0.5})`)
        gradient.addColorStop(1, "rgba(28, 28, 28, 0)")
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })

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

  return <canvas ref={canvasRef} className="absolute inset-0" />
}
