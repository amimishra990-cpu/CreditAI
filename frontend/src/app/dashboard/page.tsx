"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Building2, Plus, Loader2, FolderOpen, Users, ArrowRight, Settings,
  TrendingUp, TrendingDown, FileText, Database, BrainCircuit,
  AlertTriangle, CheckCircle2, Clock, DollarSign, Activity,
  BarChart3, PieChart, Target, Zap, Shield, Eye
} from "lucide-react";
import { motion } from "framer-motion";
import ShinyText from "@/components/ui/ShinyText";
import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";
import { CountUp } from "@/components/ui/CountUp";

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [currentOrg, setCurrentOrg] = useState<any>(null);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [workspacesLoading, setWorkspacesLoading] = useState(false);

  // Dashboard statistics
  const [stats, setStats] = useState({
    totalWorkspaces: 0,
    activeWorkspaces: 0,
    completedWorkspaces: 0,
    totalDocuments: 0,
    totalAnalyses: 0,
    avgRiskScore: 0,
    pendingReviews: 0,
    recentActivity: 0
  });

  useEffect(() => {
    loadOrganizations();
  }, []);

  useEffect(() => {
    if (currentOrg) {
      loadWorkspaces(currentOrg.id);
    }
  }, [currentOrg]);

  const loadOrganizations = async () => {
    try {
      const response = await apiClient.getOrganizations();
      const orgs = response.data.organizations;
      setOrganizations(orgs);

      // Set current org based on user's currentOrganizationId
      const activeOrg = orgs.find((o: any) => o.id === user?.currentOrganizationId) || orgs[0];
      setCurrentOrg(activeOrg);
    } catch (error) {
      console.error("Failed to load organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadWorkspaces = async (orgId: string) => {
    setWorkspacesLoading(true);
    try {
      const response = await apiClient.getOrganizationWorkspaces(orgId);
      const workspaceData = response.data.workspaces;
      setWorkspaces(workspaceData);

      // Calculate statistics
      const totalDocs = workspaceData.reduce((acc: number, ws: any) =>
        acc + (ws.documents?.length || 0), 0);
      const completed = workspaceData.filter((ws: any) => ws.status === "completed").length;
      const active = workspaceData.filter((ws: any) => ws.status === "in_progress").length;

      setStats({
        totalWorkspaces: workspaceData.length,
        activeWorkspaces: active,
        completedWorkspaces: completed,
        totalDocuments: totalDocs,
        totalAnalyses: workspaceData.filter((ws: any) => ws.analysis).length,
        avgRiskScore: 72, // Mock data - calculate from actual analyses
        pendingReviews: workspaceData.filter((ws: any) => ws.status === "pending").length,
        recentActivity: workspaceData.length
      });
    } catch (error) {
      console.error("Failed to load workspaces:", error);
    } finally {
      setWorkspacesLoading(false);
    }
  };

  const switchOrganization = async (orgId: string) => {
    try {
      await apiClient.switchOrganization(orgId);
      const org = organizations.find((o) => o.id === orgId);
      setCurrentOrg(org);
      toast.success(`Switched to ${org.name}`);
    } catch (error) {
      toast.error("Failed to switch organization");
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#C0C0C0] animate-spin" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (organizations.length === 0) {
    return (
      <div className="w-full flex justify-center items-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Organizations Yet</h2>
          <p className="text-gray-400 mb-6">Create your first organization to get started</p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-6 py-3 silver-gradient hover:opacity-90 text-black font-bold rounded-xl transition-all silver-glow-hover"
          >
            <Plus className="w-5 h-5" />
            Create Organization
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <ShinyText text="Command Center" disabled={false} speed={2} className="silver-text" />
              </h1>
              <p className="text-gray-400 text-sm">Real-time insights and analytics for your credit operations</p>
            </div>

            {/* Organization Selector */}
            {organizations.length > 1 && (
              <div className="flex items-center gap-2">
                <select
                  value={currentOrg?.id || ""}
                  onChange={(e) => switchOrganization(e.target.value)}
                  className="px-4 py-2 bg-[#0a0a0a] border border-[#333333] rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#C0C0C0]/50"
                >
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Workspaces */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-[#0a0a0a] border border-[#333333] rounded-2xl silver-glow-hover group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-[#C0C0C0]/10 rounded-xl silver-border">
                  <FolderOpen className="w-6 h-6 text-[#C0C0C0]" />
                </div>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12%
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">
                <CountUp to={stats.totalWorkspaces} duration={2} />
              </h3>
              <p className="text-sm text-gray-400">Total Workspaces</p>
            </motion.div>

            {/* Active Workspaces */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-[#0a0a0a] border border-[#333333] rounded-2xl silver-glow-hover group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/30">
                  <Activity className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-xs text-blue-400 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Live
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">
                <CountUp to={stats.activeWorkspaces} duration={2} />
              </h3>
              <p className="text-sm text-gray-400">Active Analyses</p>
            </motion.div>

            {/* Total Documents */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 bg-[#0a0a0a] border border-[#333333] rounded-2xl silver-glow-hover group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/30">
                  <FileText className="w-6 h-6 text-green-400" />
                </div>
                <span className="text-xs text-green-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +24%
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">
                <CountUp to={stats.totalDocuments} duration={2} />
              </h3>
              <p className="text-sm text-gray-400">Documents Processed</p>
            </motion.div>

            {/* Average Risk Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 bg-[#0a0a0a] border border-[#333333] rounded-2xl silver-glow-hover group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
                  <Target className="w-6 h-6 text-yellow-400" />
                </div>
                <span className="text-xs text-yellow-400 flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  -5%
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">
                <CountUp to={stats.avgRiskScore} duration={2} />
              </h3>
              <p className="text-sm text-gray-400">Avg Risk Score</p>
            </motion.div>
          </div>

          {/* Current Organization Info */}
          {currentOrg && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-[#0a0a0a] border border-[#333333] rounded-2xl silver-glow-hover"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#C0C0C0]/10 rounded-xl silver-border">
                    <Building2 className="w-6 h-6 text-[#C0C0C0]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{currentOrg.name}</h2>
                    {currentOrg.description && (
                      <p className="text-gray-400 text-sm mb-3">{currentOrg.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {currentOrg.industry && (
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {currentOrg.industry}
                        </span>
                      )}
                      {currentOrg.memberCount && (
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {currentOrg.memberCount} members
                        </span>
                      )}
                      <span className="px-2 py-1 bg-[#C0C0C0]/20 text-[#C0C0C0] rounded-md text-xs font-medium">
                        {currentOrg.role}
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  href="/settings"
                  className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-400" />
                </Link>
              </div>
            </motion.div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href="/workspace/new"
                className="block p-6 bg-[#0a0a0a] border border-[#333333] rounded-2xl silver-glow-hover group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#C0C0C0]/10 rounded-xl silver-border group-hover:silver-glow transition-all">
                    <Plus className="w-6 h-6 text-[#C0C0C0]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#C0C0C0] transition-colors">
                      New Workspace
                    </h3>
                    <p className="text-sm text-gray-400">Start a new credit appraisal workflow</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-[#C0C0C0] transition-colors" />
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link
                href="/data-ingestion"
                className="block p-6 bg-[#0a0a0a] border border-[#333333] rounded-2xl silver-glow-hover group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/30 group-hover:bg-blue-500/20 transition-all">
                    <Database className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                      Upload Documents
                    </h3>
                    <p className="text-sm text-gray-400">Ingest financial data with AI OCR</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-blue-400 transition-colors" />
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link
                href="/agent-analysis"
                className="block p-6 bg-[#0a0a0a] border border-[#333333] rounded-2xl silver-glow-hover group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/30 group-hover:bg-purple-500/20 transition-all">
                    <BrainCircuit className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                      AI Analysis
                    </h3>
                    <p className="text-sm text-gray-400">Run multi-agent credit analysis</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-purple-400 transition-colors" />
                </div>
              </Link>
            </motion.div>
          </div>

          {/* System Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Platform Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="lg:col-span-2 p-6 bg-[#0a0a0a] border border-[#333333] rounded-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#C0C0C0]" />
                Platform Capabilities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: Database, title: "Data Ingestion", desc: "AI-powered OCR & classification", color: "blue" },
                  { icon: BrainCircuit, title: "Agent Analysis", desc: "Multi-agent credit assessment", color: "purple" },
                  { icon: Shield, title: "Risk Scoring", desc: "Real-time risk evaluation", color: "yellow" },
                  { icon: AlertTriangle, title: "Early Warning", desc: "Predictive risk signals", color: "red" },
                  { icon: FileText, title: "Credit Reports", desc: "Comprehensive appraisal reports", color: "green" },
                  { icon: Eye, title: "Orchestrator", desc: "Unified decision synthesis", color: "cyan" }
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-black/50 border border-[#333333] rounded-xl hover:border-[#C0C0C0]/50 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 bg-${feature.color}-500/10 rounded-lg border border-${feature.color}-500/30`}>
                        <feature.icon className={`w-5 h-5 text-${feature.color}-400`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1 group-hover:text-[#C0C0C0] transition-colors">
                          {feature.title}
                        </h4>
                        <p className="text-xs text-gray-500">{feature.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="p-6 bg-[#0a0a0a] border border-[#333333] rounded-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#C0C0C0]" />
                System Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">AI Agents</span>
                  <span className="flex items-center gap-2 text-sm text-green-400">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">OCR Service</span>
                  <span className="flex items-center gap-2 text-sm text-green-400">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Database</span>
                  <span className="flex items-center gap-2 text-sm text-green-400">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">API Status</span>
                  <span className="flex items-center gap-2 text-sm text-green-400">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    Healthy
                  </span>
                </div>
                <div className="pt-4 border-t border-[#333333]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">System Load</span>
                    <span className="text-sm text-[#C0C0C0]">32%</span>
                  </div>
                  <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#C0C0C0] to-[#808080] rounded-full" style={{ width: '32%' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Workspaces Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <FolderOpen className="w-6 h-6 text-[#C0C0C0]" />
                Your Workspaces
              </h3>
              <Link
                href="/workspace/new"
                className="flex items-center gap-2 px-4 py-2 silver-gradient hover:opacity-90 text-black font-bold rounded-xl transition-all silver-glow-hover"
              >
                <Plus className="w-4 h-4" />
                New Workspace
              </Link>
            </div>

            {workspacesLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-[#C0C0C0] animate-spin" />
              </div>
            ) : workspaces.length === 0 ? (
              <div className="text-center py-12 bg-[#0a0a0a] border border-[#333333] rounded-2xl">
                <FolderOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 mb-4">No workspaces yet</p>
                <Link
                  href="/workspace/new"
                  className="inline-flex items-center gap-2 px-4 py-2 silver-gradient hover:opacity-90 text-black font-medium rounded-lg transition-all"
                >
                  Create your first workspace
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workspaces.map((workspace, idx) => (
                  <motion.div
                    key={workspace.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link
                      href={`/workspace/${workspace.id}`}
                      className="block p-6 bg-[#0a0a0a] border border-[#333333] hover:border-[#C0C0C0]/50 rounded-2xl transition-all group silver-glow-hover"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-bold text-white group-hover:text-[#C0C0C0] transition-colors">
                          {workspace.name}
                        </h4>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${workspace.status === "completed"
                          ? "bg-green-500/20 text-green-400"
                          : workspace.status === "in_progress"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-gray-500/20 text-gray-400"
                          }`}>
                          {workspace.status}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-400">
                        <p>
                          <span className="text-gray-500">Company:</span> {workspace.company.name}
                        </p>
                        <p>
                          <span className="text-gray-500">Loan:</span> {workspace.loan.amount}
                        </p>
                        <p className="text-xs text-gray-600">
                          Created {new Date(workspace.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
