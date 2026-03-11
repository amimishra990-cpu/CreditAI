"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit, FileText, ShieldAlert, Cpu, TrendingUp,
  Loader2, CheckCircle, ArrowRight, Play, ChevronDown, ChevronUp,
  Search
} from "lucide-react";
import ShinyText from "@/components/ui/ShinyText";
import { Meteors } from "@/components/ui/Meteors";

interface AgentResult {
  agent: string;
  status: string;
  data?: any;
  error?: string;
}

const agentMeta = [
  { key: "documentAnalysis", name: "Document Analysis", icon: FileText, color: "text-blue-400", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/30" },
  { key: "financialAnalysis", name: "Financial Analysis", icon: TrendingUp, color: "text-emerald-400", bgColor: "bg-emerald-500/10", borderColor: "border-emerald-500/30" },
  { key: "researchAnalysis", name: "Research Agent", icon: Search, color: "text-purple-400", bgColor: "bg-purple-500/10", borderColor: "border-purple-500/30" },
  { key: "promoterAnalysis", name: "Promoter Analysis", icon: ShieldAlert, color: "text-orange-400", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30" },
];

export default function AgentAnalysisPage() {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<Record<string, AgentResult> | null>(null);
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [runningAgents, setRunningAgents] = useState<Set<string>>(new Set());

  const workspaceId = typeof window !== "undefined" ? localStorage.getItem("creditai_workspace") : null;

  const handleRunAnalysis = async () => {
    setRunning(true);
    setRunningAgents(new Set(agentMeta.map((a) => a.key)));
    setResults(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId }),
      });
      const data = await res.json();
      if (data.success) {
        setResults(data.agentResults);
      }
    } catch (err) {
      console.error(err);
    }
    setRunningAgents(new Set());
    setRunning(false);
  };

  const getAgentStatus = (key: string) => {
    if (runningAgents.has(key)) return "running";
    if (results && results[key as keyof typeof results]) {
      const r = results[key as keyof typeof results] as AgentResult;
      return r.status === "complete" ? "complete" : "error";
    }
    return "idle";
  };

  return (
    <div className="w-full flex justify-center pb-20 pt-4">
      <div className="w-full max-w-7xl flex flex-col gap-8 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              <ShinyText text="Multi-Agent Analysis" disabled={false} speed={2} className="text-[#f8fafc]" />
            </h1>
            <p className="text-gray-400 text-sm">
              Run 4 independent AI agents in parallel to analyze the entity from multiple perspectives.
            </p>
          </div>
          <div className="flex gap-3">
            {!running && !results && (
              <button
                onClick={handleRunAnalysis}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-xl transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)]"
              >
                <Play className="w-4 h-4" /> Run All Agents
              </button>
            )}
            {results && (
              <button
                onClick={() => router.push("/orchestrator")}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-xl transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)]"
              >
                Continue to Orchestrator <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agentMeta.map((agent, idx) => {
            const status = getAgentStatus(agent.key);
            const result = results?.[agent.key as keyof typeof results] as AgentResult | undefined;
            const Icon = agent.icon;

            return (
              <motion.div
                key={agent.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`rounded-2xl bg-[#080d1a] border overflow-hidden shadow-xl transition-all ${status === "complete" ? "border-emerald-500/30" : status === "running" ? "border-blue-500/30" : "border-[#1e293b]"
                  }`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${agent.bgColor} border ${agent.borderColor}`}>
                        <Icon className={`w-6 h-6 ${agent.color}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-100">{agent.name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Independent AI Agent</p>
                      </div>
                    </div>
                    <div>
                      {status === "running" && (
                        <div className="flex items-center gap-2 text-blue-400">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="text-xs font-mono">ANALYZING</span>
                        </div>
                      )}
                      {status === "complete" && (
                        <div className="flex items-center gap-2 text-emerald-400">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-xs font-mono">COMPLETE</span>
                        </div>
                      )}
                      {status === "idle" && (
                        <span className="text-xs font-mono text-gray-500 bg-[#0f172a] px-3 py-1 rounded-full border border-[#1e293b]">STANDBY</span>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1 bg-[#1e293b] rounded-full mb-4 overflow-hidden">
                    {status === "running" && (
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "80%" }}
                        transition={{ duration: 8, ease: "easeInOut" }}
                      />
                    )}
                    {status === "complete" && (
                      <div className="h-full w-full bg-emerald-500 rounded-full" />
                    )}
                  </div>

                  {/* Result Summary */}
                  {result?.data && (
                    <div className="space-y-2">
                      {result.data.summary && (
                        <p className="text-sm text-gray-300 leading-relaxed">{result.data.summary}</p>
                      )}
                      <button
                        onClick={() => setExpandedAgent(expandedAgent === agent.key ? null : agent.key)}
                        className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors mt-2"
                      >
                        {expandedAgent === agent.key ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        {expandedAgent === agent.key ? "Hide Details" : "View Full Analysis"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedAgent === agent.key && result?.data && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-[#1e293b] overflow-hidden"
                    >
                      <div className="p-5">
                        <pre className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 text-xs text-gray-300 font-mono max-h-[400px] overflow-y-auto whitespace-pre-wrap">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Live Neural Stream */}
        {running && (
          <div className="p-8 rounded-2xl bg-[#0f172a]/80 border border-[#1e293b] relative overflow-hidden shadow-xl">
            <Meteors number={25} />
            <div className="relative z-10 flex flex-col gap-4">
              <h2 className="text-xl font-bold border-b border-[#1e293b] pb-4 flex items-center gap-3">
                <BrainCircuit className="w-5 h-5 text-emerald-400" />
                <ShinyText text="Live Agent Processing Stream" disabled={false} speed={2.5} className="text-gray-200" />
              </h2>
              <div className="font-mono text-xs md:text-sm text-emerald-400/90 space-y-2 mt-2">
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0 }}>[SYS] Initializing all 4 independent AI agents...</motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>[DOC] Document Analysis Agent parsing extracted text from uploaded files...</motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>[FIN] Financial Analysis Agent calculating key ratios and indicators...</motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }} className="text-purple-400">[RES] Research Agent gathering industry trends and market sentiment...</motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4 }} className="text-orange-400">[PRM] Promoter Analysis Agent scanning for fraud indicators...</motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 6 }} className="text-emerald-300">[SYS] Awaiting Gemini Flash 2.5 responses for all agents...</motion.p>
                <p className="animate-pulse mt-4 text-emerald-500">_</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
