"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Database,
  BrainCircuit,
  Workflow,
  AlertTriangle,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  UserPlus,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import ShinyText from "@/components/ui/ShinyText";

const navItems = [
  { name: "Onboarding", href: "/onboarding", icon: UserPlus },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Data Ingestion", href: "/data-ingestion", icon: Database },
  { name: "Agent Analysis", href: "/agent-analysis", icon: BrainCircuit },
  { name: "Orchestrator", href: "/orchestrator", icon: Workflow },
  { name: "Early Warning", href: "/early-warning", icon: AlertTriangle },
  { name: "Credit Report", href: "/report", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Hide the sidebar completely on the root landing page
  if (pathname === "/" || pathname === "/onboarding") return <>{children}</>;

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      <motion.aside
        initial={{ width: 260 }}
        animate={{ width: collapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="h-full border-r border-[#1e293b] bg-[#030712]/80 backdrop-blur-xl flex flex-col items-center py-6 relative z-20 shrink-0"
      >
        <div className="flex items-center justify-center w-full mb-10 px-4">
          <div className="flex items-center gap-3">
            <div className="bg-brand/20 p-2 rounded-xl flex items-center justify-center border border-brand/50 shadow-[0_0_15px_rgba(22,58,92,0.5)]">
              <ShieldAlert className="text-brand w-6 h-6" />
            </div>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="overflow-hidden"
              >
                <ShinyText text="CreditAI" disabled={false} speed={2.5} className="text-2xl font-black tracking-tight" />
              </motion.div>
            )}
          </div>
        </div>

        <nav className="flex-1 w-full px-3 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center p-3 rounded-xl transition-all duration-300 group overflow-hidden",
                  isActive
                    ? "bg-brand/15 text-blue-100"
                    : "text-gray-400 hover:text-gray-100 hover:bg-[#1e293b]/50"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent border-l-2 border-emerald-500 rounded-r-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <item.icon
                  className={cn(
                    "w-5 h-5 shrink-0 relative z-10 transition-colors",
                    isActive ? "text-emerald-400" : "group-hover:text-gray-300"
                  )}
                />

                <motion.span
                  initial={false}
                  animate={{
                    opacity: collapsed ? 0 : 1,
                    display: collapsed ? "none" : "block",
                    marginLeft: collapsed ? 0 : "12px"
                  }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap font-medium text-sm relative z-10"
                >
                  {item.name}
                </motion.span>

                {isActive && !collapsed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-3 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] z-10"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 bg-[#0f172a] border border-[#1e293b] rounded-full p-1.5 text-gray-400 hover:text-white transition-colors z-50 shadow-lg"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden bg-background relative selection:bg-brand/30 selection:text-white">
        {/* Glow effect in background */}
        <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand/10 blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand/5 blur-[100px] pointer-events-none" />

        {children}
      </main>
    </div>
  );
}
