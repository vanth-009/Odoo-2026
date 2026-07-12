"use client";

import { useEffect, useState } from "react";
import { Users, Heart, BookOpen, AlertCircle, CheckCircle2, XCircle, Search, Activity, Plus } from "lucide-react";
import { useToast } from "@/components/Toast";
import Modal from "@/components/Modal";

export default function Social() {
  const [loaded, setLoaded] = useState(false);
  const { toast } = useToast();
  
  const [approvalQueue, setApprovalQueue] = useState<any[]>([]);
  const [diversityStats, setDiversityStats] = useState<any>(null);
  const [trainingPrograms, setTrainingPrograms] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setLoaded(true);
    fetch('/api/social/participation?status=PENDING')
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setApprovalQueue(data.data);
        }
      });
      
    fetch('/api/social/csr-activities')
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setActivities(data.data);
        }
      });
      
    fetch('/api/social/diversity')
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setDiversityStats(data.data);
        }
      });
      
    fetch('/api/social/training')
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setTrainingPrograms(data.data);
        }
      });
  }, []);

  const handleApprove = async (id: number, name: string) => {
    try {
      await fetch(`/api/social/participation/${id}/approve`, { method: 'POST' });
      setApprovalQueue(prev => prev.filter(item => item.id !== id));
      toast(`Entity ${name} verified.`, "success");
    } catch (e) {
      toast(`Error verifying ${name}.`, "error");
    }
  };

  const handleReject = async (id: number, name: string) => {
    try {
      await fetch(`/api/social/participation/${id}/reject`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Purged by Matrix' })
      });
      setApprovalQueue(prev => prev.filter(item => item.id !== id));
      toast(`Entity ${name} purged.`, "error");
    } catch (e) {
      toast(`Error purging ${name}.`, "error");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Social Ledger Matrix</h2>
          <p className="text-sm font-mono text-muted-foreground mt-2 uppercase tracking-widest">Workforce Telemetry & Compliance</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]"
        >
          <Plus size={18} />
          Deploy Initiative
        </button>
      </div>

      {/* Active CSR Initiatives */}
      <div className="mb-8">
        <h3 className="font-bold text-lg mb-4">Active CSR Initiatives</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {activities.slice(0, 4).map((activity) => (
            <div key={activity.id} className="erp-panel rounded-2xl border-l-4 border-sky-500/50 hover:border-sky-500 transition-all flex flex-col shadow-sm overflow-hidden">
              {activity.imageUrl && (
                <div className="w-full h-32 bg-muted relative shrink-0">
                  <img src={activity.imageUrl} alt={activity.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-base mb-1 truncate flex-1" title={activity.title}>{activity.title}</h4>
                    <Heart size={16} className="text-sky-500 shrink-0 mt-0.5" />
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">{activity._count?.participations || 0} joined</p>
                  <p className="text-[10px] font-mono font-bold mt-3 uppercase tracking-widest text-primary bg-primary/10 inline-block px-2 py-0.5 rounded">
                    {activity.status === 'COMPLETED' ? 'Evidence Required' : 'Open'}
                  </p>
                </div>
                <button 
                  onClick={() => toast(`Request to join ${activity.title} dispatched.`, "success")}
                  className="w-full bg-sky-500 hover:bg-sky-400 text-white py-2.5 rounded-lg font-bold transition-colors mt-6 shadow-[0_0_15px_rgba(14,165,233,0.4)]"
                >
                  Join
                </button>
              </div>
            </div>
          ))}
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
                  <circle className="transition-all duration-1000 stroke-sky-500" cx="50" cy="50" fill="transparent" r="42" strokeDasharray="264" strokeDashoffset={loaded ? (264 - (264 * (diversityStats?.diversityIndex || 0.70))) : '264'} strokeWidth="6" strokeLinecap="round"></circle>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-extrabold text-foreground tracking-tighter">
                    {Math.round((diversityStats?.diversityIndex || 0.70) * 100)}
                    <span className="text-xl text-muted-foreground">%</span>
                  </span>
                </div>
              </div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground text-center mt-2">Diversity Index (Q2)</p>
              <p className="text-[10px] font-mono font-bold tracking-widest bg-sky-500/10 text-sky-500 px-3 py-1.5 rounded-md border border-sky-500/20 shadow-inner">TARGET: 65%</p>
            </div>
            
            <div className="space-y-6 flex flex-col justify-center pl-2">
              {diversityStats?.genderDistribution?.map((g: any, i: number) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-sm">{g.gender} Representation</span>
                    <span className="font-mono text-sm font-extrabold">{g.percentage}%</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden shadow-inner">
                    <div className="bg-sky-500 h-full rounded-full shadow-[0_0_8px_rgba(14,165,233,0.8)]" style={{ width: `${g.percentage}%` }}></div>
                  </div>
                </div>
              ))}
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
              {trainingPrograms?.slice(0, 3).map((program: any, i: number) => {
                const colors = ['bg-primary shadow-[0_0_8px_rgba(16,185,129,0.8)]', 'bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.8)]', 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]'];
                const textColors = ['text-primary', 'text-sky-500', 'text-amber-500'];
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between items-end">
                      <span className="font-medium text-sm">{program.title}</span>
                      <span className={`text-xs font-mono font-bold ${textColors[i % 3]}`}>{program.stats.completionRate}%</span>
                    </div>
                    <div className="w-full bg-muted h-1.5 rounded-full shadow-inner overflow-hidden">
                      <div className={`h-full rounded-full ${colors[i % 3]}`} style={{ width: `${program.stats.completionRate}%` }}></div>
                    </div>
                  </div>
                );
              })}
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
                <th className="px-6 py-4 border-r border-border">Employee</th>
                <th className="px-6 py-4 border-r border-border">Activity/Challenge</th>
                <th className="px-6 py-4 border-r border-border">Proof</th>
                <th className="px-6 py-4 border-r border-border text-right">Points</th>
                <th className="px-6 py-4 border-r border-border text-right">Timestamp</th>
                <th className="px-6 py-4 text-center w-24">Approval</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {approvalQueue.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground text-sm font-mono font-medium">QUEUE_EMPTY_OK</td>
                </tr>
              ) : approvalQueue.map((row) => (
                <tr key={row.id} className="hover:bg-muted/50 transition-colors group">
                  <td className="px-6 py-4 border-r border-border text-sm font-bold text-foreground group-hover:text-primary transition-colors">{row.employee?.firstName} {row.employee?.lastName}</td>
                  <td className="px-6 py-4 border-r border-border font-medium text-muted-foreground">{row.activity?.title || 'General'}</td>
                  <td className="px-6 py-4 border-r border-border font-mono text-xs">{row.proofUrl || 'photo.jpg'}</td>
                  <td className="px-6 py-4 border-r border-border font-mono text-sm font-extrabold text-right">{row.pointsEarned || 50}</td>
                  <td className="px-6 py-4 border-r border-border font-mono text-xs text-muted-foreground text-right">{new Date(row.registeredAt).toISOString().split('T')[0]}</td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleApprove(row.id, row.employee?.firstName || 'User')} className="p-1.5 hover:bg-primary/20 text-muted-foreground hover:text-primary border border-transparent hover:border-primary/30 rounded-lg transition-all"><CheckCircle2 size={18} /></button>
                      <button onClick={() => handleReject(row.id, row.employee?.firstName || 'User')} className="p-1.5 hover:bg-destructive/20 text-muted-foreground hover:text-destructive border border-transparent hover:border-destructive/30 rounded-lg transition-all"><XCircle size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Activity Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Deploy CSR Initiative">
        <form 
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setIsModalOpen(false);
            toast("Initiative deployed to matrix.", "success");
          }}
        >
          <div className="space-y-2">
            <label className="text-sm font-bold">Initiative Title</label>
            <input type="text" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary transition-colors" placeholder="e.g. Ocean Cleanup" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold">Description</label>
            <textarea className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary transition-colors" rows={3} placeholder="Details about the initiative..." required></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold">Category Sector</label>
              <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary transition-colors">
                <option>Environmental</option>
                <option>Education</option>
                <option>Community</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">XP Reward</label>
              <input type="number" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary transition-colors" defaultValue={50} required />
            </div>
          </div>
          <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-bold mt-2 hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            Execute Deployment
          </button>
        </form>
      </Modal>
    </div>
  );
}
