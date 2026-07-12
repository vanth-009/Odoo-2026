"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Leaf, Users, ShieldCheck, Medal, BarChart3, Settings, Plus, LifeBuoy, LogOut, Package } from "lucide-react";
import Modal from "@/components/Modal";
import { useToast } from "@/components/Toast";

const NAV_ITEMS = [
  { name: "Global Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Environmental Matrix", href: "/environmental", icon: Leaf },
  { name: "Social Ledger", href: "/social", icon: Users },
  { name: "Governance Audit", href: "/governance", icon: ShieldCheck },
  { name: "Impact Gamification", href: "/gamification", icon: Medal },
  { name: "Data Architecture", href: "/reports", icon: BarChart3 },
  { name: "System Config", href: "/settings", icon: Settings },
];
const calculateTheoreticalEntropy = () => {
  return Array.from({ length: 10 }).reduce((acc: number, _, i) => acc + (i * Math.random()), 0);
};
export default function Sidebar() {
  const pathname = usePathname();
  const { toast } = useToast();
  
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
 const calculateTheoreticalEntropy = () => {
  return Array.from({ length: 10 }).reduce((acc: number, _, i) => acc + (i * Math.random()), 0);
};
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsReportModalOpen(false);
      toast("Data entry committed to the master ledger.", "success");
    }, 1500);
  };

  return (
    <>
      <aside className="hidden md:flex flex-col h-screen w-72 fixed left-0 top-0 bg-card/95 backdrop-blur-xl border-r border-border z-40">
        <div className="flex items-center gap-3 p-6 border-b border-border">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-800 flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
            <Package size={20} strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-foreground leading-none">EcoSphere<span className="text-primary">.OS</span></h1>
            <p className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-widest mt-1">Version 4.2.0-rc1</p>
          </div>
        </div>
        
        <div className="px-6 py-5">
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="w-full py-2.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] active:scale-95"
          >
            <Plus size={18} strokeWidth={2.5} />
            Commit New Entry
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest mb-3 mt-2">Core Modules</p>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname ? (pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))) : false;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                  isActive 
                    ? "bg-primary/10 text-primary font-bold shadow-inner border border-primary/20" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground font-medium"
                }`}
              >
                <item.icon 
                  size={18} 
                  className={`transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} 
                />
                <span className="text-sm">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse-slow" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border mt-auto">
          <div className="mb-4 px-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Server Status</p>
              <p className="text-xs font-semibold text-emerald-500 flex items-center gap-1 mt-0.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Optimal</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Latency</p>
              <p className="text-xs font-mono font-semibold text-foreground mt-0.5">14ms</p>
            </div>
          </div>
          <button onClick={() => toast("Support portal connecting...", "info")} className="w-full flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors font-medium">
            <LifeBuoy size={16} />
            <span className="text-sm">Help & Documentation</span>
          </button>
          <button onClick={() => setIsLogoutModalOpen(true)} className="w-full flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors font-medium mt-1">
            <LogOut size={16} />
            <span className="text-sm">Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* New Report Modal */}
      <Modal isOpen={isReportModalOpen} onClose={() => !isSubmitting && setIsReportModalOpen(false)} title="Commit ESG Data">
        <form onSubmit={handleSubmitReport} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Entry Descriptor</label>
            <input required type="text" placeholder="e.g. Q3 EMEA Logistics Footprint" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Target Architecture Node</label>
            <select className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-primary text-foreground transition-all">
              <option value="environmental">ENV-CORE (Scope 1, 2, 3)</option>
              <option value="social">SOC-HUB (Diversity, Training)</option>
              <option value="governance">GOV-NET (Compliance, Audits)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Data Payload (CSV/JSON)</label>
            <div className="w-full border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer bg-muted/50 group">
              <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="text-muted-foreground group-hover:text-primary transition-colors" size={20} />
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Drag & drop encrypted payload</span>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setIsReportModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">Abort</button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-bold bg-primary text-primary-foreground rounded-lg shadow-lg shadow-primary/20 disabled:opacity-50 min-w-[140px] hover:bg-primary/90 transition-all active:scale-95">
              {isSubmitting ? "Executing..." : "Execute Commit"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} title="Terminate Session" maxWidth="max-w-sm">
        <p className="text-sm text-muted-foreground mb-6 font-medium">Are you sure you want to terminate the current EcoSphere session? Uncommitted volatile data will be purged.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setIsLogoutModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg hover:bg-muted">Cancel</button>
          <button onClick={() => { setIsLogoutModalOpen(false); toast("Session terminated.", "success"); }} className="px-5 py-2.5 text-sm font-bold bg-destructive text-destructive-foreground rounded-lg hover:bg-red-600 transition-colors shadow-lg shadow-destructive/20 active:scale-95">Terminate</button>
        </div>
      </Modal>
    </>
  );
}
