"use client";

import { Meteors } from "@/components/ui/Meteors";
import ShinyText from "@/components/ui/ShinyText";
import TiltedCard from "@/components/ui/TiltedCard";
import { BrainCircuit, FileText, ShieldAlert, Cpu } from "lucide-react";

const agents = [
  { id: 1, name: "Financial Agent", icon: Cpu, status: "ACTIVE - 98% CONF", bgImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600" },
  { id: 2, name: "Document Agent", icon: FileText, status: "ACTIVE - 95% CONF", bgImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600" },
  { id: 3, name: "Fraud Agent", icon: ShieldAlert, status: "ANALYZING...", bgImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600" },
  { id: 4, name: "Risk Agent", icon: BrainCircuit, status: "STANDBY", bgImage: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=600" },
];

export default function AgentAnalysisPage() {
  return (
    <div className="w-full flex justify-center pb-20 pt-4">
      <div className="w-full max-w-7xl flex flex-col gap-8 relative z-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <ShinyText text="Multi-Agent Analysis" disabled={false} speed={2} className="text-[#f8fafc]" />
          </h1>
          <p className="text-gray-400 text-sm">
            Deep dive into individual AI agent network nodes and confidence metrics.
          </p>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
           {agents.map(agent => (
               <div key={agent.id} className="w-full max-w-[300px] aspect-[4/5] relative mx-auto">
                 <TiltedCard 
                    imageSrc={agent.bgImage}
                    altText={agent.name}
                    containerHeight="100%"
                    containerWidth="100%"
                    imageHeight="100%"
                    imageWidth="100%"
                    rotateAmplitude={12}
                    scaleOnHover={1.05}
                    showTooltip={false}
                    displayOverlayContent={true}
                    overlayContent={
                       <div className="absolute inset-0 p-6 flex flex-col justify-between bg-black/50 hover:bg-black/20 transition-colors rounded-[15px] pointer-events-none">
                          <div className="p-3 bg-brand/40 rounded-xl w-fit border border-brand/50 backdrop-blur-sm">
                             <agent.icon className="w-6 h-6 text-emerald-400" />
                          </div>
                          <div>
                             <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">{agent.name}</h3>
                             <p className="text-emerald-400 font-mono text-xs drop-shadow-md bg-black/40 inline-block px-2 py-1 rounded whitespace-nowrap">{agent.status}</p>
                          </div>
                       </div>
                    }
                 />
               </div>
           ))}
        </div>

        {/* Advanced Data terminal view */}
        <div className="p-8 rounded-2xl bg-[#0f172a]/80 border border-[#1e293b] relative overflow-hidden shadow-xl mt-8">
           <Meteors number={25} />
           <div className="relative z-10 flex flex-col gap-4">
              <h2 className="text-xl font-bold border-b border-[#1e293b] pb-4 flex items-center gap-3">
                <BrainCircuit className="w-5 h-5 text-emerald-400" />
                <ShinyText text="Live Neural Stream" disabled={false} speed={2.5} className="text-gray-200" />
              </h2>
              <div className="font-mono text-xs md:text-sm text-emerald-400/90 space-y-2 h-48 overflow-y-auto mt-4">
                 <p>[SYS] Initializing Financial Agent node...</p>
                 <p>[SYS] Cross-referencing GST portal for entity 0x9f5a...</p>
                 <p className="text-emerald-300">[OK] Document Agent extracted 23 key-value pairs from BS_FY23.pdf</p>
                 <p className="text-orange-400">[WARN] Fraud Agent detected anomalous network node expanding query depth.</p>
                 <p className="text-emerald-300">[OK] Risk Agent aggregating scores. Confidence interval: 95.4%</p>
                 <p className="text-emerald-300">[OK] Multi-agent consensus reached. Writing payload to database.</p>
                 <p className="animate-pulse mt-4 text-emerald-500">_</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
