"use client";

import React from "react";
import { 
  FileText, ShieldAlert, CheckCircle2, Clock, AlertTriangle, 
  ArrowRight, Calendar, Landmark
} from "lucide-react";
import Link from "next/link";
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

interface GovernanceDashboardClientProps {
  stats: {
    totalPolicies: number;
    openComplianceIssues: number;
    completedAudits: number;
    pendingPolicyAcks: number;
    overdueIssues: number;
  };
  policyStatusData: { name: string; value: number; color: string }[];
  departmentStats: { name: string; policyCompliance: number; auditScore: number }[];
  recentAudits: {
    id: string;
    title: string;
    startDate: string;
    auditorName: string;
    status: string;
  }[];
  recentIssues: {
    id: string;
    title: string;
    sourceTitle: string;
    remediationDeadline: string;
    severity: string;
    status: string;
  }[];
}

export default function GovernanceDashboardClient({
  stats,
  policyStatusData,
  departmentStats,
  recentAudits,
  recentIssues
}: GovernanceDashboardClientProps) {
  
  const hasPolicyData = policyStatusData.some(d => d.value > 0);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent w-fit">
          Governance & Compliance Dashboard
        </h2>
        <p className="text-sm text-zinc-400">
          Monitor your ESG code framework, track compliance audits, and remediate risk exposures.
        </p>
      </div>

      {/* KPI Cards (Matches 5 stats cards requested) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        
        {/* Card 1: Total Policies */}
        <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] shadow-sm flex items-center gap-4 hover:border-emerald-550/30 transition-all">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-400">Total Policies</p>
            <h3 className="text-xl font-extrabold text-white mt-0.5">{stats.totalPolicies}</h3>
          </div>
        </div>

        {/* Card 2: Open Compliance Issues */}
        <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] shadow-sm flex items-center gap-4 hover:border-blue-550/30 transition-all">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-400">Open Compliance</p>
            <h3 className="text-xl font-extrabold text-white mt-0.5">{stats.openComplianceIssues}</h3>
          </div>
        </div>

        {/* Card 3: Completed Audits */}
        <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] shadow-sm flex items-center gap-4 hover:border-teal-550/30 transition-all">
          <div className="p-3 bg-teal-500/10 text-teal-400 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-400">Completed Audits</p>
            <h3 className="text-xl font-extrabold text-white mt-0.5">{stats.completedAudits}</h3>
          </div>
        </div>

        {/* Card 4: Pending Policy Acknowledgements */}
        <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] shadow-sm flex items-center gap-4 hover:border-amber-550/30 transition-all">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-400">Pending Acknowledgements</p>
            <h3 className="text-xl font-extrabold text-white mt-0.5">{stats.pendingPolicyAcks}</h3>
          </div>
        </div>

        {/* Card 5: Overdue Issues */}
        <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] shadow-sm flex items-center gap-4 hover:border-rose-550/30 transition-all">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-400">Overdue Issues</p>
            <h3 className="text-xl font-extrabold text-white mt-0.5">{stats.overdueIssues}</h3>
          </div>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Left: Donut Chart (Policies by Status) */}
        <div className="md:col-span-1 p-6 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col justify-between backdrop-blur-md">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Policies by Status</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">Overview of code standard publication states.</p>
          </div>
          <div className="h-60 mt-4 flex items-center justify-center relative">
            {hasPolicyData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={policyStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {policyStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '11px', borderRadius: '8px' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '10px', color: '#a1a1aa' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-zinc-550 text-xs flex flex-col items-center gap-1.5">
                <FileText className="w-8 h-8 opacity-40" />
                <span>No Policies Registered</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Bar Chart (Department Governance Score) */}
        <div className="md:col-span-2 p-6 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col justify-between backdrop-blur-md">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Department Governance Score</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">Comparison of department compliance and audit score ratings.</p>
          </div>
          <div className="h-60 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentStats}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={10} tickLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '11px', borderRadius: '8px' }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={32}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '10px', color: '#a1a1aa' }}
                />
                <Bar dataKey="policyCompliance" name="Policy Compliance (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="auditScore" name="Audit Score (%)" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Grid of Recent Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Recent Audits list */}
        <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col gap-5 backdrop-blur-md">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Recent Audit Activities</h3>
            </div>
            <Link href="/governance/audits" className="text-xs font-bold text-emerald-450 hover:underline flex items-center gap-0.5">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentAudits.length === 0 ? (
              <p className="text-xs text-zinc-500 py-6 text-center">No audits scheduled.</p>
            ) : (
              recentAudits.map(audit => (
                <div key={audit.id} className="flex items-center justify-between p-3.5 rounded-lg bg-black/30 border border-white/[0.04] hover:border-white/10 transition-colors">
                  <div className="flex flex-col gap-1">
                    <h4 className="font-semibold text-xs text-white leading-tight">{audit.title}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                      <span>{new Date(audit.startDate).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Auditor: {audit.auditorName}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                    audit.status === 'COMPLETED' || audit.status === 'Completed'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {audit.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Compliance Issues list */}
        <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col gap-5 backdrop-blur-md">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold text-white">Active Compliance Issues</h3>
            </div>
            <Link href="/governance/compliance" className="text-xs font-bold text-emerald-450 hover:underline flex items-center gap-0.5">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentIssues.length === 0 ? (
              <p className="text-xs text-zinc-500 py-6 text-center">No active compliance issues logged.</p>
            ) : (
              recentIssues.map(issue => (
                <div key={issue.id} className="flex items-center justify-between p-3.5 rounded-lg bg-black/30 border border-white/[0.04] hover:border-white/10 transition-colors">
                  <div className="flex flex-col gap-1">
                    <h4 className="font-semibold text-xs text-white leading-tight">{issue.title}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                      <span>Source: {issue.sourceTitle}</span>
                      <span>•</span>
                      <span>Due: {issue.remediationDeadline ? new Date(issue.remediationDeadline).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full border ${
                      issue.severity === 'HIGH' || issue.severity === 'Critical' || issue.severity === 'CRITICAL'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {issue.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
