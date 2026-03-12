"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { SparklesCore } from "@/components/ui/sparkles";
import { Meteors } from "@/components/ui/Meteors";

export function BackgroundEffects() {
  const pathname = usePathname();

  // Landing page and onboarding have their own effects
  if (pathname === "/" || pathname === "/onboarding") return null;

  return (
    <>
      {/* Ambient gradient orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-brand/5 blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/5 blur-[130px] pointer-events-none z-0" />
      <div className="fixed top-[40%] right-[10%] w-[300px] h-[300px] rounded-full bg-brand/5 blur-[100px] pointer-events-none z-0" />

      {/* Background beams with dot pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <BackgroundBeams />
      </div>

      {/* Floating sparkles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <SparklesCore
          particleDensity={25}
          particleColor="#3b82f6"
          minSize={0.2}
          maxSize={0.8}
          speed={0.3}
        />
      </div>

      {/* Subtle meteors */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <Meteors number={8} />
      </div>
    </>
  );
}
