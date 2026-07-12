import React from 'react';
import { Leaf, Calendar, Award, Target, AlertTriangle, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { DashboardKPIs } from '../types';

interface KPIOverviewProps {
  kpis: DashboardKPIs;
}

export default function KPIOverview({ kpis }: KPIOverviewProps) {
  const scorePercentage = kpis.avgScore;
  const scoreCircumference = 2 * Math.PI * 24; // r=24
  const scoreStrokeDashoffset = scoreCircumference - (scorePercentage / 100) * scoreCircumference;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
      {/* Primary Hero KPI: Org-Wide Score with Circular Progress Gauge (Col-span 4) */}
      <div className="md:col-span-4 bg-gradient-to-br from-[#141417]/80 to-emerald-950/10 border border-[#27272a]/40 hover:border-emerald-500/30 rounded-2xl p-6.5 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.55)] transition-premium group relative overflow-hidden">
        {/* Subtle hover gradient background */}
        <div className="absolute inset-0 bg-radial-glow from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-premium pointer-events-none" />
        
        <div className="flex justify-between items-start z-10">
          <div>
            <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-500">Telemetry Index</span>
            <h4 className="text-[#f4f4f5] text-xs font-bold mt-0.5">Environmental Score</h4>
          </div>
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
            <Award className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-center gap-6 my-6 z-10">
          {/* Circular Progress SVG */}
          <div className="relative w-18 h-18 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="36"
                cy="36"
                r="24"
                className="stroke-[#1f1f23]"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="36"
                cy="36"
                r="24"
                className="stroke-emerald-500 transition-all duration-1000"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={scoreCircumference}
                strokeDashoffset={scoreStrokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-lg font-extrabold text-[#f4f4f5] tracking-tight">{scorePercentage}</span>
              <span className="text-[7.5px] text-zinc-500 block -mt-1 font-mono">/100</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xl font-bold text-[#f4f4f5] tracking-tight">{scorePercentage >= 80 ? 'Class-A Rating' : 'Class-B Rating'}</span>
            <p className="text-zinc-400 text-[10px] leading-relaxed">
              Weighted index calculated based on emission standards and goal precision.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-[#1f1f23]/40 flex items-center justify-between text-[9px] text-zinc-500 z-10 font-medium">
          <span>Target Score Limit</span>
          <span className="font-semibold text-emerald-400">82.4% Target</span>
        </div>
      </div>

      {/* Carbon Engine: Emissions with MoM breakdown (Col-span 5) */}
      <div className="md:col-span-5 bg-[#141417]/80 border border-[#27272a]/40 hover:border-emerald-500/30 rounded-2xl p-6.5 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.55)] transition-premium group relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-500">Real-Time Telemetry</span>
            <h4 className="text-[#f4f4f5] text-xs font-bold mt-0.5">Total Carbon Emissions</h4>
          </div>
          <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
            <Leaf className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-end justify-between my-5">
          <div className="space-y-1.5">
            <span className="text-3xl font-black text-[#f4f4f5] tracking-tight">
              {kpis.totalEmissions.toLocaleString()} <span className="text-xs font-semibold text-zinc-500 font-mono">tCO2e</span>
            </span>
            <div className="flex items-center gap-1.5">
              {kpis.momChange < 0 ? (
                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ArrowDownRight className="w-3 h-3" />
                  {Math.abs(kpis.momChange)}% MoM
                </span>
              ) : (
                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <ArrowUpRight className="w-3 h-3" />
                  +{Math.abs(kpis.momChange)}% MoM
                </span>
              )}
              <span className="text-[9.5px] text-zinc-500 font-medium">vs previous cycle</span>
            </div>
          </div>

          {/* Mini comparison bar visualizer */}
          <div className="flex items-end gap-1.5 h-14 w-18 shrink-0">
            <div className="flex flex-col items-center flex-1">
              <span className="text-[7.5px] text-zinc-500 font-mono mb-1">Prev</span>
              <div className="w-full bg-[#1f1f23] rounded-t-sm h-8" />
            </div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-[7.5px] text-zinc-400 font-mono mb-1">Curr</span>
              <div 
                className={`w-full rounded-t-sm transition-all duration-550 ${kpis.momChange < 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                style={{ height: `${Math.min(14 * 3, Math.max(6, 8 * (1 + kpis.momChange / 100)))}px` }}
              />
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[#1f1f23]/40 flex items-center justify-between text-[9px] text-zinc-500 font-medium">
          <span>Reporting Period</span>
          <span className="font-mono text-zinc-400">Current: {kpis.currentMonthEmissions.toLocaleString()} t</span>
        </div>
      </div>

      {/* Target Breaches & Goals: Contextual Stats (Col-span 3) */}
      <div className="md:col-span-3 bg-[#141417]/80 border border-[#27272a]/40 hover:border-emerald-500/30 rounded-2xl p-6.5 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.55)] transition-premium group relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-500">Compliance Indices</span>
            <h4 className="text-[#f4f4f5] text-xs font-bold mt-0.5">Active Targets</h4>
          </div>
          <div className="p-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
            <Target className="w-4 h-4" />
          </div>
        </div>

        <div className="my-4.5 space-y-3">
          <div className="flex justify-between items-center bg-[#09090b]/60 border border-[#27272a]/20 p-2.5 rounded-xl">
            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-3.5 h-3.5 ${kpis.deptsExceedingTarget > 0 ? 'text-rose-400' : 'text-zinc-500'}`} />
              <span className="text-[10px] font-semibold text-zinc-300">Target Breaches</span>
            </div>
            <span className={`font-mono text-xs font-bold ${kpis.deptsExceedingTarget > 0 ? 'text-rose-400' : 'text-zinc-400'}`}>
              {kpis.deptsExceedingTarget} Depts
            </span>
          </div>

          <div className="flex justify-between items-center bg-[#09090b]/60 border border-[#27272a]/20 p-2.5 rounded-xl">
            <div className="flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[10px] font-semibold text-zinc-300">Goals Achieved</span>
            </div>
            <span className="font-mono text-xs font-bold text-purple-400">
              {kpis.goalsAchieved} / {kpis.activeGoals + kpis.goalsAchieved}
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-[#1f1f23]/40 flex items-center justify-between text-[9px] text-zinc-500 font-medium">
          <span>Net Carbon Avoided</span>
          <span className="font-mono text-emerald-405 font-bold">+{kpis.netCarbonSaved.toLocaleString()} t</span>
        </div>
      </div>
    </div>
  );
}
