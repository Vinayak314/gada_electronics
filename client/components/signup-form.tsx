"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, User, Lock, ArrowRight, Loader2, CheckCircle2, Shield } from "lucide-react"

export function SignupForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  })
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength(0)
      return
    }

    let strength = 0
    if (formData.password.length >= 8) strength += 25
    if (formData.password.length >= 12) strength += 25
    if (/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password)) strength += 25
    if (/[0-9]/.test(formData.password)) strength += 15
    if (/[^a-zA-Z0-9]/.test(formData.password)) strength += 10

    setPasswordStrength(Math.min(strength, 100))
  }, [formData.password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log("Signup data:", formData)
    setLoading(false)
  }

  const getStrengthColor = () => {
    if (passwordStrength < 40) return "bg-destructive"
    if (passwordStrength < 70) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground text-balance">Create Account</h2>
        <p className="text-sm text-muted-foreground">Join the future of authentication</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-email" className="text-foreground">
            Email Address
          </Label>
          <div className={`relative transition-all duration-300 ${focusedField === "email" ? "scale-[1.02]" : ""}`}>
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="signup-email"
              type="email"
              placeholder="your@email.com"
              className="pl-10 bg-input border-border focus:border-primary focus:ring-primary/20 transition-all duration-300"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              required
            />
            {formData.email && formData.email.includes("@") && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500 animate-in fade-in zoom-in duration-300" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-username" className="text-foreground">
            Username
          </Label>
          <div className={`relative transition-all duration-300 ${focusedField === "username" ? "scale-[1.02]" : ""}`}>
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="signup-username"
              type="text"
              placeholder="username"
              className="pl-10 bg-input border-border focus:border-primary focus:ring-primary/20 transition-all duration-300"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              onFocus={() => setFocusedField("username")}
              onBlur={() => setFocusedField(null)}
              required
            />
            {formData.username && formData.username.length >= 3 && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500 animate-in fade-in zoom-in duration-300" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-password" className="text-foreground flex items-center gap-2">
            Password
            {passwordStrength > 70 && (
              <Shield className="h-3 w-3 text-green-500 animate-in fade-in zoom-in duration-300" />
            )}
          </Label>
          <div className={`relative transition-all duration-300 ${focusedField === "password" ? "scale-[1.02]" : ""}`}>
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="signup-password"
              type="password"
              placeholder="••••••••"
              className="pl-10 bg-input border-border focus:border-primary focus:ring-primary/20 transition-all duration-300"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              required
            />
          </div>
          {formData.password && (
            <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full ${getStrengthColor()} transition-all duration-500`}
                  style={{ width: `${passwordStrength}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {passwordStrength < 40 && "Weak password"}
                {passwordStrength >= 40 && passwordStrength < 70 && "Medium strength"}
                {passwordStrength >= 70 && "Strong password"}
              </p>
            </div>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/50"
        disabled={loading}
      >
        <span className="relative z-10 flex items-center justify-center">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            <>
              Create Account
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant="outline"
          className="border-border hover:bg-secondary hover:text-secondary-foreground bg-transparent"
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"
            />
          </svg>
          GitHub
        </Button>
        <Button
          type="button"
          variant="outline"
          className="border-border hover:bg-secondary hover:text-secondary-foreground bg-transparent"
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06c-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22l.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1C7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </Button>
      </div>
    </form>
  )
}
