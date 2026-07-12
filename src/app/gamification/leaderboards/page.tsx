"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, Trophy, Medal, Star, BarChart3, HelpCircle, 
  Clock, ShieldAlert, Award, ArrowUpRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RankedEmployee {
  rank: number;
  id: string;
  employeeName: string;
  employeeCode: string;
  departmentName: string;
  xp: number;
  badges: number;
}

interface DepartmentOption {
  id: string;
  name: string;
}

export default function LeaderboardsPage() {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [departmentId, setDepartmentId] = useState('all');
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [leaderboard, setLeaderboard] = useState<RankedEmployee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/gamification/leaderboard?departmentId=${departmentId}`);
      if (res.ok) {
        const json = await res.json();
        setLeaderboard(json.leaderboard || []);
        if (json.departments) {
          setDepartments(json.departments);
        }
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [departmentId]);

  const filteredList = leaderboard.filter(e => 
    e.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.departmentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Chart Data: Top 10 Employees
  const chartData = filteredList.slice(0, 10).map(e => ({
    name: e.employeeName.split(' ')[0], // First name only for chart spacing
    xp: e.xp
  }));

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Medal className="w-5 h-5 text-yellow-400 fill-yellow-400/10 shrink-0" />;
      case 2:
        return <Medal className="w-5 h-5 text-slate-350 fill-slate-300/10 shrink-0" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600 fill-amber-700/10 shrink-0" />;
      default:
        return <span className="font-mono text-zinc-550 text-xs w-5 text-center shrink-0">{rank}</span>;
    }
  };

  return (
    <div className="space-y-6 text-slate-100 animate-fadeIn">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-white">Gamification Leaderboards</h3>
        <p className="text-slate-400 text-sm mt-1">Audit employee carbon action rankings and compare engagement performance.</p>
      </div>

      {/* Primary timeframe tabs & filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        
        {/* Timeframe switch */}
        <div className="flex bg-zinc-950 p-1 rounded-xl border border-white/5 gap-1 select-none">
          {(['weekly', 'monthly', 'yearly'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
                timeframe === t
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search rankings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:outline-none"
            />
          </div>
          <div className="relative">
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-350 focus:outline-none"
            >
              <option value="all">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.id} className="bg-slate-900">{d.name}</option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Main Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Rankings Table list */}
          <div className="xl:col-span-2 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl flex flex-col">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-xs text-left">
                <thead className="text-zinc-400 uppercase bg-black/25">
                  <tr>
                    <th className="px-6 py-4 rounded-tl-lg font-medium w-20">Rank</th>
                    <th className="px-6 py-4 font-medium">Employee Name</th>
                    <th className="px-6 py-4 font-medium">Department</th>
                    <th className="px-6 py-4 font-medium pl-8">Total XP</th>
                    <th className="px-6 py-4 rounded-tr-lg font-medium">Badges Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-400 bg-transparent">
                        No ranking records found.
                      </td>
                    </tr>
                  ) : filteredList.map((e) => (
                    <tr key={e.id} className="hover:bg-white/[0.02] transition-colors">
                      
                      {/* Medal Rank */}
                      <td className="px-6 py-4">
                        {getMedalIcon(e.rank)}
                      </td>

                      {/* Profile details */}
                      <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                        <div className="w-7 h-7 rounded bg-white/5 border border-white/10 flex items-center justify-center font-bold text-[10px] text-zinc-400">
                          {e.employeeName.split(' ')[0][0]}{e.employeeName.split(' ').pop()?.[0]}
                        </div>
                        <div className="flex flex-col">
                          <span>{e.employeeName}</span>
                          <span className="text-[9px] font-normal text-zinc-550">{e.employeeCode}</span>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="px-6 py-4 text-slate-350">{e.departmentName}</td>

                      {/* XP */}
                      <td className="px-6 py-4 font-black text-amber-400 text-sm">
                        {e.xp.toLocaleString()} XP
                      </td>

                      {/* Badges count */}
                      <td className="px-6 py-4 text-slate-300 font-bold">
                        {e.badges > 0 ? (
                          <span className="inline-flex items-center gap-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded text-[10px]">
                            🏆 {e.badges} badges
                          </span>
                        ) : (
                          <span className="text-zinc-650 font-normal italic">None</span>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Panel: Top 10 Employees Chart Comparison */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Top 10 Comparison</h4>
              <span className="text-[10px] text-zinc-500">XP point spreads</span>
            </div>
            
            <div className="flex-1 min-h-[300px]">
              {chartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-zinc-550 italic text-xs">
                  No telemetry metrics to plot.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis type="number" stroke="#71717a" fontSize={9} />
                    <YAxis dataKey="name" type="category" stroke="#71717a" fontSize={9} width={50} />
                    <Tooltip contentStyle={{ background: '#09090b', borderColor: '#27272a', fontSize: '10px' }} />
                    <Bar dataKey="xp" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
