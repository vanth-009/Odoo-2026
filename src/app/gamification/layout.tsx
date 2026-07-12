"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Trophy, LayoutDashboard, Target, Users, Landmark, 
  Award, ShieldAlert, FileText, Settings, Gift, BarChart2
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';

export default function GamificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/gamification") return pathname === "/gamification";
    return pathname.startsWith(href);
  };

  const navItems = [
    { label: 'Dashboard Overview', href: '/gamification', icon: LayoutDashboard },
    { label: 'Challenges', href: '/gamification/challenges', icon: Target },
    { label: 'Submissions Review', href: '/gamification/participation', icon: Users },
    { label: 'XP Management', href: '/gamification/xp', icon: Award },
    { label: 'Badges Milestones', href: '/gamification/badges', icon: Trophy },
    { label: 'Rewards Store', href: '/gamification/rewards', icon: Gift },
    { label: 'Leaderboards', href: '/gamification/leaderboards', icon: BarChart2 },
    { label: 'Achievements Timeline', href: '/gamification/achievements', icon: ShieldAlert },
    { label: 'Export Reports', href: '/gamification/reports', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-100 flex flex-col font-sans">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1c1917', color: '#fff' } }} />

      {/* Global ESG Top Navigation Bar */}
      <header className="border-b border-white/10 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Trophy className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide">EcoSphere ESG Console</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Gamification &amp; Engagement Hub</p>
          </div>
        </div>

        {/* ESG systems link tabs */}
        <div className="flex bg-zinc-950/80 p-1 rounded-xl border border-white/5 gap-1">
          <Link href="/environment" className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-zinc-400 hover:text-white transition-all">
            Environmental
          </Link>
          <Link href="/social" className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-zinc-400 hover:text-white transition-all">
            Social
          </Link>
          <Link href="/governance" className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-zinc-400 hover:text-white transition-all">
            Governance
          </Link>
          <Link href="/gamification" className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 text-black transition-all shadow-md shadow-emerald-500/10">
            Gamification
          </Link>
        </div>
      </header>

      {/* Main Screen Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Navigation Sidebar */}
        <aside className="w-64 border-r border-white/10 bg-[#0c0c0e] p-4 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            <div className="px-2">
              <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest">Gamification Console</span>
            </div>
            
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all group ${
                      active
                        ? 'bg-emerald-500/10 text-emerald-450 border-l-2 border-emerald-500'
                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.02]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 transition-transform ${active ? 'text-emerald-450' : 'text-zinc-500 group-hover:text-white'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-white/5 pt-4">
            <div className="bg-black/30 border border-white/5 p-3 rounded-lg flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs text-white">
                AD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">Amit Das</p>
                <p className="text-[9px] text-zinc-500 truncate">Platform Administrator</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#09090b]">
          {children}
        </main>

      </div>
    </div>
  );
}
