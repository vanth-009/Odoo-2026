'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, RefreshCw, LogOut, CheckCircle2, ShieldAlert,
  Users2, Landmark, Gamepad2, Settings2, HelpCircle
} from 'lucide-react';
import { DashboardData } from '../types';
import KPIOverview from './KPIOverview';
import TrendAnalytics from './TrendAnalytics';
import SourceBreakdown from './SourceBreakdown';
import DepartmentPerformance from './DepartmentPerformance';
import GoalsTracker from './GoalsTracker';
import RecentActivity from './RecentActivity';
import AlertsInsights from './AlertsInsights';
import FactorConfigModal from './FactorConfigModal';

interface DashboardProps {
  initialData: DashboardData;
}

export default function EnvironmentDashboard({ initialData }: DashboardProps) {
  const [data, setData] = useState<DashboardData>(initialData);
  const [loading, setLoading] = useState(false);
  const [isFactorModalOpen, setIsFactorModalOpen] = useState(false);
  const [departmentsList, setDepartmentsList] = useState<{ id: string; name: string }[]>([]);
  
  // Toast notifications state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch all departments for select dropdowns
  const fetchDepartments = async () => {
    try {
      const res = await fetch('/api/environment/departments');
      if (res.ok) {
        const list = await res.json();
        setDepartmentsList(list);
      }
    } catch (err) {
      console.error('Failed to load departments', err);
    }
  };

  // Refresh dashboard data
  const refreshData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch('/api/environment/dashboard');
      if (res.ok) {
        const freshData = await res.json();
        setData(freshData);
      }
    } catch (err) {
      triggerToast('Failed to refresh carbon metrics', 'error');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="flex flex-1 bg-zinc-950 text-zinc-100 min-h-screen font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-zinc-900 bg-zinc-950 flex flex-col justify-between hidden md:flex shrink-0">
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-zinc-900 gap-2.5">
            <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-black text-sm">
              E
            </div>
            <span className="font-semibold text-sm tracking-tight">EcoSphere ESG</span>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1.5">
            <a 
              href="#" 
              className="flex items-center gap-3 px-3.5 py-2.5 bg-emerald-950/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/10 rounded-xl text-xs font-semibold transition-all"
            >
              <BarChart3 className="w-4 h-4" />
              Environmental Dashboard
            </a>
            
            {/* Locked modules */}
            <div className="pt-4 pb-2 px-3 text-[10px] uppercase font-bold tracking-wider text-zinc-650">
              Other Modules
            </div>

            <div 
              className="flex items-center justify-between px-3.5 py-2.5 text-zinc-600 rounded-xl text-xs font-medium cursor-not-allowed border border-transparent"
              title="Assigned to Team Member B"
            >
              <span className="flex items-center gap-3">
                <Users2 className="w-4 h-4" />
                Social Responsibility
              </span>
              <span className="text-[8px] bg-zinc-900 text-zinc-650 px-1.5 py-0.5 rounded font-mono font-bold uppercase">Locked</span>
            </div>

            <div 
              className="flex items-center justify-between px-3.5 py-2.5 text-zinc-600 rounded-xl text-xs font-medium cursor-not-allowed border border-transparent"
              title="Assigned to Team Member C"
            >
              <span className="flex items-center gap-3">
                <Landmark className="w-4 h-4" />
                Corporate Governance
              </span>
              <span className="text-[8px] bg-zinc-900 text-zinc-650 px-1.5 py-0.5 rounded font-mono font-bold uppercase">Locked</span>
            </div>

            <div 
              className="flex items-center justify-between px-3.5 py-2.5 text-zinc-600 rounded-xl text-xs font-medium cursor-not-allowed border border-transparent"
              title="Assigned to Gamification Team"
            >
              <span className="flex items-center gap-3">
                <Gamepad2 className="w-4 h-4" />
                ESG Gamification Hub
              </span>
              <span className="text-[8px] bg-zinc-900 text-zinc-650 px-1.5 py-0.5 rounded font-mono font-bold uppercase">Locked</span>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-zinc-900 space-y-2 text-zinc-500 text-xs">
          <button 
            onClick={() => setIsFactorModalOpen(true)}
            className="w-full flex items-center gap-3 px-3.5 py-2 hover:bg-zinc-900 hover:text-zinc-300 rounded-lg transition-colors text-left font-medium"
          >
            <Settings2 className="w-4 h-4" />
            Emission Config
          </button>
          <a href="#" className="flex items-center gap-3 px-3.5 py-2 hover:bg-zinc-900 hover:text-zinc-300 rounded-lg transition-colors font-medium">
            <HelpCircle className="w-4 h-4" />
            Help & Documentation
          </a>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header */}
        <header className="h-16 border-b border-zinc-900 px-6 flex items-center justify-between bg-zinc-950 shrink-0">
          <div className="flex flex-col">
            <h1 className="text-base font-bold text-zinc-100 tracking-tight">Environmental Dashboard</h1>
            <p className="text-[10px] text-zinc-500 font-medium mt-0.5">EcoSphere ESG Management Console</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-400">
              Q1-Q4 reporting
            </span>

            <button
              onClick={() => refreshData()}
              disabled={loading}
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 border border-zinc-850 transition-colors disabled:opacity-40"
              title="Refresh Dashboard Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="p-6 space-y-6 flex-1 bg-zinc-950">
          {/* Toast Alert */}
          {toast && (
            <div className={`fixed bottom-6 right-6 z-50 p-4 border rounded-xl shadow-2xl flex items-center gap-3 transition-all duration-300 animate-slide-up ${
              toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/90 border-rose-500/30 text-rose-300'
            }`}>
              {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <ShieldAlert className="w-5 h-5 shrink-0" />}
              <span className="text-xs font-semibold">{toast.message}</span>
            </div>
          )}

          {/* 1. KPIs */}
          <KPIOverview kpis={data.kpis} />

          {/* 2. Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TrendAnalytics data={data.monthlyTrends} isLoading={loading} />
            </div>
            <div>
              <SourceBreakdown data={data.sourceBreakdown} isLoading={loading} />
            </div>
          </div>

          {/* 3. Incidents, Alerts & Insights */}
          <AlertsInsights alerts={data.alerts} />

          {/* 4. Departments Leaderboard & Goals */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DepartmentPerformance departments={data.departments} isLoading={loading} />
            </div>
            <div>
              <GoalsTracker 
                goals={data.goals} 
                departments={departmentsList} 
                onGoalCreated={() => {
                  refreshData(true);
                  triggerToast('Sustainability goal registered successfully!');
                }}
                isLoading={loading}
              />
            </div>
          </div>

          {/* 5. Recent Activity Table */}
          <RecentActivity 
            initialTransactions={data.recentActivity} 
            departments={departmentsList}
            onTransactionAdded={() => {
              refreshData(true);
              triggerToast('Emissions transaction logged successfully!');
            }}
            isLoading={loading}
          />
        </div>
      </main>

      {/* Factor Configurations Modal */}
      <FactorConfigModal 
        isOpen={isFactorModalOpen} 
        onClose={() => setIsFactorModalOpen(false)} 
        onFactorUpdated={() => {
          refreshData(true);
          triggerToast('Emission factor values saved successfully!');
        }}
      />
    </div>
  );
}
