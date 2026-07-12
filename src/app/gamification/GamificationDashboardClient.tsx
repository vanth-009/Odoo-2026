"use client";

import React from 'react';
import { 
  Trophy, Target, Users, Award, Gift, Sparkles, TrendingUp, HelpCircle 
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

interface KPIProps {
  totalChallenges: number;
  activeChallenges: number;
  employeesParticipating: number;
  totalXpAwarded: number;
  badgesEarned: number;
  rewardsRedeemed: number;
}

interface ChartProps {
  challengeCompletionTrend: any[];
  xpEarnedOverTime: any[];
  topDepartments: any[];
  participationByDepartment: any[];
}

export default function GamificationDashboardClient({
  kpis,
  charts
}: {
  kpis: KPIProps;
  charts: ChartProps;
}) {
  return (
    <div className="space-y-6 text-slate-100 animate-fadeIn">
      
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-white">Gamification Control Dashboard</h3>
        <p className="text-slate-400 text-sm mt-1">Monitor high-level engagement metrics, employee challenge completions, and XP allocation ledgers.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        
        {/* Total Challenges */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md relative overflow-hidden flex flex-col justify-between min-h-[100px]">
          <div className="flex justify-between items-start text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Challenges</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">{kpis.totalChallenges}</span>
            <span className="block text-[9px] text-zinc-500 mt-1">Across all categories</span>
          </div>
        </div>

        {/* Active Challenges */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md relative overflow-hidden flex flex-col justify-between min-h-[100px]">
          <div className="flex justify-between items-start text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active Challenges</span>
            <Sparkles className="w-4 h-4 text-emerald-450" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">{kpis.activeChallenges}</span>
            <span className="block text-[9px] text-emerald-400 mt-1">Live right now</span>
          </div>
        </div>

        {/* Employees Participating */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md relative overflow-hidden flex flex-col justify-between min-h-[100px]">
          <div className="flex justify-between items-start text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Participating</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">{kpis.employeesParticipating}</span>
            <span className="block text-[9px] text-zinc-500 mt-1">Unique employees</span>
          </div>
        </div>

        {/* Total XP Awarded */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md relative overflow-hidden flex flex-col justify-between min-h-[100px]">
          <div className="flex justify-between items-start text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total XP</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">{kpis.totalXpAwarded.toLocaleString()}</span>
            <span className="block text-[9px] text-amber-400 mt-1">Points credited</span>
          </div>
        </div>

        {/* Badges Earned */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md relative overflow-hidden flex flex-col justify-between min-h-[100px]">
          <div className="flex justify-between items-start text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Badges Earned</span>
            <Trophy className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">{kpis.badgesEarned}</span>
            <span className="block text-[9px] text-zinc-500 mt-1">Milestones unlocked</span>
          </div>
        </div>

        {/* Rewards Redeemed */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md relative overflow-hidden flex flex-col justify-between min-h-[100px]">
          <div className="flex justify-between items-start text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Redeemed</span>
            <Gift className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">{kpis.rewardsRedeemed}</span>
            <span className="block text-[9px] text-zinc-500 mt-1">Claimed vouchers</span>
          </div>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Challenge Completion Trend */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Challenge Completion Trend</h4>
            <span className="text-[10px] text-zinc-500">Submissions approved over time</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.challengeCompletionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" stroke="#71717a" fontSize={10} />
                <YAxis stroke="#71717a" fontSize={10} />
                <Tooltip contentStyle={{ background: '#09090b', borderColor: '#27272a', fontSize: '11px' }} />
                <Line type="monotone" dataKey="completions" stroke="#10b981" strokeWidth={2} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* XP Earned Over Time */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">XP Earned Over Time</h4>
            <span className="text-[10px] text-zinc-500">Aggregated points distribution</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.xpEarnedOverTime}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" stroke="#71717a" fontSize={10} />
                <YAxis stroke="#71717a" fontSize={10} />
                <Tooltip contentStyle={{ background: '#09090b', borderColor: '#27272a', fontSize: '11px' }} />
                <Area type="monotone" dataKey="xp" stroke="#f59e0b" fillOpacity={1} fill="url(#colorXp)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Departments by XP */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Top Departments by XP Points</h4>
            <span className="text-[10px] text-zinc-500">Leading sustainability departments</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.topDepartments}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#71717a" fontSize={10} />
                <YAxis stroke="#71717a" fontSize={10} />
                <Tooltip contentStyle={{ background: '#09090b', borderColor: '#27272a', fontSize: '11px' }} />
                <Bar dataKey="totalXp" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Participation Rate by Department */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Participation Rate by Department</h4>
            <span className="text-[10px] text-zinc-500">Percentage of active employees</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.participationByDepartment}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#71717a" fontSize={10} />
                <YAxis stroke="#71717a" fontSize={10} tickFormatter={(val) => `${val}%`} />
                <Tooltip contentStyle={{ background: '#09090b', borderColor: '#27272a', fontSize: '11px' }} formatter={(val) => [`${val}%`, 'Rate']} />
                <Bar dataKey="rate" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
