"use client";

import { useEffect, useState } from "react";
import { Settings2, Key, Users, Sliders, ShieldAlert, CheckCircle2, RotateCcw, Save } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function Settings() {
  const [loaded, setLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast("System parameters committed to global config.", "success");
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            System Configuration
          </h2>
          <p className="text-sm font-mono text-muted-foreground mt-2 uppercase tracking-widest">Global Parameters & Access Control</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => toast("Reverting to last safe state...", "info")} className="bg-background border border-border px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-muted transition-colors">
            <RotateCcw size={16} /> Revert
          </button>
          <button onClick={handleSave} className="bg-primary text-primary-foreground border border-primary/50 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            <Save size={16} /> Commit Config
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar (Inner) */}
        <div className="lg:col-span-3 erp-panel p-4 rounded-2xl flex flex-col h-fit">
          <button className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-lg border border-primary/20 font-bold text-sm text-left">
            <Sliders size={18} /> Global Thresholds
          </button>
          <button onClick={() => toast("Navigating to Identity Matrix", "info")} className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg border border-transparent font-medium text-sm text-left transition-colors">
            <Users size={18} /> Identity & Roles
          </button>
          <button onClick={() => toast("Navigating to API Keys", "info")} className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg border border-transparent font-medium text-sm text-left transition-colors">
            <Key size={18} /> API Keychains
          </button>
          <button onClick={() => toast("Navigating to Security", "info")} className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg border border-transparent font-medium text-sm text-left transition-colors">
            <ShieldAlert size={18} /> Security Vectors
          </button>
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-9 erp-panel p-6 rounded-2xl">
          <div className="border-b border-border pb-4 mb-6 flex justify-between items-center">
            <h3 className="font-bold text-lg">Global Alert Thresholds</h3>
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2 py-1 rounded">ENV: PRODUCTION</span>
          </div>

          <form className="space-y-8" onSubmit={handleSave}>
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
              <h4 className="text-sm font-extrabold text-foreground mb-4 uppercase tracking-wide">Social & Governance Flags</h4>
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
      </div>
    </div>
  );
}
