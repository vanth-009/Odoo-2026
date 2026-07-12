"use client";

import React, { useState } from "react";
import { ClipboardCheck, Save, Shield, HelpCircle, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function GovernanceSettingsPage() {
  // Governance settings states
  const [policyReminders, setPolicyReminders] = useState(true);
  const [autoFlagOverdue, setAutoFlagOverdue] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [inAppNotifications, setInAppNotifications] = useState(true);
  const [reminderFrequency, setReminderFrequency] = useState("15");
  const [defaultAuditFrequency, setDefaultAuditFrequency] = useState("quarterly");
  const [escalationDays, setEscalationDays] = useState("5");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Governance settings saved successfully!");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent w-fit">
          Governance Settings
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Configure notification frequencies, escalation rules, and automatic compliance flags.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Core Settings Box */}
        <div className="border border-white/10 bg-white/[0.02] rounded-xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-white/5 bg-white/[0.01]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-emerald-400" />
              Rules & Actions Configuration
            </h3>
            <p className="text-[11px] text-zinc-400 mt-1">Select preferences for automated compliance remediation actions.</p>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Toggles section */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Automations & Alerts</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Reminders */}
                <label className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-black/20 hover:bg-black/30 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={policyReminders}
                    onChange={(e) => setPolicyReminders(e.target.checked)}
                    className="mt-1 h-4 w-4 text-emerald-600 border-white/10 rounded focus:ring-emerald-500 bg-zinc-900"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Policy acknowledgement reminders</span>
                    <span className="text-[10px] text-zinc-400 mt-0.5 block">Transmit periodic ping alerts to employees pending read receipts.</span>
                  </div>
                </label>

                {/* Auto flag */}
                <label className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-black/20 hover:bg-black/30 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoFlagOverdue}
                    onChange={(e) => setAutoFlagOverdue(e.target.checked)}
                    className="mt-1 h-4 w-4 text-emerald-600 border-white/10 rounded focus:ring-emerald-500 bg-zinc-900"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Auto flag overdue compliance issues</span>
                    <span className="text-[10px] text-zinc-400 mt-0.5 block">Mark compliance issues as "Overdue" when target dates expire.</span>
                  </div>
                </label>

                {/* Email notifications */}
                <label className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-black/20 hover:bg-black/30 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="mt-1 h-4 w-4 text-emerald-600 border-white/10 rounded focus:ring-emerald-500 bg-zinc-900"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Email notifications</span>
                    <span className="text-[10px] text-zinc-400 mt-0.5 block">Send weekly digests, action escalations, and reports to mailbox.</span>
                  </div>
                </label>

                {/* In-app notifications */}
                <label className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-black/20 hover:bg-black/30 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={inAppNotifications}
                    onChange={(e) => setInAppNotifications(e.target.checked)}
                    className="mt-1 h-4 w-4 text-emerald-600 border-white/10 rounded focus:ring-emerald-500 bg-zinc-900"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">In-app notifications</span>
                    <span className="text-[10px] text-zinc-400 mt-0.5 block">Trigger push alerts and panel notifications inside workspace.</span>
                  </div>
                </label>

              </div>
            </div>

            {/* Threshold parameters */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Frequencies & Thresholds</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div>
                  <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Reminder Frequency</label>
                  <select
                    value={reminderFrequency}
                    onChange={(e) => setReminderFrequency(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="7">Every 7 Days</option>
                    <option value="15">Every 15 Days</option>
                    <option value="30">Every 30 Days</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Default Audit Frequency</label>
                  <select
                    value={defaultAuditFrequency}
                    onChange={(e) => setDefaultAuditFrequency(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="semi-annually">Semi-Annually</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Compliance Issue Escalation Days</label>
                  <input
                    type="number"
                    value={escalationDays}
                    onChange={(e) => setEscalationDays(e.target.value)}
                    min="1"
                    max="90"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

              </div>
            </div>

          </div>

          {/* Action button */}
          <div className="p-6 bg-white/[0.01] border-t border-white/5 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-xs font-bold text-[#09090b] flex items-center gap-1.5 shadow-lg shadow-emerald-500/10 transition-all"
            >
              <Save className="w-3.5 h-3.5" /> Save Settings
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
