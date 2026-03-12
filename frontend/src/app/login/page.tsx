"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Lock, Mail, Loader2, Shield, Eye, EyeOff } from "lucide-react";
import ShinyText from "@/components/ui/ShinyText";
import { Meteors } from "@/components/ui/Meteors";
import Link from "next/link";

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
        } catch (error) {
            // Error handled by auth context
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full bg-[#0a0a0a] border border-[#333333] rounded-xl px-4 py-3 pl-12 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C0C0C0]/50 focus:border-[#C0C0C0]/50 transition-all";

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4">
            <div className="w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                >
                    {/* Logo/Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#C0C0C0]/10 border border-[#C0C0C0]/30 mb-4 silver-glow">
                            <Shield className="w-8 h-8 text-[#C0C0C0]" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">
                            <ShinyText text="CreditAI" disabled={false} speed={2} className="silver-text" />
                        </h1>
                        <p className="text-gray-400 text-sm">Secure Credit Appraisal System</p>
                    </div>

                    {/* Login Form */}
                    <div className="relative p-8 rounded-2xl bg-[#0a0a0a] border border-[#333333] shadow-2xl overflow-hidden silver-glow-hover">
                        <Meteors number={10} />

                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Email */}
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2 font-medium">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@company.com"
                                            required
                                            className={inputClass}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2 font-medium">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            required
                                            className={inputClass}
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 silver-gradient hover:opacity-90 text-black font-bold rounded-xl transition-all silver-glow disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-5 h-5" />
                                            Sign In
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Security Notice */}
                            <div className="mt-6 p-4 rounded-xl bg-[#C0C0C0]/5 border border-[#C0C0C0]/20">
                                <p className="text-xs text-gray-400 text-center">
                                    🔒 Your session is secured with enterprise-grade encryption.
                                    <br />
                                    Account will lock after 5 failed attempts.
                                </p>
                            </div>

                            {/* Register Link */}
                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-400">
                                    Don't have an account?{" "}
                                    <Link
                                        href="/signup"
                                        className="text-[#C0C0C0] hover:text-[#E8E8E8] font-medium transition-colors"
                                    >
                                        Sign up
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-center text-xs text-gray-600">
                        <p>Protected by advanced security measures</p>
                        <p className="mt-1">Rate limited • Audit logged • Encrypted</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
