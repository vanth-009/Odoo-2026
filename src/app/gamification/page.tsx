"use client";

import { useEffect, useState } from "react";
import { Medal, Trophy, Star, Target, Zap, ChevronUp, Hexagon, Flame, Droplets, Users } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function Gamification() {
  const [loaded, setLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleClaimReward = () => {
    toast("Achievement token minted to department ledger.", "success");
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            Impact Gamification Engine
          </h2>
          <p className="text-sm font-mono text-muted-foreground mt-2 uppercase tracking-widest">Departmental Telemetry & Achievement Nodes</p>
        </div>
        <div className="flex items-center gap-3 bg-muted/50 p-2 rounded-lg border border-border">
          <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center border border-primary/30">
            <Flame size={16} className="text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Active Campaign</p>
            <p className="text-sm font-bold text-foreground">Q3 Net-Zero Sprint</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Global Leaderboard */}
        <div className="lg:col-span-7 erp-panel p-6 rounded-2xl flex flex-col">
          <div className="flex justify-between items-end mb-6">
            <h3 className="font-bold text-lg">Sector Leaderboard</h3>
            <span className="text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded">LIVE SYNC</span>
          </div>
          
          <div className="space-y-4 flex-1">
            {[
              { rank: 1, name: "Logistics Hub B", score: "9,420", delta: "+420", icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/30" },
              { rank: 2, name: "Corporate HQ", score: "8,115", delta: "+150", icon: Medal, color: "text-slate-400", bg: "bg-slate-400/10", border: "border-slate-400/30" },
              { rank: 3, name: "R&D Facility Alpha", score: "7,890", delta: "+85", icon: Medal, color: "text-amber-700", bg: "bg-amber-700/10", border: "border-amber-700/30" },
              { rank: 4, name: "Manufacturing Sec-4", score: "6,200", delta: "-40", icon: Target, color: "text-muted-foreground", bg: "bg-muted", border: "border-border" },
              { rank: 5, name: "European Datacenter", score: "5,950", delta: "+12", icon: Target, color: "text-muted-foreground", bg: "bg-muted", border: "border-border" },
            ].map((sector) => (
              <div key={sector.rank} className={`flex items-center gap-4 p-3 rounded-xl border ${sector.border} ${sector.bg} hover:bg-muted/80 transition-colors cursor-pointer group`} onClick={() => toast(`Viewing telemetry for ${sector.name}`, "info")}>
                <div className="w-8 h-8 rounded flex items-center justify-center font-mono font-bold text-lg shrink-0">
                  #{sector.rank}
                </div>
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shadow-inner shrink-0">
                  <sector.icon size={20} className={sector.color} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-foreground">{sector.name}</h4>
                  <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Impact Score</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-extrabold text-lg text-foreground">{sector.score}</p>
                  <p className={`text-[10px] font-mono font-bold uppercase tracking-widest mt-0.5 flex items-center justify-end gap-0.5 ${sector.delta.startsWith('+') ? 'text-primary' : 'text-destructive'}`}>
                    {sector.delta.startsWith('+') ? <ChevronUp size={12} /> : null} {sector.delta} PTS
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Nodes */}
        <div className="lg:col-span-5 grid grid-rows-2 gap-6">
          <div className="erp-panel p-6 rounded-2xl flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors pointer-events-none"></div>
            
            <div className="z-10">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">Next Unlockable Node</h3>
                <Hexagon size={24} className="text-primary" strokeWidth={1.5} />
              </div>
              <h4 className="font-extrabold text-2xl text-primary text-gradient mb-1">Zero-Waste Vanguard</h4>
              <p className="text-sm text-muted-foreground font-medium">Achieve 95% material recycling across all local facilities for 30 consecutive days.</p>
            </div>
            
            <div className="z-10 mt-6">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Progress Vector</span>
                <span className="font-mono text-sm font-bold text-primary">82%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" style={{ width: '82%' }}></div>
              </div>
            </div>
          </div>

          <div className="erp-panel p-6 rounded-2xl flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Unlocked Nodes</h3>
              <span className="text-xs font-mono font-bold text-muted-foreground">3 / 12 Earned</span>
            </div>
            
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <Star size={24} className="text-primary fill-primary/20" />
                </div>
                <span className="text-[9px] font-mono font-bold text-center text-foreground uppercase">Carbon Neutral<br/>HQ</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.2)]">
                  <Droplets size={24} className="text-sky-500 fill-sky-500/20" />
                </div>
                <span className="text-[9px] font-mono font-bold text-center text-foreground uppercase">Water<br/>Steward</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                  <Users size={24} className="text-purple-500 fill-purple-500/20" />
                </div>
                <span className="text-[9px] font-mono font-bold text-center text-foreground uppercase">DEI<br/>Champion</span>
              </div>
            </div>
            
            <button onClick={handleClaimReward} className="mt-auto w-full py-2.5 bg-background border border-border hover:bg-muted text-foreground font-mono text-xs font-bold uppercase tracking-widest rounded-lg transition-colors">
              Mint Tokens
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
