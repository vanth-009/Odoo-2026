"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { Leaf, Droplets, Wind, MoreHorizontal, ArrowRight, TrendingDown, Search, Filter } from "lucide-react";
import { useToast } from "@/components/Toast";

const intensityData = [
  { name: 'JAN', value: 40, active: false },
  { name: 'FEB', value: 55, active: false },
  { name: 'MAR', value: 45, active: false },
  { name: 'APR', value: 70, active: false },
  { name: 'MAY', value: 60, active: false },
  { name: 'JUN', value: 85, active: true },
  { name: 'JUL', value: 30, active: false },
  { name: 'AUG', value: 40, active: false },
  { name: 'SEP', value: 50, active: false },
];

export default function Environmental() {
  const [loaded, setLoaded] = useState(false);
  const { toast } = useToast();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      toast(`Querying node vectors for: ${searchValue}`, "success");
      e.currentTarget.blur();
    }
  };

  const handleRowClick = (id: string) => {
    toast(`Opening deep telemetry for ${id}`, "info");
  };

  return (
    <div className="space-y-6 pb-12">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Environmental Matrix</h2>
          <p className="text-sm font-mono text-muted-foreground mt-2 uppercase tracking-widest">Resource & Emissions Architecture</p>
        </div>
      </div>

      {/* Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="erp-panel p-6 rounded-2xl border-b-4 border-b-primary group">
          <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest mb-3">Total Carbon YTD</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-extrabold tracking-tighter group-hover:text-primary transition-colors">2,481<span className="text-2xl text-muted-foreground font-normal">.5</span></h3>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-muted-foreground uppercase">Unit: tCO2e</span>
            <div className="flex items-center gap-1 text-primary text-[10px] font-mono font-bold uppercase tracking-wider bg-primary/10 px-2 py-1 rounded border border-primary/20">
              <TrendingDown size={14} /> -4.2% YoY
            </div>
          </div>
        </div>
        
        <div className="erp-panel p-6 rounded-2xl group">
          <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest mb-3">Scope 1 (Direct)</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold tracking-tighter">297<span className="text-xl text-muted-foreground font-normal">.8</span></h3>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-muted-foreground uppercase">Unit: tCO2e</span>
            <span className="text-[10px] font-mono font-bold px-2 py-1 bg-muted rounded border border-border text-foreground">12% LOAD</span>
          </div>
        </div>

        <div className="erp-panel p-6 rounded-2xl group">
          <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest mb-3">Scope 2 (Indirect)</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold tracking-tighter">868<span className="text-xl text-muted-foreground font-normal">.5</span></h3>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-muted-foreground uppercase">Unit: tCO2e</span>
            <span className="text-[10px] font-mono font-bold px-2 py-1 bg-muted rounded border border-border text-foreground">35% LOAD</span>
          </div>
        </div>

        <div className="erp-panel p-6 rounded-2xl group">
          <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest mb-3">Scope 3 (Value Chain)</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold tracking-tighter text-amber-500">1,315<span className="text-xl text-amber-500/50 font-normal">.2</span></h3>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-muted-foreground uppercase">Unit: tCO2e</span>
            <span className="text-[10px] font-mono font-bold px-2 py-1 bg-amber-500/10 text-amber-500 rounded border border-amber-500/20">53% LOAD (HI)</span>
          </div>
        </div>
      </div>

      {/* Chart and Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Emission Intensity Index */}
        <div className="lg:col-span-8 erp-panel p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-bold text-lg">Monthly Intensity Node</h3>
              <p className="text-xs font-mono text-muted-foreground mt-1 uppercase tracking-widest">tCO2e per $M Revenue</p>
            </div>
            <div className="w-3 h-3 rounded-sm bg-primary/20 border border-primary animate-pulse"></div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={intensityData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5}/>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--muted-fg)', fontSize: 10, fontFamily: 'monospace'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--muted-fg)', fontSize: 10, fontFamily: 'monospace'}} />
                <Tooltip 
                  cursor={{fill: 'var(--muted-bg)'}}
                  contentStyle={{ backgroundColor: 'var(--card-bg)', backdropFilter: 'blur(16px)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--fg-color)', fontFamily: 'monospace' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {intensityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.active ? '#10b981' : 'var(--muted-fg)'} opacity={entry.active ? 1 : 0.3} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sustainability Goals List */}
        <div className="lg:col-span-4 erp-panel p-6 rounded-2xl flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Active Subroutines</h3>
            <button onClick={() => toast("Opening config", "info")} className="text-muted-foreground hover:text-foreground transition-colors"><MoreHorizontal size={20} /></button>
          </div>
          <div className="space-y-6 flex-1">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold">Fleet Electrification</span>
                <span className="text-xs font-mono font-bold text-primary">78%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden shadow-inner">
                <div className="bg-primary h-full rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" style={{ width: '78%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold">Packaging Waste Red.</span>
                <span className="text-xs font-mono font-bold text-sky-500">42%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden shadow-inner">
                <div className="bg-sky-500 h-full rounded-full shadow-[0_0_8px_rgba(14,165,233,0.8)]" style={{ width: '42%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold">Solar Transition (C)</span>
                <span className="text-xs font-mono font-bold text-amber-500">15%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden shadow-inner">
                <div className="bg-amber-500 h-full rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>
          <button onClick={() => toast("Loading subroutine list", "info")} className="mt-6 w-full py-2.5 bg-background border border-border hover:bg-muted rounded-lg text-xs font-mono font-bold uppercase tracking-widest transition-colors text-foreground">
            Manage Parameters
          </button>
        </div>
      </div>

      {/* Carbon Transactions Table */}
      <div className="erp-panel rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/30">
          <div>
            <h3 className="font-bold text-lg">Emissions Master Database</h3>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleSearch}
                className="pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm font-mono focus:outline-none focus:border-primary w-full sm:w-72 transition-colors" 
                placeholder="Query record ID..." 
                type="text"
              />
            </div>
            
            <div className="relative">
              <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg text-sm font-bold hover:bg-muted transition-colors text-foreground">
                <Filter size={16} />
                <span className="hidden sm:inline">Filter</span>
              </button>
              
              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)}></div>
                  <div className="absolute right-0 top-full mt-2 w-64 p-4 rounded-xl erp-panel z-50 animate-fade-in-up">
                    <h4 className="text-xs font-mono font-bold mb-3 text-muted-foreground uppercase tracking-widest">Status Flags</h4>
                    <div className="space-y-3 mb-4">
                      <label className="flex items-center gap-3 text-sm font-medium cursor-pointer hover:text-primary transition-colors">
                        <input type="checkbox" className="rounded border-border w-4 h-4 accent-primary" defaultChecked /> Verified (VER)
                      </label>
                      <label className="flex items-center gap-3 text-sm font-medium cursor-pointer hover:text-amber-500 transition-colors">
                        <input type="checkbox" className="rounded border-border w-4 h-4 accent-amber-500" defaultChecked /> Audit Pending (AUD)
                      </label>
                      <label className="flex items-center gap-3 text-sm font-medium cursor-pointer hover:text-destructive transition-colors">
                        <input type="checkbox" className="rounded border-border w-4 h-4 accent-destructive" defaultChecked /> Flagged (FLG)
                      </label>
                    </div>
                    <button onClick={() => {setIsFilterOpen(false); toast("Filters committed.", "success");}} className="w-full bg-primary text-primary-foreground text-sm font-bold py-2 rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/20">Execute</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-muted-foreground text-[10px] font-mono font-bold uppercase tracking-widest">
                <th className="px-6 py-4 border-r border-border w-32">UUID</th>
                <th className="px-6 py-4 border-r border-border">Vector</th>
                <th className="px-6 py-4 border-r border-border">Node</th>
                <th className="px-6 py-4 border-r border-border text-right">Value (tCO2e)</th>
                <th className="px-6 py-4 border-r border-border">Status</th>
                <th className="px-6 py-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { id: "ENV-24-001", cat: "Logistics", origin: "Berlin Hub", em: "42.15", stat: "VERIFIED", statCol: "bg-primary/10 text-primary border border-primary/20", rowbg: "" },
                { id: "ENV-24-002", cat: "Data Center", origin: "Virginia", em: "118.04", stat: "VERIFIED", statCol: "bg-primary/10 text-primary border border-primary/20", rowbg: "bg-muted/20" },
                { id: "ENV-24-003", cat: "Fleet", origin: "Corporate", em: "24.50", stat: "AUDIT_PENDING", statCol: "bg-amber-500/10 text-amber-500 border border-amber-500/20", rowbg: "" },
                { id: "ENV-24-004", cat: "Manufacturing", origin: "Plant C", em: "312.90", stat: "VERIFIED", statCol: "bg-primary/10 text-primary border border-primary/20", rowbg: "bg-muted/20" },
                { id: "ENV-24-005", cat: "Travel", origin: "Global HQ", em: "12.22", stat: "ERR_FLAGGED", statCol: "bg-destructive/10 text-destructive border border-destructive/20", rowbg: "" }
              ].map((row, i) => (
                <tr key={i} onClick={() => handleRowClick(row.id)} className={`hover:bg-muted/50 transition-colors cursor-pointer ${row.rowbg} group`}>
                  <td className="px-6 py-4 border-r border-border font-mono text-xs font-bold text-foreground group-hover:text-primary transition-colors">{row.id}</td>
                  <td className="px-6 py-4 border-r border-border font-medium">{row.cat}</td>
                  <td className="px-6 py-4 border-r border-border text-muted-foreground">{row.origin}</td>
                  <td className="px-6 py-4 border-r border-border font-mono text-sm font-extrabold text-foreground text-right">{row.em}</td>
                  <td className="px-6 py-4 border-r border-border">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${row.statCol}`}>{row.stat}</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground text-right">2024-06-14 11:42</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
