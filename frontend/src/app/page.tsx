"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Layers, Zap, BarChart3, LockKeyhole, Activity } from "lucide-react";

// React Bits Components
import SplashCursor from "@/components/ui/SplashCursor";
import SplitText from "@/components/ui/SplitText";
import ShinyText from "@/components/ui/ShinyText";
import TiltedCard from "@/components/ui/TiltedCard";
import PixelCard from "@/components/ui/PixelCard";
import { Meteors } from "@/components/ui/Meteors";

export default function LandingPage() {
  const features = [
    {
      title: "Multi-Agent Analysis",
      description: "Financial, Document, and Fraud agents break down risk from artifacts instantly.",
      imageSrc: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
      icon: <Layers className="w-6 h-6" />,
    },
    {
      title: "Fraud Detection Engine",
      description: "Cross-checks GST mismatches and scans news for negative promoter press.",
      imageSrc: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200",
      icon: <ShieldCheck className="w-6 h-6" />,
    },
    {
      title: "Automated Decisioning",
      description: "Aggregates agent confidence scores to generate a highly accurate Credit Memo.",
      imageSrc: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
      icon: <Zap className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col items-center w-full overflow-hidden">
      
      {/* ===== HERO SECTION ===== */}
      <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#030712]">
        <div className="absolute inset-0 z-0">
          <SplashCursor />
        </div>
        
        {/* Glow behind text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/30 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto w-full">
          <div className="px-4 py-2 rounded-full border border-brand/50 bg-[#0f172a]/80 backdrop-blur-md mb-8 inline-flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-emerald-400 font-bold animate-pulse"></span>
             <ShinyText text="CreditAI OS is now live" disabled={false} speed={3} className="text-sm font-medium" />
          </div>

          <div className="w-full flex justify-center text-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-200 to-gray-500 mb-6 drop-shadow-2xl text-center leading-[1.1]">
               The Intelligence Layer<br />for Modern B2B Lending
            </h1>
          </div>
          
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mt-6 mb-12 font-medium">
            Credit infrastructure that scales with your roadmap. Automated credit decisioning built for scale. Complete borrower intelligence from day one.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pointer-events-auto">
             <Link href="/onboarding" className="px-8 py-4 rounded-xl bg-brand hover:bg-blue-600 text-white font-bold transition-all shadow-[0_0_30px_rgba(22,58,92,0.8)] flex items-center gap-2 group border border-blue-400/30">
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </Link>
             <Link href="/dashboard" className="px-8 py-4 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold transition-all border border-[#1e293b] hover:border-gray-500 flex items-center gap-2">
                Launch Dashboard
             </Link>
          </div>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-[#030712] to-transparent pointer-events-none z-10"></div>
      </div>

      {/* ===== HOW IT WORKS / AGENTS SECTION ===== */}
      <div className="relative w-full py-32 px-4 md:px-8 bg-[#030712] z-20 border-t border-[#1e293b]/50">
         <div className="max-w-[1400px] mx-auto flex flex-col items-center">
            
            <div className="text-center mb-32 z-30 relative">
               <ShinyText text="Built for modern dev teams" disabled={false} speed={3} className="text-3xl md:text-5xl font-bold mb-6" />
               <p className="text-zinc-400 text-lg max-w-2xl mx-auto mt-4">
                 Our proprietary agents handle data extraction, network mapping, and financial modelling to deliver 95%+ confidence approvals.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full place-items-center mt-8">
               {features.map((feature, idx) => (
                 <div key={idx} className="w-full max-w-[380px] bg-[#0f172a]/50 border border-[#1e293b] rounded-[24px] overflow-hidden flex flex-col shadow-2xl">
                   <div className="w-full h-[250px] relative pointer-events-auto">
                      <TiltedCard
                         imageSrc={feature.imageSrc}
                         altText={feature.title}
                         containerHeight="250px"
                         containerWidth="100%"
                         imageHeight="100%"
                         imageWidth="100%"
                         rotateAmplitude={12}
                         scaleOnHover={1.05}
                         showTooltip={false}
                         displayOverlayContent={false}
                      />
                   </div>
                   <div className="p-8 flex flex-col flex-1 bg-gradient-to-b from-transparent to-[#030712]/80">
                      <div className="flex items-center gap-3 mb-4">
                         <div className="p-2 bg-brand/20 rounded-lg text-emerald-400">
                            {feature.icon}
                         </div>
                         <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                      </div>
                      <p className="text-zinc-400 text-base leading-relaxed">{feature.description}</p>
                   </div>
                 </div>
               ))}
            </div>

         </div>
      </div>

      {/* ===== SYSTEM ARCHITECTURE ===== */}
      <div className="realtive w-full py-24 bg-[#0a101f] relative overflow-hidden flex flex-col items-center border-y border-[#1e293b]/80">
          <Meteors number={15} className="z-0 opacity-50" />
          
          <div className="max-w-6xl w-full px-6 flex flex-col md:flex-row items-center gap-12 relative z-10">
             <div className="w-full md:w-1/2 flex flex-col">
                <ShinyText text="Empowering Decisions" className="text-brand font-bold tracking-wider uppercase mb-2" />
                <h3 className="text-4xl font-bold text-white mb-6 leading-tight">Multi-Agent Workflow</h3>
                <p className="text-zinc-400 text-lg mb-8">
                  Watch CreditAI ingest thousands of data points simultaneously. The Financial Analyzer reads statements, while the Document Passer checks GST compliance—cross-validating insights dynamically.
                </p>
                <ul className="space-y-4 text-zinc-300">
                  <li className="flex items-center gap-3"><CheckCircleIcon /> Approvals boosted by 30%</li>
                  <li className="flex items-center gap-3"><CheckCircleIcon /> Time-to-decision drops to seconds</li>
                  <li className="flex items-center gap-3"><CheckCircleIcon /> Highly explainable reasoning</li>
                </ul>
             </div>
             
             {/* Deep Tech Pixel Card rendering */}
             <div className="w-full md:w-1/2 h-[400px]">
                <PixelCard variant="blue" gap={10} speed={40} className="w-[400px] max-w-full">
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-black/40 backdrop-blur-sm">
                    <Activity className="w-16 h-16 text-emerald-400 mb-4 animate-pulse" />
                    <h3 className="text-2xl font-bold text-white mb-2">Live Analysis</h3>
                    <p className="text-emerald-400/80 text-sm">Hover to reveal computation matrix</p>
                  </div>
                </PixelCard>
             </div>
          </div>
      </div>

      {/* ===== BOTTOM CTA ===== */}
      <div className="relative w-full py-32 px-4 md:px-8 bg-black z-20 flex flex-col items-center justify-center text-center">
         <div className="absolute inset-0 bg-brand/5 max-w-4xl mx-auto blur-[120px] rounded-full pointer-events-none"></div>
         
         <div className="relative z-10 max-w-3xl border border-[#1e293b]/50 bg-[#0f172a]/30 backdrop-blur-xl p-12 md:p-16 rounded-[32px] shadow-2xl">
            <h2 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-8 leading-[1.2]">
               Launch lending faster,<br />scale smarter.
            </h2>
            <p className="text-xl text-zinc-400 mb-10">
               Join the fintechs, banks, and startups currently running their credit infrastructure on CreditAI.
            </p>
            <Link href="/onboarding" className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
               Start Exploring Live UI
            </Link>
         </div>
      </div>

    </div>
  );
}

function CheckCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 mr-2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}
