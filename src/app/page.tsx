"use client";

import { Leaf, Users, ShieldCheck, Target, ArrowRight, Activity, Plus } from "lucide-react";
import StatCard from "@/components/StatCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const emissionData = [
  { name: 'Jan', emissions: 400 },
  { name: 'Feb', emissions: 300 },
  { name: 'Mar', emissions: 550 },
  { name: 'Apr', emissions: 450 },
  { name: 'May', emissions: 400 },
  { name: 'Jun', emissions: 380 },
];

const departmentData = [
  { name: 'IT', score: 85 },
  { name: 'HR', score: 92 },
  { name: 'Ops', score: 78 },
  { name: 'Sales', score: 88 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Executive Overview</h2>
          <p className="text-slate-400 mt-1">Your company's ESG performance at a glance.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Environmental Score" 
          value="82 / 100" 
          color="emerald"
          icon={<Leaf className="w-6 h-6" />}
          trend="up"
          trendValue="+2.5%"
          subtitle="vs last month"
        />
        <StatCard 
          title="Social Score" 
          value="74 / 100" 
          color="blue"
          icon={<Users className="w-6 h-6" />}
          trend="up"
          trendValue="+1.2%"
          subtitle="vs last month"
        />
        <StatCard 
          title="Governance Score" 
          value="88 / 100" 
          color="purple"
          icon={<ShieldCheck className="w-6 h-6" />}
          trend="neutral"
          trendValue="0.0%"
          subtitle="vs last month"
        />
        <StatCard 
          title="Overall ESG Score" 
          value="81 / 100" 
          color="amber"
          icon={<Target className="w-6 h-6" />}
          trend="up"
          trendValue="+1.8%"
          subtitle="vs last month"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-100 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Emissions Tracking (tCO2e)
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={emissionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Line type="monotone" dataKey="emissions" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#0f172a'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-6">Department ESG Ranking</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" stroke="#64748b" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#1e293b'}}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                />
                <Bar dataKey="score" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { title: "Planting Trees Drive completed", time: "2 hours ago", type: "social" },
              { title: "Audit report submitted by Jane Doe", time: "5 hours ago", type: "governance" },
              { title: "New emissions factor added: Fleet Vehicles", time: "1 day ago", type: "environmental" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                <div className={`w-2 h-2 mt-2 rounded-full ${
                  item.type === 'social' ? 'bg-blue-400' : 
                  item.type === 'governance' ? 'bg-purple-400' : 'bg-emerald-400'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-slate-200 font-medium">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-sm text-blue-400 font-medium flex items-center gap-1 hover:text-blue-300 transition-colors">
            View All Activity <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                <Leaf className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-sm font-medium text-slate-300 group-hover:text-emerald-400">Log Carbon Data</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:bg-amber-500/10 hover:border-amber-500/30 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
                <Target className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-sm font-medium text-slate-300 group-hover:text-amber-400">Start Challenge</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:bg-blue-500/10 hover:border-blue-500/30 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-sm font-medium text-slate-300 group-hover:text-blue-400">Join Event</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:bg-purple-500/10 hover:border-purple-500/30 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-sm font-medium text-slate-300 group-hover:text-purple-400">Review Policy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
