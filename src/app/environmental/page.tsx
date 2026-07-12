"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
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
      toast(`Searching for: ${searchValue}`, "info");
      e.currentTarget.blur();
    }
  };

  const handleRowClick = (id: string) => {
    toast(`Opening details for ${id}`, "info");
  };

  return (
    <div className="space-y-6 pb-16">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Leaf className="text-emerald-500" size={32} />
            Environmental Tracking
          </h2>
          <p className="text-muted-foreground mt-1">Monitor your carbon footprint, resource usage, and active initiatives.</p>
        </div>
      </div>

      {/* Hero Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sustainability Goals */}
        <section className="md:col-span-2 glass-panel p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Active Sustainability Goals</h3>
            <button onClick={() => toast("Goal management not implemented", "info")} className="text-muted-foreground hover:text-foreground transition-colors"><MoreHorizontal size={20} /></button>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Reduce Fleet Emissions</span>
                <span className="text-sm font-bold text-emerald-500">78%</span>
              </div>
              <div className="w-full bg-black/5 dark:bg-white/5 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: loaded ? '78%' : '0%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Cut Packaging Waste</span>
                <span className="text-sm font-bold text-blue-500">42%</span>
              </div>
              <div className="w-full bg-black/5 dark:bg-white/5 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: loaded ? '42%' : '0%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Renewable Energy Shift</span>
                <span className="text-sm font-bold text-purple-500">15%</span>
              </div>
              <div className="w-full bg-black/5 dark:bg-white/5 rounded-full h-2 overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{ width: loaded ? '15%' : '0%' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Reforestation Project Card */}
        <section className="glass-panel p-1 rounded-2xl overflow-hidden flex flex-col group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none"></div>
          <div className="h-48 relative rounded-xl overflow-hidden m-1 z-10">
            <img 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              alt="Amazonia Reforestation"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzj3Ojyh1RRCv03_pjcLnykkmE4ZYRf19xRKJCbPvkUINd6TV6t7B9KghiK-974T1NJzLlq-J1a5yKfougplD_xu1o54tAApaGMXYiKFDsyUNHzTZMgE04AziR50skyltNMXY8Tx_ZiFPGg-j05KLpBY-pJeuQ19ACECrqLcnv3ncxPl3KLu16tGHiopC6ANIMmNpUt2gRhpB-4H8Iq2K943nIHWiUemeWZtogI1DbT2VHF-amBimzLg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow">Active</div>
            <div className="absolute bottom-3 left-4">
              <h3 className="font-bold text-lg text-white mb-0.5">Amazonia Reforestation</h3>
              <p className="text-white/70 text-xs">Biodiversity restoration in Brazil.</p>
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col justify-end z-10">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Contribution</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">12.4k <span className="text-sm font-normal text-muted-foreground">Trees</span></p>
              </div>
              <button onClick={() => toast("Redirecting to project page...", "info")} className="text-primary hover:text-primary-foreground bg-primary/10 hover:bg-primary p-2 rounded-full transition-colors">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Second Row: Chart and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Emission Intensity Index */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-semibold text-lg">Emission Intensity Index</h3>
              <p className="text-sm text-muted-foreground">tCO2e per $M Revenue — Monthly breakdown</p>
            </div>
            <div className="flex gap-1 bg-black/5 dark:bg-black/40 p-1 rounded-lg border border-white/5">
              <button onClick={() => toast("2023 Data loaded.", "success")} className="px-3 py-1 text-xs text-muted-foreground hover:text-foreground rounded-md transition-colors">2023</button>
              <button className="px-3 py-1 text-xs bg-white dark:bg-white/10 rounded-md font-medium text-foreground shadow-sm">2024</button>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={intensityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#a1a1aa', fontSize: 10}} dy={10} />
                <Tooltip 
                  cursor={{fill: 'rgba(128,128,128,0.1)'}}
                  contentStyle={{ backgroundColor: 'var(--glass-bg)', backdropFilter: 'blur(8px)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--fg-color)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {intensityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.active ? '#10b981' : 'rgba(16, 185, 129, 0.2)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scope Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group border border-emerald-500/30">
            <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-700">
              <Wind size={150} />
            </div>
            <h4 className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">Total Carbon Footprint</h4>
            <p className="text-4xl font-extrabold tracking-tight">2,481.5</p>
            <p className="text-sm opacity-90 mt-1">tCO2e Year-to-Date</p>
            <div className="mt-6 flex items-center gap-1 bg-black/20 w-fit px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10">
              <TrendingDown size={14} className="text-emerald-300" />
              <span className="text-xs font-bold text-emerald-300">-4.2% from last period</span>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider text-muted-foreground">Emissions by Source</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                  <span className="text-sm font-medium">Scope 1 (Direct)</span>
                </div>
                <span className="text-sm font-bold">12%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                  <span className="text-sm font-medium">Scope 2 (Indirect)</span>
                </div>
                <span className="text-sm font-bold">35%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
                  <span className="text-sm font-medium">Scope 3 (Value Chain)</span>
                </div>
                <span className="text-sm font-bold">53%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carbon Transactions Table */}
      <section className="glass-panel rounded-2xl overflow-visible">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.02]">
          <div>
            <h3 className="font-semibold text-lg">Carbon Transactions Ledger</h3>
            <p className="text-sm text-muted-foreground">Immutable record of environmental assets.</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
              <input 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleSearch}
                className="pl-9 pr-4 py-2 bg-black/5 dark:bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 w-full sm:w-64 transition-all" 
                placeholder="Search asset ID..." 
                type="text"
              />
            </div>
            
            <div className="relative">
              <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex items-center gap-2 px-3 py-2 border border-white/10 rounded-lg text-sm hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground">
                <Filter size={14} />
                <span className="hidden sm:inline">Filter</span>
              </button>
              
              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)}></div>
                  <div className="absolute right-0 top-full mt-2 w-64 p-4 rounded-xl glass-panel bg-background/95 border border-white/10 shadow-2xl z-50 animate-fade-in-up">
                    <h4 className="text-sm font-bold mb-3 text-foreground">Filter by Status</h4>
                    <div className="space-y-2 mb-4">
                      <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                        <input type="checkbox" className="rounded border-white/20 bg-black/20 text-primary focus:ring-primary" defaultChecked /> Verified
                      </label>
                      <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                        <input type="checkbox" className="rounded border-white/20 bg-black/20 text-primary focus:ring-primary" defaultChecked /> Auditing
                      </label>
                      <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                        <input type="checkbox" className="rounded border-white/20 bg-black/20 text-primary focus:ring-primary" defaultChecked /> Action Required
                      </label>
                    </div>
                    <button onClick={handleApplyFilter} className="w-full bg-primary text-primary-foreground text-sm font-bold py-2 rounded-lg hover:bg-emerald-400">Apply Filters</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/5 dark:bg-black/20 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Asset ID</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Origin</th>
                <th className="px-6 py-4 text-right">Emissions (tCO2e)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { id: "#ASSET-0921-F", cat: "Logistics", catBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", origin: "Berlin Hub", em: "42.15", stat: "Verified", statCol: "text-emerald-600 dark:text-emerald-400", statDot: "bg-emerald-500 shadow-[0_0_5px_#34d399]", date: "Jun 14, 2024" },
                { id: "#ASSET-0842-X", cat: "Data Center", catBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20", origin: "Virginia", em: "118.04", stat: "Verified", statCol: "text-emerald-600 dark:text-emerald-400", statDot: "bg-emerald-500 shadow-[0_0_5px_#34d399]", date: "Jun 12, 2024" },
                { id: "#ASSET-0773-M", cat: "Fleet", catBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20", origin: "Corporate", em: "24.50", stat: "Auditing", statCol: "text-amber-600 dark:text-amber-400", statDot: "bg-amber-500 shadow-[0_0_5px_#fbbf24]", date: "Jun 10, 2024" },
                { id: "#ASSET-0651-B", cat: "Manufacturing", catBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", origin: "Plant C", em: "312.90", stat: "Verified", statCol: "text-emerald-600 dark:text-emerald-400", statDot: "bg-emerald-500 shadow-[0_0_5px_#34d399]", date: "Jun 08, 2024" },
                { id: "#ASSET-0520-L", cat: "Travel", catBg: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20", origin: "Global HQ", em: "12.22", stat: "Action Req", statCol: "text-red-600 dark:text-red-400", statDot: "bg-red-500 shadow-[0_0_5px_#f87171]", date: "Jun 05, 2024" }
              ].map((row, i) => (
                <tr key={i} onClick={() => handleRowClick(row.id)} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                  <td className="px-6 py-4 font-mono text-sm text-foreground">{row.id}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] rounded border font-bold uppercase tracking-wider ${row.catBg}`}>{row.cat}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{row.origin}</td>
                  <td className="px-6 py-4 text-sm font-bold text-foreground text-right">{row.em}</td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 ${row.statCol} font-medium text-xs`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${row.statDot}`}></span> {row.stat}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground text-right">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
