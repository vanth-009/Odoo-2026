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
    toast("Settings page not implemented yet.", "info");
  };

  return (
    <header className="w-full h-16 flex justify-between items-center px-6 sticky top-0 z-40 glass-panel border-b border-white/5">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-muted-foreground hover:text-foreground transition-colors">
          <Menu size={24} />
        </button>
        <div className="hidden md:flex items-center gap-3 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
          <Activity size={16} className="text-primary" />
          <span className="text-sm font-medium text-muted-foreground">Reporting Period: <span className="text-foreground font-semibold text-gradient">FY24 Q3</span></span>
          <div className="h-4 w-px bg-white/10 mx-1"></div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Live Sync</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className={`hidden lg:flex items-center bg-black/40 border transition-all rounded-full px-4 py-1.5 w-72 ${isSearchFocused ? 'border-primary ring-1 ring-primary shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'border-white/10'}`}>
          <Search size={16} className={isSearchFocused ? "text-primary" : "text-muted-foreground"} />
          <input 
            className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm w-full font-medium ml-2 text-foreground placeholder:text-muted-foreground" 
            placeholder="Search assets, metrics..." 
            type="text"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                toast("Search functionality ready for backend integration", "info");
                e.currentTarget.blur();
              }
            }}
          />
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-white/10 px-1.5 py-0.5 rounded font-mono">
            <span>⌘</span><span>K</span>
          </div>
        </div>
        
        {/* Theme Toggle */}
        {mounted && (
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-white/5"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        )}
        
        {/* Notifications */}
        <button onClick={handleNotifications} className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-white/5">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-[var(--bg-color)]"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-foreground leading-none">Eleanor P.</p>
            <p className="text-xs text-muted-foreground mt-1">CSO</p>
          </div>
          <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-primary/30 p-0.5 hover:ring-primary transition-all">
            <img 
              className="w-full h-full rounded-full object-cover" 
              alt="Profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzuNyqZ74PEEL7xnhaRhCluKz3giEkH57bczPwLjjREb8wd3ewBYesthwe54Z-_Z8w8_vDPqzX-ugyYwFO_vKOSCRCWmwS4yQ5uhPBaf5B17tEp084TTrEWUc-Dn7GWH_851iixBsClqftMiGgo9_GQYSgaghd5xzoTaJBcMcCAS0Mj6osE0fWICcN2QP7CkZjke4ORWOVGmeUOOZ5KrqktFeyZkcJaLRpPJgRFb33pcMFTu_eNUhfow"
            />
          </button>
          
          {/* Dropdown Menu */}
          {isProfileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
              <div className="absolute right-0 top-12 mt-2 w-48 rounded-xl glass-panel bg-background/95 border border-white/10 shadow-2xl py-1 z-50 animate-fade-in-up">
                <div className="px-4 py-2 border-b border-white/5 mb-1">
                  <p className="text-sm font-medium text-foreground">Eleanor Penhaligon</p>
                  <p className="text-xs text-muted-foreground">eleanor@ecosphere.com</p>
                </div>
                <button onClick={handleProfileSettings} className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 flex items-center gap-2">
                  <User size={14} /> Profile
                </button>
                <button onClick={handleProfileSettings} className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 flex items-center gap-2">
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
