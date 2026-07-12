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

  const handleApplyFilter = () => {
    setIsFilterOpen(false);
    toast("Filters applied successfully.", "success");
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      toast(`Querying database for: ${searchValue}`, "info");
      e.currentTarget.blur();
    }
  };

  const handleRowClick = (id: string) => {
    toast(`Opening record detail for ${id}`, "info");
  };

  return (
    <div className="space-y-4 pb-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4 border-b border-border pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Environmental Tracking Module
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Resource consumption and emissions tracking across all facilities.</p>
        </div>
      </div>

      {/* Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="erp-panel p-4 rounded-md">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2 tracking-wider">Total Carbon YTD</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">2,481.5</h3>
            <span className="text-xs text-muted-foreground">tCO2e</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
            <TrendingDown size={14} /> -4.2% vs last year
          </div>
        </div>
        
        <div className="erp-panel p-4 rounded-md">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2 tracking-wider">Scope 1 (Direct)</p>
          <div className="flex justify-between items-end">
            <div className="flex items-baseline gap-2">
              <h3 className="text-xl font-bold">297.8</h3>
              <span className="text-xs text-muted-foreground">tCO2e</span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 bg-muted rounded border border-border">12%</span>
          </div>
        </div>

        <div className="erp-panel p-4 rounded-md">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2 tracking-wider">Scope 2 (Indirect)</p>
          <div className="flex justify-between items-end">
            <div className="flex items-baseline gap-2">
              <h3 className="text-xl font-bold">868.5</h3>
              <span className="text-xs text-muted-foreground">tCO2e</span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 bg-muted rounded border border-border">35%</span>
          </div>
        </div>

        <div className="erp-panel p-4 rounded-md">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2 tracking-wider">Scope 3 (Value Chain)</p>
          <div className="flex justify-between items-end">
            <div className="flex items-baseline gap-2">
              <h3 className="text-xl font-bold">1,315.2</h3>
              <span className="text-xs text-muted-foreground">tCO2e</span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 bg-muted rounded border border-border">53%</span>
          </div>
        </div>
      </div>

      {/* Chart and Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Emission Intensity Index */}
        <div className="lg:col-span-8 erp-panel p-4 rounded-md">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-sm">Monthly Emission Intensity</h3>
              <p className="text-xs text-muted-foreground">tCO2e per $M Revenue</p>
            </div>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={intensityData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--muted-fg)', fontSize: 10}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--muted-fg)', fontSize: 10}} />
                <Tooltip 
                  cursor={{fill: 'var(--surface-hover)'}}
                  contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--fg-color)' }}
                />
                <Bar dataKey="value" radius={[2, 2, 0, 0]} maxBarSize={30}>
                  {intensityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.active ? '#059669' : 'var(--border-color)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sustainability Goals List */}
        <div className="lg:col-span-4 erp-panel p-4 rounded-md flex flex-col">
          <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
            <h3 className="font-semibold text-sm">Active Initiatives</h3>
            <button onClick={() => toast("Opening project settings", "info")} className="text-muted-foreground hover:text-foreground transition-colors"><MoreHorizontal size={16} /></button>
          </div>
          <div className="space-y-4 flex-1">
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs font-medium">Fleet Electrification</span>
                <span className="text-xs font-bold text-foreground">78%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs font-medium">Packaging Waste Reduction</span>
                <span className="text-xs font-bold text-foreground">42%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs font-medium">Solar Transition (Plant C)</span>
                <span className="text-xs font-bold text-foreground">15%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>
          <button onClick={() => toast("Loading initiatives list", "info")} className="mt-4 w-full py-1.5 bg-muted border border-border hover:bg-background rounded text-xs font-medium transition-colors text-foreground">
            Manage Initiatives
          </button>
        </div>
      </div>

      {/* Carbon Transactions Table */}
      <div className="erp-panel rounded-md">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/50">
          <div>
            <h3 className="font-semibold text-sm">Emissions Database</h3>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
              <input 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleSearch}
                className="pl-8 pr-3 py-1.5 bg-background border border-border rounded text-xs focus:outline-none focus:border-primary w-full sm:w-64" 
                placeholder="Search record ID..." 
                type="text"
              />
            </div>
            
            <div className="relative">
              <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded text-xs hover:bg-muted transition-colors text-foreground">
                <Filter size={14} />
                <span className="hidden sm:inline">Filter</span>
              </button>
              
              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)}></div>
                  <div className="absolute right-0 top-full mt-1 w-56 p-3 rounded-md bg-card border border-border shadow-lg z-50">
                    <h4 className="text-xs font-bold mb-2 text-foreground">Status Filter</h4>
                    <div className="space-y-1.5 mb-3">
                      <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                        <input type="checkbox" className="rounded border-border" defaultChecked /> Verified
                      </label>
                      <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                        <input type="checkbox" className="rounded border-border" defaultChecked /> Pending Audit
                      </label>
                      <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                        <input type="checkbox" className="rounded border-border" defaultChecked /> Flagged
                      </label>
                    </div>
                    <button onClick={handleApplyFilter} className="w-full bg-primary text-primary-foreground text-xs font-bold py-1.5 rounded hover:bg-primary/90">Apply</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-muted border-b border-border text-muted-foreground text-xs font-semibold">
                <th className="px-4 py-2 border-r border-border w-32">Record ID</th>
                <th className="px-4 py-2 border-r border-border">Category</th>
                <th className="px-4 py-2 border-r border-border">Facility</th>
                <th className="px-4 py-2 border-r border-border text-right">Value (tCO2e)</th>
                <th className="px-4 py-2 border-r border-border">Status</th>
                <th className="px-4 py-2 text-right">Date Logged</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { id: "ENV-24-001", cat: "Logistics", origin: "Berlin Hub", em: "42.15", stat: "Verified", statCol: "text-emerald-600 dark:text-emerald-400", bg: "bg-background" },
                { id: "ENV-24-002", cat: "Data Center", origin: "Virginia", em: "118.04", stat: "Verified", statCol: "text-emerald-600 dark:text-emerald-400", bg: "bg-muted/30" },
                { id: "ENV-24-003", cat: "Fleet", origin: "Corporate", em: "24.50", stat: "Pending", statCol: "text-amber-600 dark:text-amber-500", bg: "bg-background" },
                { id: "ENV-24-004", cat: "Manufacturing", origin: "Plant C", em: "312.90", stat: "Verified", statCol: "text-emerald-600 dark:text-emerald-400", bg: "bg-muted/30" },
                { id: "ENV-24-005", cat: "Travel", origin: "Global HQ", em: "12.22", stat: "Flagged", statCol: "text-red-600 dark:text-red-400", bg: "bg-background" }
              ].map((row, i) => (
                <tr key={i} onClick={() => handleRowClick(row.id)} className={`hover:bg-muted transition-colors cursor-pointer ${row.bg}`}>
                  <td className="px-4 py-2 border-r border-border font-mono text-xs font-medium text-foreground">{row.id}</td>
                  <td className="px-4 py-2 border-r border-border text-xs">{row.cat}</td>
                  <td className="px-4 py-2 border-r border-border text-xs text-muted-foreground">{row.origin}</td>
                  <td className="px-4 py-2 border-r border-border text-xs font-semibold text-foreground text-right">{row.em}</td>
                  <td className="px-4 py-2 border-r border-border">
                    <span className={`text-xs font-semibold ${row.statCol}`}>{row.stat}</span>
                  </td>
                  <td className="px-4 py-2 text-xs text-muted-foreground text-right">2024-06-14</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
