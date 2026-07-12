"use client";

import { useEffect, useState } from "react";
import { Users, Heart, BookOpen, AlertCircle, CheckCircle2, XCircle, Search } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function Social() {
  const [loaded, setLoaded] = useState(false);
  const { toast } = useToast();
  
  const [joinedInitiatives, setJoinedInitiatives] = useState<string[]>([]);
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
    toast(`Approved ${name}'s hours.`, "success");
  };

  const handleReject = (id: string, name: string) => {
    setApprovalQueue(prev => prev.filter(item => item.id !== id));
    toast(`Rejected ${name}'s hours.`, "error");
  };

  const handleExportCSV = () => {
    toast("Generating CSV Export...", "info");
  };

  return (
    <div className="space-y-4 pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4 border-b border-border pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Social & Workforce Module
          </h2>
          <p className="text-sm text-muted-foreground mt-1">HR integration, diversity metrics, and compliance training tracking.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Diversity Metrics Hub */}
        <div className="lg:col-span-8 erp-panel p-4 rounded-md flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-sm">Workforce Diversity Data</h3>
            <span className="text-xs text-muted-foreground">Source: Workday API</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            <div className="flex flex-col items-center justify-center space-y-2 border-r border-border pr-6">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="transparent" r="45" className="stroke-muted" strokeWidth="10"></circle>
                  <circle className="transition-all duration-1000 stroke-primary" cx="50" cy="50" fill="transparent" r="45" strokeDasharray="282.7" strokeDashoffset={loaded ? '84.8' : '282.7'} strokeWidth="10"></circle>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-bold text-foreground">70%</span>
                </div>
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Diverse Hires (Q2)</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-800">Target: 65%</p>
            </div>
            
            <div className="space-y-4 flex flex-col justify-center">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Female Representation</span>
                  <span className="font-bold text-foreground">48%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded overflow-hidden">
                  <div className="bg-primary h-full w-[48%]"></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Male Representation</span>
                  <span className="font-bold text-foreground">45%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded overflow-hidden">
                  <div className="bg-slate-500 h-full w-[45%]"></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Non-binary / Undisclosed</span>
                  <span className="font-bold text-foreground">7%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded overflow-hidden">
                  <div className="bg-slate-400 h-full w-[7%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Training Completion Bars */}
        <div className="lg:col-span-4 erp-panel p-4 rounded-md flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-sm mb-4">Training Compliance</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between items-end">
                  <span className="font-medium text-xs">Business Ethics</span>
                  <span className="text-xs font-bold">94%</span>
                </div>
                <div className="w-full bg-muted h-1.5 rounded">
                  <div className="bg-primary h-full w-[94%]"></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-end">
                  <span className="font-medium text-xs">DEI Principles</span>
                  <span className="text-xs font-bold">88%</span>
                </div>
                <div className="w-full bg-muted h-1.5 rounded">
                  <div className="bg-primary h-full w-[88%]"></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-end">
                  <span className="font-medium text-xs">Cybersecurity</span>
                  <span className="text-xs font-bold text-amber-600">72%</span>
                </div>
                <div className="w-full bg-muted h-1.5 rounded">
                  <div className="bg-amber-500 h-full w-[72%]"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-2 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded flex items-start gap-2">
            <AlertCircle className="text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" size={14} />
            <p className="text-[10px] text-amber-800 dark:text-amber-300">Cybersecurity module deadline in 4 days. <button onClick={() => toast("Reminders dispatched.", "success")} className="underline font-bold">Dispatch Reminders</button></p>
          </div>
        </div>
      </div>

      {/* Participation Approval Queue Table */}
      <div className="erp-panel rounded-md">
        <div className="p-3 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/50">
          <div>
            <h3 className="font-semibold text-sm">Hours Approval Queue</h3>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" size={12} />
              <input className="pl-6 pr-2 py-1 bg-background border border-border rounded text-xs focus:outline-none focus:border-primary w-full sm:w-48" placeholder="Search employee..." type="text" />
            </div>
            <button onClick={handleExportCSV} className="px-3 py-1 text-xs border border-border bg-background rounded hover:bg-muted transition-colors font-medium">Export List</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-muted border-b border-border text-muted-foreground text-xs font-semibold">
              <tr>
                <th className="px-4 py-2 border-r border-border w-24">Req ID</th>
                <th className="px-4 py-2 border-r border-border">Employee</th>
                <th className="px-4 py-2 border-r border-border">Department</th>
                <th className="px-4 py-2 border-r border-border">Type</th>
                <th className="px-4 py-2 border-r border-border text-right">Hours</th>
                <th className="px-4 py-2 border-r border-border text-right">Date</th>
                <th className="px-4 py-2 text-center w-24">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {approvalQueue.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground text-xs">Queue is empty.</td>
                </tr>
              ) : approvalQueue.map((row) => (
                <tr key={row.id} className="hover:bg-muted transition-colors">
                  <td className="px-4 py-2 border-r border-border font-mono text-xs text-muted-foreground">{row.id}</td>
                  <td className="px-4 py-2 border-r border-border text-xs font-semibold text-foreground">{row.name}</td>
                  <td className="px-4 py-2 border-r border-border text-xs text-muted-foreground">{row.dept}</td>
                  <td className="px-4 py-2 border-r border-border text-xs">{row.type}</td>
                  <td className="px-4 py-2 border-r border-border text-xs font-bold text-foreground text-right">{row.hrs}</td>
                  <td className="px-4 py-2 border-r border-border text-xs text-muted-foreground text-right">{row.date}</td>
                  <td className="px-4 py-1.5 text-center">
                    <div className="flex justify-center gap-1">
                      <button onClick={() => handleApprove(row.id, row.name)} className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded"><CheckCircle2 size={16} /></button>
                      <button onClick={() => handleReject(row.id, row.name)} className="p-1 hover:bg-red-100 dark:hover:bg-red-900/50 text-destructive rounded"><XCircle size={16} /></button>
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
