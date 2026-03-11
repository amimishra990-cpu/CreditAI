"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    FileText, Loader2, Play, Download,
    Building2, TrendingUp, ShieldAlert, Globe, AlertTriangle,
    Star, TrendingDown, CheckCircle, Target
} from "lucide-react";
import ShinyText from "@/components/ui/ShinyText";
import { Meteors } from "@/components/ui/Meteors";

export default function ReportPage() {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState<any>(null);

    const workspaceId = typeof window !== "undefined" ? localStorage.getItem("creditai_workspace") : null;

    const handleGenerateReport = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ workspaceId }),
            });
            const data = await res.json();
            if (data.success) setReport(data.report);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const sectionIcons: Record<string, any> = {
        companyOverview: Building2,
        financialAnalysis: TrendingUp,
        promoterAssessment: ShieldAlert,
        industryAnalysis: Globe,
        riskAssessment: AlertTriangle,
        swotAnalysis: Target,
        loanRecommendation: CheckCircle,
    };

    const sectionColors: Record<string, string> = {
        companyOverview: "text-blue-400 bg-blue-500/10 border-blue-500/30",
        financialAnalysis: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
        promoterAssessment: "text-orange-400 bg-orange-500/10 border-orange-500/30",
        industryAnalysis: "text-purple-400 bg-purple-500/10 border-purple-500/30",
        riskAssessment: "text-red-400 bg-red-500/10 border-red-500/30",
        swotAnalysis: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
        loanRecommendation: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    };

    return (
        <div className="w-full flex justify-center pb-20 pt-4">
            <div className="w-full max-w-5xl flex flex-col gap-8 relative z-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            <ShinyText text="Credit Appraisal Memo (CAM)" disabled={false} speed={2} className="text-[#f8fafc]" />
                        </h1>
                        <p className="text-gray-400 text-sm">
                            AI-generated structured credit report with full analysis.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {!loading && !report && (
                            <button
                                onClick={handleGenerateReport}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-xl transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)]"
                            >
                                <Play className="w-4 h-4" /> Generate Report
                            </button>
                        )}
                        {report && (
                            <button
                                onClick={() => window.print()}
                                className="flex items-center gap-2 px-6 py-3 bg-[#0f172a] border border-[#1e293b] text-gray-200 hover:text-white rounded-xl transition-all"
                            >
                                <Download className="w-4 h-4" /> Print / Save PDF
                            </button>
                        )}
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="p-12 rounded-2xl bg-[#080d1a] border border-[#1e293b] flex flex-col items-center justify-center relative overflow-hidden shadow-xl min-h-[400px]">
                        <Meteors number={20} />
                        <Loader2 className="w-16 h-16 text-emerald-400 animate-spin mb-6 relative z-10" />
                        <h2 className="text-2xl font-bold mb-2 z-10">
                            <ShinyText text="Generating Credit Report..." disabled={false} speed={2.5} className="text-gray-200" />
                        </h2>
                        <p className="text-gray-400 max-w-md text-center z-10">
                            Compiling company overview, financial analysis, SWOT, risk signals, and final recommendation into a structured CAM report.
                        </p>
                    </div>
                )}

                {/* Report Content */}
                {report && (
                    <div className="flex flex-col gap-6 print:gap-4">
                        {/* Report Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-8 rounded-2xl bg-gradient-to-br from-[#080d1a] to-[#0f172a] border border-emerald-500/20 shadow-xl text-center"
                        >
                            <FileText className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-black text-gray-100 mb-2">{report.reportTitle || "Credit Appraisal Memo"}</h2>
                            <p className="text-sm text-gray-500">Generated: {report.generatedAt || new Date().toISOString()}</p>
                            {report.executiveSummary && (
                                <p className="mt-4 text-gray-300 max-w-2xl mx-auto leading-relaxed border-t border-[#1e293b] pt-4">
                                    {report.executiveSummary}
                                </p>
                            )}
                        </motion.div>

                        {/* Sections */}
                        {report.sections && Object.entries(report.sections).map(([key, section]: [string, any], idx) => {
                            const Icon = sectionIcons[key] || FileText;
                            const colorClass = sectionColors[key] || "text-gray-400 bg-gray-500/10 border-gray-500/30";

                            return (
                                <motion.div
                                    key={key}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-6 rounded-2xl bg-[#080d1a] border border-[#1e293b] shadow-xl"
                                >
                                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#1e293b]">
                                        <div className={`p-2 rounded-xl border ${colorClass}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-100">{section.title || key}</h3>
                                    </div>

                                    {/* Content */}
                                    {section.content && (
                                        <p className="text-sm text-gray-300 leading-relaxed mb-4">{section.content}</p>
                                    )}

                                    {/* Key Metrics */}
                                    {section.keyMetrics?.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                                            {section.keyMetrics.map((m: any, i: number) => (
                                                <div key={i} className="p-3 bg-[#0f172a] rounded-xl border border-[#1e293b]">
                                                    <p className="text-xs text-gray-500 mb-1">{m.metric}</p>
                                                    <p className="text-sm font-bold text-gray-200">{m.value}</p>
                                                    {m.assessment && (
                                                        <span className={`text-[10px] font-mono mt-1 inline-block px-1.5 py-0.5 rounded ${m.assessment === "good" ? "bg-emerald-500/10 text-emerald-400" :
                                                                m.assessment === "fair" ? "bg-yellow-500/10 text-yellow-400" :
                                                                    "bg-red-500/10 text-red-400"
                                                            }`}>{m.assessment}</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Risk Factors */}
                                    {section.riskFactors?.length > 0 && (
                                        <div className="space-y-2 mb-4">
                                            {section.riskFactors.map((rf: any, i: number) => (
                                                <div key={i} className="flex items-start gap-3 p-3 bg-[#0f172a] rounded-xl border border-[#1e293b]">
                                                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${rf.severity === "high" ? "bg-red-500" : rf.severity === "medium" ? "bg-orange-500" : "bg-blue-400"
                                                        }`} />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-200">{rf.factor}</p>
                                                        {rf.mitigation && <p className="text-xs text-gray-500 mt-0.5">Mitigation: {rf.mitigation}</p>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* SWOT */}
                                    {key === "swotAnalysis" && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {[
                                                { title: "Strengths", items: section.strengths, icon: Star, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                                                { title: "Weaknesses", items: section.weaknesses, icon: TrendingDown, color: "text-red-400 bg-red-500/10 border-red-500/20" },
                                                { title: "Opportunities", items: section.opportunities, icon: TrendingUp, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                                                { title: "Threats", items: section.threats, icon: AlertTriangle, color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
                                            ].map((s) => (
                                                <div key={s.title} className={`p-4 rounded-xl border ${s.color}`}>
                                                    <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                                                        <s.icon className="w-3.5 h-3.5" /> {s.title}
                                                    </h4>
                                                    <ul className="space-y-1">
                                                        {s.items?.map((item: string, i: number) => (
                                                            <li key={i} className="text-xs text-gray-300">• {item}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Loan Terms */}
                                    {section.proposedTerms && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                                            {Object.entries(section.proposedTerms).map(([k, v]) => (
                                                <div key={k} className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
                                                    <p className="text-[10px] text-gray-500 uppercase">{k}</p>
                                                    <p className="text-sm font-bold text-emerald-400">{v as string}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Conditions */}
                                    {section.conditions?.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            <p className="text-xs text-gray-500 uppercase font-bold">Conditions:</p>
                                            {section.conditions.map((c: string, i: number) => (
                                                <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" /> {c}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Decision Badge */}
                                    {section.decision && (
                                        <div className={`mt-4 p-4 rounded-xl text-center font-bold text-lg ${section.decision.toLowerCase().includes("approve") && !section.decision.toLowerCase().includes("condition")
                                                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                                                : section.decision.toLowerCase().includes("condition")
                                                    ? "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400"
                                                    : "bg-red-500/10 border border-red-500/30 text-red-400"
                                            }`}>
                                            {section.decision}
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !report && (
                    <div className="p-12 rounded-2xl bg-[#080d1a] border border-[#1e293b] flex flex-col items-center justify-center relative overflow-hidden shadow-xl min-h-[400px]">
                        <Meteors number={15} />
                        <div className="bg-brand/20 p-4 rounded-full mb-6 border border-brand/30 shadow-[0_0_20px_rgba(22,58,92,0.4)]">
                            <FileText className="w-12 h-12 text-brand" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2 z-10">
                            <ShinyText text="Credit Report Generator" disabled={false} speed={2.5} className="text-gray-200" />
                        </h2>
                        <p className="text-gray-400 max-w-md text-center z-10">
                            Click &quot;Generate Report&quot; to create a complete Credit Appraisal Memo (CAM) with all analysis sections, SWOT, and final recommendation.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
