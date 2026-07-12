'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, RefreshCw, CheckCircle2, ShieldAlert, Sparkles,
  Users2, Landmark, Gamepad2, Settings2, HelpCircle, ArrowRight, Package, FileText, Target, BarChart2, FileSpreadsheet
} from 'lucide-react';
import { DashboardData } from '../types';
import KPIOverview from './KPIOverview';
import TrendAnalytics from './TrendAnalytics';
import SourceBreakdown from './SourceBreakdown';
import DepartmentPerformance from './DepartmentPerformance';
import GoalsTracker from './GoalsTracker';
import RecentActivity from './RecentActivity';
import AlertsInsights from './AlertsInsights';
import CarbonHotspots from './CarbonHotspots';
import FactorConfigModal from './FactorConfigModal';

interface DashboardProps {
  initialData: DashboardData;
}

export default function EnvironmentDashboard({ initialData }: DashboardProps) {
  const [data, setData] = useState<DashboardData>(initialData);
  const [loading, setLoading] = useState(false);
  const [isFactorModalOpen, setIsFactorModalOpen] = useState(false);
  const [departmentsList, setDepartmentsList] = useState<{ id: string; name: string }[]>([]);
  
  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

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
    <div className="flex flex-1 bg-[#09090b] text-[#f4f4f5] min-h-screen relative overflow-hidden transition-all duration-300">
      
      {/* Premium ambient light layers (Stripe/Linear style) */}
      <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] ambient-glow-1 pointer-events-none z-0" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] ambient-glow-2 pointer-events-none z-0" />
      <div className="absolute top-[30%] right-[10%] w-[45%] h-[45%] ambient-glow-3 pointer-events-none z-0" />

      {/* Elegant, Compact & Minimal Sidebar */}
      <aside className="w-64 border-r border-[#1f1f23]/60 bg-[#09090b]/80 backdrop-blur-md flex flex-col justify-between hidden md:flex shrink-0 z-10 relative">
        <div>
          {/* Logo with system status indication */}
          <div className="h-16 flex items-center px-6 border-b border-[#1f1f23]/40 gap-3">
            <div className="w-5.5 h-5.5 bg-emerald-500 rounded-md flex items-center justify-center font-bold text-[#09090b] text-[11px] shadow-[0_0_20px_rgba(16,185,129,0.25)]">
              E
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-[11px] tracking-widest text-[#f4f4f5] block uppercase">EcoSphere</span>
              <span className="text-[7.5px] text-zinc-550 font-mono tracking-widest uppercase flex items-center gap-1 -mt-0.5">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                Telemetry Node Active
              </span>
            </div>
          </div>

          {/* Navigation Links with Active Line Indicators */}
          <nav className="p-4 space-y-2">
            <span className="px-3 text-[8.5px] uppercase font-bold tracking-widest text-zinc-500 block mb-3">Sections</span>
            
            <a 
              href="/environment" 
              className="flex items-center gap-3 px-3 py-2 text-emerald-450 border border-transparent rounded-lg text-xs font-semibold relative transition-premium group"
            >
              {/* Subtle active line indicator */}
              <span className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-emerald-500 rounded-full" />
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              Environmental Console
            </a>

            <a 
              href="/environment/factors" 
              className="flex items-center gap-3 px-3 py-2 text-zinc-400 border border-transparent rounded-lg text-xs font-semibold relative transition-premium group hover:bg-zinc-900/10 hover:text-[#f4f4f5]"
            >
              <Settings2 className="w-4 h-4 text-zinc-400 group-hover:text-[#f4f4f5] transition-colors" />
              Emission Factors
            </a>

            <a 
              href="/environment/products" 
              className="flex items-center gap-3 px-3 py-2 text-zinc-400 border border-transparent rounded-lg text-xs font-semibold relative transition-premium group hover:bg-zinc-900/10 hover:text-[#f4f4f5]"
            >
              <Package className="w-4 h-4 text-zinc-400 group-hover:text-[#f4f4f5] transition-colors" />
              Product ESG Profiles
            </a>

            <a 
              href="/environment/transactions" 
              className="flex items-center gap-3 px-3 py-2 text-zinc-400 border border-transparent rounded-lg text-xs font-semibold relative transition-premium group hover:bg-zinc-900/10 hover:text-[#f4f4f5]"
            >
              <FileText className="w-4 h-4 text-zinc-400 group-hover:text-[#f4f4f5] transition-colors" />
              Carbon Transactions
            </a>

            <a 
              href="/environment/goals" 
              className="flex items-center gap-3 px-3 py-2 text-zinc-400 border border-transparent rounded-lg text-xs font-semibold relative transition-premium group hover:bg-zinc-900/10 hover:text-[#f4f4f5]"
            >
              <Target className="w-4 h-4 text-zinc-400 group-hover:text-[#f4f4f5] transition-colors" />
              Sustainability Goals
            </a>

            <a 
              href="/environment/analytics" 
              className="flex items-center gap-3 px-3 py-2 text-zinc-405 border border-transparent rounded-lg text-xs font-semibold relative transition-premium group hover:bg-zinc-900/10 hover:text-[#f4f4f5]"
            >
              <BarChart2 className="w-4 h-4 text-zinc-405 group-hover:text-[#f4f4f5] transition-colors" />
              Department Analytics
            </a>

            <a 
              href="/environment/reports" 
              className="flex items-center gap-3 px-3 py-2 text-zinc-400 border border-transparent rounded-lg text-xs font-semibold relative transition-premium group hover:bg-zinc-900/10 hover:text-[#f4f4f5]"
            >
              <FileSpreadsheet className="w-4 h-4 text-zinc-400 group-hover:text-[#f4f4f5] transition-colors" />
              Environmental Reports
            </a>
            
            {/* Locked Modules with clean layout */}
            <div className="pt-6 pb-2 px-3 text-[8.5px] uppercase font-bold tracking-widest text-zinc-500">
              Other Systems
            </div>

            <div 
              className="flex items-center justify-between px-3 py-2 text-zinc-500 rounded-lg text-xs font-medium cursor-not-allowed border border-transparent hover:bg-zinc-900/10 group"
              title="Assigned to Social Responsibility Team"
            >
              <span className="flex items-center gap-3">
                <Users2 className="w-4 h-4 text-zinc-650 group-hover:text-zinc-500 transition-colors" />
                Social System
              </span>
              <span className="text-[7.5px] bg-[#18181b] text-zinc-600 px-1.5 py-0.5 rounded font-mono font-bold uppercase">Locked</span>
            </div>

            <div 
              className="flex items-center justify-between px-3 py-2 text-zinc-500 rounded-lg text-xs font-medium cursor-not-allowed border border-transparent hover:bg-zinc-900/10 group"
              title="Assigned to Corporate Governance Team"
            >
              <span className="flex items-center gap-3">
                <Landmark className="w-4 h-4 text-zinc-650 group-hover:text-zinc-500 transition-colors" />
                Governance System
              </span>
              <span className="text-[7.5px] bg-[#18181b] text-zinc-600 px-1.5 py-0.5 rounded font-mono font-bold uppercase">Locked</span>
            </div>

            <div 
              className="flex items-center justify-between px-3 py-2 text-zinc-500 rounded-lg text-xs font-medium cursor-not-allowed border border-transparent hover:bg-zinc-900/10 group"
              title="Assigned to Gamification Team"
            >
              <span className="flex items-center gap-3">
                <Gamepad2 className="w-4 h-4 text-zinc-650 group-hover:text-zinc-500 transition-colors" />
                Gamification System
              </span>
              <span className="text-[7.5px] bg-[#18181b] text-zinc-600 px-1.5 py-0.5 rounded font-mono font-bold uppercase">Locked</span>
            </div>
          </nav>
        </div>

        {/* Sidebar settings */}
        <div className="p-4 border-t border-[#1f1f23]/40 space-y-2 text-zinc-500 text-xs">
          <button 
            onClick={() => setIsFactorModalOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#18181b] hover:text-[#f4f4f5] rounded-lg transition-premium text-left font-medium"
          >
            <Settings2 className="w-4 h-4 text-zinc-400" />
            Coefficient Factors
          </button>
          <a href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-[#18181b] hover:text-[#f4f4f5] rounded-lg transition-premium font-medium">
            <HelpCircle className="w-4 h-4 text-zinc-400" />
            Help Center
          </a>
        </div>
      </aside>

      {/* Main Workspace with organic layout */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto z-10 relative">
        {/* Minimal Header */}
        <header className="h-16 border-b border-[#1f1f23]/30 px-8 flex items-center justify-between bg-[#09090b]/50 backdrop-blur-md shrink-0">
          <div className="flex flex-col">
            <span className="text-[8.5px] font-mono tracking-widest text-zinc-500 uppercase">ESG Intelligence Node</span>
            <h1 className="text-sm font-extrabold text-[#f4f4f5] tracking-tight -mt-0.5">Environmental Intelligence Console</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[9px] font-mono font-medium px-2.5 py-1 bg-[#18181b] border border-[#27272a]/30 rounded-lg text-zinc-400 uppercase tracking-wider">
              Scope: Q1-Q4
            </span>

            <button
              onClick={() => refreshData()}
              disabled={loading}
              className="p-2 rounded-lg bg-[#18181b] hover:bg-[#27272a] text-zinc-400 hover:text-[#f4f4f5] border border-[#27272a]/40 transition-premium disabled:opacity-40"
              title="Poll database metrics"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 space-y-8 flex-1">
          {/* Toast Notification */}
          {toast && (
            <div className={`fixed bottom-8 right-8 z-50 p-4 border rounded-xl shadow-2xl flex items-center gap-3 transition-premium ${
              toast.type === 'success' ? 'bg-[#09090b]/90 border-emerald-500/20 text-emerald-300' : 'bg-[#09090b]/90 border-rose-500/20 text-rose-300'
            }`}>
              {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <ShieldAlert className="w-4 h-4 shrink-0" />}
              <span className="text-xs font-semibold">{toast.message}</span>
            </div>
          )}

          {/* Premium Skeleton Loading Loader */}
          {loading ? (
            <div className="space-y-8">
              <div className="h-44 w-full rounded-2xl shimmer-loader" />
              <div className="grid grid-cols-3 gap-6">
                <div className="h-32 rounded-xl shimmer-loader" />
                <div className="h-32 rounded-xl shimmer-loader" />
                <div className="h-32 rounded-xl shimmer-loader" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="h-[350px] rounded-2xl shimmer-loader" />
                <div className="h-[350px] rounded-2xl shimmer-loader" />
              </div>
            </div>
          ) : (
            <>
              {/* SECTION 1: WHAT IS HAPPENING? */}
              <section className="space-y-6">
                {/* Widescreen Editorial Climate Briefing */}
                <div className="bg-[#141417]/50 border border-[#27272a]/30 rounded-2xl p-6.5 shadow-[0_4px_30px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                  <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6.5 items-center relative z-10">
                    <div className="lg:col-span-2 space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[8.5px] font-bold uppercase tracking-widest">
                          Executive Briefing
                        </span>
                        <span className="text-[9.5px] text-zinc-550 font-mono">Telemetry verified: carbon ledger push</span>
                      </div>

                      <h2 className="text-lg font-bold text-[#f4f4f5] tracking-tight leading-relaxed max-w-3xl">
                        Total corporate emissions registered <span className="text-emerald-400 font-extrabold">{data.kpis.avgScore}%</span> environmental score compliance, 
                        resulting in <span className="text-emerald-450 font-bold">{data.kpis.netCarbonSaved.toLocaleString()} tCO2e</span> saved.
                      </h2>

                      <div className="flex items-start gap-2.5 text-xs text-zinc-400 bg-[#09090b]/40 border border-[#27272a]/20 p-3 rounded-xl max-w-2xl">
                        <Sparkles className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
                        <p className="leading-relaxed text-[11px]">
                          <span className="text-[#f4f4f5] font-semibold">Climate Analytics Insight: </span>
                          Liquid immersion cooling deployment in the IT & Data Center network has offset seasonal natural gas heating consumption increases within Manufacturing production zones.
                        </p>
                      </div>
                    </div>

                    {/* Right side asymmetric recommendation panel */}
                    <div className="bg-[#09090b]/80 border border-[#27272a]/20 p-5 rounded-xl flex flex-col justify-between h-full hover:border-zinc-800 transition-premium">
                      <div className="space-y-1.5">
                        <span className="text-[8.5px] text-emerald-400 font-bold uppercase tracking-widest block">Mitigation Advisory</span>
                        <h4 className="text-zinc-200 text-xs font-bold leading-normal">Upgrade Assembly Line A Coil Boilers</h4>
                        <p className="text-zinc-500 text-[10px] leading-relaxed">
                          Installing electric heat loops is projected to reduce Scope 1 gas reliance and elevate overall compliance by 6.2%.
                        </p>
                      </div>

                      <button 
                        onClick={() => setIsFactorModalOpen(true)}
                        className="mt-4 flex items-center justify-center gap-1.5 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-[#09090b] text-xs font-bold rounded-lg transition-premium border border-emerald-500/20"
                      >
                        Adjust Telemetry Coefficients
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Non-Uniform Telemetry Cards */}
                <KPIOverview kpis={data.kpis} />
              </section>

              {/* SECTION 2: WHY IS IT HAPPENING? */}
              <section className="space-y-3">
                <span className="text-[8.5px] font-mono font-bold tracking-widest text-zinc-550 uppercase block">Attribution Diagnostics</span>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <TrendAnalytics data={data.monthlyTrends} />
                  </div>
                  <div>
                    <SourceBreakdown data={data.sourceBreakdown} />
                  </div>
                </div>
              </section>

              {/* SECTION 3: WHERE IS IT HAPPENING? */}
              <section className="space-y-3">
                <span className="text-[8.5px] font-mono font-bold tracking-widest text-zinc-550 uppercase block">Spatial Operations Diagnostics</span>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <DepartmentPerformance departments={data.departments} />
                  </div>
                  <div>
                    <CarbonHotspots hotspots={data.hotspots} />
                  </div>
                </div>
              </section>

              {/* SECTION 4: WHAT SHOULD WE DO? */}
              <section className="space-y-3">
                <span className="text-[8.5px] font-mono font-bold tracking-widest text-zinc-550 uppercase block">Mitigation Strategy</span>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <AlertsInsights alerts={data.alerts} />
                  </div>
                  <div>
                    <GoalsTracker 
                      goals={data.goals} 
                      departments={departmentsList} 
                      onGoalCreated={() => {
                        refreshData(true);
                        triggerToast('Sustainability target logged successfully!');
                      }}
                    />
                  </div>
                </div>
              </section>

              {/* SECTION 5: OPERATIONS LEDGER */}
              <section className="space-y-3">
                <span className="text-[8.5px] font-mono font-bold tracking-widest text-zinc-550 uppercase block">Carbon Ledger Logs</span>
                <RecentActivity 
                  initialTransactions={data.recentActivity} 
                  departments={departmentsList}
                  onTransactionAdded={() => {
                    refreshData(true);
                    triggerToast('Emissions record entered into ledger!');
                  }}
                />
              </section>
            </>
          )}
        </div>
      </main>

      {/* Telemetry Coefficients Configuration Modal */}
      <FactorConfigModal 
        isOpen={isFactorModalOpen} 
        onClose={() => setIsFactorModalOpen(false)} 
        onFactorUpdated={() => {
          refreshData(true);
          triggerToast('Telemetry coefficients updated!');
        }}
      />
    </div>
  );
}
