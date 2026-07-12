"use client";
import { FileText } from "lucide-react";
export default function Reports() {
  return (
    <div className="flex flex-col items-center justify-center h-96 glass-card border-dashed">
      <FileText className="w-16 h-16 text-slate-500 mb-4" />
      <h2 className="text-2xl font-bold text-slate-100">Reports Module</h2>
      <p className="text-slate-400 mt-2">Custom Report Builder coming soon.</p>
    </div>
  );
}
