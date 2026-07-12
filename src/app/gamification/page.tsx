"use client";

import { Trophy, Star, Medal, Zap } from "lucide-react";
import DataTable from "@/components/DataTable";

const mockLeaderboard = [
  { rank: 1, name: "Jane Doe", dept: "HR", points: 4500, badges: 12 },
  { rank: 2, name: "John Smith", dept: "IT", points: 4200, badges: 10 },
  { rank: 3, name: "Alice Johnson", dept: "Ops", points: 3850, badges: 8 },
  { rank: 4, name: "Bob Williams", dept: "Sales", points: 3600, badges: 7 },
  { rank: 5, name: "Emma Davis", dept: "Marketing", points: 3450, badges: 6 },
];

export default function Gamification() {
  const leaderboardColumns = [
    { 
      key: "rank", 
      label: "Rank",
      render: (val: number) => (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 font-bold text-slate-300">
          {val === 1 ? <Trophy className="w-4 h-4 text-amber-400" /> : 
           val === 2 ? <Medal className="w-4 h-4 text-slate-300" /> : 
           val === 3 ? <Medal className="w-4 h-4 text-amber-700" /> : val}
        </div>
      )
    },
    { key: "name", label: "Employee Name" },
    { key: "dept", label: "Department" },
    { 
      key: "points", 
      label: "Total XP",
      render: (val: number) => <span className="font-semibold text-blue-400">{val.toLocaleString()} XP</span>
    },
    { key: "badges", label: "Badges Earned" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-purple-400" /> Gamification Center
          </h2>
          <p className="text-slate-400 mt-1">Challenges, rewards, and employee leaderboard.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-200">Active Challenges</h3>
            <button className="text-sm text-blue-400 hover:text-blue-300">View All</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Zero Print Week", desc: "Don't print any documents for 5 days.", xp: 500, users: 142, icon: <FileText className="w-5 h-5" />, color: "emerald" },
              { title: "Bike to Work", desc: "Commute via bicycle 3 times this week.", xp: 750, users: 89, icon: <Activity className="w-5 h-5" />, color: "blue" },
              { title: "Energy Saver", desc: "Ensure all monitors are off post 6PM.", xp: 300, users: 210, icon: <Zap className="w-5 h-5" />, color: "amber" },
            ].map((c, i) => (
              <div key={i} className={`glass-card p-5 relative overflow-hidden group`}>
                <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-${c.color}-500/10 group-hover:bg-${c.color}-500/20 transition-colors duration-500`} />
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-${c.color}-500/20 text-${c.color}-400`}>
                    {c.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-100">{c.title}</h4>
                    <p className="text-sm text-slate-400 mt-1 mb-3 line-clamp-2">{c.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-amber-400 flex items-center gap-1">
                        <Star className="w-3 h-3" /> {c.xp} XP
                      </span>
                      <button className={`px-3 py-1.5 text-xs font-medium rounded-lg bg-${c.color}-600 hover:bg-${c.color}-500 text-white transition-colors`}>
                        Join Challenge
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-slate-200 pt-4">Global Leaderboard</h3>
          <DataTable columns={leaderboardColumns} data={mockLeaderboard} />
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 border-t-4 border-amber-500/30 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-slate-800 border-4 border-amber-500/50 flex items-center justify-center mb-4">
              <Trophy className="w-10 h-10 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-100">Your Ranking</h3>
            <p className="text-3xl font-bold text-amber-400 my-2">#14</p>
            <p className="text-sm text-slate-400">Top 5% of the company</p>
            
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Current XP</span>
                <span className="font-medium text-blue-400">2,840</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[70%]" />
              </div>
              <p className="text-xs text-slate-500 mt-2 text-left">160 XP to next level</p>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Recent Badges</h3>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square rounded-xl bg-slate-900/50 border border-slate-700/50 flex flex-col items-center justify-center p-2 hover:bg-slate-800 transition-colors group cursor-pointer">
                  <Medal className={`w-8 h-8 mb-1 ${i % 2 === 0 ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className="text-[10px] text-center text-slate-400 group-hover:text-slate-200 leading-tight">Eco Warrior</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Missing imports hack for simplicity in MVP
import { Gamepad2, FileText, Activity } from "lucide-react";
