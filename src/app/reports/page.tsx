"use client";

import { useEffect, useState } from "react";
import { Database, Server, Terminal, Network, ArrowRight, Download, RefreshCw, Box, Users } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function Reports() {
  const [loaded, setLoaded] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    "[SYSTEM] Data Architecture Module Online.",
    "[SYSTEM] Connected to ERP Core via secure tunnel.",
    "[OK] Workday API Node: Synchronized at 04:00 UTC",
    "[OK] SAP Logistics Node: Synchronized at 05:15 UTC",
    "[WAIT] Awaiting manual query instructions..."
  ]);
  const [query, setQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleExecuteQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setConsoleOutput(prev => [...prev, `[USER] > ${query}`, "[EXEC] Compiling data vector...", "[OK] 14,209 rows matching query parameters.", "[SYS] Ready for download buffer."]);
    setQuery("");
    toast("Query executed successfully.", "success");
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            Data Architecture & Exports
          </h2>
          <p className="text-sm font-mono text-muted-foreground mt-2 uppercase tracking-widest">Pipeline Telemetry & Query Console</p>
        </div>
        <button onClick={() => toast("Syncing all pipelines...", "info")} className="bg-background border border-border px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-muted transition-colors shadow-sm">
          <RefreshCw size={16} /> Force Global Sync
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pipeline Telemetry */}
        <div className="lg:col-span-7 erp-panel p-6 rounded-2xl flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Active Data Pipelines</h3>
            <Network size={20} className="text-muted-foreground" />
          </div>
          
          <div className="space-y-6 flex-1">
            {/* SAP Pipeline */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <Database size={16} className="text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">SAP ERP (Logistics/Mfg)</h4>
                    <p className="text-[10px] font-mono text-muted-foreground uppercase">Integration: REST API v2</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold text-primary px-2 py-1 bg-primary/10 rounded border border-primary/20">HEALTHY</span>
                  <p className="text-[10px] font-mono text-muted-foreground mt-1 text-right">Ping: 42ms</p>
                </div>
              </div>
              <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden flex">
                <div className="bg-blue-500 h-full w-[100%] shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
              </div>
            </div>

            {/* Workday Pipeline */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <Users size={16} className="text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Workday (HR/Social)</h4>
                    <p className="text-[10px] font-mono text-muted-foreground uppercase">Integration: GraphQL</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold text-amber-500 px-2 py-1 bg-amber-500/10 rounded border border-amber-500/20">SYNCING</span>
                  <p className="text-[10px] font-mono text-muted-foreground mt-1 text-right">Ping: 115ms</p>
                </div>
              </div>
              <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden flex">
                <div className="bg-amber-500 h-full w-[65%] shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse"></div>
              </div>
            </div>

            {/* Legacy Database */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-slate-500/10 flex items-center justify-center border border-slate-500/20">
                    <Server size={16} className="text-slate-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">On-Prem Governance DB</h4>
                    <p className="text-[10px] font-mono text-muted-foreground uppercase">Integration: ODBC SQL</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-1 bg-muted rounded border border-border">IDLE</span>
                  <p className="text-[10px] font-mono text-muted-foreground mt-1 text-right">Ping: 8ms</p>
                </div>
              </div>
              <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden flex">
                <div className="bg-slate-400 h-full w-[100%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Query Console */}
        <div className="lg:col-span-5 erp-panel p-0 rounded-2xl flex flex-col overflow-hidden border border-border">
          <div className="bg-muted/80 p-3 border-b border-border flex items-center gap-2">
            <Terminal size={16} className="text-muted-foreground" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground">SQL/JSON Data Export Console</span>
          </div>
          
          <div className="flex-1 bg-[#0a0a0e] p-4 font-mono text-xs overflow-y-auto space-y-1.5 h-64">
            {consoleOutput.map((line, i) => (
              <div key={i} className={`${line.includes('[USER]') ? 'text-sky-400' : line.includes('[OK]') ? 'text-emerald-400' : line.includes('[ERR]') ? 'text-rose-400' : 'text-slate-400'}`}>
                {line}
              </div>
            ))}
          </div>

          <div className="bg-background border-t border-border p-4">
            <form onSubmit={handleExecuteQuery} className="flex gap-2">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="SELECT * FROM metrics WHERE..."
                className="flex-1 bg-muted/50 border border-border rounded-md px-3 py-2 text-xs font-mono focus:outline-none focus:border-primary text-foreground"
              />
              <button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-mono text-xs font-bold uppercase tracking-widest shadow-sm transition-colors">
                Exec
              </button>
            </form>
            <div className="mt-3 flex justify-between items-center">
              <span className="text-[10px] font-mono text-muted-foreground">Format: CSV, JSON, XML</span>
              <button onClick={() => toast("Downloading buffer...", "info")} className="flex items-center gap-1 text-[10px] font-mono font-bold text-foreground bg-muted px-2 py-1 rounded border border-border hover:bg-muted/80 transition-colors">
                <Download size={12} /> DL Buffer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
