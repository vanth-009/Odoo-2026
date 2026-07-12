'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, RefreshCw, CheckCircle2, ShieldAlert, Sparkles,
  Users2, Landmark, Gamepad2, Settings2, HelpCircle, ArrowRight,
  Plus, Search, Download, Edit2, Archive, Eye, RotateCcw, AlertCircle, FileText, Package, Target, BarChart2,
  TrendingUp, TrendingDown, Info, LayoutGrid, CheckSquare, Layers, Award, ShieldQuestion, Globe, FileSpreadsheet,
  Calendar, FileDown, BookOpen, Clock, Printer
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, 
  ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

interface Department {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  code: string;
}

interface Goal {
  id: string;
  name: string;
}

interface ReportLog {
  id: string;
  name: string;
  type: string;
  generatedBy: string;
  generatedAt: string | Date;
  filters: string;
  format: string;
  status: string;
}

interface ReportsManagerProps {
  initialDepartments: Department[];
  initialProducts: Product[];
  initialGoals: Goal[];
  initialHistory: ReportLog[];
}

export default function ReportsManager({
  initialDepartments,
  initialProducts,
  initialGoals,
  initialHistory
}: ReportsManagerProps) {
  const [history, setHistory] = useState<ReportLog[]>(initialHistory);

  // Builder States
  const [reportName, setReportName] = useState('Monthly Sustainability Review - ' + new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }));
  const [reportType, setReportType] = useState('Monthly Sustainability Review');
  const [selectedDeptId, setSelectedDeptId] = useState('ALL');
  const [selectedDateRange, setSelectedDateRange] = useState('Monthly');
  const [selectedSource, setSelectedSource] = useState('ALL');
  const [selectedProductId, setSelectedProductId] = useState('ALL');
  const [selectedGoalId, setSelectedGoalId] = useState('ALL');
  const [selectedFormat, setSelectedFormat] = useState('CSV');

  // Preview States
  const [previewData, setPreviewData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Predefined Templates Configuration
  const templates = [
    {
      name: 'Monthly Sustainability Review',
      description: 'Monthly operational checkup targeting MoM variance, department scores, and electricity targets.',
      type: 'Monthly Sustainability Review',
      dateRange: 'Monthly',
      dept: 'ALL',
      format: 'CSV'
    },
    {
      name: 'Quarterly Environmental Assessment',
      description: 'Quarterly audit analyzing goal milestones, product impacts, and overall waste footprints.',
      type: 'Quarterly Environmental Assessment',
      dateRange: 'Q2',
      dept: 'ALL',
      format: 'JSON'
    },
    {
      name: 'Annual Environmental Report',
      description: 'Comprehensive annual executive footprint review mapping YTD targets against standard baselines.',
      type: 'Annual Environmental Report',
      dateRange: 'Yearly',
      dept: 'ALL',
      format: 'CSV'
    },
    {
      name: 'Department Scorecard',
      description: 'Focused assessment analyzing a specific department\'s scoring breakdown and top carbon sources.',
      type: 'Department Scorecard',
      dateRange: 'Monthly',
      dept: initialDepartments[0]?.id || 'ALL',
      format: 'JSON'
    }
  ];

  // Configure builder from a template card
  const selectTemplate = (tpl: typeof templates[0]) => {
    setReportType(tpl.type);
    setSelectedDateRange(tpl.dateRange);
    setSelectedDeptId(tpl.dept);
    setSelectedFormat(tpl.format);
    
    let suffix = '';
    if (tpl.dateRange === 'Monthly') {
      suffix = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
    } else {
      suffix = `${tpl.dateRange} ${new Date().getFullYear()}`;
    }
    setReportName(`${tpl.name} - ${suffix}`);
  };

  // POST: Generate report dynamic dataset
  const generateReport = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/environment/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: reportName,
          type: reportType,
          departmentId: selectedDeptId,
          dateRange: selectedDateRange,
          source: selectedSource,
          productId: selectedProductId,
          goalId: selectedGoalId,
          format: selectedFormat,
          generatedBy: 'Sarah Connor'
        })
      });

      if (!res.ok) throw new Error('Failed to generate report dataset');
      const data = await res.json();
      setPreviewData(data.preview);
      
      // Refresh history log list
      fetchHistory();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // GET: Refresh reports history logs
  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const res = await fetch('/api/environment/reports');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Re-run report from a history log item
  const loadHistoryItem = async (log: ReportLog) => {
    const filters = JSON.parse(log.filters);
    setReportName(log.name);
    setReportType(log.type);
    setSelectedDeptId(filters.departmentId || 'ALL');
    setSelectedDateRange(filters.dateRange || 'Monthly');
    setSelectedSource(filters.source || 'ALL');
    setSelectedProductId(filters.productId || 'ALL');
    setSelectedGoalId(filters.goalId || 'ALL');
    setSelectedFormat(log.format);

    // Trigger report rebuild
    try {
      setLoading(true);
      const res = await fetch('/api/environment/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: log.name,
          type: log.type,
          departmentId: filters.departmentId || 'ALL',
          dateRange: filters.dateRange || 'Monthly',
          source: filters.source || 'ALL',
          productId: filters.productId || 'ALL',
          goalId: filters.goalId || 'ALL',
          format: log.format,
          generatedBy: log.generatedBy
        })
      });
      if (!res.ok) throw new Error('Failed to compile historical report preview');
      const data = await res.json();
      setPreviewData(data.preview);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Local File Downloader
  const downloadPreviewFile = (format: 'CSV' | 'JSON') => {
    if (!previewData) return;

    if (format === 'JSON') {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(previewData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `${reportName.replace(/\s+/g, '_')}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      // Create simple table CSV format
      const csvLines = [
        `Report: ${reportName}`,
        `Type: ${reportType}`,
        `Date: ${new Date().toLocaleDateString()}`,
        '',
        '--- ENVIRONMENTAL KPIS ---',
        `Total Carbon Emissions (tCO2e),${previewData.kpis.totalEmissions}`,
        `Carbon Saved (tCO2e),${previewData.kpis.carbonSaved}`,
        `Avg Environmental Score,${previewData.kpis.averageEnvironmentalScore}`,
        `Top Performing Department,${previewData.kpis.highestPerformingDepartment}`,
        `Lowest Performing Department,${previewData.kpis.lowestPerformingDepartment}`,
        `Goals Completed,${previewData.kpis.goalsCompleted}`,
        `Goals At Risk,${previewData.kpis.goalsAtRisk}`,
        '',
        '--- DEPARTMENT CARBON SCORES ---',
        'Department,Emissions (tCO2e),Transactions count'
      ];

      previewData.departmentEmissions.forEach((d: any) => {
        csvLines.push(`${d.name},${d.carbon},${d.transactions}`);
      });

      const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${reportName.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  const PIE_COLORS = ['#34d399', '#60a5fa', '#a78bfa', '#f59e0b', '#ec4899', '#f43f5e'];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex relative overflow-hidden font-sans">
      {/* Background Neon Mesh Gradients */}
      <div className="absolute top-0 left-1/3 w-[50rem] h-[35rem] bg-emerald-500/5 rounded-full blur-[130px] -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-5 w-[35rem] h-[30rem] bg-purple-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Global Sidebar Navigation */}
      <aside className="w-64 border-r border-zinc-900 bg-zinc-950/80 backdrop-blur-md p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-7">
          {/* Branding */}
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
              className="flex items-center gap-3 px-3 py-2 text-zinc-400 border border-transparent rounded-lg text-xs font-semibold relative transition-premium group hover:bg-zinc-900/10 hover:text-[#f4f4f5]"
            >
              <BarChart2 className="w-4 h-4 text-zinc-400 group-hover:text-[#f4f4f5] transition-colors" />
              Department Analytics
            </a>

            <a 
              href="/environment/reports" 
              className="flex items-center gap-3 px-3 py-2 text-emerald-450 border border-transparent rounded-lg text-xs font-semibold relative transition-premium group animate-fade-in"
            >
              <span className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-emerald-500 rounded-full" />
              <FileSpreadsheet className="w-4 h-4 text-emerald-450" />
              Environmental Reports
            </a>

            {/* Active ESG Modules */}
            <div className="pt-6 pb-2 px-3 text-[9px] uppercase font-bold tracking-widest text-zinc-500">
              ESG Systems
            </div>

            <a 
              href="/social" 
              className="flex items-center gap-3 px-3 py-2 text-zinc-400 border border-transparent rounded-lg text-xs font-semibold relative transition-premium group hover:bg-zinc-900/10 hover:text-[#f4f4f5]"
            >
              <Users2 className="w-4 h-4 text-zinc-400 group-hover:text-[#f4f4f5] transition-colors" />
              Social Console
            </a>

            <a 
              href="/governance" 
              className="flex items-center gap-3 px-3 py-2 text-zinc-400 border border-transparent rounded-lg text-xs font-semibold relative transition-premium group hover:bg-zinc-900/10 hover:text-[#f4f4f5]"
            >
              <Landmark className="w-4 h-4 text-zinc-400 group-hover:text-[#f4f4f5] transition-colors" />
              Governance Console
            </a>
          </nav>
        </div>

        <div className="pt-4 border-t border-zinc-900 text-[10px] text-zinc-500 flex items-center justify-between">
          <span>Ver. 2.6.4</span>
          <span className="font-semibold text-zinc-450">Active DB Connected</span>
        </div>
      </aside>

      {/* Main Workspace Layout */}
      <main className="flex-1 p-8 overflow-y-auto space-y-6">
        {/* Header Block */}
        <header className="flex justify-between items-center pb-4 border-b border-zinc-900">
          <div>
            <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-semibold mb-1">
              <span>EcoSphere Console</span>
              <span className="text-zinc-650">/</span>
              <span className="text-emerald-400">Environmental Reports</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
              Environmental Reporting Center
              <Sparkles className="w-4.5 h-4.5 text-emerald-400 animate-pulse" />
            </h1>
          </div>
        </header>

        {/* Predefined Templates Grid */}
        <section className="space-y-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-350 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-450" />
              Select Report Template
            </h3>
            <p className="text-[10px] text-zinc-450 mt-0.5">Quickly initialize custom templates to generate carbon compliance scorecards.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {templates.map((tpl) => (
              <button
                key={tpl.name}
                onClick={() => selectTemplate(tpl)}
                className="bg-zinc-900/40 border border-zinc-900 hover:border-zinc-850 hover:bg-zinc-900/60 p-4 rounded-xl text-left transition-all space-y-2 group"
              >
                <span className="text-xs font-bold text-zinc-200 group-hover:text-emerald-400 transition-colors block truncate">{tpl.name}</span>
                <p className="text-[10px] text-zinc-500 leading-normal line-clamp-2">{tpl.description}</p>
                <div className="flex justify-between items-center pt-2 text-[9px] text-zinc-400 font-semibold border-t border-zinc-900/60 mt-1">
                  <span>Scope: {tpl.dateRange}</span>
                  <span className="bg-zinc-950 px-2 py-0.5 rounded border border-zinc-850">{tpl.format}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Split Screen Workspace: Builder (Left) & Preview (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Builder configuration */}
          <section className="lg:col-span-4 bg-zinc-900/30 border border-zinc-900 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Report Builder</h3>
            
            <div className="space-y-3.5">
              {/* Report Name Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Report Name</label>
                <input
                  type="text"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-lg py-1.5 px-3 text-xs text-zinc-200 placeholder-zinc-550 focus:outline-none focus:border-zinc-700"
                />
              </div>

              {/* Report Type Selection */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Report Type</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-lg py-1.5 px-3 text-xs text-zinc-300 focus:outline-none focus:border-zinc-700"
                >
                  <option value="Monthly Sustainability Review">Monthly Sustainability Review</option>
                  <option value="Quarterly Environmental Assessment">Quarterly Environmental Assessment</option>
                  <option value="Annual Environmental Report">Annual Environmental Report</option>
                  <option value="Department Scorecard">Department Scorecard</option>
                  <option value="Executive Environmental Summary">Executive Environmental Summary</option>
                </select>
              </div>

              {/* Department filter */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Department Scope</label>
                <select
                  value={selectedDeptId}
                  onChange={(e) => setSelectedDeptId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-lg py-1.5 px-3 text-xs text-zinc-300 focus:outline-none focus:border-zinc-700"
                >
                  <option value="ALL">All Departments (Overall)</option>
                  {initialDepartments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Date Scope */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Date Timeline Scope</label>
                <select
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-lg py-1.5 px-3 text-xs text-zinc-300 focus:outline-none focus:border-zinc-700"
                >
                  <option value="Monthly">Current Month</option>
                  <option value="Q1">Q1 Assessment (Jan-Mar)</option>
                  <option value="Q2">Q2 Assessment (Apr-Jun)</option>
                  <option value="Q3">Q3 Assessment (Jul-Sep)</option>
                  <option value="Q4">Q4 Assessment (Oct-Dec)</option>
                  <option value="Yearly">Year-to-Date (YTD)</option>
                </select>
              </div>

              {/* Emission Source filter */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Operational Emission Source</label>
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-lg py-1.5 px-3 text-xs text-zinc-300 focus:outline-none focus:border-zinc-700"
                >
                  <option value="ALL">All Operational Sources</option>
                  <option value="Fleet">Fleet Operations</option>
                  <option value="Manufacturing">Manufacturing Operations</option>
                  <option value="Electricity">Electricity Grid Usage</option>
                  <option value="Business Travel">Business Travel</option>
                  <option value="Waste Management">Waste Management</option>
                </select>
              </div>

              {/* Format selection */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Export Format</label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-lg py-1.5 px-3 text-xs text-zinc-300 focus:outline-none focus:border-zinc-700"
                >
                  <option value="CSV">Comma Separated Values (.csv)</option>
                  <option value="JSON">Structured JSON format (.json)</option>
                </select>
              </div>

              {/* Compile Report Trigger */}
              <button
                onClick={generateReport}
                disabled={loading}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-450 text-zinc-950 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/5 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
                {loading ? 'Compiling Environmental Data...' : 'Generate Executive Report'}
              </button>
            </div>
          </section>

          {/* Right Column: Report preview sheet workspace */}
          <section className="lg:col-span-8 space-y-6">
            {!previewData ? (
              <div className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-10 flex flex-col items-center justify-center py-32 space-y-3 text-center">
                <div className="w-12 h-12 bg-zinc-950 rounded-xl border border-zinc-850 flex items-center justify-center text-zinc-600 mb-1">
                  <FileSpreadsheet className="w-6 h-6 stroke-1" />
                </div>
                <h4 className="text-sm font-bold text-zinc-300">EcoSphere Report Workspace</h4>
                <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
                  Select a predefined template above or configure your variables in the Report Builder to compile live carbon and goals data.
                </p>
              </div>
            ) : (
              <div className="bg-zinc-900/35 border border-zinc-850 rounded-xl p-6 space-y-6 relative overflow-hidden print:bg-white print:text-black">
                {/* Print and Export Buttons */}
                <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold block">Generated Document</span>
                    <h3 className="text-sm font-bold text-zinc-200">{reportName}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-850 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 rounded text-[10px] font-bold flex items-center gap-1.5 transition-all"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Print
                    </button>
                    <button
                      onClick={() => downloadPreviewFile(selectedFormat as 'CSV' | 'JSON')}
                      className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-450 text-zinc-950 rounded text-[10px] font-bold flex items-center gap-1.5 transition-all"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      Download {selectedFormat}
                    </button>
                  </div>
                </div>

                {/* Section 1: Executive Summary */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">I. Executive Summary</h4>
                  <div className="p-4 bg-zinc-950/40 border border-zinc-900 rounded-xl space-y-2">
                    {previewData.executiveSummary.map((sum: string, idx: number) => (
                      <p key={idx} className="text-xs text-zinc-300 leading-relaxed">• {sum}</p>
                    ))}
                  </div>
                </div>

                {/* Section 2: Environmental KPIs Grid */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">II. Environmental KPIs scorecard</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-zinc-950/40 rounded-lg border border-zinc-900">
                      <span className="text-[8.5px] uppercase font-bold text-zinc-500 tracking-wider">Total Carbon Emissions</span>
                      <span className="text-sm font-bold font-mono text-zinc-200 block mt-1">{previewData.kpis.totalEmissions} tCO2e</span>
                    </div>
                    <div className="p-3 bg-zinc-950/40 rounded-lg border border-zinc-900">
                      <span className="text-[8.5px] uppercase font-bold text-zinc-500 tracking-wider">Baseline Carbon Saved</span>
                      <span className="text-sm font-bold font-mono text-emerald-400 block mt-1">-{previewData.kpis.carbonSaved} tCO2e</span>
                    </div>
                    <div className="p-3 bg-zinc-950/40 rounded-lg border border-zinc-900">
                      <span className="text-[8.5px] uppercase font-bold text-zinc-500 tracking-wider">Avg Environmental Score</span>
                      <span className="text-sm font-bold font-mono text-zinc-200 block mt-1">{previewData.kpis.averageEnvironmentalScore} pts</span>
                    </div>
                    <div className="p-3 bg-zinc-950/40 rounded-lg border border-zinc-900">
                      <span className="text-[8.5px] uppercase font-bold text-zinc-500 tracking-wider">Sustainability Goals</span>
                      <span className="text-sm font-bold font-mono text-zinc-200 block mt-1">
                        {previewData.kpis.goalsCompleted} met / {previewData.kpis.goalsAtRisk} risk
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section 3: Operational Source Pie */}
                {previewData.operationalSources && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-t border-zinc-900 pt-4">
                    <div className="md:col-span-5 space-y-2">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">III. Operational Source Analysis</h4>
                      <p className="text-[10px] text-zinc-450 leading-relaxed">
                        Emissions categorized by fuel combustion, material waste, grid electricity, travel, and logistics.
                      </p>
                    </div>

                    <div className="md:col-span-7 bg-zinc-950/30 border border-zinc-900 p-4 rounded-xl flex items-center justify-between">
                      <div className="w-28 h-28">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={previewData.operationalSources.filter((s: any) => s.carbon > 0)}
                              cx="50%"
                              cy="50%"
                              innerRadius={25}
                              outerRadius={45}
                              paddingAngle={2}
                              dataKey="carbon"
                            >
                              {previewData.operationalSources.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="grid grid-cols-1 gap-1 text-[9px] w-1/2">
                        {previewData.operationalSources.filter((s: any) => s.carbon > 0).map((entry: any, index: number) => (
                          <div key={entry.name} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                            <span className="text-zinc-400 font-medium truncate">{entry.name}:</span>
                            <span className="font-semibold text-zinc-200 font-mono">{entry.carbon} t</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 4: Department Comparison Table */}
                <div className="space-y-2 border-t border-zinc-900 pt-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">IV. Department Emissions Comparison</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-zinc-900 text-zinc-550 font-bold text-[8.5px] uppercase tracking-wider">
                          <th className="py-2">Department Name</th>
                          <th className="py-2">Carbon (tCO2e)</th>
                          <th className="py-2 text-right">Transactions count</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900/60">
                        {previewData.departmentEmissions.map((d: any) => (
                          <tr key={d.id} className="text-zinc-300">
                            <td className="py-2.5 font-semibold">{d.name}</td>
                            <td className="py-2.5 font-mono">{d.carbon}</td>
                            <td className="py-2.5 font-mono text-right">{d.transactions}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section 5: Goal Progress */}
                <div className="space-y-2 border-t border-zinc-900 pt-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">V. Sustainability Goal Progress</h4>
                  {previewData.goals.length === 0 ? (
                    <p className="text-zinc-650 text-xs py-2">No active objectives associated with current parameters.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {previewData.goals.map((g: any, i: number) => (
                        <div key={i} className="p-3 bg-zinc-950/40 rounded-lg border border-zinc-900 space-y-1.5 text-xs">
                          <div className="flex justify-between items-start">
                            <span className="font-semibold text-zinc-200 block truncate max-w-[170px]">{g.name}</span>
                            <span className="text-[9px] font-mono text-zinc-500">{g.status}</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px]">
                            <div className="w-4/5 bg-zinc-950 rounded-full h-1 overflow-hidden">
                              <div className="bg-emerald-400 h-1 rounded-full" style={{ width: `${g.progress}%` }} />
                            </div>
                            <span className="font-semibold text-zinc-350 font-mono text-[9px]">{g.progress}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section 6: Key Insights */}
                <div className="space-y-2 border-t border-zinc-900 pt-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">VI. Strategic Recommendations</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {previewData.insights.map((ins: any, idx: number) => (
                      <div key={idx} className="p-3 bg-zinc-950/40 rounded-lg border border-zinc-900 space-y-1 text-xs">
                        <span className="font-bold text-zinc-200 block">{ins.message}</span>
                        <p className="text-[10px] text-zinc-500 leading-normal">{ins.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 7: Appendix / Method statement */}
                <div className="border-t border-zinc-900 pt-4 space-y-1.5 text-[9px] text-zinc-500 leading-relaxed">
                  <span className="font-bold uppercase tracking-wider">Appendix: Methodology Statement & Audit Trail</span>
                  <p>
                    All emission values are dynamically aggregated from the active database ledger. Carbon outputs are calculated using standard quantity-factor coefficients: Carbon = Quantity × Factor Value. Predefined emission factors reference verified databases including EPA Emission Factors Hub 2025 and DEFRA Carbon Reporting guidelines.
                  </p>
                </div>
              </div>
            )}

            {/* Reports Generation History Logs Table */}
            <div className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-350 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  Generated Reports History
                </h3>
                {historyLoading && <RefreshCw className="w-3.5 h-3.5 text-zinc-500 animate-spin" />}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-900 text-zinc-550 font-bold text-[8.5px] uppercase tracking-wider">
                      <th className="py-2.5">Report Name</th>
                      <th className="py-2.5">Type</th>
                      <th className="py-2.5">Generated By</th>
                      <th className="py-2.5">Time</th>
                      <th className="py-2.5">Format</th>
                      <th className="py-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/60">
                    {history.map((log) => (
                      <tr 
                        key={log.id} 
                        onClick={() => loadHistoryItem(log)}
                        className="hover:bg-zinc-900/30 cursor-pointer text-zinc-300 transition-colors"
                      >
                        <td className="py-3 font-semibold text-zinc-200">{log.name}</td>
                        <td className="py-3 text-zinc-400">{log.type}</td>
                        <td className="py-3 text-zinc-400">{log.generatedBy}</td>
                        <td className="py-3 text-zinc-550">{new Date(log.generatedAt).toLocaleString()}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-[8.5px] font-bold bg-zinc-950 border border-zinc-850">
                            {log.format}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <span className="text-emerald-400 font-bold text-[9px] flex items-center justify-end gap-1">
                            <CheckSquare className="w-3 h-3 text-emerald-400" />
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
