"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertTriangle, Loader2, Play, ArrowRight,
  Shield, Bell, CheckCircle, TrendingUp, TrendingDown, Minus,
  Gavel, Newspaper, DollarSign, FileWarning
} from "lucide-react";
import ShinyText from "@/components/ui/ShinyText";
import { Meteors } from "@/components/ui/Meteors";
import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";

export default function EarlyWarningPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [acknowledged, setAcknowledged] = useState<Set<number>>(new Set());

  const handleScan = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getEarlyWarning({});
      if (res.data.success) {
        setResult(res.data);
        toast.success("Risk scan completed");
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const toggleAck = (id: number) => {
    setAcknowledged((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "financial": return <DollarSign className="w-4 h-4" />;
      case "legal": return <Gavel className="w-4 h-4" />;
      case "market": return <TrendingUp className="w-4 h-4" />;
      case "news": return <Newspaper className="w-4 h-4" />;
      case "regulatory": return <FileWarning className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case "high": return "bg-red-500/10 border-red-500/30 text-red-400";
      case "medium": return "bg-orange-500/10 border-orange-500/30 text-orange-400";
      case "low": return "bg-blue-500/10 border-blue-500/30 text-blue-400";
      default: return "bg-gray-500/10 border-gray-500/30 text-gray-400";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing": return <TrendingUp className="w-4 h-4 text-red-400" />;
      case "decreasing": return <TrendingDown className="w-4 h-4 text-blue-400" />;
      case "stable": return <Minus className="w-4 h-4 text-gray-400" />;
      default: return null;
    }
  };

  return (
    <div className="w-full flex justify-center pb-20 pt-4">
      <div className="w-full max-w-7xl flex flex-col gap-8 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              <ShinyText text="Early Warning Risk Detection" disabled={false} speed={2} className="text-[#f8fafc]" />
            </h1>
            <p className="text-gray-400 text-sm">
              Continuous monitoring layer that scans for emerging risk signals.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleScan}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-xl transition-all shadow-[0_0_25px_rgba(239,68,68,0.3)] disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
              {loading ? "Scanning..." : "Run Risk Scan"}
            </button>
            {result && (
              <button
                onClick={() => router.push("/report")}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold rounded-xl transition-all shadow-[0_0_25px_rgba(22,58,92,0.5)]"
              >
                Generate Report <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Risk Trend Banner */}
        {result?.overallRiskTrend && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl flex items-center justify-between border ${result.overallRiskTrend === "increasing" ? "bg-red-500/5 border-red-500/20" :
              result.overallRiskTrend === "decreasing" ? "bg-emerald-500/5 border-emerald-500/20" :
                "bg-[#0f172a] border-[#1e293b]"
              }`}
          >
            <div className="flex items-center gap-3">
              {getTrendIcon(result.overallRiskTrend)}
              <span className="text-sm text-gray-300">
                Overall Risk Trend: <span className="font-bold capitalize">{result.overallRiskTrend}</span>
              </span>
            </div>
            <span className="text-xs text-gray-500">{result.alerts?.length || 0} alerts detected</span>
          </motion.div>
        )}

        {/* Alerts List */}
        {result?.alerts?.length > 0 && (
          <div className="flex flex-col gap-4">
            {result.alerts.map((alert: any, idx: number) => (
              <motion.div
                key={alert.id || idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`rounded-2xl bg-[#080d1a] border overflow-hidden shadow-xl ${acknowledged.has(alert.id) ? "border-[#1e293b] opacity-60" : "border-[#1e293b]"
                  }`}
              >
                <div className="p-5 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-xl border ${getSeverityColor(alert.severity)}`}>
                      {getTypeIcon(alert.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-100">{alert.title}</h3>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getSeverityColor(alert.severity)} uppercase`}>
                          {alert.severity}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0f172a] border border-[#1e293b] text-gray-400 uppercase">
                          {alert.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed">{alert.description}</p>
                      {alert.recommended_action && (
                        <p className="text-xs text-blue-400/80 mt-2">
                          <span className="font-semibold">Recommended:</span> {alert.recommended_action}
                        </p>
                      )}
                      {alert.timestamp && (
                        <p className="text-xs text-gray-600 mt-1">{alert.timestamp}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleAck(alert.id || idx)}
                    className={`shrink-0 p-2 rounded-lg border transition-all ${acknowledged.has(alert.id || idx)
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-[#0f172a] border-[#1e293b] text-gray-500 hover:text-gray-300"
                      }`}
                  >
                    {acknowledged.has(alert.id || idx) ? <CheckCircle className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Summary */}
        {result?.summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-[#080d1a] to-[#0f172a] border border-[#1e293b] shadow-xl"
          >
            <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Risk Landscape Summary</h3>
            <p className="text-gray-300 leading-relaxed">{result.summary}</p>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !result && (
          <div className="p-12 rounded-2xl bg-[#080d1a] border border-[#1e293b] flex flex-col items-center justify-center relative overflow-hidden shadow-xl min-h-[400px]">
            <Meteors number={15} />
            <div className="bg-red-500/10 p-4 rounded-full mb-6 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2 z-10">
              <ShinyText text="Proactive Risk Monitoring" disabled={false} speed={2.5} className="text-gray-200" />
            </h2>
            <p className="text-gray-400 max-w-md text-center z-10">
              Click &quot;Run Risk Scan&quot; to scan for revenue drops, negative news, legal disputes, and unusual financial patterns.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
