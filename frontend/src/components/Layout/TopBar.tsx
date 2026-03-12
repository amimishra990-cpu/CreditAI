"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  User,
  LogOut,
  Settings,
  Shield,
  Building2,
  LayoutDashboard,
  Database,
  BrainCircuit,
  Workflow,
  AlertTriangle,
  FileText,
  Plus,
  Menu,
  X,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { cn } from "@/lib/utils";
import ShinyText from "@/components/ui/ShinyText";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Data Ingestion", href: "/data-ingestion", icon: Database },
  { name: "Agent Analysis", href: "/agent-analysis", icon: BrainCircuit },
  { name: "Orchestrator", href: "/orchestrator", icon: Workflow },
  { name: "Early Warning", href: "/early-warning", icon: AlertTriangle },
  { name: "Credit Report", href: "/report", icon: FileText },
];

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentOrg, setCurrentOrg] = useState<any>(null);

  // Public pages where TopBar should not show
  const publicPages = ["/", "/login", "/signup"];
  const shouldShow = !publicPages.includes(pathname);

  useEffect(() => {
    if (shouldShow && user?.currentOrganizationId) {
      loadCurrentOrg();
    }
  }, [user?.currentOrganizationId, shouldShow]);

  const loadCurrentOrg = async () => {
    try {
      const response = await apiClient.getOrganization(user!.currentOrganizationId!);
      setCurrentOrg(response.data.organization);
    } catch (error) {
      console.error("Failed to load organization:", error);
    }
  };

  const getCurrentRole = () => {
    if (!user?.currentOrganizationId || !user?.organizations) return "viewer";
    const org = user.organizations.find((o) => o.organizationId === user.currentOrganizationId);
    return org?.role || "viewer";
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "admin":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "analyst":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "viewer":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const currentRole = getCurrentRole();

  // Don't render if on public pages
  if (!shouldShow) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#333333] bg-black/95 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 max-w-[1920px] mx-auto">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 shrink-0">
          <div className="bg-[#C0C0C0]/10 p-2 rounded-xl flex items-center justify-center border border-[#C0C0C0]/30 shadow-[0_0_15px_rgba(192,192,192,0.3)]">
            <ShieldAlert className="text-[#C0C0C0] w-5 h-5" />
          </div>
          <ShinyText
            text="CreditAI"
            disabled={false}
            speed={2.5}
            className="text-xl font-black tracking-tight hidden sm:block silver-text"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center px-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-[#C0C0C0]/15 text-white silver-border"
                    : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* New Workspace Button */}
          <Link
            href="/workspace/new"
            className="hidden md:flex items-center gap-2 px-4 py-2 silver-gradient hover:opacity-90 text-black text-sm font-bold rounded-lg transition-all silver-glow-hover"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xl:inline">New Workspace</span>
          </Link>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-[#C0C0C0] transition-colors rounded-lg hover:bg-[#C0C0C0]/10">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-black shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="h-9 w-9 rounded-full bg-gradient-to-br from-[#C0C0C0] to-[#808080] flex items-center justify-center p-[2px] shadow-[0_0_10px_rgba(192,192,192,0.5)] hover:shadow-[0_0_15px_rgba(192,192,192,0.8)] transition-all overflow-hidden group"
            >
              <div className="h-full w-full rounded-full bg-black flex items-center justify-center transition-colors group-hover:bg-[#0a0a0a]">
                <User className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
              </div>
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#0a0a0a] border border-[#333333] shadow-2xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-[#333333]">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#C0C0C0] to-[#808080] flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-black" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                              currentRole
                            )}`}
                          >
                            <Shield className="w-3 h-3" />
                            {currentRole.toUpperCase()}
                          </span>
                        </div>
                        {currentOrg && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                            <Building2 className="w-3 h-3" />
                            <span className="truncate">{currentOrg.name}</span>
                          </div>
                        )}
                        {user?.organizations && user.organizations.length > 1 && (
                          <p className="text-xs text-gray-600 mt-1">
                            {user.organizations.length} organizations
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    {user?.organizations && user.organizations.length > 1 && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          router.push("/dashboard");
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors"
                      >
                        <Building2 className="w-4 h-4" />
                        Switch Organization
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        router.push("/settings");
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {showMobileMenu && (
        <div className="lg:hidden border-t border-[#333333] bg-[#0a0a0a]/95 backdrop-blur-xl">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMobileMenu(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-[#C0C0C0]/15 text-white silver-border"
                      : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <Link
              href="/workspace/new"
              onClick={() => setShowMobileMenu(false)}
              className="flex items-center gap-3 px-4 py-3 silver-gradient text-black rounded-lg text-sm font-bold"
            >
              <Plus className="w-5 h-5" />
              <span>New Workspace</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
