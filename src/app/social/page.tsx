"use client";

import { useEffect, useState } from "react";
import { Users, Heart, BookOpen, AlertCircle, CheckCircle2, XCircle, Search, Activity } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function Social() {
  const [loaded, setLoaded] = useState(false);
  const { toast } = useToast();
  
  const [approvalQueue, setApprovalQueue] = useState([
    { id: "REQ-1023", name: "Sarah Miller", dept: "Marketing", date: "2024-05-12", hrs: "4.5", type: "Volunteer" },
    { id: "REQ-1024", name: "Robert Kane", dept: "Legal", date: "2024-05-14", hrs: "6.0", type: "Pro Bono" },
    { id: "REQ-1025", name: "Li Dan", dept: "Engineering", date: "2024-05-15", hrs: "2.0", type: "Volunteer" }
  ]);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleApprove = (id: string, name: string) => {
    setApprovalQueue(prev => prev.filter(item => item.id !== id));
    toast(`Node ${id} verified.`, "success");
  };

  const handleReject = (id: string, name: string) => {
    setApprovalQueue(prev => prev.filter(item => item.id !== id));
    toast(`Node ${id} purged.`, "error");
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Social Ledger Matrix</h2>
          <p className="text-sm font-mono text-muted-foreground mt-2 uppercase tracking-widest">Workforce Telemetry & Compliance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Diversity Metrics Hub */}
        <div className="lg:col-span-8 erp-panel p-6 rounded-2xl flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-8 z-10">
            <h3 className="font-bold text-lg">Workforce Diversity Data</h3>
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest border border-border px-2 py-1 rounded bg-muted/50">Source: Workday API (Live)</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 z-10">
            <div className="flex flex-col items-center justify-center space-y-4 border-r border-border/50 pr-8">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(14,165,233,0.3)]" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="transparent" r="42" className="stroke-muted" strokeWidth="6"></circle>
                  <circle className="transition-all duration-1000 stroke-sky-500" cx="50" cy="50" fill="transparent" r="42" strokeDasharray="264" strokeDashoffset={loaded ? '79.2' : '264'} strokeWidth="6" strokeLinecap="round"></circle>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-extrabold text-foreground tracking-tighter">70<span className="text-xl text-muted-foreground">%</span></span>
                </div>
              </div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground text-center mt-2">Diversity Index (Q2)</p>
              <p className="text-[10px] font-mono font-bold tracking-widest bg-sky-500/10 text-sky-500 px-3 py-1.5 rounded-md border border-sky-500/20 shadow-inner">TARGET: 65%</p>
            </div>
            
            <div className="space-y-6 flex flex-col justify-center pl-2">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-sm">Female Representation</span>
                  <span className="font-mono text-sm font-extrabold">48%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden shadow-inner">
                  <div className="bg-sky-500 h-full w-[48%] rounded-full shadow-[0_0_8px_rgba(14,165,233,0.8)]"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-sm">Male Representation</span>
                  <span className="font-mono text-sm font-extrabold">45%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden shadow-inner">
                  <div className="bg-sky-400 h-full w-[45%] rounded-full opacity-60"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-sm">Non-binary / Undisclosed</span>
                  <span className="font-mono text-sm font-extrabold text-muted-foreground">7%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden shadow-inner">
                  <div className="bg-muted-foreground h-full w-[7%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Training Completion Bars */}
        <div className="lg:col-span-4 erp-panel p-6 rounded-2xl flex flex-col justify-between group border-b-4 border-b-amber-500">
          <div>
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-bold text-lg">Compliance Training</h3>
              <Activity size={18} className="text-muted-foreground" />
            </div>
            
            <div className="space-y-5">
              <div className="space-y-1.5">
                <div className="flex justify-between items-end">
                  <span className="font-medium text-sm">Business Ethics</span>
                  <span className="text-xs font-mono font-bold text-primary">94%</span>
                </div>
                <div className="w-full bg-muted h-1.5 rounded-full shadow-inner overflow-hidden">
                  <div className="bg-primary h-full w-[94%] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-end">
                  <span className="font-medium text-sm">DEI Principles</span>
                  <span className="text-xs font-mono font-bold text-primary">88%</span>
                </div>
                <div className="w-full bg-muted h-1.5 rounded-full shadow-inner overflow-hidden">
                  <div className="bg-primary h-full w-[88%] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-end">
                  <span className="font-medium text-sm">Cybersecurity</span>
                  <span className="text-xs font-mono font-bold text-amber-500 animate-pulse">72%</span>
                </div>
                <div className="w-full bg-muted h-1.5 rounded-full shadow-inner overflow-hidden">
                  <div className="bg-amber-500 h-full w-[72%] rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3 shadow-inner">
            <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={16} />
            <div>
              <p className="text-xs font-bold text-amber-500 mb-1">Cybersecurity Deadline: T-MINUS 96H</p>
              <button onClick={() => toast("Reminders dispatched.", "success")} className="text-[10px] font-mono font-bold bg-background border border-border text-foreground px-2 py-1 rounded hover:bg-muted transition-colors">Dispatch Pings</button>
            </div>
          </div>
        </div>
      </div>

      {/* Participation Approval Queue Table */}
      <div className="erp-panel rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/30">
          <div>
            <h3 className="font-bold text-lg">Verification Queue</h3>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input className="pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm font-mono focus:outline-none focus:border-primary w-full sm:w-64 transition-colors" placeholder="Search UUID..." type="text" />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground text-[10px] font-mono font-bold uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 border-r border-border w-32">UUID</th>
                <th className="px-6 py-4 border-r border-border">Entity</th>
                <th className="px-6 py-4 border-r border-border">Sector</th>
                <th className="px-6 py-4 border-r border-border">Vector</th>
                <th className="px-6 py-4 border-r border-border text-right">Magnitude (Hrs)</th>
                <th className="px-6 py-4 border-r border-border text-right">Timestamp</th>
                <th className="px-6 py-4 text-center w-24">Command</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {approvalQueue.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground text-sm font-mono font-medium">QUEUE_EMPTY_OK</td>
                </tr>
              ) : approvalQueue.map((row) => (
                <tr key={row.id} className="hover:bg-muted/50 transition-colors group">
                  <td className="px-6 py-4 border-r border-border font-mono text-xs font-bold text-foreground group-hover:text-primary transition-colors">{row.id}</td>
                  <td className="px-6 py-4 border-r border-border text-sm font-bold">{row.name}</td>
                  <td className="px-6 py-4 border-r border-border font-medium text-muted-foreground">{row.dept}</td>
                  <td className="px-6 py-4 border-r border-border font-medium">{row.type}</td>
                  <td className="px-6 py-4 border-r border-border font-mono text-sm font-extrabold text-right">{row.hrs}</td>
                  <td className="px-6 py-4 border-r border-border font-mono text-xs text-muted-foreground text-right">{row.date}</td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleApprove(row.id, row.name)} className="p-1.5 hover:bg-primary/20 text-muted-foreground hover:text-primary border border-transparent hover:border-primary/30 rounded-lg transition-all"><CheckCircle2 size={18} /></button>
                      <button onClick={() => handleReject(row.id, row.name)} className="p-1.5 hover:bg-destructive/20 text-muted-foreground hover:text-destructive border border-transparent hover:border-destructive/30 rounded-lg transition-all"><XCircle size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
