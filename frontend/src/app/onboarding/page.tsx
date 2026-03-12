"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Briefcase, Users, ArrowRight, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";
import ShinyText from "@/components/ui/ShinyText";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Organization details
    organizationName: "",
    industry: "",
    size: "",
    website: "",
    description: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.organizationName) {
        toast.error("Organization name is required");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!formData.organizationName) {
      toast.error("Organization name is required");
      return;
    }

    setLoading(true);

    try {
      await apiClient.createOrganization({
        name: formData.organizationName,
        industry: formData.industry,
        size: formData.size,
        website: formData.website,
        description: formData.description,
      });

      toast.success("Organization created successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#020817] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  const inputClass =
    "w-full bg-[#0f172a] border border-[#1e293b] rounded-xl px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50 transition-all";

  return (
    <div className="min-h-screen bg-[#020817] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">
              <ShinyText text="Welcome to CreditAI" disabled={false} speed={2} className="text-[#f8fafc]" />
            </h1>
            <p className="text-gray-400">Let's set up your organization</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center gap-4">
              {[1, 2].map((s) => (
                <React.Fragment key={s}>
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${step >= s
                        ? "border-brand bg-brand/20 text-brand"
                        : "border-gray-600 text-gray-600"
                      }`}
                  >
                    {step > s ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="font-bold">{s}</span>
                    )}
                  </div>
                  {s < 2 && (
                    <div
                      className={`w-16 h-0.5 transition-all ${step > s ? "bg-brand" : "bg-gray-600"
                        }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form Container */}
          <div className="relative p-8 rounded-2xl bg-[#080d1a] border border-[#1e293b] shadow-2xl">
            <AnimatePresence mode="wait">
              {/* Step 1: Organization Basics */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Building2 className="w-6 h-6 text-brand" />
                    <h2 className="text-2xl font-bold text-white">Organization Details</h2>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2 font-medium">
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleChange}
                      placeholder="Acme Financial Services"
                      required
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2 font-medium">
                      Industry
                    </label>
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      placeholder="Financial Services, Banking, Fintech, etc."
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2 font-medium">
                      Company Size
                    </label>
                    <select
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="500+">500+ employees</option>
                    </select>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold rounded-xl transition-all"
                    >
                      Next
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Additional Info */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Briefcase className="w-6 h-6 text-brand" />
                    <h2 className="text-2xl font-bold text-white">Additional Information</h2>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2 font-medium">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://yourcompany.com"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2 font-medium">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Tell us about your organization..."
                      rows={4}
                      className={inputClass}
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 px-6 py-3 bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold rounded-xl transition-all border border-[#1e293b]"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          Complete Setup
                          <CheckCircle className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Skip Option */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
            >
              Skip for now
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
