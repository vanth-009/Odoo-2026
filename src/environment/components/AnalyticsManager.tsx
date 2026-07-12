'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, RefreshCw, CheckCircle2, ShieldAlert, Sparkles,
  Users2, Landmark, Gamepad2, Settings2, HelpCircle, ArrowRight,
  Plus, Search, Download, Edit2, Archive, Eye, RotateCcw, AlertCircle, FileText, Package, Target, BarChart2,
  TrendingUp, TrendingDown, Info, LayoutGrid, CheckSquare, Layers, Award, ShieldQuestion, Globe
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, 
  ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

interface DepartmentOverview {
  id: string;
  name: string;
  manager: string;
  employeeCount: number;
  targetEmissions: number;
  totalEmissions: number;
  currentMonthEmissions: number;
  prevMonthEmissions: number;
  trendPercent: number;
  score: number;
  status: 'Green' | 'Yellow' | 'Red';
  carbonSaved: number;
  goalsCount: number;
  goalsCompleted: number;
  activeGoals: number;
  scoringBreakdown: {
    progress: number;
    goalAchievement: number;
    trend: number;
    efficiency: number;
  };
}

interface OrgKPIs {
  totalDepartments: number;
  averageScore: number;
  highestPerformingDepartment: string;
  highestPerformingScore: number;
  lowestPerformingDepartment: string;
  lowestPerformingScore: number;
  totalEmissions: number;
  carbonSaved: number;
  goalsCompleted: number;
}

interface AnalyticsManagerProps {
  initialDepartments: { id: string; name: string }[];
}

