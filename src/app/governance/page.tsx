"use client";

import { useEffect, useState } from "react";
import { Shield, MoreVertical, Filter, Download, Eye, AlertTriangle, FileWarning, ArrowRight, CheckCircle2, Search, Activity, Zap } from "lucide-react";
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

  const handleViewAudit = (auditId: string) => {
    setSelectedAudit(auditId);
    setIsAuditModalOpen(true);
  };

  const handleResolveIssue = () => {
    toast("Action vector dispatched to EHS node.", "success");
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            Governance Matrix
          </h2>
          <p className="text-sm font-mono text-muted-foreground mt-2 uppercase tracking-widest">Regulatory Adherence & Risk Vectors</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto bg-muted/50 p-1.5 rounded-lg border border-border">
          <span className="bg-background text-foreground shadow-sm rounded-md font-bold text-sm px-4 py-1.5 cursor-pointer border border-border">Overview</span>
          <span onClick={() => toast("Switching to ledger", "info")} className="text-muted-foreground font-medium hover:text-foreground transition-colors cursor-pointer text-sm px-4 py-1.5">Ledger</span>
          <span onClick={() => toast("Switching to policies", "info")} className="text-muted-foreground font-medium hover:text-foreground transition-colors cursor-pointer text-sm px-4 py-1.5">Protocols</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Compliance Health */}
        <div className="lg:col-span-4 erp-panel p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <div>
            <h3 className="font-bold text-lg mb-8 z-10 relative">System Compliance Integrity</h3>
          </div>
          <div className="flex items-center justify-center flex-1 z-10">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]" viewBox="0 0 100 100">
                <circle className="text-muted" cx="50" cy="50" fill="transparent" r="42" stroke="currentColor" strokeWidth="6"></circle>
                <circle 
                  className="text-purple-500 transition-all duration-1000" 
                  cx="50" cy="50" fill="transparent" r="42" 
                  stroke="currentColor" 
                  strokeDasharray="264" 
                  strokeDashoffset={loaded ? '31.6' : '264'} 
                  strokeWidth="6" 
                  strokeLinecap="round"
                ></circle>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-5xl font-extrabold text-foreground tracking-tighter">88</span>
                <span className="text-[10px] font-mono font-bold text-purple-500 uppercase tracking-widest mt-1">Integrity OK</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-8 z-10">
            <div className="text-center p-3 rounded-xl bg-background border border-border shadow-inner">
              <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Anti-Corrupt</p>
              <p className="text-lg font-extrabold text-foreground">92</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-background border border-border shadow-inner">
              <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Privacy</p>
              <p className="text-lg font-extrabold text-foreground">84</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-background border border-border shadow-inner">
              <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Whistleblow</p>
              <p className="text-lg font-extrabold text-foreground">88</p>
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="font-bold text-lg">Active Threat Vectors</h3>
            <button className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest hover:underline flex items-center gap-1">
              <Zap size={12} fill="currentColor" /> View All Vectors
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="erp-panel p-6 rounded-2xl border-l-4 border-l-destructive shadow-inner">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase flex items-center gap-1.5">
                  <AlertTriangle size={12} /> CRITICAL VECTOR
                </div>
                <span className="text-xs font-mono font-bold text-muted-foreground">VEC-8912</span>
              </div>
              <h4 className="font-extrabold text-base text-foreground mb-2">Missing MSDS Safety Protocols</h4>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">Required for chemical inventory in Sector B-12. Core system halt imminent in 48h if unresolved.</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Node: EHS Team</span>
                <button onClick={handleResolveIssue} className="text-[10px] font-mono font-bold bg-background border border-border text-foreground px-3 py-1.5 rounded-lg hover:bg-muted transition-colors shadow-sm">Dispatch Fix</button>
              </div>
            </div>

            <div className="erp-panel p-6 rounded-2xl border-l-4 border-l-amber-500 shadow-inner">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase flex items-center gap-1.5">
                  <FileWarning size={12} /> ELEVATED
                </div>
                <span className="text-xs font-mono font-bold text-muted-foreground">VEC-8904</span>
              </div>
              <h4 className="font-extrabold text-base text-foreground mb-2">Late Vendor Disclosure</h4>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">Partner 'GreenStream' has not updated ethical labor certificate in master ledger.</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Node: Procurement</span>
                <button onClick={handleResolveIssue} className="text-[10px] font-mono font-bold bg-background border border-border text-foreground px-3 py-1.5 rounded-lg hover:bg-muted transition-colors shadow-sm">Ping Vendor</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Audit Logs Table */}
      <div className="erp-panel rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/30">
          <div>
            <h3 className="font-bold text-lg">Immutable Audit Ledger</h3>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input className="pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm font-mono focus:outline-none focus:border-primary w-64 transition-colors" placeholder="Query UUID..." type="text" />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground text-[10px] font-mono font-bold uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 border-r border-border w-32">UUID</th>
                <th className="px-6 py-4 border-r border-border">Target Node</th>
                <th className="px-6 py-4 border-r border-border">Auditing Entity</th>
                <th className="px-6 py-4 border-r border-border text-right">Timestamp</th>
                <th className="px-6 py-4 border-r border-border">Status Code</th>
                <th className="px-6 py-4 text-center w-20">Command</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { id: "AUD-9921", scopeLabel: "ENV", scopeText: "Carbon Credits", auditor: "Deloitte ESG Services", time: "2023-10-24 14:32", status: "VERIFIED", statusCol: "bg-primary/10 text-primary border border-primary/20" },
                { id: "AUD-9918", scopeLabel: "GOV", scopeText: "Board Composition", auditor: "Internal Audit Bureau", time: "2023-10-22 09:15", status: "PENDING_REV", statusCol: "bg-amber-500/10 text-amber-500 border border-amber-500/20" },
                { id: "AUD-9892", scopeLabel: "SOC", scopeText: "Diversity Metrics", auditor: "Global Impact Partners", time: "2023-10-19 16:45", status: "VERIFIED", statusCol: "bg-primary/10 text-primary border border-primary/20" }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-muted/50 transition-colors group">
                  <td className="px-6 py-4 border-r border-border font-mono text-xs font-bold text-foreground group-hover:text-primary transition-colors">{row.id}</td>
                  <td className="px-6 py-4 border-r border-border text-sm font-medium">
                    <span className="font-mono text-[10px] font-bold tracking-widest mr-2 text-muted-foreground bg-background px-1.5 py-0.5 rounded border border-border">[{row.scopeLabel}]</span>
                    {row.scopeText}
                  </td>
                  <td className="px-6 py-4 border-r border-border font-medium text-muted-foreground">{row.auditor}</td>
                  <td className="px-6 py-4 border-r border-border font-mono text-xs text-muted-foreground text-right">{row.time}</td>
                  <td className="px-6 py-4 border-r border-border">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${row.statusCol}`}>{row.status}</span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button onClick={() => handleViewAudit(row.id)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 rounded-lg transition-all"><Eye size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Detail Modal */}
      <Modal isOpen={isAuditModalOpen} onClose={() => setIsAuditModalOpen(false)} title="Audit Ledger Details">
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-muted/50 p-4 rounded-xl border border-border shadow-inner">
            <div>
              <p className="text-xs font-mono font-bold text-muted-foreground mb-1">{selectedAudit}</p>
              <p className="font-extrabold text-base text-foreground">Deep Ledger Review</p>
            </div>
            <span className="text-primary text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
              <CheckCircle2 size={16} /> VERIFIED
            </span>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Auditor Matrix Output</h4>
            <div className="p-4 bg-background border border-border rounded-xl font-mono text-xs leading-relaxed text-foreground/80 shadow-inner">
              <span className="text-primary mr-2">{'>'}</span>The data vectors provided accurately reflect the source systems. No anomalies detected in the calculation methodology for Scope 2 emissions across EMEA network nodes.
            </div>
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-3 mt-6">
            <button onClick={() => setIsAuditModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors">Close Viewer</button>
            <button onClick={() => { setIsAuditModalOpen(false); toast("Report encoded to master node.", "success"); }} className="px-5 py-2.5 text-sm font-bold bg-primary text-primary-foreground rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] active:scale-95 transition-all">Acknowledge</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
