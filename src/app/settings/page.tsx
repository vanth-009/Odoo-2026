"use client";
import { Settings as SettingsIcon } from "lucide-react";
export default function Settings() {
  return (
    <div className="flex flex-col items-center justify-center h-96 glass-card border-dashed">
      <SettingsIcon className="w-16 h-16 text-slate-500 mb-4" />
      <h2 className="text-2xl font-bold text-slate-100">Settings & Administration</h2>
      <p className="text-slate-400 mt-2">Configuration options coming soon.</p>
    </div>
  );
}
