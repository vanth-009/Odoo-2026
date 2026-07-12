"use client";

import { useEffect, useState } from "react";
import { Users, Heart, ArrowRight, BookOpen, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function Social() {
  const [loaded, setLoaded] = useState(false);
  const { toast } = useToast();
  
  const [joinedInitiatives, setJoinedInitiatives] = useState<string[]>([]);
  const [approvalQueue, setApprovalQueue] = useState([
    { id: 1, name: "Sarah Miller", dept: "Marketing Dept.", initials: "SM", bg: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30", init: "Tree Plantation Drive", date: "Oct 12, 2023", hrs: "4.5 hrs" },
    { id: 2, name: "Robert Kane", dept: "Legal & Compliance", initials: "RK", bg: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30", init: "Coastal Cleanup", date: "Oct 14, 2023", hrs: "6.0 hrs" },
    { id: 3, name: "Li Dan", dept: "Product Engineering", initials: "LD", bg: "bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30", init: "Blood Donation", date: "Oct 15, 2023", hrs: "2.0 hrs" }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleJoin = (id: string, name: string) => {
    if (joinedInitiatives.includes(id)) {
      setJoinedInitiatives(prev => prev.filter(i => i !== id));
      toast(`Left ${name}`, "info");
    } else {
      setJoinedInitiatives(prev => [...prev, id]);
      toast(`Successfully joined ${name}!`, "success");
    }
  };

  const handleApprove = (id: number, name: string) => {
    setApprovalQueue(prev => prev.filter(item => item.id !== id));
    toast(`Approved ${name}'s participation.`, "success");
  };

  const handleReject = (id: number, name: string) => {
    setApprovalQueue(prev => prev.filter(item => item.id !== id));
    toast(`Rejected ${name}'s participation.`, "error");
  };

  const handleBulkApprove = () => {
    if (approvalQueue.length === 0) return toast("Queue is empty.", "info");
    setApprovalQueue([]);
    toast(`Successfully bulk approved ${approvalQueue.length} requests.`, "success");
  };

  const handleExportCSV = () => {
    toast("Exporting participation data to CSV...", "info");
    setTimeout(() => {
      toast("Export complete.", "success");
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Users className="text-blue-500" size={32} />
            Social Engagement
          </h2>
          <p className="text-muted-foreground mt-1">Track CSR initiatives, diversity metrics, and global compliance training.</p>
        </div>
      </div>

      {/* Section: Active CSR Initiatives */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Active CSR Initiatives</h3>
          <button onClick={() => toast("Navigating to all initiatives...", "info")} className="text-blue-500 dark:text-blue-400 text-sm font-medium flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
            View All <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tree Plantation */}
          <div className="glass-panel p-1 rounded-2xl overflow-hidden flex flex-col group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none"></div>
            <div className="h-40 relative rounded-xl overflow-hidden m-1 z-10">
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Tree Plantation" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBP1oLIofOJOd1HfVKgrXTrJ8fHvekyR68WgvOk3uhHPu1_XPVv6t_f4LkfOjW_ZuFkb0WO-Yq9iCGD3fC6iANPcQwSf0Ir1Q4h3736HqD0IRvnTfMt5lv11mfdQuGCzDbr_MTkZtKnhGuozjlZLyCJoggrOzOQX8fziIVqHgrociVoMpYjkhJO8XoygeVMvssVvHfpWwwN_RrWNzJXt72Uk0RXh3bt2YTQ0KhLUyCkDesw5TnfuPzEAg" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur text-white text-[10px] px-2 py-1 rounded shadow uppercase font-bold tracking-widest">Environmental</div>
            </div>
            <div className="p-4 z-10 flex-1 flex flex-col">
              <h4 className="font-bold text-base text-foreground mb-1">Tree Plantation Drive</h4>
              <p className="text-xs text-muted-foreground mb-4 flex-1">Target: 5,000 saplings in the Amazon Buffer Zone by Q3.</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs text-muted-foreground font-medium">412 Participants</span>
                <button 
                  onClick={() => handleJoin('tree', 'Tree Plantation Drive')}
                  className={`${joinedInitiatives.includes('tree') ? 'bg-primary/20 text-primary' : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-foreground'} px-4 py-1.5 rounded-lg font-bold text-xs transition-colors`}
                >
                  {joinedInitiatives.includes('tree') ? 'Joined' : 'Join'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Blood Donation */}
          <div className="glass-panel p-1 rounded-2xl overflow-hidden flex flex-col group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none"></div>
            <div className="h-40 relative rounded-xl overflow-hidden m-1 z-10">
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Blood Donation" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6Id-rcxlGU4CAYzhWtE_0inOyP9dWnlSypBjbtgcRJayo60cT4A_kpbqjPOLYDhW_NIzfd1lgvUxTyH2bhlp6uNx7vwcf8_8IHr0fFjuDk-lj6LSS63WPaTZAt4mHo_fj0JzMDQJLal_-w15t7Zji8EhDLqAxcA0e3AUfWk10KNVZiVMtnA-xvPDqJfI3ZbVxyzk6RDAVM8XRlw60FSpOh0qADASgovBgocV4-pDkAiUFizvezeTtRA" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute top-3 right-3 bg-red-500/90 backdrop-blur text-white text-[10px] px-2 py-1 rounded shadow uppercase font-bold tracking-widest">Social</div>
            </div>
            <div className="p-4 z-10 flex-1 flex flex-col">
              <h4 className="font-bold text-base text-foreground mb-1">Annual Blood Donation</h4>
              <p className="text-xs text-muted-foreground mb-4 flex-1">Partnered with City Red Cross for our quarterly drive.</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs text-muted-foreground font-medium">89 Registered</span>
                <button 
                  onClick={() => handleJoin('blood', 'Annual Blood Donation')}
                  className={`${joinedInitiatives.includes('blood') ? 'bg-primary/20 text-primary' : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-foreground'} px-4 py-1.5 rounded-lg font-bold text-xs transition-colors`}
                >
                  {joinedInitiatives.includes('blood') ? 'Joined' : 'Join'}
                </button>
              </div>
            </div>
          </div>

          {/* Coastal Cleanup */}
          <div className="glass-panel p-1 rounded-2xl overflow-hidden flex flex-col group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none"></div>
            <div className="h-40 relative rounded-xl overflow-hidden m-1 z-10">
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Coastal Cleanup" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD48r5S79F9o_DQ4sivmPYR63MJ-WgJtQ-WVuoHybRwq5kYBlRowjEjBtSV-uRRzzQ3trPfdlKGxpNKU_4QA3J-OfVHBMIGa1hqmRjFGGAeaL0Pw8HLJIrkhThQjhouCDlUU3yiI0NAVSdL1e25o4S35Xc6JXhqyCPhKkjybheWPz_LZ4LQKKvjVq34OUNSD7MJUg0dpH4IuVeZmelW8EZce53GhRwWeHSvaS0-izmvxQkNtY6FADqT7w" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur text-white text-[10px] px-2 py-1 rounded shadow uppercase font-bold tracking-widest">Environmental</div>
            </div>
            <div className="p-4 z-10 flex-1 flex flex-col">
              <h4 className="font-bold text-base text-foreground mb-1">Coastal Cleanup</h4>
              <p className="text-xs text-muted-foreground mb-4 flex-1">Restoring the Bay Area marine ecosystem.</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs text-muted-foreground font-medium">156 Registered</span>
                <button 
                  onClick={() => handleJoin('coast', 'Coastal Cleanup')}
                  className={`${joinedInitiatives.includes('coast') ? 'bg-primary/20 text-primary' : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-foreground'} px-4 py-1.5 rounded-lg font-bold text-xs transition-colors`}
                >
                  {joinedInitiatives.includes('coast') ? 'Joined' : 'Join'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid: Diversity & Training */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Diversity Metrics Hub */}
        <section className="lg:col-span-8 glass-panel p-6 rounded-2xl flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-muted-foreground">
            <Heart size={120} />
          </div>
          <div className="flex items-center justify-between mb-8 z-10">
            <div>
              <h3 className="font-semibold text-lg">Diversity Metrics Hub</h3>
              <p className="text-sm text-muted-foreground">Real-time equitable hiring & workforce data.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 z-10">
            {/* Gauge for 70% Diverse Hire */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="transparent" r="45" className="stroke-black/5 dark:stroke-white/5" strokeWidth="8"></circle>
                  <circle className="transition-all duration-1500" cx="50" cy="50" fill="transparent" r="45" stroke="#3b82f6" strokeDasharray="282.7" strokeDashoffset={loaded ? '84.8' : '282.7'} strokeLinecap="round" strokeWidth="8"></circle>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-5xl font-extrabold text-foreground">70%</span>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Diverse Hire</span>
                </div>
              </div>
              <p className="text-xs text-center text-blue-600 dark:text-blue-400 font-medium bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">Exceeding Q2 target of 65%</p>
            </div>
            
            {/* Gender Distribution Data */}
            <div className="space-y-6 flex flex-col justify-center">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Female</span>
                  <span className="font-bold text-foreground">48%</span>
                </div>
                <div className="w-full bg-black/5 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[48%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Male</span>
                  <span className="font-bold text-foreground">45%</span>
                </div>
                <div className="w-full bg-black/5 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[45%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Non-binary / Other</span>
                  <span className="font-bold text-foreground">7%</span>
                </div>
                <div className="w-full bg-black/5 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full w-[7%] rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Training Completion Bars */}
        <section className="lg:col-span-4 glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
              <BookOpen size={18} className="text-purple-500 dark:text-purple-400" />
              Training Compliance
            </h3>
            <p className="text-sm text-muted-foreground mb-8">Global team completion rates</p>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="font-medium text-sm">Business Ethics</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">94%</span>
                </div>
                <div className="w-full bg-black/5 dark:bg-white/5 h-2 rounded-full">
                  <div className="bg-emerald-500 h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] w-[94%]"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="font-medium text-sm">DEI Principles</span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">88%</span>
                </div>
                <div className="w-full bg-black/5 dark:bg-white/5 h-2 rounded-full">
                  <div className="bg-blue-500 h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] w-[88%]"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="font-medium text-sm">Cybersecurity</span>
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400">72%</span>
                </div>
                <div className="w-full bg-black/5 dark:bg-white/5 h-2 rounded-full">
                  <div className="bg-amber-500 h-full rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)] w-[72%]"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 flex items-start gap-3">
            <AlertCircle className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-amber-700 dark:text-amber-200/80 leading-relaxed">Cybersecurity module deadline is in <span className="font-bold text-amber-600 dark:text-amber-400">4 days</span>. <button onClick={() => toast("Reminders sent successfully.", "success")} className="underline hover:text-amber-500 transition-colors">Send automated reminders?</button></p>
          </div>
        </section>
      </div>

      {/* Participation Approval Queue Table */}
      <section className="glass-panel rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.02]">
          <div>
            <h3 className="font-semibold text-lg">Participation Approval Queue</h3>
            <p className="text-sm text-muted-foreground">Review employee submissions for volunteer hours.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleExportCSV} className="px-4 py-2 text-sm border border-white/10 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-muted-foreground font-medium">Export CSV</button>
            <button onClick={handleBulkApprove} className="px-4 py-2 text-sm bg-primary text-primary-foreground font-bold rounded-lg transition-transform hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">Bulk Approve</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-black/5 dark:bg-black/20 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Initiative</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Hours</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {approvalQueue.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground text-sm">
                    All requests have been approved. Queue is empty.
                  </td>
                </tr>
              ) : approvalQueue.map((row) => (
                <tr key={row.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border ${row.bg}`}>{row.initials}</div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{row.name}</p>
                        <p className="text-xs text-muted-foreground font-medium">{row.dept}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{row.init}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{row.date}</td>
                  <td className="px-6 py-4 text-sm font-bold text-foreground">{row.hrs}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-[10px] uppercase tracking-wider">Pending</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleApprove(row.id, row.name)} className="p-1.5 hover:bg-emerald-500/20 text-emerald-500 rounded-full transition-colors"><CheckCircle2 size={18} /></button>
                      <button onClick={() => handleReject(row.id, row.name)} className="p-1.5 hover:bg-red-500/20 text-red-500 rounded-full transition-colors"><XCircle size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
