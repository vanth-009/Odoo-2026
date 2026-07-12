"use client";

import { useEffect, useState } from "react";
import { Shield, MoreVertical, Filter, Download, Eye, AlertTriangle, FileWarning, ArrowRight, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/Toast";
import Modal from "@/components/Modal";

export default function Governance() {
  const [loaded, setLoaded] = useState(false);
  const { toast } = useToast();
  
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
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
    toast("Issue marked as resolving. Escalated to compliance team.", "success");
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Shield className="text-purple-500" size={32} />
            Governance
          </h2>
          <p className="text-muted-foreground mt-1">Monitor compliance, audit readiness, and policy adherence.</p>
        </div>
        <div className="flex gap-4 border-b border-white/10 pb-1 w-full md:w-auto overflow-x-auto">
          <span className="text-purple-600 dark:text-purple-400 font-bold border-b-2 border-purple-500 pb-2 cursor-pointer text-sm px-1 whitespace-nowrap">Health</span>
          <span onClick={() => toast("Switching tab view", "info")} className="text-muted-foreground font-medium hover:text-foreground transition-colors cursor-pointer text-sm px-1 pb-2 whitespace-nowrap">Audits</span>
          <span onClick={() => toast("Switching tab view", "info")} className="text-muted-foreground font-medium hover:text-foreground transition-colors cursor-pointer text-sm px-1 pb-2 whitespace-nowrap">Compliance</span>
        </div>
      </div>

      {/* Section: Governance Health (Bento Layout) */}
      <section className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-5 glass-panel p-6 rounded-2xl flex flex-col justify-between overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
          <div className="absolute -right-4 -bottom-4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-700 pointer-events-none"></div>
          
          <div className="z-10">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Aggregate Health</p>
            <h3 className="text-xl font-semibold text-foreground">Governance Health</h3>
          </div>
          <div className="py-8 flex items-center justify-center relative z-10">
            <div className="relative w-56 h-56 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 192 192">
                <circle className="text-black/5 dark:text-white/5" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="12"></circle>
                <circle 
                  className="text-purple-500 transition-all duration-1500" 
                  cx="96" cy="96" fill="transparent" r="88" 
                  stroke="currentColor" 
                  strokeDasharray="552.92" 
                  strokeDashoffset={loaded ? '66.35' : '552.92'} 
                  strokeWidth="12" 
                  strokeLinecap="round"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-extrabold text-foreground">88</span>
                <span className="text-xs font-medium text-muted-foreground mt-1 tracking-widest uppercase">/ 100</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 z-10">
            <div className="text-center p-3 rounded-xl bg-black/5 dark:bg-black/40 border border-white/5">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Anti-Corrupt</p>
              <p className="text-xl font-bold text-purple-600 dark:text-purple-400">92</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-black/5 dark:bg-black/40 border border-white/5">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Privacy</p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">84</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-black/5 dark:bg-black/40 border border-white/5">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Whistleblow</p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">88</p>
            </div>
          </div>
        </div>

        {/* Compliance Tracking Board */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Action Required</p>
              <h3 className="text-xl font-semibold text-foreground">Compliance Tracking</h3>
            </div>
            <button onClick={() => toast("Fetching full tracking board...", "info")} className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center gap-1 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              View All Items <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Critical Issue Card */}
            <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-red-500 relative overflow-hidden group hover:bg-black/5 dark:hover:bg-white/[0.02] transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase flex items-center gap-1">
                  <AlertTriangle size={12} /> High Severity
                </div>
                <button onClick={() => toast("Opening issue menu", "info")} className="text-muted-foreground hover:text-foreground transition-colors"><MoreVertical size={16} /></button>
              </div>
              <h4 className="font-semibold text-base text-foreground mb-2">Missing MSDS Safety Sheets</h4>
              <p className="text-sm text-muted-foreground mb-6 line-clamp-2">Required for chemical inventory in Sector B-12. Audit deadline: 48h.</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-[var(--bg-color)] bg-white/10 overflow-hidden">
                      <img className="w-full h-full object-cover" alt="Officer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAts636TnZmlr9bqV8L50L1fMkpM0YDY68Qrupsg9QqgvlhodsTDrudvuhUvG4zII45-CoppWy_5NqwdzUX01t6el6UTHVjkUR4aJur3jr4PsBF6awFDYU7BwWO642xnA-eSlbhELC-iqhENssBYmM9cmHLZ6W1a7Py7Gi3j-W_8RmrApWAAYN90cNhkl6LI3ntXbnA2xH_fvDcxKE6QFFbsA8r2i_RyD_VqbO1t_gHVlnxhYg3YWCwRg" />
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-[var(--bg-color)] bg-white/10 flex items-center justify-center text-xs font-bold text-muted-foreground backdrop-blur">+2</div>
                  </div>
                </div>
                <button onClick={handleResolveIssue} className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-red-600 transition-colors">Resolve</button>
              </div>
            </div>

            {/* Medium Issue Card */}
            <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-amber-500 relative overflow-hidden group hover:bg-black/5 dark:hover:bg-white/[0.02] transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase flex items-center gap-1">
                  <FileWarning size={12} /> Medium Severity
                </div>
                <button onClick={() => toast("Opening issue menu", "info")} className="text-muted-foreground hover:text-foreground transition-colors"><MoreVertical size={16} /></button>
              </div>
              <h4 className="font-semibold text-base text-foreground mb-2">Late Vendor Disclosure</h4>
              <p className="text-sm text-muted-foreground mb-6 line-clamp-2">Logistics partner 'GreenStream' has not updated ethical labor certificate.</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-[var(--bg-color)] bg-white/10 overflow-hidden">
                      <img className="w-full h-full object-cover" alt="Manager" src="https://lh3.googleusercontent.com/aida-public/AB6AXuATyOsCNT4dMjAtyGFVk1_fjYSBhKEFKFalISVdXoFyWSBJ_JSpJZOnbyo9DPbxkq6-4jT9YIUsL6yEsDMVWpx0SuifNYWiRCFvik_Ys--PlEL0uPKVwPjuG8NV_7apo7GrX_PjX2V0x_RaIvFy78lxQU0oxYhVtSNNtikWOCM-2Ud0Dpbo_aXmDZ2PyhDO_lqTo9XRaJGPqyNm2M5sH7i1lPauPVQA1Mh18NO-pcf84Sji6qThKkmUGw" />
                    </div>
                  </div>
                </div>
                <button onClick={handleResolveIssue} className="text-xs bg-amber-500 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-amber-600 transition-colors">Resolve</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Audit Logs Table */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Transparency Ledger</p>
            <h3 className="text-xl font-semibold text-foreground">Recent Audit Logs</h3>
          </div>
          <div className="flex gap-3">
            <button onClick={() => toast("Opening filter panel", "info")} className="glass-panel px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground">
              <Filter size={16} /> <span className="hidden sm:inline">Filter</span>
            </button>
            <button onClick={handleExportPDF} className="glass-panel px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground">
              <Download size={16} /> <span className="hidden sm:inline">Export PDF</span>
            </button>
          </div>
        </div>
        <div className="glass-panel rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/5 dark:bg-black/20 border-b border-white/5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="px-6 py-4">Audit ID</th>
                <th className="px-6 py-4">Metric Scope</th>
                <th className="px-6 py-4">Auditor</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { id: "#AUD-9921", scopeLabel: "Environmental", scopeText: "Carbon Credits", scopeBg: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30", auditor: "Deloitte ESG Services", time: "Oct 24, 2023 14:32", status: "Verified", statusCol: "text-emerald-600 dark:text-emerald-400", statusBg: "bg-emerald-500/10 border border-emerald-500/20", dot: "bg-emerald-500" },
                { id: "#AUD-9918", scopeLabel: "Governance", scopeText: "Board Composition", scopeBg: "bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30", auditor: "Internal Audit Bureau", time: "Oct 22, 2023 09:15", status: "Pending Review", statusCol: "text-amber-600 dark:text-amber-400", statusBg: "bg-amber-500/10 border border-amber-500/20", dot: "bg-amber-500", striped: true },
                { id: "#AUD-9892", scopeLabel: "Social", scopeText: "Diversity Metrics", scopeBg: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30", auditor: "Global Impact Partners", time: "Oct 19, 2023 16:45", status: "Verified", statusCol: "text-emerald-600 dark:text-emerald-400", statusBg: "bg-emerald-500/10 border border-emerald-500/20", dot: "bg-emerald-500" }
              ].map((row, i) => (
                <tr key={i} className={`hover:bg-black/5 dark:hover:bg-white/5 transition-colors group ${row.striped ? 'bg-black/[0.02] dark:bg-white/[0.01]' : ''}`}>
                  <td className="px-6 py-4 font-mono text-sm text-foreground">{row.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${row.scopeBg}`}>{row.scopeLabel}</span>
                      <span className="text-sm font-medium text-foreground">{row.scopeText}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{row.auditor}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{row.time}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${row.statusCol} ${row.statusBg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor] ${row.dot}`}></span> {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleViewAudit(row.id)} className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-black/10 dark:hover:bg-white/5 rounded-full"><Eye size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Audit Detail Modal */}
      <Modal isOpen={isAuditModalOpen} onClose={() => setIsAuditModalOpen(false)} title="Audit Details" maxWidth="max-w-lg">
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-white/10">
            <div>
              <p className="text-xs text-muted-foreground font-mono mb-1">{selectedAudit}</p>
              <p className="font-bold text-foreground">Detailed Ledger Review</p>
            </div>
            <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1">
              <CheckCircle2 size={12} /> Verified
            </span>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Auditor Remarks</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The data provided accurately reflects the source systems. No discrepancies found in the calculation methodology for Scope 2 emissions across European facilities.
            </p>
          </div>

          <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
            <button onClick={() => setIsAuditModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-white/10 rounded-lg hover:bg-white/5 transition-colors">Close</button>
            <button onClick={() => { setIsAuditModalOpen(false); toast("Report sent to compliance officer.", "success"); }} className="px-4 py-2 text-sm font-bold bg-primary text-primary-foreground rounded-lg shadow hover:bg-emerald-400 transition-colors">Acknowledge</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
