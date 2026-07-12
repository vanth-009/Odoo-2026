"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Leaf, Users, ShieldCheck, Medal, BarChart3, Settings, Plus, LifeBuoy, LogOut } from "lucide-react";
import Modal from "@/components/Modal";
import { useToast } from "@/components/Toast";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Environmental", href: "/environmental", icon: Leaf },
  { name: "Social", href: "/social", icon: Users },
  { name: "Governance", href: "/governance", icon: ShieldCheck },
  { name: "Gamification", href: "/gamification", icon: Medal },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { toast } = useToast();
  
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSupport = () => toast("Opening support portal...", "info");

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsReportModalOpen(false);
      toast("Report generated successfully and sent for processing.", "success");
    }, 1500);
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    toast("Logged out successfully.", "success");
  };

  return (
    <>
      <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 glass-panel border-r border-white/5 z-40 bg-background/50">
        <div className="flex items-center gap-3 mb-10 p-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
            <Leaf className="text-white" size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">EcoSphere</h1>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Intelligence</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Main Menu</p>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group ${
                  isActive 
                    ? "bg-primary/10 text-primary font-semibold shadow-inner border border-primary/20" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <item.icon 
                  size={18} 
                  className={`transition-colors duration-300 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} 
                />
                <span className="text-sm">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse-slow" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="w-full py-2.5 px-4 bg-primary hover:bg-emerald-400 text-primary-foreground rounded-lg font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
          >
            <Plus size={18} strokeWidth={3} />
            <span className="text-sm">New Report</span>
          </button>
          
          <div className="mt-4 space-y-1">
            <button onClick={handleSupport} className="w-full flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-all cursor-pointer group">
              <LifeBuoy size={18} className="group-hover:text-blue-400 transition-colors" />
              <span className="text-sm font-medium">Support</span>
            </button>
            <button onClick={() => setIsLogoutModalOpen(true)} className="w-full flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all cursor-pointer group">
              <LogOut size={18} className="group-hover:text-destructive transition-colors" />
              <span className="text-sm font-medium">Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* New Report Modal */}
      <Modal isOpen={isReportModalOpen} onClose={() => !isSubmitting && setIsReportModalOpen(false)} title="Generate New ESG Report">
        <form onSubmit={handleSubmitReport} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Report Title</label>
            <input required type="text" placeholder="e.g. Q3 European Logistics Footprint" className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">ESG Pillar</label>
            <select className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-foreground">
              <option value="environmental">Environmental (Scope 1, 2, 3)</option>
              <option value="social">Social (Diversity, Training)</option>
              <option value="governance">Governance (Compliance, Audits)</option>
              <option value="comprehensive">Comprehensive ESG</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Data File (Optional)</label>
            <div className="w-full border-2 border-dashed border-white/10 hover:border-primary/50 transition-colors rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-white/[0.02]">
              <Plus className="text-muted-foreground" size={24} />
              <span className="text-sm text-muted-foreground">Click to upload CSV or Excel</span>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsReportModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-bold bg-primary text-primary-foreground rounded-lg shadow disabled:opacity-50 min-w-[120px]">
              {isSubmitting ? "Generating..." : "Generate Report"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} title="Confirm Logout" maxWidth="max-w-sm">
        <p className="text-sm text-muted-foreground mb-6">Are you sure you want to log out of EcoSphere? Any unsaved changes may be lost.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setIsLogoutModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border border-white/10 rounded-lg hover:bg-white/5">Cancel</button>
          <button onClick={handleLogout} className="px-4 py-2 text-sm font-bold bg-destructive text-destructive-foreground rounded-lg shadow hover:bg-red-600 transition-colors">Log Out</button>
        </div>
      </Modal>
    </>
  );
}
