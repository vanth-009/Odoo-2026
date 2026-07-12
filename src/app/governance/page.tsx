"use client";

import { ShieldCheck, AlertTriangle } from "lucide-react";
import DataTable from "@/components/DataTable";

const mockIssues = [
  { id: "ISS-001", type: "Policy Violation", severity: "High", owner: "Jane Doe", status: "Open" },
  { id: "ISS-002", type: "Audit Failure", severity: "Critical", owner: "IT Dept", status: "Investigating" },
  { id: "ISS-003", type: "Data Privacy", severity: "Medium", owner: "HR Dept", status: "Closed" },
];

export default function Governance() {
  const issueColumns = [
    { key: "id", label: "Issue ID" },
    { key: "type", label: "Type" },
    { 
      key: "severity", 
      label: "Severity",
      render: (val: string) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          val === 'Critical' ? 'bg-rose-500/20 text-rose-400' :
          val === 'High' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
        }`}>
          {val}
        </span>
      )
    },
    { key: "owner", label: "Owner" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-400" /> Governance & Compliance
          </h2>
          <p className="text-slate-400 mt-1">Track policies, audits, and compliance issues.</p>
        </div>
        <button className="flex items-center gap-2 bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 border border-rose-500/30 px-4 py-2 rounded-xl font-medium transition-colors">
          <AlertTriangle className="w-4 h-4" /> Report Issue
        </button>
      </div>

      <DataTable 
        title="Active Compliance Issues"
        columns={issueColumns} 
        data={mockIssues} 
      />
    </div>
  );
}
