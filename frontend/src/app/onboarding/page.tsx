"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Building2, CreditCard, ArrowRight, Loader2,
  Hash, FileText, Factory, DollarSign, Clock, Percent, Briefcase,
  LayoutDashboard
} from "lucide-react";
import ShinyText from "@/components/ui/ShinyText";
import { Meteors } from "@/components/ui/Meteors";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [workspaceCreated, setWorkspaceCreated] = useState<string | null>(null);

  const [form, setForm] = useState({
    companyName: "",
    cin: "",
    pan: "",
    sector: "",
    annualTurnover: "",
    loanType: "Working Capital",
    loanAmount: "",
    loanTenure: "",
    interestRate: "",
  });

  const update = (field: string, value: string) => setForm({ ...form, [field]: value });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("creditai_workspace", data.workspaceId);
        localStorage.setItem("creditai_company", form.companyName || form.cin);
        setWorkspaceCreated(data.workspaceId);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const inputClass =
    "w-full bg-[#0f172a] border border-[#1e293b] rounded-xl px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all";

  // === Success screen after workspace created ===
  if (workspaceCreated) {
    return (
      <div className="w-full flex justify-center pb-20 pt-4">
        <div className="w-full max-w-2xl flex flex-col gap-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative p-12 rounded-2xl bg-gradient-to-br from-[#080d1a] to-[#0f172a] border border-emerald-500/30 shadow-2xl overflow-hidden text-center"
          >
            <Meteors number={15} />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <Building2 className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-black mb-2">
                <ShinyText text="Workspace Created!" disabled={false} speed={2} className="text-[#f8fafc]" />
              </h2>
              <p className="text-gray-400 mb-2 text-sm">
                {form.companyName || form.cin} · {form.loanType} · {form.loanAmount}
              </p>
              <p className="text-xs text-gray-600 mb-8 font-mono">ID: {workspaceCreated}</p>

              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#0f172a] border border-[#1e293b] hover:border-[#334155] text-gray-200 hover:text-white font-semibold rounded-xl transition-all"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Go to Dashboard
                </button>
                <button
                  onClick={() => router.push("/data-ingestion")}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-xl transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)]"
                >
                  Upload Documents
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center pb-20 pt-4">
      <div className="w-full max-w-4xl flex flex-col gap-8 relative z-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <ShinyText text="Entity Onboarding" disabled={false} speed={2} className="text-[#f8fafc]" />
          </h1>
          <p className="text-gray-400 text-sm">
            Create a digital profile for the company being analyzed.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setStep(1)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              step === 1
                ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                : "bg-[#0f172a] border border-[#1e293b] text-gray-400 hover:text-gray-200"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span className="text-sm font-medium">Company Details</span>
          </button>
          <div className="h-[1px] flex-1 bg-[#1e293b]" />
          <button
            onClick={() => setStep(2)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              step === 2
                ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                : "bg-[#0f172a] border border-[#1e293b] text-gray-400 hover:text-gray-200"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span className="text-sm font-medium">Loan Details</span>
          </button>
        </div>

        {/* Form Card */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: step === 1 ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="relative p-8 rounded-2xl bg-[#080d1a] border border-[#1e293b] shadow-xl overflow-hidden"
        >
          <Meteors number={8} />

          {step === 1 ? (
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm text-gray-400 mb-2 font-medium">
                  <Building2 className="w-4 h-4" /> Company Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. TechnoSteel Pvt. Ltd."
                  value={form.companyName}
                  onChange={(e) => update("companyName", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-400 mb-2 font-medium">
                  <Hash className="w-4 h-4" /> CIN (Company Identification Number)
                </label>
                <input
                  type="text"
                  placeholder="e.g. U27100MH2010PTC198765"
                  value={form.cin}
                  onChange={(e) => update("cin", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-400 mb-2 font-medium">
                  <FileText className="w-4 h-4" /> PAN
                </label>
                <input
                  type="text"
                  placeholder="e.g. AAACT1234E"
                  value={form.pan}
                  onChange={(e) => update("pan", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-400 mb-2 font-medium">
                  <Factory className="w-4 h-4" /> Sector
                </label>
                <select
                  value={form.sector}
                  onChange={(e) => update("sector", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select Sector</option>
                  <option>Steel Manufacturing</option>
                  <option>Pharmaceuticals</option>
                  <option>Textiles &amp; Apparel</option>
                  <option>IT &amp; Software</option>
                  <option>Infrastructure</option>
                  <option>FMCG</option>
                  <option>Banking &amp; Finance</option>
                  <option>Real Estate</option>
                  <option>Energy</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-400 mb-2 font-medium">
                  <DollarSign className="w-4 h-4" /> Annual Turnover
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹ 4.8 Cr"
                  value={form.annualTurnover}
                  onChange={(e) => update("annualTurnover", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2 flex justify-end mt-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                >
                  Next: Loan Details <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-400 mb-2 font-medium">
                  <Briefcase className="w-4 h-4" /> Loan Type
                </label>
                <select
                  value={form.loanType}
                  onChange={(e) => update("loanType", e.target.value)}
                  className={inputClass}
                >
                  <option>Working Capital</option>
                  <option>Term Loan</option>
                  <option>Overdraft</option>
                  <option>Project Finance</option>
                  <option>Debt Restructuring</option>
                  <option>Export Finance</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-400 mb-2 font-medium">
                  <DollarSign className="w-4 h-4" /> Loan Amount
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹ 3.5 Cr"
                  value={form.loanAmount}
                  onChange={(e) => update("loanAmount", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-400 mb-2 font-medium">
                  <Clock className="w-4 h-4" /> Loan Tenure
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5 years"
                  value={form.loanTenure}
                  onChange={(e) => update("loanTenure", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-400 mb-2 font-medium">
                  <Percent className="w-4 h-4" /> Interest Rate
                </label>
                <input
                  type="text"
                  placeholder="e.g. 12.5%"
                  value={form.interestRate}
                  onChange={(e) => update("interestRate", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2 flex justify-between mt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 bg-[#0f172a] border border-[#1e293b] text-gray-300 hover:text-white rounded-xl transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-xl transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)] disabled:opacity-50"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Creating Workspace...</>
                  ) : (
                    <>Create Workspace &amp; Continue <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
