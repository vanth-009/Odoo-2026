"use client";

import { useEffect, useState } from "react";
import { Settings2, Key, Users, Sliders, ShieldAlert, RotateCcw, Save } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function Settings() {
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'thresholds' | 'notifications'>('thresholds');
  const { toast } = useToast();

  // Notification settings preferences state
  const [prefs, setPrefs] = useState({
    complianceInApp: true,
    complianceEmail: true,
    approvalInApp: true,
    approvalEmail: true,
    policyInApp: true,
    policyEmail: true,
    badgeInApp: true,
    badgeEmail: true,
  });

  // Load preferences from localStorage on mount
  useEffect(() => {
    setLoaded(true);
    const localPrefs = localStorage.getItem('esg_notification_settings');
    if (localPrefs) {
      try {
        setPrefs(JSON.parse(localPrefs));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  const handleSaveThresholds = (e: React.FormEvent) => {
    e.preventDefault();
    toast("System parameters committed to global config.", "success");
  };

  const handleSaveNotifications = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    localStorage.setItem('esg_notification_settings', JSON.stringify(prefs));
    toast("Notification preferences updated successfully.", "success");
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-7xl mx-auto px-6 pt-6 text-foreground">
      
      {/* Title & Action Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            System Configuration
          </h2>
          <p className="text-sm font-mono text-muted-foreground mt-2 uppercase tracking-widest">
            {activeTab === 'thresholds' ? 'Global Parameters & Access Control' : 'Alert Protocols & Message Ingestion'}
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => {
              if (activeTab === 'notifications') {
                setPrefs({
                  complianceInApp: true,
                  complianceEmail: true,
                  approvalInApp: true,
                  approvalEmail: true,
                  policyInApp: true,
                  policyEmail: true,
                  badgeInApp: true,
                  badgeEmail: true,
                });
                toast("Notification defaults loaded.", "info");
              } else {
                toast("Reverting to last safe state...", "info");
              }
            }} 
            className="bg-background border border-border px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-muted transition-colors"
          >
            <RotateCcw size={16} /> Revert
          </button>
          
          <button 
            onClick={(e) => {
              if (activeTab === 'notifications') {
                handleSaveNotifications();
              } else {
                handleSaveThresholds(e);
              }
            }} 
            className="bg-primary text-primary-foreground border border-primary/50 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <Save size={16} /> Commit Config
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Navigation Sidebar (Inner) */}
        <div className="lg:col-span-3 erp-panel p-4 rounded-2xl flex flex-col h-fit gap-1 bg-white/[0.02] border border-white/10">
          <button 
            onClick={() => setActiveTab('thresholds')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border font-bold text-sm text-left transition-colors ${
              activeTab === 'thresholds'
                ? "bg-primary/10 text-primary border-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground border-transparent font-medium"
            }`}
          >
            <Sliders size={18} /> Global Thresholds
          </button>
          
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border font-bold text-sm text-left transition-colors ${
              activeTab === 'notifications'
                ? "bg-primary/10 text-primary border-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground border-transparent font-medium"
            }`}
          >
            <Settings2 size={18} /> Notification Settings
          </button>
          
          <button 
            onClick={() => toast("Identity Matrix is read-only.", "info")} 
            className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg border border-transparent font-medium text-sm text-left transition-colors"
          >
            <Users size={18} /> Identity &amp; Roles
          </button>
          
          <button 
            onClick={() => toast("API Keychain credentials are managed by administrator.", "info")} 
            className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg border border-transparent font-medium text-sm text-left transition-colors"
          >
            <Key size={18} /> API Keychains
          </button>
          
          <button 
            onClick={() => toast("Access Control List vectors are verified.", "info")} 
            className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg border border-transparent font-medium text-sm text-left transition-colors"
          >
            <ShieldAlert size={18} /> Security Vectors
          </button>
        </div>

        {/* Global Thresholds Tab Content */}
        {activeTab === 'thresholds' && (
          <div className="lg:col-span-9 erp-panel p-6 rounded-2xl bg-white/[0.02] border border-white/10">
            <div className="border-b border-border pb-4 mb-6 flex justify-between items-center">
              <h3 className="font-bold text-lg">Global Alert Thresholds</h3>
              <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2 py-1 rounded">ENV: PRODUCTION</span>
            </div>

            <form className="space-y-8" onSubmit={handleSaveThresholds}>
              {/* Section 1 */}
              <div>
                <h4 className="text-sm font-extrabold text-foreground mb-4 uppercase tracking-wide">Environmental Parameters</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">Scope 1 MAX (tCO2e)</label>
                    <input type="number" defaultValue={300} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm font-mono focus:outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">Scope 2 MAX (tCO2e)</label>
                    <input type="number" defaultValue={900} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm font-mono focus:outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">Intensity Target ($M/tCO2e)</label>
                    <input type="number" defaultValue={105} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm font-mono focus:outline-none focus:border-primary" />
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="pt-6 border-t border-border">
                <h4 className="text-sm font-extrabold text-foreground mb-4 uppercase tracking-wide">Social &amp; Governance Flags</h4>
                <div className="grid grid-cols-1 gap-6">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                    <div>
                      <h5 className="font-bold text-sm">Strict Diversity Mode</h5>
                      <p className="text-xs text-muted-foreground mt-1">Halt API ingestion if Workday reports &gt;5% variance in gender metrics.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                    <div>
                      <h5 className="font-bold text-sm">Automated Compliance Pings</h5>
                      <p className="text-xs text-muted-foreground mt-1">Send automatic Slack/Email reminders for pending audit items 96 hours before deadline.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Notification Settings Tab Content */}
        {activeTab === 'notifications' && (
          <div className="lg:col-span-9 erp-panel p-6 rounded-2xl bg-white/[0.02] border border-white/10">
            <div className="border-b border-border pb-4 mb-6 flex justify-between items-center">
              <h3 className="font-bold text-lg">Notification Settings</h3>
              <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2 py-1 rounded">ALERT PREFERENCES</span>
            </div>

            <form className="space-y-8 animate-fadeIn" onSubmit={handleSaveNotifications}>
              <div>
                <h4 className="text-sm font-extrabold text-foreground mb-2 uppercase tracking-wide">Configure Channels</h4>
                <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                  Choose which actions trigger in-app updates in the Alerts Ledger and which generate transactional email digests.
                </p>

                <div className="space-y-4">
                  
                  {/* 1. Compliance Issue Raised */}
                  <div className="p-4 bg-white/[0.01] border border-white/5 hover:border-white/10 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
                    <div>
                      <h5 className="font-bold text-sm text-foreground">Compliance Issue Raised</h5>
                      <p className="text-xs text-muted-foreground mt-0.5">Triggers when a new regulatory or emission deviation issue is assigned.</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={prefs.complianceInApp} 
                          onChange={(e) => setPrefs(prev => ({ ...prev, complianceInApp: e.target.checked }))}
                          className="rounded border-white/15 bg-black/40 text-emerald-500 focus:ring-emerald-500/30 w-4 h-4 cursor-pointer" 
                        />
                        <span className="text-xs font-semibold text-zinc-300">In-App</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={prefs.complianceEmail} 
                          onChange={(e) => setPrefs(prev => ({ ...prev, complianceEmail: e.target.checked }))}
                          className="rounded border-white/15 bg-black/40 text-emerald-500 focus:ring-emerald-500/30 w-4 h-4 cursor-pointer" 
                        />
                        <span className="text-xs font-semibold text-zinc-300">Email</span>
                      </label>
                    </div>
                  </div>

                  {/* 2. CSR/Challenge Approval Decisions */}
                  <div className="p-4 bg-white/[0.01] border border-white/5 hover:border-white/10 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
                    <div>
                      <h5 className="font-bold text-sm text-foreground">CSR &amp; Challenge Approvals</h5>
                      <p className="text-xs text-muted-foreground mt-0.5">Triggers when a challenge participation or volunteer activity is approved or rejected.</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={prefs.approvalInApp} 
                          onChange={(e) => setPrefs(prev => ({ ...prev, approvalInApp: e.target.checked }))}
                          className="rounded border-white/15 bg-black/40 text-emerald-500 focus:ring-emerald-500/30 w-4 h-4 cursor-pointer" 
                        />
                        <span className="text-xs font-semibold text-zinc-300">In-App</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={prefs.approvalEmail} 
                          onChange={(e) => setPrefs(prev => ({ ...prev, approvalEmail: e.target.checked }))}
                          className="rounded border-white/15 bg-black/40 text-emerald-500 focus:ring-emerald-500/30 w-4 h-4 cursor-pointer" 
                        />
                        <span className="text-xs font-semibold text-zinc-300">Email</span>
                      </label>
                    </div>
                  </div>

                  {/* 3. Policy Acknowledgement Reminders */}
                  <div className="p-4 bg-white/[0.01] border border-white/5 hover:border-white/10 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
                    <div>
                      <h5 className="font-bold text-sm text-foreground">Policy Acknowledgements</h5>
                      <p className="text-xs text-muted-foreground mt-0.5">Triggers when mandatory policies are published or require outstanding signatures.</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={prefs.policyInApp} 
                          onChange={(e) => setPrefs(prev => ({ ...prev, policyInApp: e.target.checked }))}
                          className="rounded border-white/15 bg-black/40 text-emerald-500 focus:ring-emerald-500/30 w-4 h-4 cursor-pointer" 
                        />
                        <span className="text-xs font-semibold text-zinc-300">In-App</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={prefs.policyEmail} 
                          onChange={(e) => setPrefs(prev => ({ ...prev, policyEmail: e.target.checked }))}
                          className="rounded border-white/15 bg-black/40 text-emerald-500 focus:ring-emerald-500/30 w-4 h-4 cursor-pointer" 
                        />
                        <span className="text-xs font-semibold text-zinc-300">Email</span>
                      </label>
                    </div>
                  </div>

                  {/* 4. Badge Unlocks */}
                  <div className="p-4 bg-white/[0.01] border border-white/5 hover:border-white/10 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
                    <div>
                      <h5 className="font-bold text-sm text-foreground">Badge Unlocks</h5>
                      <p className="text-xs text-muted-foreground mt-0.5">Triggers when a participant earns a new badge milestone in the Gamification console.</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={prefs.badgeInApp} 
                          onChange={(e) => setPrefs(prev => ({ ...prev, badgeInApp: e.target.checked }))}
                          className="rounded border-white/15 bg-black/40 text-emerald-500 focus:ring-emerald-500/30 w-4 h-4 cursor-pointer" 
                        />
                        <span className="text-xs font-semibold text-zinc-300">In-App</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={prefs.badgeEmail} 
                          onChange={(e) => setPrefs(prev => ({ ...prev, badgeEmail: e.target.checked }))}
                          className="rounded border-white/15 bg-black/40 text-emerald-500 focus:ring-emerald-500/30 w-4 h-4 cursor-pointer" 
                        />
                        <span className="text-xs font-semibold text-zinc-300">Email</span>
                      </label>
                    </div>
                  </div>

                </div>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
