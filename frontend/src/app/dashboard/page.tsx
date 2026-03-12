"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Building2, Plus, Loader2, FolderOpen, Users, ArrowRight, Settings
} from "lucide-react";
import { motion } from "framer-motion";
import ShinyText from "@/components/ui/ShinyText";
import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [currentOrg, setCurrentOrg] = useState<any>(null);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [workspacesLoading, setWorkspacesLoading] = useState(false);

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
      setWorkspaces(response.data.workspaces);
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
          <Loader2 className="w-12 h-12 text-brand animate-spin" />
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold rounded-xl transition-all"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                <ShinyText text="Dashboard" disabled={false} speed={2} className="text-[#f8fafc]" />
              </h1>
              <p className="text-gray-400 text-sm">Manage your organizations and workspaces</p>
            </div>

            {/* Organization Selector */}
            {organizations.length > 1 && (
              <div className="flex items-center gap-2">
                <select
                  value={currentOrg?.id || ""}
                  onChange={(e) => switchOrganization(e.target.value)}
                  className="px-4 py-2 bg-[#0f172a] border border-[#1e293b] rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand/50"
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

          {/* Current Organization Info */}
          {currentOrg && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-[#0f172a] border border-[#1e293b] rounded-2xl"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand/20 rounded-xl">
                    <Building2 className="w-6 h-6 text-brand" />
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
                      <span className="px-2 py-1 bg-brand/20 text-brand rounded-md text-xs font-medium">
                        {currentOrg.role}
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  href="/settings"
                  className="p-2 hover:bg-[#1e293b] rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-400" />
                </Link>
              </div>
            </motion.div>
          )}

          {/* Workspaces Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Workspaces</h3>
              <Link
                href="/workspace/new"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold rounded-xl transition-all"
              >
                <Plus className="w-4 h-4" />
                New Workspace
              </Link>
            </div>

            {workspacesLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-brand animate-spin" />
              </div>
            ) : workspaces.length === 0 ? (
              <div className="text-center py-12 bg-[#0f172a] border border-[#1e293b] rounded-2xl">
                <FolderOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 mb-4">No workspaces yet</p>
                <Link
                  href="/workspace/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand hover:bg-blue-600 text-white font-medium rounded-lg transition-all"
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
                      className="block p-6 bg-[#0f172a] border border-[#1e293b] hover:border-brand/50 rounded-2xl transition-all group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-bold text-white group-hover:text-brand transition-colors">
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
