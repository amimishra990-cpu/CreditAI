"use client";

import React, { useState } from "react";
import { 
  Building2, AlertTriangle, 
  ChevronDown, CheckCircle, XCircle, AlertCircle, FileSearch, User, ArrowRight, ArrowUp, ArrowDown, Minus 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RiskGauge from "@/components/ui/RiskGauge";
import { BentoGrid, BentoGridItem } from "@/components/ui/BentoGrid";
import { Meteors } from "@/components/ui/Meteors";
import ShinyText from "@/components/ui/ShinyText";
import PixelCard from "@/components/ui/PixelCard";
import { companies, companyList } from "@/data/mockData";

export default function Dashboard() {
  const [activeCompanyId, setActiveCompanyId] = useState("technosteel");
  const [companySelectorOpen, setCompanySelectorOpen] = useState(false);

  // Type assertion for company to match the mock data structure
  const company = companies[activeCompanyId as keyof typeof companies];

  // Helper for generating the anomaly icon
  const getAnomalyIcon = (type: string) => {
    switch (type) {
      case "arrow-right": return <ArrowRight className="w-4 h-4 text-blue-400" />;
      case "arrow-up": return <ArrowUp className="w-4 h-4 text-red-500" />;
      case "down": return <ArrowDown className="w-4 h-4 text-red-500" />;
      case "stable": return <Minus className="w-4 h-4 text-emerald-400" />;
      default: return null;
    }
  };

  return (
    <div className="w-full flex justify-center pb-20">
      <div className="w-full max-w-7xl flex flex-col gap-8 relative z-10 pt-4">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              <ShinyText text="Risk Intelligence Dashboard" disabled={false} speed={2} className="text-[#f8fafc]" />
            </h1>
            <p className="text-gray-400 text-sm">
              Real-time multi-agent appraisal insights
            </p>
          </div>

          {/* Company Selector */}
          <div className="relative z-50">
            <button
              onClick={() => setCompanySelectorOpen(!companySelectorOpen)}
              className="flex items-center gap-3 px-4 py-2 bg-[#0f172a] border border-[#1e293b] rounded-xl hover:border-brand/50 transition-colors shadow-lg"
            >
              <div className="bg-brand/20 p-1.5 rounded-lg">
                <Building2 className="w-4 h-4 text-brand" />
              </div>
              <span className="font-medium text-gray-200">{company.name}</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${companySelectorOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {companySelectorOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 mt-2 w-64 bg-[#0f172a] border border-[#1e293b] rounded-xl shadow-2xl overflow-hidden py-1"
                >
                  {companyList.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setActiveCompanyId(c.id);
                        setCompanySelectorOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                        c.id === activeCompanyId ? "bg-brand/10 text-brand" : "text-gray-400 hover:bg-[#1e293b] hover:text-gray-200"
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span className="font-medium text-sm">{c.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Top KPI Cards using grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           {/* Revenue */}
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
             <PixelCard variant="blue" gap={6} speed={35} className="w-full h-[120px] rounded-2xl border border-[#1e293b]">
               <div className="absolute inset-0 p-5 flex flex-col gap-2 bg-[#0f172a]/20 backdrop-blur-[2px] pointer-events-none">
                 <span className="text-gray-400 text-sm font-medium">Annual Revenue</span>
                 <div className="text-2xl font-bold text-gray-100">{company.annualRevenue}</div>
               </div>
             </PixelCard>
           </motion.div>
           {/* PM */}
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
             <PixelCard variant="default" gap={6} speed={35} className="w-full h-[120px] rounded-2xl border border-[#1e293b]">
               <div className="absolute inset-0 p-5 flex flex-col gap-2 bg-[#0f172a]/20 backdrop-blur-[2px] pointer-events-none">
                 <span className="text-gray-400 text-sm font-medium">Profit Margin</span>
                 <div className="text-2xl font-bold text-emerald-400">{company.profitMargin}</div>
               </div>
             </PixelCard>
           </motion.div>
           {/* Loan Limit */}
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
             <PixelCard variant="blue" gap={6} speed={35} className="w-full h-[120px] rounded-2xl border border-[#1e293b] overflow-hidden">
               <div className="absolute inset-0 p-5 flex flex-col gap-2 bg-[#0f172a]/20 backdrop-blur-[2px] pointer-events-none z-10">
                 <span className="text-gray-400 text-sm font-medium">Recommended Limit</span>
                 <div className="text-2xl font-bold text-emerald-400">{company.loanLimit}</div>
               </div>
               <Meteors number={10} className="opacity-30 z-0" />
             </PixelCard>
           </motion.div>
           {/* Status */}
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
             <PixelCard variant="pink" gap={4} speed={40} className="w-full h-[120px] rounded-2xl border border-[#1e293b]">
               <div className="absolute inset-0 p-5 flex flex-col gap-2 bg-[#0f172a]/20 backdrop-blur-[2px] pointer-events-none">
                 <span className="text-gray-400 text-sm font-medium">Decision</span>
                 <div className={`text-xl font-bold ${
                   company.riskSummary.decision.includes("Approve") ? "text-emerald-400" : "text-red-500"
                 }`}>{company.riskSummary.decision}</div>
               </div>
             </PixelCard>
           </motion.div>
        </div>

        {/* Bento Grid layout */}
        <BentoGrid className="max-w-none mt-4 md:auto-rows-[minmax(20rem,auto)]">
          {/* Main Risk Overview */}
          <BentoGridItem
            className="md:col-span-2 bg-[#080d1a] border-[#1e293b]"
            title={<ShinyText text="Company Risk Overview" disabled={false} speed={2.5} className="text-[#f8fafc] text-base font-bold" />}
            description="Aggregated risk score from financial, legal, and operational metrics."
            header={
              <div className="flex flex-col md:flex-row items-center justify-between w-full h-full p-4">
                 <RiskGauge score={company.riskScore} size={180} label="" />
                 <div className="flex flex-col gap-4 mt-6 md:mt-0 w-full md:pl-10">
                    <div className="flex justify-between items-center border-b border-[#1e293b] pb-2">
                       <span className="text-gray-400 text-sm">Cash Flow Status</span>
                       <span className={`text-sm font-medium flex items-center gap-1 ${company.cashFlowStatus === 'Positive' ? 'text-emerald-400' : 'text-red-500'}`}>
                          {company.cashFlowStatus}
                          {company.cashFlowStatus === 'Positive' ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                       </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#1e293b] pb-2">
                       <span className="text-gray-400 text-sm">Litigation Alerts</span>
                       <span className={`text-sm font-medium flex items-center gap-1 ${company.litigationAlerts > 0 ? 'text-orange-400' : 'text-emerald-400'}`}>
                          {company.litigationAlerts}
                          {company.litigationAlerts > 0 && <AlertCircle className="w-3.5 h-3.5" />}
                       </span>
                    </div>
                    <div className="flex justify-between items-center pb-2">
                       <span className="text-gray-400 text-sm">Industry</span>
                       <span className="text-sm font-medium text-gray-200">{company.industry}</span>
                    </div>
                 </div>
              </div>
            }
          />

          {/* Promoter Network */}
          <BentoGridItem
            className="md:col-span-1 bg-gradient-to-br from-[#080d1a] to-[#0f172a] border-[#1e293b]"
            title={<ShinyText text="Promoter Network Insights" disabled={false} speed={2.5} className="text-[#f8fafc] text-base font-bold" />}
            description="Deep analysis of connected entities and reputational risks."
            header={
              <div className="flex flex-col items-center justify-center h-full w-full py-6">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#1e293b] flex items-center justify-center border-2 border-brand relative z-10 shadow-[0_0_20px_rgba(22,58,92,0.6)]">
                    <User className="w-8 h-8 text-gray-300" />
                  </div>
                  {/* Connection lines mock */}
                  <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 z-0 pointer-events-none" viewBox="0 0 100 100">
                    <motion.line x1="50" y1="50" x2="10" y2="20" stroke="#1e293b" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
                    <motion.line x1="50" y1="50" x2="90" y2="30" stroke="#1e293b" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6 }} />
                    <motion.line x1="50" y1="50" x2="50" y2="90" stroke="#1e293b" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7 }} />
                  </svg>
                  {/* Nodes */}
                  <div className="absolute top-[-30px] left-[-40px] w-6 h-6 rounded-full bg-[#0a101f] border border-blue-500 flex items-center justify-center shadow-lg"><Building2 className="w-3 h-3 text-blue-400" /></div>
                  <div className="absolute top-[-10px] right-[-50px] w-6 h-6 rounded-full bg-[#0a101f] border border-emerald-500 flex items-center justify-center shadow-lg"><FileSearch className="w-3 h-3 text-emerald-400" /></div>
                  <div className="absolute bottom-[-50px] left-[20px] w-6 h-6 rounded-full bg-[#0a101f] border border-orange-500 flex items-center justify-center shadow-lg"><AlertTriangle className="w-3 h-3 text-orange-400" /></div>
                </div>
                <div className="w-full mt-4 text-center">
                   <div className="text-xl font-bold text-gray-100">{company.promoter.name}</div>
                   <div className="text-sm text-gray-400">{company.promoter.role}</div>
                   <div className="mt-4 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl inline-block">
                     <span className="text-xs font-semibold text-red-500 tracking-wider">FRAUD PROB {company.promoterRisk.fraudProbability}</span>
                   </div>
                </div>
              </div>
            }
          />
        </BentoGrid>

        {/* Lower Row Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
             {/* Financial Ratios */}
             <div className="md:col-span-2 p-6 rounded-2xl bg-[#080d1a] border border-[#1e293b] flex flex-col relative overflow-hidden shadow-xl">
                 <h3 className="text-lg font-bold mb-4">
                    <ShinyText text="Quarterly GST & Bank Inflows" disabled={false} speed={2} className="text-gray-100" />
                 </h3>
                 <div className="overflow-x-auto w-full">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                       <thead>
                         <tr className="border-b border-[#1e293b]">
                           <th className="pb-3 text-gray-400 font-medium tracking-wider uppercase text-xs">Quarter</th>
                           <th className="pb-3 text-gray-400 font-medium tracking-wider uppercase text-xs">GST Invoices</th>
                           <th className="pb-3 text-gray-400 font-medium tracking-wider uppercase text-xs">Bank Inflow</th>
                           <th className="pb-3 text-gray-400 font-medium tracking-wider uppercase text-xs text-right">Trend</th>
                         </tr>
                       </thead>
                       <tbody>
                         {company.financialQuarters.map((q, idx) => (
                           <motion.tr 
                             initial={{ opacity: 0, x: -10 }} 
                             animate={{ opacity: 1, x: 0 }} 
                             transition={{ delay: 0.1 * idx }}
                             key={idx} 
                             className="border-b border-[#1e293b]/50 hover:bg-[#1e293b]/20 transition-colors"
                           >
                             <td className="py-4 font-medium text-gray-300">{q.quarter}</td>
                             <td className="py-4 text-gray-400">{q.gstInvoices}</td>
                             <td className="py-4 text-gray-400">{q.bankInflow}</td>
                             <td className="py-4 flex justify-end">
                                <div className="bg-[#0f172a] p-1.5 rounded-md border border-[#1e293b]">
                                   {getAnomalyIcon(q.anomalies)}
                                </div>
                             </td>
                           </motion.tr>
                         ))}
                       </tbody>
                    </table>
                 </div>
             </div>

             {/* Risk Factors & Alerts */}
             <div className="md:col-span-1 p-6 rounded-2xl bg-[#080d1a] border border-[#1e293b] flex flex-col relative overflow-hidden shadow-xl">
                 <Meteors number={15} />
                 <h3 className="text-lg font-bold text-gray-100 mb-4 relative z-10 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-400" /> 
                    <ShinyText text="Active Risk Factors" disabled={false} speed={2} className="text-gray-100" />
                 </h3>
                 <div className="flex flex-col gap-4 relative z-10">
                    {company.riskFactors.map((rf, idx) => (
                       <div key={idx} className="bg-[#0f172a]/90 backdrop-blur-md border border-[#1e293b] p-3 rounded-lg flex flex-col gap-2 shadow-lg">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${rf.severity === 'high' ? 'bg-red-500 shadow-[0_0_8px_red]' : rf.severity === 'medium' ? 'bg-orange-500' : 'bg-blue-400'}`}></span>
                            <span className="font-semibold text-gray-200 text-sm">{rf.name}</span>
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed pl-4">{rf.detail}</p>
                       </div>
                    ))}
                 </div>
                 
                 <div className="mt-8 relative z-10">
                    <h4 className="text-sm font-semibold mb-3 border-b border-[#1e293b] pb-2">
                      <ShinyText text="MULTI-AGENT DIAGNOSIS" disabled={false} speed={2.5} className="text-gray-400" />
                    </h4>
                    <div className="flex flex-col gap-2">
                      {company.agentConfidence.map((a, i) => (
                         <div key={i} className="flex justify-between items-center text-xs">
                           <span className="text-gray-300">{a.agent}</span>
                           <span className={a.confidence > 0.7 ? "text-emerald-400 font-mono" : "text-orange-400 font-mono"}>{(a.confidence * 100).toFixed(0)}% CONFIDENCE</span>
                         </div>
                      ))}
                    </div>
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
}
