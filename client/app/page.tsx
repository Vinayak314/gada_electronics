"use client"

import { SignupForm } from "@/components/signup-form"
import { ShaderAnimation } from "@/components/shader-animation"


export default function AuthPage() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#1C1C1C]">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ShaderAnimation />
      </div>

      <div className="relative z-30 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-2 mb-8 group">
            <div className="w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <img src="/icon.svg" alt="GadaElectronics" className="w-10 h-10" />
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
