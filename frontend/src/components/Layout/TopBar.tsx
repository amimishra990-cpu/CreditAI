"use client";

import React from "react";
import { Bell, Search, User } from "lucide-react";
import { usePathname } from "next/navigation";

export function TopBar() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1e293b]/60 bg-[#030712]/70 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-full max-w-sm hidden md:flex group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent rounded-full blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-emerald-400 transition-colors z-10" />
            <input
              type="text"
              placeholder="Search companies, applications..."
              className="w-full relative z-10 bg-[#0f172a]/80 border border-[#1e293b] rounded-full pl-10 pr-4 py-2 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all shadow-inner"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-400 hover:text-emerald-400 transition-colors rounded-full hover:bg-emerald-500/10">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-[#030712] shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
          </button>
          
          <button className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-blue-600 flex items-center justify-center p-[2px] shadow-[0_0_10px_rgba(52,211,153,0.3)] hover:shadow-[0_0_15px_rgba(52,211,153,0.6)] transition-all overflow-hidden group">
            <div className="h-full w-full rounded-full bg-[#030712] flex items-center justify-center transition-colors group-hover:bg-[#030712]/80">
               <User className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
