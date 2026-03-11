"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Workflow, Loader2, CheckCircle, ArrowRight, Play,
  ShieldCheck, AlertTriangle, TrendingUp, TrendingDown,
  Target, Star, Zap, AlertCircle
} from "lucide-react";
import ShinyText from "@/components/ui/ShinyText";
import { Meteors } from "@/components/ui/Meteors";
import RiskGauge from "@/components/ui/RiskGauge";

export default function OrchestratorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const workspaceId = typeof window !== "undefined" ? localStorage.getItem("creditai_workspace") : null;

  const handleOrchestrate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId }),
      });
      const data = await res.json();
      if (data.success) setResult(data.orchestratorResult);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const getDecisionColor = (rec: string) => {
    if (!rec) return "text-gray-400";
    const lower = rec.toLowerCase();
    if (lower.includes("approve") && !lower.includes("condition")) return "text-emerald-400";
    if (lower.includes("condition")) return "text-yellow-400";
    return "text-red-400";
  };

  const getDecisionBg = (rec: string) => {
    if (!rec) return "bg-gray-500/10 border-gray-500/30";
    const lower = rec.toLowerCase();
    if (lower.includes("approve") && !lower.includes("condition")) return "bg-emerald-500/10 border-emerald-500/30";
    if (lower.includes("condition")) return "bg-yellow-500/10 border-yellow-500/30";
    return "bg-red-500/10 border-red-500/30";
  };

  return (
    <div className="w-full flex justify-center pb-20 pt-4">
      <div className="w-full max-w-7xl flex flex-col gap-8 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              <ShinyText text="Central Orchestrator" disabled={false} speed={2} className="text-[#f8fafc]" />
            </h1>
            <p className="text-gray-400 text-sm">
              Combines insights from all AI agents to generate a final credit assessment.
            </p>
          </div>
          <div className="flex gap-3">
            {!loading && !result && (
              <button
                onClick={handleOrchestrate}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-xl transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)]"
              >
                <Play className="w-4 h-4" /> Run Orchestrator
              </button>
            )}
            {result && (
              <button
                onClick={() => router.push("/early-warning")}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-xl transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)]"
              >
                Early Warning Scan <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-12 rounded-2xl bg-[#080d1a] border border-[#1e293b] flex flex-col items-center justify-center relative overflow-hidden shadow-xl min-h-[400px]">
            <Meteors number={20} />
            <Loader2 className="w-16 h-16 text-emerald-400 animate-spin mb-6 relative z-10" />
            <h2 className="text-2xl font-bold mb-2 z-10">
              <ShinyText text="Synthesizing Agent Insights..." disabled={false} speed={2.5} className="text-gray-200" />
            </h2>
            <p className="text-gray-400 max-w-md text-center z-10">
              The Orchestrator is combining results from Document, Financial, Research, and Promoter agents to generate the final credit assessment.
            </p>
          </div>
        )}

        {/* Results */}
        {result && (
          <>
            {/* Top Row — Decision + Risk Gauge + Confidence */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Decision Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-2xl border ${getDecisionBg(result.recommendation)} flex flex-col items-center justify-center shadow-xl`}
              >
                <ShieldCheck className={`w-12 h-12 mb-3 ${getDecisionColor(result.recommendation)}`} />
                <p className="text-sm text-gray-400 mb-1">Final Recommendation</p>
                <p className={`text-2xl font-black ${getDecisionColor(result.recommendation)}`}>
                  {result.recommendation || "Pending"}
                </p>
                <p className="text-xs text-gray-500 mt-2">{result.riskLevel}</p>
              </motion.div>

              {/* Risk Gauge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-2xl bg-[#080d1a] border border-[#1e293b] flex flex-col items-center justify-center shadow-xl"
              >
                <RiskGauge score={result.overallRiskScore || 50} size={160} label="" />
                <p className="text-sm text-gray-400 mt-2">Overall Risk Score</p>
              </motion.div>

              {/* Confidence */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-2xl bg-[#080d1a] border border-[#1e293b] flex flex-col justify-center shadow-xl"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-medium text-gray-300">Agent Confidence</span>
                </div>
                {result.confidenceBreakdown?.map((a: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-xs mb-3">
                    <span className="text-gray-400">{a.agent}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${a.confidence > 0.7 ? "bg-emerald-500" : "bg-orange-500"}`}
                          style={{ width: `${(a.confidence || 0) * 100}%` }}
                        />
                      </div>
                      <span className={`font-mono ${a.confidence > 0.7 ? "text-emerald-400" : "text-orange-400"}`}>
                        {((a.confidence || 0) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
                <div className="mt-3 pt-3 border-t border-[#1e293b] flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-300">Overall</span>
                  <span className="text-lg font-bold text-emerald-400">
                    {((result.confidenceScore || 0) * 100).toFixed(0)}%
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Explanations */}
            {result.explanations?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-2xl bg-[#080d1a] border border-[#1e293b] shadow-xl"
              >
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-400" />
                  <ShinyText text="Explainable Reasoning" disabled={false} speed={2} className="text-gray-200" />
                </h3>
                <div className="space-y-3">
                  {result.explanations.map((exp: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-[#0f172a] rounded-xl border border-[#1e293b]">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <p className="text-sm text-gray-300">{exp}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SWOT Analysis */}
            {result.swot && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {[
                  { title: "Strengths", items: result.swot.strengths, icon: Star, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
                  { title: "Weaknesses", items: result.swot.weaknesses, icon: TrendingDown, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
                  { title: "Opportunities", items: result.swot.opportunities, icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
                  { title: "Threats", items: result.swot.threats, icon: AlertTriangle, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
                ].map((section) => (
                  <div key={section.title} className={`p-5 rounded-2xl border ${section.bg} shadow-lg`}>
                    <h4 className={`text-sm font-bold mb-3 flex items-center gap-2 ${section.color}`}>
                      <section.icon className="w-4 h-4" /> {section.title}
                    </h4>
                    <ul className="space-y-2">
                      {section.items?.map((item: string, i: number) => (
                        <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${section.color.replace("text-", "bg-")}`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Risk Signals */}
            {result.keyRiskSignals?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-6 rounded-2xl bg-[#080d1a] border border-[#1e293b] shadow-xl"
              >
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-400" />
                  <span className="text-gray-200">Key Risk Signals</span>
                </h3>
                <div className="space-y-3">
                  {result.keyRiskSignals.map((s: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-[#0f172a] rounded-xl border border-[#1e293b]">
                      <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${s.severity === "high" ? "bg-red-500 shadow-[0_0_8px_red]" : s.severity === "medium" ? "bg-orange-500" : "bg-blue-400"
                        }`} />
                      <div>
                        <p className="text-sm text-gray-200 font-medium">{s.signal}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Source: {s.source} • Severity: {s.severity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Executive Summary */}
            {result.summary && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-[#080d1a] to-[#0f172a] border border-emerald-500/20 shadow-xl"
              >
                <h3 className="text-sm font-bold text-emerald-400 mb-2 uppercase tracking-wider">Executive Summary</h3>
                <p className="text-gray-300 leading-relaxed">{result.summary}</p>
              </motion.div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !result && (
          <div className="p-12 rounded-2xl bg-[#080d1a] border border-[#1e293b] flex flex-col items-center justify-center relative overflow-hidden shadow-xl min-h-[400px]">
            <Meteors number={15} />
            <div className="bg-brand/20 p-4 rounded-full mb-6 border border-brand/30 shadow-[0_0_20px_rgba(22,58,92,0.4)]">
              <Workflow className="w-12 h-12 text-brand" />
            </div>
            <h2 className="text-2xl font-bold mb-2 z-10">
              <ShinyText text="Orchestration Engine Ready" disabled={false} speed={2.5} className="text-gray-200" />
            </h2>
            <p className="text-gray-400 max-w-md text-center z-10">
              Click &quot;Run Orchestrator&quot; to synthesize all agent analysis results into a final credit recommendation with explainable reasoning.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
