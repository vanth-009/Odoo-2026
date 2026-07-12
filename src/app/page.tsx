"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Leaf, Users, Shield, Trophy, FileText, ArrowRight, Activity } from "lucide-react";

export default function GlobalDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(body => {
        if (body.success) {
          setData(body.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const modules = [
    {
      title: "Environmental Console",
      description: "Manage carbon emissions, product lifecycle, and corporate sustainability goals.",
      href: "/environment",
      icon: Leaf,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20"
    },
    {
      title: "Social Responsibility",
      description: "Track CSR activities, diversity metrics, and employee engagement surveys.",
      href: "/social",
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20"
    },
    {
      title: "Corporate Governance",
      description: "Oversee internal audits, policy compliance, and regulatory adherence.",
      href: "/governance",
      icon: Shield,
      color: "text-violet-400",
      bg: "bg-violet-400/10",
      border: "border-violet-400/20"
    },
    {
      title: "ESG Gamification Hub",
      description: "Engage employees with challenges, badges, and XP leaderboards.",
      href: "/gamification",
      icon: Trophy,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      border: "border-amber-400/20"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-foreground font-sans relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-emerald-900/20 to-transparent -z-10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-700">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-8 h-8 text-emerald-400" />
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Odoo ESG Core
            </h1>
          </div>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Central command for enterprise sustainability. Monitor your global ESG score and access specialized operational modules.
          </p>
        </header>

        {loading ? (
          <div className="h-64 flex items-center justify-center border border-white/5 bg-white/[0.02] rounded-3xl mb-12">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
              <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">Aggregating Global Metrics...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            
            {/* Overall Score Highlight */}
            <div className="lg:col-span-5 relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 to-black p-8 group hover:border-emerald-500/50 transition-colors duration-500">
              <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 blur-[100px] group-hover:bg-emerald-500/10 transition-colors duration-500" />
              
              <h2 className="text-lg font-bold text-white mb-2 relative z-10 flex items-center gap-2">
                Overall ESG Rating
              </h2>
              <p className="text-sm text-zinc-400 mb-8 relative z-10">
                Weighted index based on department performance.
              </p>
              
              <div className="flex items-end gap-4 relative z-10">
                <span className="text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-teal-600 drop-shadow-sm">
                  {data?.overallEsgScore || 0}
                </span>
                <span className="text-xl text-zinc-500 font-bold mb-3">/ 100</span>
              </div>
            </div>

            {/* Sub-scores */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* E */}
              <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-colors flex flex-col justify-between group">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center mb-4">
                    <Leaf className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-zinc-200">Environmental</h3>
                  <p className="text-xs text-zinc-500 mt-1 font-mono uppercase tracking-wider">Weight: {data?.weights?.env || 40}%</p>
                </div>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white group-hover:text-emerald-400 transition-colors">{data?.envScore || 0}</span>
                  <span className="text-sm text-zinc-500">pts</span>
                </div>
              </div>

              {/* S */}
              <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-colors flex flex-col justify-between group">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-400/10 flex items-center justify-center mb-4">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="font-bold text-zinc-200">Social</h3>
                  <p className="text-xs text-zinc-500 mt-1 font-mono uppercase tracking-wider">Weight: {data?.weights?.soc || 30}%</p>
                </div>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white group-hover:text-blue-400 transition-colors">{data?.socScore || 0}</span>
                  <span className="text-sm text-zinc-500">pts</span>
                </div>
              </div>

              {/* G */}
              <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-colors flex flex-col justify-between group">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-violet-400/10 flex items-center justify-center mb-4">
                    <Shield className="w-5 h-5 text-violet-400" />
                  </div>
                  <h3 className="font-bold text-zinc-200">Governance</h3>
                  <p className="text-xs text-zinc-500 mt-1 font-mono uppercase tracking-wider">Weight: {data?.weights?.gov || 30}%</p>
                </div>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white group-hover:text-violet-400 transition-colors">{data?.govScore || 0}</span>
                  <span className="text-sm text-zinc-500">pts</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modules Grid */}
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          Operational Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((mod, idx) => (
            <Link key={idx} href={mod.href} className="group block h-full">
              <div className={`h-full rounded-2xl border ${mod.border} bg-white/[0.01] p-6 hover:bg-white/[0.03] transition-all duration-300 flex flex-col hover:-translate-y-1 hover:shadow-2xl hover:shadow-${mod.color.split('-')[1]}-500/10`}>
                <div className={`w-12 h-12 rounded-xl ${mod.bg} flex items-center justify-center mb-6`}>
                  <mod.icon className={`w-6 h-6 ${mod.color}`} />
                </div>
                <h3 className="text-lg font-bold text-zinc-100 mb-2 group-hover:text-white">{mod.title}</h3>
                <p className="text-sm text-zinc-400 flex-grow mb-6">{mod.description}</p>
                
                <div className="flex items-center text-xs font-bold uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors mt-auto">
                  Launch Module <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
