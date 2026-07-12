"use client";

import { useState, useEffect } from "react";
import { Search, Bell, Activity, Menu, Sun, Moon, Settings, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useToast } from "@/components/Toast";

export default function Topbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { toast } = useToast();

  useEffect(() => setMounted(true), []);

  const handleNotifications = () => {
    toast("No system anomalies detected.", "info");
  };

  return (
    <header className="w-full h-16 flex justify-between items-center px-6 sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border shadow-sm">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-muted-foreground hover:text-foreground transition-colors">
          <Menu size={24} />
        </button>
        <div className="hidden md:flex items-center gap-3 bg-muted/50 px-4 py-1.5 rounded-md border border-border">
          <Activity size={16} className="text-primary" />
          <span className="text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider">Sync Cycle: <span className="text-foreground font-bold">FY24-Q3-LIVE</span></span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className={`hidden lg:flex items-center bg-background border transition-all rounded-lg px-4 py-2 w-72 ${isSearchFocused ? 'border-primary ring-1 ring-primary/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'border-border'}`}>
          <Search size={16} className={isSearchFocused ? "text-primary" : "text-muted-foreground"} />
          <input 
            className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-medium ml-3 text-foreground w-full placeholder:text-muted-foreground/60" 
            placeholder="Query master ledger..." 
            type="text"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                toast("Query dispatched to indexing engine", "success");
                e.currentTarget.blur();
              }
            }}
          />
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono border border-border">
            <span>⌘</span><span>K</span>
          </div>
        </div>
        
        {/* Theme Toggle */}
        {mounted && (
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
            title="Toggle Protocol"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        )}
        
        {/* Notifications */}
        <button onClick={handleNotifications} className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-card animate-pulse-slow"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-extrabold text-foreground leading-none">EL-PEN-01</p>
            <p className="text-[10px] font-mono text-muted-foreground mt-1 uppercase tracking-widest text-primary">Chief Sec. Off.</p>
          </div>
          <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-10 h-10 rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-all p-0.5">
            <img 
              className="w-full h-full object-cover rounded-md" 
              alt="Profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzuNyqZ74PEEL7xnhaRhCluKz3giEkH57bczPwLjjREb8wd3ewBYesthwe54Z-_Z8w8_vDPqzX-ugyYwFO_vKOSCRCWmwS4yQ5uhPBaf5B17tEp084TTrEWUc-Dn7GWH_851iixBsClqftMiGgo9_GQYSgaghd5xzoTaJBcMcCAS0Mj6osE0fWICcN2QP7CkZjke4ORWOVGmeUOOZ5KrqktFeyZkcJaLRpPJgRFb33pcMFTu_eNUhfow"
            />
          </button>
          
          {/* Dropdown Menu */}
          {isProfileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
              <div className="absolute right-0 top-12 mt-2 w-56 rounded-xl erp-panel py-2 z-50 animate-fade-in-up">
                <div className="px-5 py-3 border-b border-border mb-2 bg-muted/30">
                  <p className="text-sm font-bold text-foreground">Eleanor Penhaligon</p>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">AUTH_LVL_MAX</p>
                </div>
                <button className="w-full text-left px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-3 transition-colors">
                  <User size={16} /> Identity Matrix
                </button>
                <button className="w-full text-left px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-3 transition-colors">
                  <Settings size={16} /> Global Parameters
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
