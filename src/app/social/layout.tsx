"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users2, Globe, FileSpreadsheet, LayoutDashboard, Trophy, Shield, Landmark, Settings2, HelpCircle,
  Calendar, CheckSquare, PieChart, TrendingUp
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/social", icon: LayoutDashboard },
  { label: "CSR Activities", href: "/social/csr-activities", icon: Globe },
  { label: "Participation", href: "/social/participation", icon: CheckSquare },
  { label: "Diversity", href: "/social/diversity", icon: PieChart },
  { label: "Engagement & Training", href: "/social/engagement", icon: TrendingUp },
  { label: "Social Reports", href: "/social/reports", icon: FileSpreadsheet },
];

export default function SocialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/social") return pathname === "/social";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-1 bg-[#09090b] text-[#f4f4f5] min-h-screen relative overflow-hidden transition-all duration-300">
      
      {/* Ambient backgrounds */}
      <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.06),transparent_60%)] pointer-events-none z-0" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.04),transparent_60%)] pointer-events-none z-0" />

      {/* Shared Left Sidebar */}
      <aside className="w-64 border-r border-[#1f1f23]/60 bg-[#09090b]/80 backdrop-blur-md flex flex-col justify-between hidden md:flex shrink-0 z-10 relative">
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-[#1f1f23]/40 gap-3">
            <div className="w-5.5 h-5.5 bg-emerald-500 rounded-md flex items-center justify-center font-bold text-[#09090b] text-[11px] shadow-[0_0_20px_rgba(16,185,129,0.25)] flex-shrink-0">
              S
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-[11px] tracking-widest text-[#f4f4f5] block uppercase">EcoSphere</span>
              <span className="text-[7.5px] text-zinc-500 font-mono tracking-widest uppercase flex items-center gap-1 -mt-0.5">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                Social Mode Active
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-2">
            <span className="px-3 text-[8.5px] uppercase font-bold tracking-widest text-zinc-500 block mb-3">Sections</span>
            
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 border border-transparent rounded-lg text-xs font-semibold relative transition-all duration-200 group ${
                    active 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                      : "text-zinc-400 hover:bg-zinc-900/40 hover:text-[#f4f4f5]"
                  }`}
                >
                  <item.icon className={`w-4 h-4 transition-colors ${active ? "text-emerald-400" : "text-zinc-400 group-hover:text-[#f4f4f5]"}`} />
                  {item.label}
                </Link>
              );
            })}

            {/* Active ESG Modules switcher */}
            <div className="pt-6 pb-2 px-3 text-[8.5px] uppercase font-bold tracking-widest text-zinc-500">
              ESG Systems
            </div>

            <Link 
              href="/environment" 
              className="flex items-center gap-3 px-3 py-2 text-zinc-400 border border-transparent rounded-lg text-xs font-semibold relative transition-all duration-200 group hover:bg-zinc-900/40 hover:text-[#f4f4f5]"
            >
              <Landmark className="w-4 h-4 text-zinc-400 group-hover:text-[#f4f4f5] transition-colors" />
              Environmental Console
            </Link>

            <Link 
              href="/social" 
              className="flex items-center gap-3 px-3 py-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs font-semibold relative transition-all duration-200 group"
            >
              <Users2 className="w-4 h-4 text-emerald-400" />
              Social Console
            </Link>

            <Link 
              href="/governance" 
              className="flex items-center gap-3 px-3 py-2 text-zinc-400 border border-transparent rounded-lg text-xs font-semibold relative transition-all duration-200 group hover:bg-zinc-900/40 hover:text-[#f4f4f5]"
            >
              <Shield className="w-4 h-4 text-zinc-400 group-hover:text-[#f4f4f5] transition-colors" />
              Governance Console
            </Link>

            <Link 
              href="/gamification" 
              className="flex items-center gap-3 px-3 py-2 text-zinc-400 border border-transparent rounded-lg text-xs font-semibold relative transition-all duration-200 group hover:bg-zinc-900/40 hover:text-[#f4f4f5]"
            >
              <Trophy className="w-4 h-4 text-zinc-400 group-hover:text-[#f4f4f5] transition-colors" />
              Gamification Hub
            </Link>
          </nav>
        </div>

        {/* Sidebar settings */}
        <div className="p-4 border-t border-[#1f1f23]/40 space-y-2 text-zinc-550 text-xs">
          <Link 
            href="/social/settings"
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 font-medium ${
              isActive("/social/settings")
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "text-zinc-400 hover:bg-[#18181b] hover:text-[#f4f4f5]"
            }`}
          >
            <Settings2 className="w-4 h-4" />
            Social Settings
          </Link>
          <a href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-[#18181b] hover:text-[#f4f4f5] rounded-lg transition-all duration-200 font-medium">
            <HelpCircle className="w-4 h-4" />
            Help Center
          </a>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto z-10 relative">
        {/* Header banner */}
        <header className="h-16 border-b border-[#1f1f23]/30 px-8 flex items-center justify-between bg-[#09090b]/50 backdrop-blur-md shrink-0">
          <div className="flex flex-col">
            <span className="text-[8.5px] font-mono tracking-widest text-zinc-550 uppercase">ESG Intelligence Node</span>
            <h1 className="text-sm font-extrabold text-[#f4f4f5] tracking-tight -mt-0.5">Corporate Social Console</h1>
          </div>
        </header>

        {/* Content area */}
        <div className="p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
