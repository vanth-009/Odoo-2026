"use client";

import { useState } from "react";
import { Plus, Download, Upload } from "lucide-react";
import DataTable from "@/components/DataTable";

const mockGoals = [
  { name: "Reduce Fleet Emissions", target: "20%", progress: 15, deadline: "2026-12-31", status: "On Track" },
  { name: "Zero Waste to Landfill", target: "100%", progress: 85, deadline: "2027-06-30", status: "On Track" },
  { name: "100% Renewable Energy", target: "100%", progress: 40, deadline: "2030-01-01", status: "At Risk" },
];

export default function Environmental() {
  const [activeTab, setActiveTab] = useState("Goals");

  const goalColumns = [
    { key: "name", label: "Goal Name" },
    { key: "target", label: "Target" },
    { 
      key: "progress", 
      label: "Progress",
      render: (val: number) => (
        <div className="w-full max-w-xs flex items-center gap-3">
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${val >= 80 ? 'bg-emerald-500' : val >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`} 
              style={{ width: `${val}%` }}
            />
          </div>
          <span className="text-xs w-8">{val}%</span>
        </div>
      )
    },
    { key: "deadline", label: "Deadline" },
    { 
      key: "status", 
      label: "Status",
      render: (val: string) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
          val === 'On Track' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
          'bg-rose-500/10 text-rose-400 border-rose-500/20'
        }`}>
          {val}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Environmental Dashboard</h2>
          <p className="text-slate-400 mt-1">Manage emissions, factors, and sustainability goals.</p>
        </div>
      </div>

      <div className="flex space-x-1 glass p-1 rounded-xl w-max">
        {["Overview", "Data & Factors", "Goals", "Carbon Transactions"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab 
                ? "bg-blue-600 text-white shadow-lg" 
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Goals" && (
        <DataTable 
          title="Sustainability Goals Tracking"
          columns={goalColumns} 
          data={mockGoals} 
          actions={
            <>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700">
                <Download className="w-4 h-4" /> Export
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white transition-colors">
                <Plus className="w-4 h-4" /> New Goal
              </button>
            </>
          }
        />
      )}

      {activeTab !== "Goals" && (
        <div className="glass-card p-12 text-center flex flex-col items-center justify-center border-dashed">
          <div className="w-16 h-16 bg-slate-900/50 rounded-full flex items-center justify-center mb-4 border border-slate-700/50">
            <Upload className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-200 mb-2">{activeTab} View</h3>
          <p className="text-slate-500 max-w-md">This view is currently under construction for the hackathon MVP. Check the Goals tab for the completed view.</p>
        </div>
      )}
    </div>
  );
}
