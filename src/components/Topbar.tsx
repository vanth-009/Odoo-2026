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
    toast("No new notifications.", "info");
  };

  const handleProfileSettings = () => {
    setIsProfileOpen(false);
    toast("Settings module not implemented.", "info");
  };

  return (
    <header className="w-full h-14 flex justify-between items-center px-4 sticky top-0 z-40 bg-card border-b border-border shadow-sm">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-muted-foreground hover:text-foreground transition-colors">
          <Menu size={20} />
        </button>
        <div className="hidden md:flex items-center gap-3 bg-muted px-3 py-1 rounded text-sm border border-border">
          <Activity size={14} className="text-primary" />
          <span className="font-medium text-muted-foreground">Reporting Period: <span className="text-foreground font-semibold">FY24 Q3</span></span>
          <div className="h-3 w-px bg-border mx-1"></div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Live Sync</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        {/* Search Bar */}
        <div className={`hidden lg:flex items-center bg-background border transition-all rounded-md px-3 py-1.5 w-64 ${isSearchFocused ? 'border-primary ring-1 ring-primary' : 'border-border'}`}>
          <Search size={14} className={isSearchFocused ? "text-primary" : "text-muted-foreground"} />
          <input 
            className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm w-full font-medium ml-2 text-foreground placeholder:text-muted-foreground" 
            placeholder="Search records, entities..." 
            type="text"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                toast("Search functionality ready for ERP integration", "info");
                e.currentTarget.blur();
              }
            }}
          />
          <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground bg-muted px-1 rounded border border-border font-mono ml-1">
            <span>⌘</span><span>K</span>
          </div>
        </div>
        
        {/* Theme Toggle */}
        {mounted && (
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        )}
        
        {/* Notifications */}
        <button onClick={handleNotifications} className="relative p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full border border-card"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative flex items-center gap-2 pl-2 md:pl-4 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-foreground leading-none">E. Penhaligon</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">CSO</p>
          </div>
          <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-8 h-8 rounded-md overflow-hidden border border-border hover:border-primary transition-all ml-1">
            <img 
              className="w-full h-full object-cover" 
              alt="Profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzuNyqZ74PEEL7xnhaRhCluKz3giEkH57bczPwLjjREb8wd3ewBYesthwe54Z-_Z8w8_vDPqzX-ugyYwFO_vKOSCRCWmwS4yQ5uhPBaf5B17tEp084TTrEWUc-Dn7GWH_851iixBsClqftMiGgo9_GQYSgaghd5xzoTaJBcMcCAS0Mj6osE0fWICcN2QP7CkZjke4ORWOVGmeUOOZ5KrqktFeyZkcJaLRpPJgRFb33pcMFTu_eNUhfow"
            />
          </button>
          
          {/* Dropdown Menu */}
          {isProfileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
              <div className="absolute right-0 top-10 mt-1 w-48 rounded-md bg-card border border-border shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-border mb-1">
                  <p className="text-sm font-medium text-foreground">Eleanor Penhaligon</p>
                  <p className="text-xs text-muted-foreground">eleanor@erp.local</p>
                </div>
                <button onClick={handleProfileSettings} className="w-full text-left px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-2">
                  <User size={14} /> Profile
                </button>
                <button onClick={handleProfileSettings} className="w-full text-left px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-2">
                  <Settings size={14} /> Preferences
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
