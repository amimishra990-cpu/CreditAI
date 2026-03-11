"use client";

import { Settings } from "lucide-react";
import ShinyText from "@/components/ui/ShinyText";

export default function SettingsPage() {
  return (
    <div className="w-full flex justify-center pb-20 pt-4">
      <div className="w-full max-w-7xl flex flex-col gap-8 relative z-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <ShinyText text="Settings" disabled={false} speed={2} className="text-[#f8fafc]" />
          </h1>
          <p className="text-gray-400 text-sm">
            System configuration and user preferences.
          </p>
        </div>

        <div className="p-12 rounded-2xl bg-[#080d1a] border border-[#1e293b] flex flex-col items-center justify-center relative shadow-xl min-h-[400px]">
           <div className="bg-brand/20 p-4 rounded-full mb-6 border border-brand/30 shadow-[0_0_20px_rgba(22,58,92,0.4)]">
             <Settings className="w-12 h-12 text-brand" />
           </div>
           <h2 className="text-2xl font-bold mb-2 z-10">
             <ShinyText text="Global Configuration" disabled={false} speed={2.5} className="text-gray-200" />
           </h2>
           <p className="text-gray-400 max-w-md text-center z-10">
             Customize risk weightages, agent thresholds, and API keys.
           </p>
        </div>
      </div>
    </div>
  );
}
