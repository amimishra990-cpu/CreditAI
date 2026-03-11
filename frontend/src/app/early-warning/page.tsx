"use client";

import { Meteors } from "@/components/ui/Meteors";
import { AlertTriangle } from "lucide-react";
import ShinyText from "@/components/ui/ShinyText";

export default function EarlyWarningPage() {
  return (
    <div className="w-full flex justify-center pb-20 pt-4">
      <div className="w-full max-w-7xl flex flex-col gap-8 relative z-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <ShinyText text="Early Warning Hub" disabled={false} speed={2} className="text-[#f8fafc]" />
          </h1>
          <p className="text-gray-400 text-sm">
            Monitored anomalies and proactive risk alerts across the portfolio.
          </p>
        </div>

        <div className="p-12 rounded-2xl bg-[#080d1a] border border-[#1e293b] flex flex-col items-center justify-center relative overflow-hidden shadow-xl min-h-[400px]">
           <Meteors number={15} />
           <div className="bg-red-500/10 p-4 rounded-full mb-6 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
             <AlertTriangle className="w-12 h-12 text-red-500" />
           </div>
           <h2 className="text-2xl font-bold mb-2 z-10">
             <ShinyText text="Proactive Monitoring" disabled={false} speed={2.5} className="text-gray-200" />
           </h2>
           <p className="text-gray-400 max-w-md text-center z-10">
             Our ML models continuously scan for cashflow mismatches, negative market news, and network litigation to surface early warnings.
           </p>
        </div>
      </div>
    </div>
  );
}