export default function AnalyticsManager({ initialDepartments }: AnalyticsManagerProps) {
  const [departments, setDepartments] = useState<DepartmentOverview[]>([]);
  const [kpis, setKpis] = useState<OrgKPIs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('SCORE_DESC');

  // Selection & Mode States
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [compareMode, setCompareMode] = useState(false);
  const [compareDeptId, setCompareDeptId] = useState<string>('');

  // Workspace Detail Telemetry
  const [detailData, setDetailData] = useState<any>(null);
  const [compareDetailData, setCompareDetailData] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [trendViewMode, setTrendViewMode] = useState<'MONTHLY' | 'QUARTERLY' | 'YEARLY'>('MONTHLY');

  // Tooltip UI
  const [showFormulaTooltip, setShowFormulaTooltip] = useState(false);

  // Fetch initial analytical matrix
  const fetchAnalyticsSummary = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/environment/analytics');
      if (!res.ok) throw new Error('Failed to retrieve environmental scorecard');
      const data = await res.json();
      setDepartments(data.departments);
      setKpis(data.kpis);
      
      // Auto-select first department if none selected
      if (data.departments.length > 0 && !selectedDeptId) {
        setSelectedDeptId(data.departments[0].id);
      }
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsSummary();
  }, []);

  // Fetch detailed workspaces on selection
  useEffect(() => {
    if (!selectedDeptId) return;

    const fetchDetail = async () => {
      try {
        setDetailLoading(true);
        const res = await fetch(`/api/environment/analytics/${selectedDeptId}`);
        if (!res.ok) throw new Error('Failed to fetch department workspace telemetry');
        const data = await res.json();
        setDetailData(data);
      } catch (err: any) {
        console.error(err);
      } finally {
        setDetailLoading(false);
      }
    };

    fetchDetail();
  }, [selectedDeptId]);

  // Fetch comparison details
  useEffect(() => {
    if (!compareDeptId || !compareMode) {
      setCompareDetailData(null);
      return;
    }

    const fetchCompareDetail = async () => {
      try {
        const res = await fetch(`/api/environment/analytics/${compareDeptId}`);
        if (!res.ok) throw new Error('Failed to fetch comparison details');
        const data = await res.json();
        setCompareDetailData(data);
      } catch (err: any) {
        console.error(err);
      }
    };

    fetchCompareDetail();
  }, [compareDeptId, compareMode]);

  // Handle Export API values
  const exportData = (type: 'csv' | 'json') => {
    if (departments.length === 0) return;

    if (type === 'json') {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ departments, kpis }, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "EcoSphere_Environmental_Analytics.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      // Build CSV
      const headers = ['Department', 'Manager', 'Employees', 'Target Emissions', 'Total Emissions', 'Score', 'Status', 'Goals Count', 'Goals Completed'];
      const rows = departments.map(d => [
        d.name, d.manager, d.employeeCount, d.targetEmissions, d.totalEmissions, d.score, d.status, d.goalsCount, d.goalsCompleted
      ]);
      
      const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'EcoSphere_Environmental_Analytics.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  // Filter and Sort Departments list
  const filteredDepartments = useMemo(() => {
    return departments
      .filter((d) => {
        const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              d.manager.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'SCORE_DESC': return b.score - a.score;
          case 'SCORE_ASC': return a.score - b.score;
          case 'EMISSIONS_DESC': return b.totalEmissions - a.totalEmissions;
          case 'EMISSIONS_ASC': return a.totalEmissions - b.totalEmissions;
          case 'GOALS_DESC': return (b.goalsCompleted / (b.goalsCount || 1)) - (a.goalsCompleted / (a.goalsCount || 1));
          default: return 0;
        }
      });
  }, [departments, searchTerm, statusFilter, sortBy]);

  // Aggregate Trend Modes (Quarterly / Yearly)
  const chartTrendData = useMemo(() => {
    if (!detailData?.monthlyTrends) return [];
    const monthly = detailData.monthlyTrends;

    if (trendViewMode === 'MONTHLY') {
      return monthly;
    } else if (trendViewMode === 'QUARTERLY') {
      // Map to quarters: Q1 (Jan-Mar), Q2 (Apr-Jun), Q3 (Jul-Sep), Q4 (Oct-Dec)
      const quarters: Record<string, { name: string; carbon: number; target: number; count: number }> = {};
      monthly.forEach((m: any) => {
        const parts = m.month.split(' ');
        const monthName = parts[0];
        const year = parts[1];
        
        let quarter = 'Q1';
        if (['Apr', 'May', 'Jun'].includes(monthName)) quarter = 'Q2';
        if (['Jul', 'Aug', 'Sep'].includes(monthName)) quarter = 'Q3';
        if (['Oct', 'Nov', 'Dec'].includes(monthName)) quarter = 'Q4';
        
        const key = `${quarter} ${year}`;
        if (!quarters[key]) {
          quarters[key] = { name: key, carbon: 0, target: 0, count: 0 };
        }
        quarters[key].carbon += m.carbon;
        quarters[key].target += m.target;
        quarters[key].count += 1;
      });

      return Object.values(quarters).map(q => ({
        month: q.name,
        carbon: parseFloat(q.carbon.toFixed(1)),
        target: parseFloat(q.target.toFixed(1))
      }));
    } else {
      // Yearly
      const years: Record<string, { name: string; carbon: number; target: number; count: number }> = {};
      monthly.forEach((m: any) => {
        const parts = m.month.split(' ');
        const year = `20${parts[1]}`;
        
        if (!years[year]) {
          years[year] = { name: year, carbon: 0, target: 0, count: 0 };
        }
        years[year].carbon += m.carbon;
        years[year].target += m.target;
        years[year].count += 1;
      });

      return Object.values(years).map(y => ({
        month: y.name,
        carbon: parseFloat(y.carbon.toFixed(1)),
        target: parseFloat(y.target.toFixed(1))
      }));
    }
  }, [detailData, trendViewMode]);

  // Color constants for source breakdown pie chart
  const PIE_COLORS = ['#34d399', '#60a5fa', '#a78bfa', '#f59e0b', '#ec4899', '#f43f5e'];

  // Comparative sources grouped data
  const comparisonSourcesData = useMemo(() => {
    if (!detailData || !compareDetailData) return [];
    
    const d1 = detailData.operationalSources || [];
    const d2 = compareDetailData.operationalSources || [];

    const allKeys = Array.from(new Set([...d1.map((s: any) => s.name), ...d2.map((s: any) => s.name)]));

    return allKeys.map(key => {
      const v1 = d1.find((s: any) => s.name === key)?.carbon || 0;
      const v2 = d2.find((s: any) => s.name === key)?.carbon || 0;

      return {
        source: key,
        [detailData.department.name]: v1,
        [compareDetailData.department.name]: v2
      };
    });
  }, [detailData, compareDetailData]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex relative overflow-hidden font-sans">
      {/* Background Decorative Mesh Gradients */}
      <div className="absolute top-0 left-1/4 w-[45rem] h-[35rem] bg-emerald-500/5 rounded-full blur-[130px] -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[35rem] h-[30rem] bg-purple-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Global Sidebar Navigation */}
      <aside className="w-64 border-r border-zinc-900 bg-zinc-950/80 backdrop-blur-md p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-7">
          {/* Platform Branding */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center">
              <Globe className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-sm font-bold text-zinc-200 tracking-wide block leading-none">EcoSphere</span>
              <span className="text-[9px] uppercase tracking-wider text-emerald-500 font-semibold mt-0.5 block">ESG Intelligence</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="px-3 pb-2 text-[9px] uppercase font-bold tracking-widest text-zinc-500">
              Environmental Node
            </div>
            
            <a 
              href="/environment" 
              className="flex items-center gap-3 px-3 py-2 text-zinc-400 border border-transparent rounded-lg text-xs font-semibold relative transition-premium group hover:bg-zinc-900/10 hover:text-[#f4f4f5]"
            >
              <BarChart3 className="w-4 h-4 text-zinc-400 group-hover:text-[#f4f4f5] transition-colors" />
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
              className="flex items-center gap-3 px-3 py-2 text-emerald-450 border border-transparent rounded-lg text-xs font-semibold relative transition-premium group animate-fade-in"
            >
              <span className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-emerald-500 rounded-full" />
              <BarChart2 className="w-4 h-4 text-emerald-450" />
              Department Analytics
            </a>
          </nav>
        </div>

        <div className="pt-4 border-t border-zinc-900 text-[10px] text-zinc-500 flex items-center justify-between">
          <span>Ver. 2.6.4</span>
          <span className="font-semibold text-zinc-450">Active DB Connected</span>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 p-8 overflow-y-auto space-y-6">
        {/* Header Block */}
        <header className="flex justify-between items-center pb-4 border-b border-zinc-900">
          <div>
            <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-semibold mb-1">
              <span>EcoSphere Console</span>
              <span className="text-zinc-650">/</span>
              <span className="text-emerald-400">Department Analytics</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
              Carbon Tracking & Environmental Analytics
              <Sparkles className="w-4.5 h-4.5 text-emerald-400 animate-pulse" />
            </h1>
          </div>

          {/* Top Actions: Export options and Compare modes */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                compareMode 
                  ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              {compareMode ? 'Disable Comparison' : 'Compare Departments'}
            </button>

            <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-850 rounded-lg p-0.5">
              <button 
                onClick={() => exportData('csv')}
                className="px-2.5 py-1 text-[11px] font-semibold text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1"
                title="Export scorecard to Excel/CSV format"
              >
                <Download className="w-3 h-3" />
                CSV
              </button>
              <span className="w-px h-3 bg-zinc-850" />
              <button 
                onClick={() => exportData('json')}
                className="px-2.5 py-1 text-[11px] font-semibold text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1"
                title="Export values to JSON format"
              >
                <Download className="w-3 h-3" />
                JSON
              </button>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
            <p className="text-zinc-400 text-xs font-medium">Aggregating department analytics from ESG data pipelines...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex gap-2 items-center">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Error aggregation: {error}</span>
          </div>
        ) : (
          <>
            {/* KPI Cards Overview */}
            {kpis && (
              <section className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {/* Total Departments */}
                <div className="bg-zinc-900/60 border border-zinc-850/65 rounded-xl p-4 space-y-1.5 relative overflow-hidden group hover:border-zinc-800 transition-all">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Departments</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold font-mono tracking-tight">{kpis.totalDepartments}</span>
                    <span className="text-[9px] text-zinc-500 font-medium">Active</span>
                  </div>
                  <Users2 className="absolute right-3 bottom-3 w-7 h-7 text-zinc-800 group-hover:text-zinc-750 transition-colors" />
                </div>

                {/* Average Score */}
                <div className="bg-zinc-900/60 border border-zinc-850/65 rounded-xl p-4 space-y-1.5 relative overflow-hidden group hover:border-zinc-800 transition-all col-span-1 md:col-span-2 lg:col-span-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1">
                      Avg Score
                      <button 
                        onMouseEnter={() => setShowFormulaTooltip(true)}
                        onMouseLeave={() => setShowFormulaTooltip(false)}
                        className="text-zinc-500 hover:text-zinc-300"
                      >
                        <Info className="w-3.5 h-3.5 cursor-help" />
                      </button>
                    </span>

                    {/* Formula Popover */}
                    {showFormulaTooltip && (
                      <div className="absolute top-10 left-4 right-4 bg-zinc-950 border border-zinc-800 p-3 rounded-lg z-50 text-[10px] text-zinc-400 space-y-2 shadow-2xl leading-normal font-sans">
                        <span className="font-bold text-zinc-200 block border-b border-zinc-850 pb-1">Score Formula weights:</span>
                        <p>🎯 <strong className="text-zinc-300">40% Carbon Reduction:</strong> Average progress of goals vs baseline.</p>
                        <p>🏆 <strong className="text-zinc-300">25% Goal Achievement:</strong> Completed goals / Total goals.</p>
                        <p>📈 <strong className="text-zinc-300">20% MoM Trend:</strong> Drop in current month emissions vs previous.</p>
                        <p>⚡ <strong className="text-zinc-300">15% Efficiency:</strong> Total emissions compared to targets.</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-xl font-bold font-mono tracking-tight ${
                      kpis.averageScore >= 85 ? 'text-emerald-400' : kpis.averageScore >= 70 ? 'text-amber-400' : 'text-rose-450'
                    }`}>{kpis.averageScore}</span>
                    <span className="text-[9px] text-zinc-500 font-medium">/ 100 max</span>
                  </div>
                  <Award className="absolute right-3 bottom-3 w-7 h-7 text-zinc-800 group-hover:text-zinc-750 transition-colors" />
                </div>

                {/* Highest Performing */}
                <div className="bg-zinc-900/60 border border-zinc-850/65 rounded-xl p-4 space-y-1.5 relative overflow-hidden group hover:border-zinc-800 transition-all col-span-1 md:col-span-2">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Top Performer</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-bold text-emerald-400 truncate max-w-[130px] block">{kpis.highestPerformingDepartment}</span>
                    <span className="text-xs font-mono font-bold text-zinc-200">({kpis.highestPerformingScore} pts)</span>
                  </div>
                  <span className="text-[9px] text-emerald-500 font-semibold block">Excellent Status</span>
                  <TrendingUp className="absolute right-3 bottom-3 w-7 h-7 text-zinc-800 group-hover:text-zinc-750 transition-colors" />
                </div>

                {/* Lowest Performing */}
                <div className="bg-zinc-900/60 border border-zinc-850/65 rounded-xl p-4 space-y-1.5 relative overflow-hidden group hover:border-zinc-800 transition-all col-span-1 md:col-span-2">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Requires Attention</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-bold text-rose-450 truncate max-w-[130px] block">{kpis.lowestPerformingDepartment}</span>
                    <span className="text-xs font-mono font-bold text-zinc-200">({kpis.lowestPerformingScore} pts)</span>
                  </div>
                  <span className="text-[9px] text-rose-500 font-semibold block">Remedial Focus</span>
                  <TrendingDown className="absolute right-3 bottom-3 w-7 h-7 text-zinc-800 group-hover:text-zinc-750 transition-colors" />
                </div>

                {/* Total Emissions & Saved */}
                <div className="bg-zinc-900/60 border border-zinc-850/65 rounded-xl p-4 space-y-1.5 relative overflow-hidden group hover:border-zinc-800 transition-all col-span-1 md:col-span-2 lg:col-span-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Total Footprint</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold font-mono tracking-tight">{kpis.totalEmissions}</span>
                    <span className="text-[9px] text-zinc-500 font-semibold">tCO2e</span>
                  </div>
                  <span className="text-[9px] text-zinc-450 block">Year-to-date</span>
                  <BarChart3 className="absolute right-3 bottom-3 w-7 h-7 text-zinc-800 group-hover:text-zinc-750 transition-colors" />
                </div>
              </section>
            )}

            {/* Visual Environmental Heatmap */}
            <section className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-5 space-y-3 relative">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Environmental Score Heatmap</h3>
                  <p className="text-[10px] text-zinc-450 mt-0.5">Instant operational risk identification across active departments.</p>
                </div>
                <div className="flex items-center gap-4 text-[9px] font-bold">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500/25 border border-emerald-500/40" /> Excellent (≥85)</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500/25 border border-amber-500/40" /> Moderate (70-84)</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-500/25 border border-rose-500/40" /> Requires Attention (&lt;70)</span>
                </div>
              </div>

              {/* Grid Layout Heatmap */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                {departments.map((dept) => {
                  const isSelected = dept.id === selectedDeptId;
                  const isCompareTarget = compareMode && dept.id === compareDeptId;
                  
                  let bgColor = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
                  let hoverColor = 'hover:bg-emerald-500/15 hover:border-emerald-500/40';
                  if (dept.status === 'Yellow') {
                    bgColor = 'bg-amber-500/10 border-amber-500/30 text-amber-400';
                    hoverColor = 'hover:bg-amber-500/15 hover:border-amber-500/40';
                  } else if (dept.status === 'Red') {
                    bgColor = 'bg-rose-500/10 border-rose-500/30 text-rose-450';
                    hoverColor = 'hover:bg-rose-500/15 hover:border-rose-500/40';
                  }

                  return (
                    <button
                      key={dept.id}
                      onClick={() => {
                        if (compareMode) {
                          if (selectedDeptId !== dept.id) {
                            setCompareDeptId(dept.id);
                          }
                        } else {
                          setSelectedDeptId(dept.id);
                        }
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${bgColor} ${hoverColor} ${
                        isSelected 
                          ? 'ring-2 ring-emerald-500 border-transparent shadow-emerald-500/10 shadow-lg scale-[1.02]' 
                          : isCompareTarget
                          ? 'ring-2 ring-purple-500 border-transparent shadow-purple-500/10 shadow-lg scale-[1.02]'
                          : 'opacity-75 hover:opacity-100'
                      }`}
                    >
                      <span className="text-[10px] font-bold truncate block">{dept.name}</span>
                      <div className="flex items-baseline justify-between mt-2">
                        <span className="text-[9px] text-zinc-400 font-medium">Score</span>
                        <span className="text-sm font-bold font-mono">{dept.score}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Split Screen Layout: Rankings (Left) & Workspace/Compare (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Rankings List */}
              <section className="lg:col-span-5 bg-zinc-900/30 border border-zinc-900 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Department Performance Rankings</h3>
                  <span className="text-[9px] font-mono bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded text-zinc-500">
                    {filteredDepartments.length} rows
                  </span>
                </div>

                {/* Filter and Sort Registry */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="relative col-span-1 md:col-span-2">
                    <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Search departments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded-lg py-1.5 pl-8 pr-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
                    />
                  </div>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-zinc-950 border border-zinc-850 rounded-lg py-1.5 px-2 text-[11px] font-semibold text-zinc-400 focus:outline-none focus:border-zinc-700"
                  >
                    <option value="SCORE_DESC">Highest Score</option>
                    <option value="SCORE_ASC">Lowest Score</option>
                    <option value="EMISSIONS_DESC">Highest Emissions</option>
                    <option value="EMISSIONS_ASC">Lowest Emissions</option>
                    <option value="GOALS_DESC">Goal Completion</option>
                  </select>
                </div>

                {/* Table Ranking */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-900 text-zinc-500 font-bold text-[9px] uppercase tracking-wider">
                        <th className="py-2.5">Dept / Score</th>
                        <th className="py-2.5">Emissions</th>
                        <th className="py-2.5">Goals</th>
                        <th className="py-2.5 text-right">Saved</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {filteredDepartments.map((dept) => {
                        const isSelected = dept.id === selectedDeptId;
                        const isCompare = compareMode && dept.id === compareDeptId;
                        
                        let badgeColor = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
                        if (dept.status === 'Yellow') badgeColor = 'bg-amber-500/10 border-amber-500/20 text-amber-400';
                        if (dept.status === 'Red') badgeColor = 'bg-rose-500/10 border-rose-500/20 text-rose-450';

                        return (
                          <tr
                            key={dept.id}
                            onClick={() => {
                              if (compareMode) {
                                if (selectedDeptId !== dept.id) {
                                  setCompareDeptId(dept.id);
                                }
                              } else {
                                setSelectedDeptId(dept.id);
                              }
                            }}
                            className={`hover:bg-zinc-900/30 cursor-pointer transition-colors ${
                              isSelected 
                                ? 'bg-emerald-500/5' 
                                : isCompare 
                                ? 'bg-purple-500/5'
                                : ''
                            }`}
                          >
                            <td className="py-3 flex items-center gap-2.5">
                              {/* Custom Score visual Progress Ring */}
                              <div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-95" viewBox="0 0 36 36">
                                  <path
                                    className="text-zinc-800"
                                    strokeWidth="2.5"
                                    stroke="currentColor"
                                    fill="none"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  />
                                  <path
                                    className={
                                      dept.status === 'Green' ? 'text-emerald-400' : dept.status === 'Yellow' ? 'text-amber-450' : 'text-rose-450'
                                    }
                                    strokeWidth="2.5"
                                    strokeDasharray={`${dept.score}, 100`}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="none"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  />
                                </svg>
                                <span className="absolute text-[9px] font-bold font-mono">{dept.score}</span>
                              </div>

                              <div className="truncate">
                                <span className="font-semibold text-zinc-200 block truncate">{dept.name}</span>
                                <span className="text-[10px] text-zinc-500 block truncate">{dept.manager}</span>
                              </div>
                            </td>

                            <td className="py-3">
                              <span className="font-semibold text-zinc-200 font-mono block">{dept.totalEmissions}</span>
                              {dept.trendPercent !== 0 && (
                                <span className={`text-[9px] font-bold flex items-center gap-0.5 ${
                                  dept.trendPercent < 0 ? 'text-emerald-500' : 'text-rose-500'
                                }`}>
                                  {dept.trendPercent < 0 ? <TrendingDown className="w-2.5 h-2.5" /> : <TrendingUp className="w-2.5 h-2.5" />}
                                  {Math.abs(dept.trendPercent)}%
                                </span>
                              )}
                            </td>

                            <td className="py-3">
                              <span className="font-semibold text-zinc-200 font-mono block">{dept.goalsCompleted}/{dept.goalsCount}</span>
                              <span className="text-[9px] text-zinc-500 block">Completed</span>
                            </td>

                            <td className="py-3 text-right">
                              <span className="font-semibold text-emerald-400 font-mono block">-{dept.carbonSaved}</span>
                              <span className="text-[9px] text-zinc-500 block">Saved tCO2e</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Right Column: Comparative workspace or Single Details */}
              <section className="lg:col-span-7 space-y-6">
                {compareMode ? (
                  /* COMPARATIVE ANALYTICS PANEL */
                  <div className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-5 space-y-5">
                    <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">Comparative Analytics Workspace</h3>
                        <p className="text-[10px] text-zinc-400">Comparing selected entities side-by-side.</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-500 font-semibold">Compare with:</span>
                        <select
                          value={compareDeptId}
                          onChange={(e) => setCompareDeptId(e.target.value)}
                          className="bg-zinc-950 border border-zinc-800 rounded py-1 px-2 text-[10px] text-zinc-300 font-semibold focus:outline-none"
                        >
                          <option value="">Select Department...</option>
                          {departments
                            .filter(d => d.id !== selectedDeptId)
                            .map(d => (
                              <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                      </div>
                    </div>

                    {!compareDeptId || !detailData || !compareDetailData ? (
                      <div className="flex flex-col items-center justify-center py-20 text-zinc-500 space-y-2">
                        <Layers className="w-8 h-8 stroke-1 text-zinc-650" />
                        <span className="text-xs font-medium">Select a department from the drop-down to compare side-by-side.</span>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Comparison Matrix Table */}
                        <div className="grid grid-cols-3 gap-4 border-b border-zinc-900 pb-4 text-center">
                          <div />
                          <div className="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl">
                            <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold block truncate">{detailData.department.name}</span>
                            <span className="text-sm font-semibold text-zinc-400 block mt-1">Manager: {detailData.department.manager}</span>
                          </div>
                          <div className="bg-purple-500/5 border border-purple-500/10 p-3 rounded-xl">
                            <span className="text-[9px] uppercase tracking-wider text-purple-400 font-bold block truncate">{compareDetailData.department.name}</span>
                            <span className="text-sm font-semibold text-zinc-400 block mt-1">Manager: {compareDetailData.department.manager}</span>
                          </div>
                        </div>

                        {/* Metric Rows */}
                        <div className="space-y-4">
                          {/* Row: Score */}
                          <div className="grid grid-cols-3 items-center gap-4 text-center border-b border-zinc-900/50 pb-3">
                            <span className="text-left text-xs font-bold text-zinc-400 uppercase">Environmental Score</span>
                            <span className="text-xl font-bold font-mono text-emerald-400">{departments.find(d => d.id === selectedDeptId)?.score} / 100</span>
                            <span className="text-xl font-bold font-mono text-purple-400">{departments.find(d => d.id === compareDeptId)?.score} / 100</span>
                          </div>

                          {/* Row: Annual Emissions */}
                          <div className="grid grid-cols-3 items-center gap-4 text-center border-b border-zinc-900/50 pb-3">
                            <span className="text-left text-xs font-bold text-zinc-400 uppercase">Total YTD Emissions</span>
                            <span className="text-base font-semibold font-mono text-zinc-200">{detailData.department.ytdEmissions} tCO2e</span>
                            <span className="text-base font-semibold font-mono text-zinc-200">{compareDetailData.department.ytdEmissions} tCO2e</span>
                          </div>

                          {/* Row: Target emissions limit */}
                          <div className="grid grid-cols-3 items-center gap-4 text-center border-b border-zinc-900/50 pb-3">
                            <span className="text-left text-xs font-bold text-zinc-400 uppercase">Annual Target Limit</span>
                            <span className="text-base font-semibold font-mono text-zinc-450">{detailData.department.targetEmissions} tCO2e</span>
                            <span className="text-base font-semibold font-mono text-zinc-455">{compareDetailData.department.targetEmissions} tCO2e</span>
                          </div>

                          {/* Row: Goal Achievement Rate */}
                          <div className="grid grid-cols-3 items-center gap-4 text-center border-b border-zinc-900/50 pb-3">
                            <span className="text-left text-xs font-bold text-zinc-400 uppercase">Goal Completion Rate</span>
                            <span className="text-base font-semibold font-mono text-zinc-200">
                              {Math.round((detailData.goals.filter((g: any) => g.status === 'Completed').length / (detailData.goals.length || 1)) * 100)}%
                            </span>
                            <span className="text-base font-semibold font-mono text-zinc-200">
                              {Math.round((compareDetailData.goals.filter((g: any) => g.status === 'Completed').length / (compareDetailData.goals.length || 1)) * 100)}%
                            </span>
                          </div>
                        </div>

                        {/* Visual Grouped Bar Chart of Sources */}
                        <div className="space-y-2 pt-4">
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Carbon Output By Operational Source</h4>
                          <div className="h-64 w-full bg-zinc-950/40 border border-zinc-900 rounded-xl p-3">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={comparisonSourcesData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" />
                                <XAxis dataKey="source" stroke="#52525b" fontSize={9} tickLine={false} />
                                <YAxis stroke="#52525b" fontSize={9} tickLine={false} />
                                <ChartTooltip 
                                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#18181b', borderRadius: '8px' }} 
                                  labelStyle={{ color: '#a1a1aa', fontWeight: 'bold', fontSize: 10 }}
                                />
                                <Legend wrapperStyle={{ fontSize: 9, paddingTop: 10 }} />
                                <Bar dataKey={detailData.department.name} fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey={compareDetailData.department.name} fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* SINGLE DEPARTMENT WORKSPACE DETAIL */
                  detailLoading || !detailData ? (
                    <div className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-5 flex flex-col items-center justify-center py-24 space-y-3">
                      <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
                      <span className="text-zinc-500 text-xs">Assembling selected department workspace...</span>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Department Summary Workspace Header */}
                      <div className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-5 space-y-4">
                        <div className="flex justify-between items-start border-b border-zinc-900 pb-3">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">Department Workspace</span>
                            <h2 className="text-base font-bold text-zinc-100">{detailData.department.name}</h2>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Current Score</span>
                            <div className="flex items-center gap-1.5 mt-0.5 justify-end">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-xl font-bold font-mono tracking-tight">{departments.find(d => d.id === selectedDeptId)?.score}</span>
                            </div>
                          </div>
                        </div>

                        {/* General Metadata cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-zinc-950/40 p-3 rounded-lg border border-zinc-900 space-y-0.5">
                            <span className="text-[9px] text-zinc-500 font-semibold block">Manager</span>
                            <span className="text-xs font-bold text-zinc-300 truncate block">{detailData.department.manager}</span>
                          </div>
                          <div className="bg-zinc-950/40 p-3 rounded-lg border border-zinc-900 space-y-0.5">
                            <span className="text-[9px] text-zinc-500 font-semibold block">Employee Count</span>
                            <span className="text-xs font-bold text-zinc-300 font-mono block">{detailData.department.employeeCount}</span>
                          </div>
                          <div className="bg-zinc-950/40 p-3 rounded-lg border border-zinc-900 space-y-0.5">
                            <span className="text-[9px] text-zinc-500 font-semibold block">Current Month Emissions</span>
                            <span className="text-xs font-bold text-zinc-300 font-mono block">{detailData.department.currentMonthEmissions} t</span>
                          </div>
                          <div className="bg-zinc-950/40 p-3 rounded-lg border border-zinc-900 space-y-0.5">
                            <span className="text-[9px] text-zinc-500 font-semibold block">Year-to-Date (YTD)</span>
                            <span className="text-xs font-bold text-zinc-300 font-mono block">{detailData.department.ytdEmissions} t</span>
                          </div>
                        </div>

                        {/* Scoring breakdown progress tracks */}
                        <div className="space-y-2 pt-2 border-t border-zinc-900">
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Scoring Methodology Contribution</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Reduction Progress */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] font-medium text-zinc-450">
                                <span>Reduction Progress (40%)</span>
                                <span className="font-semibold font-mono text-zinc-300">{detailData.department.ytdEmissions > detailData.department.targetEmissions ? '0' : '100'}%</span>
                              </div>
                              <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
                                  style={{ width: `${detailData.department.ytdEmissions > detailData.department.targetEmissions ? 0 : 100}%` }}
                                />
                              </div>
                            </div>

                            {/* Goal Achievement */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] font-medium text-zinc-450">
                                <span>Goal Achievement (25%)</span>
                                <span className="font-semibold font-mono text-zinc-300">
                                  {Math.round((detailData.goals.filter((g: any) => g.status === 'Completed').length / (detailData.goals.length || 1)) * 100)}%
                                </span>
                              </div>
                              <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" 
                                  style={{ 
                                    width: `${(detailData.goals.filter((g: any) => g.status === 'Completed').length / (detailData.goals.length || 1)) * 100}%` 
                                  }}
                                />
                              </div>
                            </div>

                            {/* MoM Trend */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] font-medium text-zinc-455">
                                <span>Emission Trend (20%)</span>
                                <span className="font-semibold font-mono text-zinc-300">
                                  {detailData.department.currentMonthEmissions <= detailData.department.prevMonthEmissions ? '100' : '60'}%
                                </span>
                              </div>
                              <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className="bg-emerald-400 h-1.5 rounded-full transition-all duration-500" 
                                  style={{ width: `${detailData.department.currentMonthEmissions <= detailData.department.prevMonthEmissions ? 100 : 60}%` }}
                                />
                              </div>
                            </div>

                            {/* Target limits */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] font-medium text-zinc-455">
                                <span>Operational Efficiency (15%)</span>
                                <span className="font-semibold font-mono text-zinc-300">
                                  {detailData.department.ytdEmissions <= detailData.department.targetEmissions ? '100' : '40'}%
                                </span>
                              </div>
                              <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className="bg-amber-400 h-1.5 rounded-full transition-all duration-500" 
                                  style={{ width: `${detailData.department.ytdEmissions <= detailData.department.targetEmissions ? 100 : 40}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Carbon Trends & Sources */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* 12 Months chart (7 cols) */}
                        <div className="md:col-span-7 bg-zinc-900/30 border border-zinc-900 rounded-xl p-5 space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-450">Historical Carbon Footprint</h4>
                            <div className="flex bg-zinc-950 rounded-lg p-0.5 border border-zinc-850">
                              {(['MONTHLY', 'QUARTERLY', 'YEARLY'] as const).map((mode) => (
                                <button
                                  key={mode}
                                  onClick={() => setTrendViewMode(mode)}
                                  className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all ${
                                    trendViewMode === mode ? 'bg-zinc-850 text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
                                  }`}
                                >
                                  {mode.charAt(0) + mode.slice(1).toLowerCase()}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={chartTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                <defs>
                                  <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" />
                                <XAxis dataKey="month" stroke="#52525b" fontSize={9} tickLine={false} />
                                <YAxis stroke="#52525b" fontSize={9} tickLine={false} />
                                <ChartTooltip 
                                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#18181b', borderRadius: '8px' }} 
                                  labelStyle={{ color: '#a1a1aa', fontWeight: 'bold', fontSize: 10 }}
                                />
                                <Area type="monotone" dataKey="carbon" stroke="#10b981" fillOpacity={1} fill="url(#colorCarbon)" strokeWidth={2} name="Actual Emissions" />
                                <Line type="monotone" dataKey="target" stroke="#ef4444" strokeWidth={1} strokeDasharray="4 4" dot={false} name="Baseline Target" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Sources Pie (5 cols) */}
                        <div className="md:col-span-5 bg-zinc-900/30 border border-zinc-900 rounded-xl p-5 space-y-4">
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-450">Operational Sources</h4>
                          <div className="h-52 w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={detailData.operationalSources.filter((s: any) => s.carbon > 0)}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={45}
                                  outerRadius={70}
                                  paddingAngle={3}
                                  dataKey="carbon"
                                >
                                  {detailData.operationalSources.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                  ))}
                                </Pie>
                                <ChartTooltip 
                                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#18181b', borderRadius: '8px' }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-[9px]">
                            {detailData.operationalSources.filter((s: any) => s.carbon > 0).map((entry: any, index: number) => (
                              <div key={entry.name} className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                                <span className="text-zinc-400 font-medium truncate">{entry.name}:</span>
                                <span className="font-semibold text-zinc-200 font-mono">{entry.carbon} t</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Product Impact, Goals, and Insights */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Product Impact List */}
                        <div className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-5 space-y-4">
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-450">Product ESG Footprint Impact</h4>
                          {detailData.productImpacts.length === 0 ? (
                            <p className="text-zinc-650 text-xs text-center py-6">No product carbon profiles associated with this department.</p>
                          ) : (
                            <div className="space-y-3">
                              {detailData.productImpacts.map((prod: any) => (
                                <div key={prod.id} className="flex items-center justify-between p-2.5 bg-zinc-950/40 rounded-lg border border-zinc-900 text-xs">
                                  <div>
                                    <span className="font-semibold text-zinc-200 block truncate max-w-[170px]">{prod.name}</span>
                                    <span className="text-[9px] font-mono text-zinc-500">{prod.code} • {prod.transactions} txs</span>
                                  </div>

                                  <div className="text-right">
                                    <span className="font-bold text-zinc-200 font-mono block">{prod.carbon} tCO2e</span>
                                    <span className="text-[9px] text-zinc-500 font-bold block">{prod.contribution}% contribution</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Active goals list */}
                        <div className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-5 space-y-4">
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-450">Active Sustainability Objectives</h4>
                          {detailData.goals.length === 0 ? (
                            <p className="text-zinc-650 text-xs text-center py-6">No sustainability targets established for this department.</p>
                          ) : (
                            <div className="space-y-3">
                              {detailData.goals.map((goal: any) => (
                                <div key={goal.id} className="space-y-1.5 p-2.5 bg-zinc-950/40 rounded-lg border border-zinc-900 text-xs">
                                  <div className="flex justify-between items-start">
                                    <span className="font-semibold text-zinc-200 block truncate max-w-[170px]">{goal.name}</span>
                                    <span className={`px-2 py-0.5 rounded text-[8.5px] font-bold ${
                                      goal.status === 'Completed'
                                        ? 'bg-emerald-500/10 text-emerald-400'
                                        : goal.status === 'On Track'
                                        ? 'bg-emerald-400/5 text-emerald-450'
                                        : 'bg-rose-500/10 text-rose-400'
                                    }`}>{goal.status}</span>
                                  </div>
                                  
                                  <div className="flex justify-between items-center text-[10px]">
                                    <div className="w-3/4 bg-zinc-950 rounded-full h-1.5 overflow-hidden">
                                      <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${goal.progress}%` }} />
                                    </div>
                                    <span className="font-semibold text-zinc-350 font-mono text-[9px]">{goal.progress}%</span>
                                  </div>

                                  <div className="flex justify-between items-center text-[9px] text-zinc-550 pt-0.5">
                                    <span>Target: {goal.targetCarbon} t</span>
                                    <span>Owner: {goal.owner}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Executive Insight Cards */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-450">Executive Insights & Recommendations</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {detailData.insights.map((insight: any, i: number) => {
                            let cardTheme = 'bg-zinc-900/20 border-zinc-900/60 text-zinc-300';
                            let icon = <Info className="w-4 h-4 text-sky-400" />;
                            
                            if (insight.type === 'success') {
                              cardTheme = 'bg-emerald-500/5 border-emerald-500/10 text-zinc-300';
                              icon = <CheckSquare className="w-4 h-4 text-emerald-400" />;
                            } else if (insight.type === 'warning') {
                              cardTheme = 'bg-rose-500/5 border-rose-500/10 text-zinc-300';
                              icon = <ShieldAlert className="w-4 h-4 text-rose-400" />;
                            }

                            return (
                              <div key={i} className={`p-4 rounded-xl border space-y-1.5 ${cardTheme}`}>
                                <div className="flex items-center gap-2">
                                  {icon}
                                  <span className="text-xs font-bold text-zinc-200">{insight.message}</span>
                                </div>
                                <p className="text-[10px] text-zinc-400 leading-normal">{insight.description}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
