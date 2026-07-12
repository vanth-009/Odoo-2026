"use client";

import { useEffect, useState } from "react";
import { Shield, MoreVertical, Filter, Download, Eye, AlertTriangle, FileWarning, ArrowRight, CheckCircle2, Search } from "lucide-react";
import { useToast } from "@/components/Toast";
import Modal from "@/components/Modal";

export default function Governance() {
  const [loaded, setLoaded] = useState(false);
  const { toast } = useToast();
  
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<any>(null);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleExportPDF = () => {
    toast("Generating Governance PDF...", "info");
    setTimeout(() => {
      toast("Download complete.", "success");
    }, 2000);
  };

  const handleViewAudit = (auditId: string) => {
    setSelectedAudit(auditId);
    setIsAuditModalOpen(true);
  };

  const handleResolveIssue = () => {
    toast("Issue marked as resolving. Ticket generated.", "success");
  };

  return (
    <div className="space-y-4 pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4 border-b border-border pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Governance & Compliance
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Audit logs, regulatory compliance tracking, and risk management.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <span className="text-primary font-bold border-b-2 border-primary pb-2 cursor-pointer text-sm px-1">Overview</span>
          <span onClick={() => toast("Tab switching", "info")} className="text-muted-foreground font-medium hover:text-foreground transition-colors cursor-pointer text-sm px-1 pb-2">Audit Ledger</span>
          <span onClick={() => toast("Tab switching", "info")} className="text-muted-foreground font-medium hover:text-foreground transition-colors cursor-pointer text-sm px-1 pb-2">Policies</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Compliance Health */}
        <div className="lg:col-span-4 erp-panel p-4 rounded-md flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold mb-6">Overall Compliance Score</h3>
          </div>
          <div className="flex items-center justify-center flex-1">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle className="text-muted" cx="50" cy="50" fill="transparent" r="42" stroke="currentColor" strokeWidth="8"></circle>
                <circle 
                  className="text-primary transition-all duration-1000" 
                  cx="50" cy="50" fill="transparent" r="42" 
                  stroke="currentColor" 
                  strokeDasharray="264" 
                  strokeDashoffset={loaded ? '31.6' : '264'} 
                  strokeWidth="8" 
                ></circle>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold text-foreground">88</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-6">
            <div className="text-center p-2 rounded bg-muted border border-border">
              <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Anti-Corrupt</p>
              <p className="text-sm font-bold text-foreground">92</p>
            </div>
            <div className="text-center p-2 rounded bg-muted border border-border">
              <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Privacy</p>
              <p className="text-sm font-bold text-foreground">84</p>
            </div>
            <div className="text-center p-2 rounded bg-muted border border-border">
              <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Whistleblow</p>
              <p className="text-sm font-bold text-foreground">88</p>
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="text-sm font-semibold">Active Compliance Risks</h3>
            <button className="text-primary text-xs font-medium hover:underline">View All Tickets</button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="erp-panel p-4 rounded-md border-l-4 border-l-destructive">
              <div className="flex justify-between items-start mb-2">
                <div className="bg-destructive/10 text-destructive px-1.5 py-0.5 rounded text-[9px] font-bold uppercase flex items-center gap-1">
                  <AlertTriangle size={10} /> High Priority
                </div>
                <span className="text-xs text-muted-foreground font-mono">TKT-8912</span>
              </div>
              <h4 className="font-semibold text-sm text-foreground mb-1">Missing MSDS Safety Sheets</h4>
              <p className="text-xs text-muted-foreground mb-4">Required for chemical inventory in Sector B-12. Deadline: 48h.</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">Assignee: EHS Team</span>
                <button onClick={handleResolveIssue} className="text-[10px] bg-background border border-border text-foreground px-2 py-1 rounded font-medium hover:bg-muted">Create Ticket</button>
              </div>
            </div>

            <div className="erp-panel p-4 rounded-md border-l-4 border-l-amber-500">
              <div className="flex justify-between items-start mb-2">
                <div className="bg-amber-500/10 text-amber-600 dark:text-amber-500 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase flex items-center gap-1">
                  <FileWarning size={10} /> Medium
                </div>
                <span className="text-xs text-muted-foreground font-mono">TKT-8904</span>
              </div>
              <h4 className="font-semibold text-sm text-foreground mb-1">Late Vendor Disclosure</h4>
              <p className="text-xs text-muted-foreground mb-4">Partner 'GreenStream' has not updated ethical labor certificate.</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">Assignee: Procurement</span>
                <button onClick={handleResolveIssue} className="text-[10px] bg-background border border-border text-foreground px-2 py-1 rounded font-medium hover:bg-muted">Send Reminder</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Audit Logs Table */}
      <div className="erp-panel rounded-md">
        <div className="p-3 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/50">
          <div>
            <h3 className="font-semibold text-sm">Audit Ledger (Immutable)</h3>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" size={12} />
              <input className="pl-6 pr-2 py-1 bg-background border border-border rounded text-xs focus:outline-none focus:border-primary w-48" placeholder="Search audit ID..." type="text" />
            </div>
            <button onClick={handleExportPDF} className="px-3 py-1 text-xs border border-border bg-background rounded hover:bg-muted transition-colors font-medium flex items-center gap-1">
              <Download size={12} /> Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-muted border-b border-border text-muted-foreground text-xs font-semibold">
              <tr>
                <th className="px-4 py-2 border-r border-border w-24">Audit ID</th>
                <th className="px-4 py-2 border-r border-border">Scope</th>
                <th className="px-4 py-2 border-r border-border">Auditor Entity</th>
                <th className="px-4 py-2 border-r border-border text-right">Timestamp</th>
                <th className="px-4 py-2 border-r border-border">Status</th>
                <th className="px-4 py-2 text-center w-16">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { id: "AUD-9921", scopeLabel: "ENV", scopeText: "Carbon Credits", auditor: "Deloitte ESG Services", time: "2023-10-24 14:32", status: "Verified", statusCol: "text-emerald-600 dark:text-emerald-400" },
                { id: "AUD-9918", scopeLabel: "GOV", scopeText: "Board Composition", auditor: "Internal Audit Bureau", time: "2023-10-22 09:15", status: "Pending Review", statusCol: "text-amber-600 dark:text-amber-500" },
                { id: "AUD-9892", scopeLabel: "SOC", scopeText: "Diversity Metrics", auditor: "Global Impact Partners", time: "2023-10-19 16:45", status: "Verified", statusCol: "text-emerald-600 dark:text-emerald-400" }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-muted transition-colors">
                  <td className="px-4 py-2 border-r border-border font-mono text-xs font-medium">{row.id}</td>
                  <td className="px-4 py-2 border-r border-border text-xs">
                    <span className="font-bold mr-1.5 text-muted-foreground">[{row.scopeLabel}]</span>
                    {row.scopeText}
                  </td>
                  <td className="px-4 py-2 border-r border-border text-xs text-muted-foreground">{row.auditor}</td>
                  <td className="px-4 py-2 border-r border-border text-xs font-mono text-muted-foreground text-right">{row.time}</td>
                  <td className="px-4 py-2 border-r border-border text-xs font-semibold">
                    <span className={row.statusCol}>{row.status}</span>
                  </td>
                  <td className="px-4 py-1.5 text-center">
                    <button onClick={() => handleViewAudit(row.id)} className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10 rounded transition-colors"><Eye size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Detail Modal */}
      <Modal isOpen={isAuditModalOpen} onClose={() => setIsAuditModalOpen(false)} title="Audit Details" maxWidth="max-w-md">
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-muted p-3 rounded border border-border">
            <div>
              <p className="text-[10px] text-muted-foreground font-mono mb-0.5">{selectedAudit}</p>
              <p className="font-bold text-sm text-foreground">Detailed Ledger Review</p>
            </div>
            <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
              <CheckCircle2 size={14} /> Verified
            </span>
          </div>
          
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Auditor Remarks</h4>
            <p className="text-sm text-foreground leading-relaxed p-3 bg-background border border-border rounded">
              The data provided accurately reflects the source systems. No discrepancies found in the calculation methodology for Scope 2 emissions across European facilities.
            </p>
          </div>

          <div className="pt-3 border-t border-border flex justify-end gap-2 mt-4">
            <button onClick={() => setIsAuditModalOpen(false)} className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground border border-border rounded hover:bg-muted transition-colors">Close</button>
            <button onClick={() => { setIsAuditModalOpen(false); toast("Report sent to compliance officer.", "success"); }} className="px-3 py-1.5 text-xs font-bold bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">Acknowledge</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
