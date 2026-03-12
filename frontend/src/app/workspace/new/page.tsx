"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Building2, DollarSign, FileText, Loader2, ArrowRight } from "lucide-react";
import ShinyText from "@/components/ui/ShinyText";
import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";

export default function NewWorkspacePage() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [organizations, setOrganizations] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        organizationId: "",
        name: "",
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

    useEffect(() => {
        loadOrganizations();
    }, []);

    const loadOrganizations = async () => {
        try {
            const response = await apiClient.getOrganizations();
            const orgs = response.data.organizations;
            setOrganizations(orgs);

            // Set default to current org
            if (user?.currentOrganizationId) {
                setFormData((prev) => ({ ...prev, organizationId: user.currentOrganizationId }));
            } else if (orgs.length > 0) {
                setFormData((prev) => ({ ...prev, organizationId: orgs[0].id }));
            }
        } catch (error) {
            console.error("Failed to load organizations:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.organizationId) {
            toast.error("Please select an organization");
            return;
        }

        setLoading(true);

        try {
            const response = await apiClient.createWorkspace(formData.organizationId, {
                name: formData.name,
                company: {
                    name: formData.companyName,
                    cin: formData.cin,
                    pan: formData.pan,
                    sector: formData.sector,
                    annualTurnover: formData.annualTurnover,
                },
                loan: {
                    type: formData.loanType,
                    amount: formData.loanAmount,
                    tenure: formData.loanTenure,
                    interestRate: formData.interestRate,
                },
            });

            toast.success("Workspace created successfully!");
            router.push(`/workspace/${response.data.workspace.id}`);
        } catch (error: any) {
            // Error handled by interceptor
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full bg-[#0f172a] border border-[#1e293b] rounded-xl px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50 transition-all";

    return (
        <div className="w-full flex justify-center pb-20">
            <div className="w-full max-w-3xl pt-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">
                            <ShinyText text="Create New Workspace" disabled={false} speed={2} className="text-[#f8fafc]" />
                        </h1>
                        <p className="text-gray-400">Set up a new credit appraisal workspace</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Organization Selection */}
                        {organizations.length > 1 && (
                            <div className="p-6 bg-[#0f172a] border border-[#1e293b] rounded-2xl">
                                <h3 className="text-lg font-bold text-white mb-4">Organization</h3>
                                <select
                                    name="organizationId"
                                    value={formData.organizationId}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                >
                                    {organizations.map((org) => (
                                        <option key={org.id} value={org.id}>
                                            {org.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Workspace Details */}
                        <div className="p-6 bg-[#0f172a] border border-[#1e293b] rounded-2xl">
                            <div className="flex items-center gap-3 mb-4">
                                <FileText className="w-5 h-5 text-brand" />
                                <h3 className="text-lg font-bold text-white">Workspace Details</h3>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 font-medium">
                                    Workspace Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Q1 2024 Loan Applications"
                                    required
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Company Information */}
                        <div className="p-6 bg-[#0f172a] border border-[#1e293b] rounded-2xl space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <Building2 className="w-5 h-5 text-brand" />
                                <h3 className="text-lg font-bold text-white">Company Information</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2 font-medium">
                                        Company Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        placeholder="Acme Corp"
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2 font-medium">
                                        Sector *
                                    </label>
                                    <input
                                        type="text"
                                        name="sector"
                                        value={formData.sector}
                                        onChange={handleChange}
                                        placeholder="Manufacturing"
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2 font-medium">
                                        CIN *
                                    </label>
                                    <input
                                        type="text"
                                        name="cin"
                                        value={formData.cin}
                                        onChange={handleChange}
                                        placeholder="U12345AB1234PLC123456"
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2 font-medium">
                                        PAN *
                                    </label>
                                    <input
                                        type="text"
                                        name="pan"
                                        value={formData.pan}
                                        onChange={handleChange}
                                        placeholder="ABCDE1234F"
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm text-gray-400 mb-2 font-medium">
                                        Annual Turnover
                                    </label>
                                    <input
                                        type="text"
                                        name="annualTurnover"
                                        value={formData.annualTurnover}
                                        onChange={handleChange}
                                        placeholder="₹50 Crores"
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Loan Details */}
                        <div className="p-6 bg-[#0f172a] border border-[#1e293b] rounded-2xl space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <DollarSign className="w-5 h-5 text-brand" />
                                <h3 className="text-lg font-bold text-white">Loan Details</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2 font-medium">
                                        Loan Type
                                    </label>
                                    <select
                                        name="loanType"
                                        value={formData.loanType}
                                        onChange={handleChange}
                                        className={inputClass}
                                    >
                                        <option value="Working Capital">Working Capital</option>
                                        <option value="Term Loan">Term Loan</option>
                                        <option value="Project Finance">Project Finance</option>
                                        <option value="Trade Finance">Trade Finance</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2 font-medium">
                                        Loan Amount *
                                    </label>
                                    <input
                                        type="text"
                                        name="loanAmount"
                                        value={formData.loanAmount}
                                        onChange={handleChange}
                                        placeholder="₹10 Crores"
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2 font-medium">
                                        Tenure
                                    </label>
                                    <input
                                        type="text"
                                        name="loanTenure"
                                        value={formData.loanTenure}
                                        onChange={handleChange}
                                        placeholder="5 years"
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2 font-medium">
                                        Interest Rate
                                    </label>
                                    <input
                                        type="text"
                                        name="interestRate"
                                        value={formData.interestRate}
                                        onChange={handleChange}
                                        placeholder="8.5%"
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-3 bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold rounded-xl transition-all border border-[#1e293b]"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
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
                                        Create Workspace
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
