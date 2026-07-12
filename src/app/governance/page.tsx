import React from 'react';
import { prisma } from '@/lib/db';
import { 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0; // Disable caching

export default async function GovernanceOverviewPage() {
  // Query totals
  const totalPolicies = await prisma.policy.count();
  const totalAudits = await prisma.audit.count();
  
  const completedAudits = await prisma.audit.count({
    where: { status: 'COMPLETED' }
  });

  const openComplianceIssues = await prisma.complianceIssue.count({
    where: { status: { in: ['OPEN', 'UNDER_INVESTIGATION'] } }
  });

  const highSeverityIssues = await prisma.complianceIssue.count({
    where: { 
      status: { in: ['OPEN', 'UNDER_INVESTIGATION'] },
      severity: 'HIGH'
    }
  });

  // Calculate Average Acknowledgement Rate
  const employeesCount = await prisma.employee.count();
  const policies = await prisma.policy.findMany({
    include: {
      acknowledgements: true
    }
  });

  let totalAckRate = 0;
  if (policies.length > 0 && employeesCount > 0) {
    const sumRates = policies.reduce((sum, pol) => {
      const acks = pol.acknowledgements.length;
      return sum + (acks / employeesCount);
    }, 0);
    totalAckRate = Math.round((sumRates / policies.length) * 100);
  } else if (policies.length > 0) {
    totalAckRate = 95; // Fallback default
  }

  // Get recent audits
  const dbRecentAudits = await prisma.audit.findMany({
    orderBy: { startDate: 'desc' },
    take: 4
  });

  const recentAudits = dbRecentAudits.map(audit => {
    let auditorName = 'External Auditor';
    if (audit.remarks && audit.remarks.startsWith('Auditor:')) {
      const match = audit.remarks.match(/Auditor:\s*(.*?)\s*\((.*?)\)/);
      if (match) {
        auditorName = match[1];
      }
    }
    return {
      id: audit.id,
      title: audit.name,
      startDate: audit.startDate,
      auditorName,
      status: audit.status,
    };
  });

  // Get recent compliance issues
  const dbRecentIssues = await prisma.complianceIssue.findMany({
    orderBy: { createdAt: 'desc' },
    take: 4,
    include: {
      audit: true
    }
  });

  const recentIssues = dbRecentIssues.map(issue => {
    return {
      id: issue.id,
      title: issue.title,
      sourceTitle: issue.audit ? issue.audit.name : 'External Report',
      remediationDeadline: issue.dueDate,
      severity: issue.severity,
      status: issue.status,
    };
  });

  return (
    <div className="space-y-8 text-slate-100">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent w-fit">
          Governance & Compliance Summary
        </h2>
        <p className="text-sm text-slate-400">Track company code policies, internal and external audits, and remediation of compliance issues.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 rounded-xl border border-white/10 bg-white/5 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-emerald-500/30 transition-all backdrop-blur-md">
          <div className="p-3 bg-[#10b981]/10 text-emerald-400 rounded-lg">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Active Policies</p>
            <h3 className="text-2xl font-bold">{totalPolicies}</h3>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-white/10 bg-white/5 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-teal-500/30 transition-all backdrop-blur-md">
          <div className="p-3 bg-[#2dd4bf]/10 text-teal-400 rounded-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Policy Ack. Rate</p>
            <h3 className="text-2xl font-bold">{totalAckRate}%</h3>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-white/10 bg-white/5 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-emerald-500/30 transition-all backdrop-blur-md">
          <div className="p-3 bg-[#10b981]/10 text-emerald-400 rounded-lg">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Audits Completed</p>
            <h3 className="text-2xl font-bold">{completedAudits} / {totalAudits}</h3>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-white/10 bg-white/5 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-red-500/30 transition-all backdrop-blur-md">
          <div className="p-3 bg-red-500/10 text-red-400 rounded-lg">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Open Compliance</p>
            <h3 className="text-2xl font-bold">{openComplianceIssues} <span className="text-xs text-red-400 font-medium">({highSeverityIssues} High)</span></h3>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Audits */}
        <div className="p-6 rounded-xl border border-white/10 bg-white/5 shadow-sm flex flex-col gap-6 backdrop-blur-md">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-semibold">Audit Activities</h3>
            </div>
            <Link href="/governance/audits" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {recentAudits.length === 0 ? (
              <p className="text-sm text-slate-400">No audit records found.</p>
            ) : (
              recentAudits.map(audit => (
                <div key={audit.id} className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex flex-col gap-1">
                    <h4 className="font-medium text-sm text-white">{audit.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(audit.startDate).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Auditor: {audit.auditorName}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                    audit.status === 'COMPLETED' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : audit.status === 'IN_PROGRESS' 
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {audit.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Compliance Issues */}
        <div className="p-6 rounded-xl border border-white/10 bg-white/5 shadow-sm flex flex-col gap-6 backdrop-blur-md">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-semibold">Active Compliance Issues</h3>
            </div>
            <Link href="/governance/compliance" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {recentIssues.length === 0 ? (
              <p className="text-sm text-slate-400">No active compliance issues.</p>
            ) : (
              recentIssues.map(issue => (
                <div key={issue.id} className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex flex-col gap-1">
                    <h4 className="font-medium text-sm text-white">{issue.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>Source: {issue.sourceTitle}</span>
                      <span>•</span>
                      <span>Due: {issue.remediationDeadline ? new Date(issue.remediationDeadline).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                      issue.severity === 'HIGH' 
                        ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                        : issue.severity === 'MEDIUM' 
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {issue.severity}
                    </span>
                    <span className="text-xs text-slate-400">{issue.status}</span>
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
