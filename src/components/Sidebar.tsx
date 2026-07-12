"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Leaf, Users, ShieldCheck, Medal, BarChart3, Settings, Plus, LifeBuoy, LogOut, Package } from "lucide-react";
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
      <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-card border-r border-border z-40">
        <div className="flex items-center gap-3 mb-6 p-6 pb-2 border-b border-border">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground shrink-0">
            <Package size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground leading-none">EcoSphere ERP</h1>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-1">Internal ESG Module</p>
          </div>
        </div>
        
        <div className="px-4 mb-4">
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="w-full py-2 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={16} strokeWidth={2.5} />
            New Entry
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          <p className="px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-2">Applications</p>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon 
                  size={18} 
                  className={isActive ? 'text-primary' : 'text-muted-foreground'} 
                />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border mt-auto">
          <button onClick={handleSupport} className="w-full flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors cursor-pointer">
            <LifeBuoy size={16} />
            <span className="text-sm">Help & Support</span>
          </button>
          <button onClick={() => setIsLogoutModalOpen(true)} className="w-full flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-red-50 dark:hover:bg-red-950 hover:text-destructive rounded-md transition-colors cursor-pointer mt-0.5">
            <LogOut size={16} />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* New Report Modal */}
      <Modal isOpen={isReportModalOpen} onClose={() => !isSubmitting && setIsReportModalOpen(false)} title="Create Data Entry">
        <form onSubmit={handleSubmitReport} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Entry Title</label>
            <input required type="text" placeholder="e.g. Q3 European Logistics Footprint" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">ESG Pillar</label>
            <select className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary text-foreground">
              <option value="environmental">Environmental (Scope 1, 2, 3)</option>
              <option value="social">Social (Diversity, Training)</option>
              <option value="governance">Governance (Compliance, Audits)</option>
              <option value="comprehensive">Comprehensive</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Data File (Optional)</label>
            <div className="w-full border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-md p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-muted">
              <Plus className="text-muted-foreground" size={24} />
              <span className="text-sm text-muted-foreground">Click to upload CSV or Excel</span>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
            <button type="button" onClick={() => setIsReportModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md disabled:opacity-50 min-w-[120px] hover:bg-primary/90 transition-colors">
              {isSubmitting ? "Creating..." : "Create Entry"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} title="Confirm Sign Out" maxWidth="max-w-sm">
        <p className="text-sm text-muted-foreground mb-6">Are you sure you want to sign out of the ERP? Any unsaved entries may be lost.</p>
        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <button onClick={() => setIsLogoutModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border border-border rounded-md hover:bg-muted">Cancel</button>
          <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground rounded-md hover:bg-red-600 transition-colors">Sign Out</button>
        </div>
      </Modal>
    </>
  );
}
