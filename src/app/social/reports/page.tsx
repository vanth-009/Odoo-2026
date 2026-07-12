"use client";

import React, { useState } from "react";
import { FileText, Download, Filter, Calendar, FileDown, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function SocialReportsPage() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const handleDownload = (reportType: string) => {
    setIsGenerating(reportType);
    toast(`Generating ${reportType}...`, "info");
    
    // Simulate generation time
    setTimeout(() => {
      setIsGenerating(null);
      toast(`${reportType} successfully generated and downloaded!`, "success");
    }, 2000);
  };

  const reports = [
    {
      id: "diversity-report",
      title: "Workforce Diversity Report",
      description: "Comprehensive breakdown of gender, ethnicity, and age distributions across the organization, including the Shannon Diversity Index.",
      type: "PDF",
      lastGenerated: "Today, 09:41 AM"
    },
    {
      id: "csr-impact",
      title: "CSR Impact & Participation",
      description: "Summary of all active and completed CSR activities, total volunteer hours logged, and XP distributed to employees.",
      type: "CSV",
      lastGenerated: "Yesterday, 14:22 PM"
    },
    {
      id: "engagement-survey",
      title: "Employee Engagement Sentiment",
      description: "Aggregated results from the latest internal surveys focusing on Work-Life Balance and Team Collaboration.",
      type: "PDF",
      lastGenerated: "3 days ago"
    },
    {
      id: "compliance-training",
      title: "Compliance & Training Audit",
      description: "A strict audit trail of employee completions for mandatory compliance training (e.g., Anti-Harassment, Data Privacy).",
      type: "CSV",
      lastGenerated: "Last Week"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Social & Governance Reports</h2>
          <p className="text-sm text-slate-400">Generate, view, and export compliance and social metrics.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white hover:bg-white/10 transition-colors">
            <Filter className="w-4 h-4 text-emerald-400" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-sm font-medium text-white transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Calendar className="w-4 h-4" />
            Schedule Report
          </button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report) => (
          <div key={report.id} className="bg-white/[0.02] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all flex flex-col h-full group">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">{report.title}</h3>
                  <span className="text-xs font-medium text-emerald-400/80 bg-emerald-400/10 px-2 py-0.5 rounded-full mt-1 inline-block">
                    {report.type} Format
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-slate-400 mb-6 flex-1 line-clamp-2">
              {report.description}
            </p>
            
            <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
              <div className="text-xs text-slate-500">
                Last generated: <span className="text-slate-300">{report.lastGenerated}</span>
              </div>
              <button 
                onClick={() => handleDownload(report.title)}
                disabled={isGenerating === report.title}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 rounded text-xs font-medium transition-colors border border-transparent hover:border-emerald-500/30"
              >
                {isGenerating === report.title ? (
                  <span className="flex items-center gap-1.5 animate-pulse">
                    <FileDown className="w-3.5 h-3.5" /> Generating...
                  </span>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" /> Download
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
