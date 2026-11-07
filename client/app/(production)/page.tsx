"use client"

import { SignupForm } from "@/components/signup-form"
import { ShaderAnimation } from "@/components/shader-animation"


import FuzzyText from "@/components/fuzzy-text"

export default function AuthPage() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#1C1C1C]">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ShaderAnimation />
      </div>

      <div className="relative z-30 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center mb-8 group">
            <img src="/feet.png" alt="FeetCode" className="w-36 h-20 object-contain" />
            <FuzzyText
              fontSize={80}
              fontWeight={900}
              fontFamily="inherit"
              color="#fafafa"
              className="-ml-10"
              enableHover={true}
            >
              FeetCode
            </FuzzyText>
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
