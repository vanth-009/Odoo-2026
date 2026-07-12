"use client";

import { useEffect, useState } from "react";
import { Settings2, Key, Users, Sliders, ShieldAlert, RotateCcw, Save, ShieldCheck, RefreshCw, KeyRound } from "lucide-react";
import { useToast } from "@/components/Toast";

type SettingsTab = 'thresholds' | 'notifications' | 'identity' | 'apikeys' | 'security';

export default function Settings() {
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>('thresholds');
  const { toast } = useToast();

  // 1. Notification settings preferences state
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

  // 2. Identity & Roles state
  const [employees, setEmployees] = useState<any[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  // 3. API Keychains state
  const [apiKeys, setApiKeys] = useState({
    sapApiKey: "sap_prod_99f2a0b12a",
    workdayClientSecret: "wd_sec_81ab66c9ff",
    slackWebhookUrl: "https://example.com/webhook/slack-integration-key"
  });

  // 4. Security Vectors state
  const [securityConfigs, setSecurityConfigs] = useState({
    mfaRequired: true,
    sessionTimeout: 30,
    allowedIpRange: "0.0.0.0/0",
    enforceStrongPasswords: true
  });

  // 5. Evidence Requirement & Auto Award operational rules state
  const [requireProof, setRequireProof] = useState(false);
  const [badgeAutoAward, setBadgeAutoAward] = useState(false);

  // Load preferences and employees on mount
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

    const localApiKeys = localStorage.getItem('esg_api_keys');
    if (localApiKeys) {
      try {
        setApiKeys(JSON.parse(localApiKeys));
      } catch (e) {}
    }

    const localSecurity = localStorage.getItem('esg_security_configs');
    if (localSecurity) {
      try {
        setSecurityConfigs(JSON.parse(localSecurity));
      } catch (e) {}
    }

    // Fetch operational settings from backend API
    fetch('/api/settings')
      .then(res => res.json())
      .then(body => {
        if (body.success && body.data) {
          setRequireProof(body.data.requireProof || false);
          setBadgeAutoAward(body.data.badgeAutoAward || false);
        }
      })
      .catch(e => console.error("Error loading backend settings", e));

    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const res = await fetch('/api/social/employees');
      if (res.ok) {
        const body = await res.json();
        setEmployees(body.data || body.employees || []);
      }
    } catch (err) {
      console.error("Failed fetching employees:", err);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleSaveThresholds = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requireProof, badgeAutoAward })
      });
      if (res.ok) {
        toast("Global thresholds and operational settings committed.", "success");
      } else {
        toast("Failed to update operational settings.", "error");
      }
    } catch (err) {
      console.error(err);
      toast("Failed to update operational settings.", "error");
    }
  };

  const handleSaveNotifications = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    localStorage.setItem('esg_notification_settings', JSON.stringify(prefs));
    toast("Notification preferences updated successfully.", "success");
  };

  const handleSaveEmployees = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('esg_employee_roles', JSON.stringify(employees));
    toast("Employee roles updated successfully.", "success");
  };

  const handleSaveApiKeys = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('esg_api_keys', JSON.stringify(apiKeys));
    toast("API Keychain credentials updated.", "success");
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('esg_security_configs', JSON.stringify(securityConfigs));
    toast("Security vectors updated successfully.", "success");
  };

  const handleRoleChange = (employeeId: string, newRole: string) => {
    setEmployees(prev => prev.map(emp => emp.id === employeeId ? { ...emp, role: newRole } : emp));
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
            {activeTab === 'thresholds' && 'Global Parameters & Access Control'}
            {activeTab === 'notifications' && 'Alert Protocols & Message Ingestion'}
            {activeTab === 'identity' && 'Identity & Roles Management'}
            {activeTab === 'apikeys' && 'API Integration Keychains'}
            {activeTab === 'security' && 'Security Vectors & Safeguards'}
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
              } else if (activeTab === 'apikeys') {
                setApiKeys({
                  sapApiKey: "sap_prod_99f2a0b12a",
                  workdayClientSecret: "wd_sec_81ab66c9ff",
                  slackWebhookUrl: "https://example.com/webhook/slack-integration-key"
                });
                toast("API Key defaults loaded.", "info");
              } else if (activeTab === 'security') {
                setSecurityConfigs({
                  mfaRequired: true,
                  sessionTimeout: 30,
                  allowedIpRange: "0.0.0.0/0",
                  enforceStrongPasswords: true
                });
                toast("Security defaults loaded.", "info");
              } else {
                fetch('/api/settings')
                  .then(res => res.json())
                  .then(body => {
                    if (body.success && body.data) {
                      setRequireProof(body.data.requireProof || false);
                      setBadgeAutoAward(body.data.badgeAutoAward || false);
                      toast("Threshold operational settings reverted.", "info");
                    }
                  });
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
              } else if (activeTab === 'identity') {
                handleSaveEmployees(e);
              } else if (activeTab === 'apikeys') {
                handleSaveApiKeys(e);
              } else if (activeTab === 'security') {
                handleSaveSecurity(e);
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
                : "text-zinc-400 hover:bg-zinc-900/40 hover:text-foreground border-transparent font-medium"
            }`}
          >
            <Sliders size={18} /> Global Thresholds
          </button>
          
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border font-bold text-sm text-left transition-colors ${
              activeTab === 'notifications'
                ? "bg-primary/10 text-primary border-primary/20"
                : "text-zinc-400 hover:bg-zinc-900/40 hover:text-foreground border-transparent font-medium"
            }`}
          >
            <Settings2 size={18} /> Notification Settings
          </button>
          
          <button 
            onClick={() => setActiveTab('identity')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border font-bold text-sm text-left transition-colors ${
              activeTab === 'identity'
                ? "bg-primary/10 text-primary border-primary/20"
                : "text-zinc-400 hover:bg-zinc-900/40 hover:text-foreground border-transparent font-medium"
            }`}
          >
            <Users size={18} /> Identity &amp; Roles
          </button>
          
          <button 
            onClick={() => setActiveTab('apikeys')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border font-bold text-sm text-left transition-colors ${
              activeTab === 'apikeys'
                ? "bg-primary/10 text-primary border-primary/20"
                : "text-zinc-400 hover:bg-zinc-900/40 hover:text-foreground border-transparent font-medium"
            }`}
          >
            <Key size={18} /> API Keychains
          </button>
          
          <button 
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border font-bold text-sm text-left transition-colors ${
              activeTab === 'security'
                ? "bg-primary/10 text-primary border-primary/20"
                : "text-zinc-400 hover:bg-zinc-900/40 hover:text-foreground border-transparent font-medium"
            }`}
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
                    <input type="number" defaultValue={300} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm font-mono focus:outline-none focus:border-primary text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">Scope 2 MAX (tCO2e)</label>
                    <input type="number" defaultValue={900} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm font-mono focus:outline-none focus:border-primary text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">Intensity Target ($M/tCO2e)</label>
                    <input type="number" defaultValue={105} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm font-mono focus:outline-none focus:border-primary text-white" />
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="pt-6 border-t border-border">
                <h4 className="text-sm font-extrabold text-foreground mb-4 uppercase tracking-wide">Social &amp; Governance Flags</h4>
                <div className="grid grid-cols-1 gap-6">
                  <div className="flex items-center justify-between p-4 bg-white/[0.01] rounded-xl border border-white/5 hover:border-white/10 transition-all">
                    <div>
                      <h5 className="font-bold text-sm">Strict Diversity Mode</h5>
                      <p className="text-xs text-muted-foreground mt-1">Halt API ingestion if Workday reports &gt;5% variance in gender metrics.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/[0.01] rounded-xl border border-white/5 hover:border-white/10 transition-all">
                    <div>
                      <h5 className="font-bold text-sm">Automated Compliance Pings</h5>
                      <p className="text-xs text-muted-foreground mt-1">Send automatic Slack/Email reminders for pending audit items 96 hours before deadline.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/[0.01] rounded-xl border border-white/5 hover:border-white/10 transition-all">
                    <div>
                      <h5 className="font-bold text-sm">Evidence Verification (CSR Proof)</h5>
                      <p className="text-xs text-muted-foreground mt-1">Block approval of CSR Activity participations if no proof file link is uploaded.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={requireProof}
                        onChange={(e) => setRequireProof(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/[0.01] rounded-xl border border-white/5 hover:border-white/10 transition-all">
                    <div>
                      <h5 className="font-bold text-sm">Auto-Award Badge Milestones</h5>
                      <p className="text-xs text-muted-foreground mt-1">Automatically assign badges to employees the moment threshold parameters or target XP goals are met.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={badgeAutoAward}
                        onChange={(e) => setBadgeAutoAward(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
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
                      <p className="text-xs text-muted-foreground mt-0.5">Triggers when a new regulatory or deviation issue is assigned.</p>
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

        {/* Identity & Roles Tab Content */}
        {activeTab === 'identity' && (
          <div className="lg:col-span-9 erp-panel p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
            <div className="border-b border-border pb-4 mb-2 flex justify-between items-center">
              <h3 className="font-bold text-lg">Identity &amp; Roles Management</h3>
              <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2 py-1 rounded">ROLES MATRIX</span>
            </div>

            <form onSubmit={handleSaveEmployees} className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                View and reassign roles for registered company employees. These role updates dictate action clearances across the ESG consoles.
              </p>

              {loadingEmployees ? (
                <div className="flex justify-center py-10">
                  <RefreshCw className="w-6 h-6 text-emerald-500 animate-spin" />
                </div>
              ) : (
                <div className="border border-white/10 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-black/20 text-zinc-400 font-bold uppercase border-b border-white/5">
                      <tr>
                        <th className="px-4 py-3">Employee</th>
                        <th className="px-4 py-3">Code</th>
                        <th className="px-4 py-3">Email Address</th>
                        <th className="px-4 py-3">Assigned Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-zinc-300">
                      {employees.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center italic text-zinc-550">No employees registered.</td>
                        </tr>
                      ) : (
                        employees.map((emp) => (
                          <tr key={emp.id} className="hover:bg-white/[0.01]">
                            <td className="px-4 py-3 font-bold text-white">{emp.firstName} {emp.lastName}</td>
                            <td className="px-4 py-3 font-mono text-zinc-500">{emp.employeeCode || emp.code || 'EMP-'+emp.id.slice(0,4)}</td>
                            <td className="px-4 py-3 text-zinc-450">{emp.email}</td>
                            <td className="px-4 py-2">
                              <select
                                value={emp.role || "EMPLOYEE"}
                                onChange={(e) => handleRoleChange(emp.id, e.target.value)}
                                className="bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-emerald-500"
                              >
                                <option value="ADMIN">Administrator</option>
                                <option value="AUDITOR">Compliance Auditor</option>
                                <option value="MANAGER">Department Manager</option>
                                <option value="EMPLOYEE">Company Employee</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </form>
          </div>
        )}

        {/* API Keychains Tab Content */}
        {activeTab === 'apikeys' && (
          <div className="lg:col-span-9 erp-panel p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
            <div className="border-b border-border pb-4 mb-2 flex justify-between items-center">
              <h3 className="font-bold text-lg">API Integration Keychains</h3>
              <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2 py-1 rounded">CREDENTIALS</span>
            </div>

            <form onSubmit={handleSaveApiKeys} className="space-y-6 animate-fadeIn">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Manage credentials, private endpoints, and webhook tokens connecting EcoSphere to external data vectors.
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">SAP ERP Integration Key</label>
                  <div className="flex gap-2">
                    <input 
                      type="password" 
                      value={apiKeys.sapApiKey} 
                      onChange={(e) => setApiKeys(prev => ({ ...prev, sapApiKey: e.target.value }))}
                      className="flex-1 bg-black/45 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500" 
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        setApiKeys(prev => ({ ...prev, sapApiKey: "sap_prod_" + Math.random().toString(36).slice(2, 12) }));
                        toast("New SAP integration key generated", "info");
                      }}
                      className="px-3 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shrink-0"
                    >
                      <KeyRound className="w-3.5 h-3.5" /> Rotate
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Workday Client Secret</label>
                  <div className="flex gap-2">
                    <input 
                      type="password" 
                      value={apiKeys.workdayClientSecret} 
                      onChange={(e) => setApiKeys(prev => ({ ...prev, workdayClientSecret: e.target.value }))}
                      className="flex-1 bg-black/45 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500" 
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        setApiKeys(prev => ({ ...prev, workdayClientSecret: "wd_sec_" + Math.random().toString(36).slice(2, 12) }));
                        toast("New Workday credentials client secret generated", "info");
                      }}
                      className="px-3 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shrink-0"
                    >
                      <KeyRound className="w-3.5 h-3.5" /> Rotate
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Slack Webhook Endpoint</label>
                  <input 
                    type="text" 
                    value={apiKeys.slackWebhookUrl} 
                    onChange={(e) => setApiKeys(prev => ({ ...prev, slackWebhookUrl: e.target.value }))}
                    className="w-full bg-black/45 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500" 
                  />
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Security Vectors Tab Content */}
        {activeTab === 'security' && (
          <div className="lg:col-span-9 erp-panel p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
            <div className="border-b border-border pb-4 mb-2 flex justify-between items-center">
              <h3 className="font-bold text-lg">Security Vectors &amp; Safeguards</h3>
              <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2 py-1 rounded">VECTORS</span>
            </div>

            <form onSubmit={handleSaveSecurity} className="space-y-6 animate-fadeIn">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Configure global security protocols, session lifetimes, and authentication requirements for environmental matrix operators.
              </p>

              <div className="space-y-4">
                
                {/* 1. MFA */}
                <div className="p-4 bg-white/[0.01] border border-white/5 hover:border-white/10 rounded-xl flex items-center justify-between gap-4 transition-all">
                  <div>
                    <h5 className="font-bold text-sm text-foreground flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" /> Multi-Factor Authentication
                    </h5>
                    <p className="text-xs text-muted-foreground mt-0.5 font-medium">Require code validation alongside standard passwords during login.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={securityConfigs.mfaRequired}
                      onChange={(e) => setSecurityConfigs(prev => ({ ...prev, mfaRequired: e.target.checked }))}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                {/* 2. Expire */}
                <div className="p-4 bg-white/[0.01] border border-white/5 hover:border-white/10 rounded-xl flex items-center justify-between gap-4 transition-all">
                  <div>
                    <h5 className="font-bold text-sm text-foreground">Session Expiration Limit</h5>
                    <p className="text-xs text-muted-foreground mt-0.5 font-medium">Period of inactivity (in minutes) before automatic session logouts.</p>
                  </div>
                  <div>
                    <input 
                      type="number" 
                      value={securityConfigs.sessionTimeout}
                      onChange={(e) => setSecurityConfigs(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) || 0 }))}
                      className="w-20 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-white text-center focus:outline-none focus:border-emerald-500" 
                    />
                  </div>
                </div>

                {/* 3. IP Whitelists */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Authorized IP Ranges (CIDR notation)</label>
                  <input 
                    type="text" 
                    value={securityConfigs.allowedIpRange}
                    onChange={(e) => setSecurityConfigs(prev => ({ ...prev, allowedIpRange: e.target.value }))}
                    className="w-full bg-black/45 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500" 
                  />
                  <p className="text-[10px] text-zinc-500 font-medium">Enter comma-separated IP CIDRs (e.g., 192.168.1.0/24). Use 0.0.0.0/0 to allow connections from any address.</p>
                </div>

              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
