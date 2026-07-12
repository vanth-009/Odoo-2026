'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, RefreshCw, CheckCircle2, ShieldAlert, Sparkles,
  Users2, Landmark, Gamepad2, Settings2, HelpCircle, ArrowRight,
  Plus, Search, Download, Edit2, Archive, Eye, RotateCcw, AlertCircle, FileText, Package,
  Grid, List, Calendar, TrendingDown, Target, ChevronRight, User, Clock, Info, BarChart2, FileSpreadsheet
} from 'lucide-react';
import { Department } from '../types';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend 
} from 'recharts';

interface Goal {
  id: string;
  name: string;
  description?: string | null;
  departmentId: string;
  department: Department;
  category: string;
  baselineCarbon: number;
  targetCarbon: number;
  startDate: string | Date;
  targetDate: string | Date;
  owner: string;
  priority: string;
  status: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  // Calculated properties from API
  currentCarbon: number;
  targetReduction: number;
  carbonSaved: number;
  remainingReduction: number;
  progressPercent: number;
  remainingPercent: number;
}

interface GoalsManagerProps {
  departments: Department[];
}

export default function GoalsManager({ departments }: GoalsManagerProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Combinable Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // View mode: 'card' or 'table'
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  // Selected Goal for Details Inspector
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<{
    goal: Goal;
    relatedTransactions: any[];
    trend: any[];
    timeline: any[];
  } | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Form Modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    departmentId: '',
    category: 'Reduce Fleet Emissions',
    baselineCarbon: '',
    targetCarbon: '',
    startDate: '',
    targetDate: '',
    owner: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    status: 'Active' as 'Draft' | 'Active' | 'On Track' | 'At Risk' | 'Completed' | 'Archived'
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchGoals = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch('/api/environment/goals');
      if (res.ok) {
        const data = await res.json();
        setGoals(data || []);
      }
    } catch (err) {
      triggerToast('Failed to load goals list', 'error');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch detailed information for inspector
  const handleInspectGoal = async (goalId: string) => {
    setDetailLoading(true);
    setSelectedGoalId(goalId);
    setIsDetailModalOpen(true);
    try {
      const res = await fetch(`/api/environment/goals/${goalId}`);
      if (res.ok) {
        const data = await res.json();
        setDetailData(data);
      } else {
        triggerToast('Failed to fetch goal details', 'error');
        setIsDetailModalOpen(false);
      }
    } catch (err) {
      triggerToast('Error loading details', 'error');
      setIsDetailModalOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  // Archive Goal Soft-delete handler
  const handleArchiveGoal = async (goal: Goal) => {
    const isArchived = goal.status === 'Archived';
    const actionLabel = isArchived ? 'restored' : 'archived';
    
    try {
      const res = await fetch(`/api/environment/goals/${goal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        // If archived, set back to Active, else soft-delete to Archived
        body: JSON.stringify({ status: isArchived ? 'Active' : 'Archived' })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update goal');
      }

      triggerToast(`Goal successfully ${actionLabel}!`);
      fetchGoals(true);
      if (selectedGoalId === goal.id) {
        setIsDetailModalOpen(false);
      }
    } catch (err: any) {
      triggerToast(err.message, 'error');
    }
  };

  // Categories list
  const categories = [
    'Reduce Fleet Emissions',
    'Reduce Electricity Consumption',
    'Reduce Manufacturing Emissions',
    'Packaging Waste Reduction',
    'Water Conservation',
    'Renewable Energy Adoption'
  ];

  // Pipeline Filtered Goals
  const filteredGoals = useMemo(() => {
    return goals.filter(g => {
      const matchesSearch = 
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (g.description && g.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        g.owner.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDept = deptFilter === 'all' || g.departmentId === deptFilter;
      const matchesCategory = categoryFilter === 'all' || g.category === categoryFilter;
      const matchesPriority = priorityFilter === 'all' || g.priority === priorityFilter;
      const matchesStatus = statusFilter === 'all' || g.status === statusFilter;

      return matchesSearch && matchesDept && matchesCategory && matchesPriority && matchesStatus;
    });
  }, [goals, searchQuery, deptFilter, categoryFilter, priorityFilter, statusFilter]);

  // Aggregate KPI summary metrics from existing goals
  const kpiData = useMemo(() => {
    const active = goals.filter(g => g.status !== 'Archived' && g.status !== 'Completed').length;
    const completed = goals.filter(g => g.status === 'Completed').length;
    const atRisk = goals.filter(g => g.status === 'At Risk').length;
    
    const validProgressGoals = goals.filter(g => g.status !== 'Archived');
    const averageProgress = validProgressGoals.length > 0
      ? validProgressGoals.reduce((sum, g) => sum + g.progressPercent, 0) / validProgressGoals.length
      : 0;

    const totalTargetReduction = validProgressGoals.reduce((sum, g) => sum + g.targetReduction, 0);
    const totalCarbonSaved = validProgressGoals.reduce((sum, g) => sum + g.carbonSaved, 0);

    return {
      active,
      completed,
      atRisk,
      averageProgress: parseFloat(averageProgress.toFixed(1)),
      totalTargetReduction: parseFloat(totalTargetReduction.toFixed(1)),
      totalCarbonSaved: parseFloat(totalCarbonSaved.toFixed(1))
    };
  }, [goals]);

  // Open Form Modal for Creating
  const handleOpenCreate = () => {
    setEditingGoal(null);
    setFormData({
      name: '',
      description: '',
      departmentId: departments[0]?.id || '',
      category: 'Reduce Fleet Emissions',
      baselineCarbon: '',
      targetCarbon: '',
      startDate: new Date().toISOString().split('T')[0],
      targetDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
      owner: '',
      priority: 'Medium',
      status: 'Active'
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open Form Modal for Editing
  const handleOpenEdit = (goal: Goal) => {
    // If completed or archived, warn or adjust
    if (goal.status === 'Completed') {
      triggerToast('Completed goals are read-only. Edit status to adjust details.', 'error');
    }
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      description: goal.description || '',
      departmentId: goal.departmentId,
      category: goal.category,
      baselineCarbon: goal.baselineCarbon.toString(),
      targetCarbon: goal.targetCarbon.toString(),
      startDate: new Date(goal.startDate).toISOString().split('T')[0],
      targetDate: new Date(goal.targetDate).toISOString().split('T')[0],
      owner: goal.owner,
      priority: goal.priority as any,
      status: goal.status as any
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Input change helper
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Client validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name || formData.name.trim().length < 3) {
      errors.name = 'Goal name must be at least 3 characters';
    }
    if (!formData.departmentId) {
      errors.departmentId = 'Department is required';
    }
    if (!formData.owner || formData.owner.trim().length < 2) {
      errors.owner = 'Owner name is required';
    }

    const baseline = parseFloat(formData.baselineCarbon);
    if (isNaN(baseline) || baseline <= 0) {
      errors.baselineCarbon = 'Baseline emissions must be a positive number';
    }

    const target = parseFloat(formData.targetCarbon);
    if (isNaN(target) || target <= 0) {
      errors.targetCarbon = 'Target emissions must be a positive number';
    } else if (target >= baseline) {
      errors.targetCarbon = 'Target emissions must always be lower than the baseline emissions';
    }

    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }
    if (!formData.targetDate) {
      errors.targetDate = 'Target date is required';
    } else if (formData.startDate && formData.startDate >= formData.targetDate) {
      errors.targetDate = 'Start Date must be earlier than Target Date';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form Submit Handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormSubmitting(true);
    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      departmentId: formData.departmentId,
      category: formData.category,
      baselineCarbon: parseFloat(formData.baselineCarbon),
      targetCarbon: parseFloat(formData.targetCarbon),
      startDate: new Date(formData.startDate),
      targetDate: new Date(formData.targetDate),
      owner: formData.owner.trim(),
      priority: formData.priority,
      status: formData.status
    };

    try {
      const url = editingGoal 
        ? `/api/environment/goals/${editingGoal.id}` 
        : '/api/environment/goals';
      const method = editingGoal ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save goal');
      }

      triggerToast(editingGoal ? 'Sustainability Goal updated successfully' : 'Sustainability Goal created successfully');
      setIsFormModalOpen(false);
      fetchGoals(true);
    } catch (err: any) {
      setFormErrors({ apiError: err.message });
    } finally {
      setFormSubmitting(false);
    }
  };

  // CSV/JSON Export download utility
  const handleExportGoals = (format: 'csv' | 'json') => {
    try {
      let dataStr = '';
      let filename = `ecosphere_sustainability_goals_${Date.now()}`;
      
      if (format === 'json') {
        dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredGoals, null, 2));
        filename += '.json';
      } else {
        const headers = 'GoalName,Department,Category,BaselineCarbon,TargetCarbon,CurrentCarbon,CarbonSaved,ProgressPercent,Deadline,Priority,Status\n';
        const rows = filteredGoals.map(g => (
          `"${g.name}","${g.department?.name}","${g.category}",${g.baselineCarbon},${g.targetCarbon},${g.currentCarbon},${g.carbonSaved},${g.progressPercent},"${new Date(g.targetDate).toLocaleDateString()}","${g.priority}","${g.status}"`
        )).join('\n');
        dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + rows);
        filename += '.csv';
      }

      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", filename);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      triggerToast(`Goals registry exported in ${format.toUpperCase()} format!`);
    } catch (err) {
      triggerToast('Export failed', 'error');
    }
  };

  return (
    <div className="flex flex-1 bg-[#09090b] text-[#f4f4f5] min-h-screen relative overflow-hidden transition-all duration-300">
      
      {/* Ambient glass light gradients */}
      <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] ambient-glow-1 pointer-events-none z-0" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] ambient-glow-2 pointer-events-none z-0" />
      <div className="absolute top-[30%] right-[10%] w-[45%] h-[45%] ambient-glow-3 pointer-events-none z-0" />

      {/* Elegant, Compact Sidebar */}
      <aside className="w-64 border-r border-[#1f1f23]/60 bg-[#09090b]/80 backdrop-blur-md flex flex-col justify-between hidden md:flex shrink-0 z-10 relative">
        <div>
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

          <nav className="p-4 space-y-2">
            <span className="px-3 text-[8.5px] uppercase font-bold tracking-widest text-zinc-500 block mb-3">Sections</span>
            
            <a 
              href="/environment" 
              className="flex items-center gap-3 px-3 py-2 text-zinc-400 border border-transparent rounded-lg text-xs font-semibold relative transition-premium group hover:bg-zinc-900/10 hover:text-[#f4f4f5]"
            >
              <BarChart3 className="w-4 h-4 text-zinc-450 group-hover:text-[#f4f4f5] transition-colors" />
              Environmental Console
            </a>

            <a 
              href="/environment/factors" 
              className="flex items-center gap-3 px-3 py-2 text-zinc-400 border border-transparent rounded-lg text-xs font-semibold relative transition-premium group hover:bg-zinc-900/10 hover:text-[#f4f4f5]"
            >
              <Settings2 className="w-4 h-4 text-zinc-450 group-hover:text-[#f4f4f5] transition-colors" />
              Emission Factors
            </a>

            <a 
              href="/environment/products" 
              className="flex items-center gap-3 px-3 py-2 text-zinc-400 border border-transparent rounded-lg text-xs font-semibold relative transition-premium group hover:bg-zinc-900/10 hover:text-[#f4f4f5]"
            >
              <Package className="w-4 h-4 text-zinc-450 group-hover:text-[#f4f4f5] transition-colors" />
              Product ESG Profiles
            </a>

            <a 
              href="/environment/transactions" 
              className="flex items-center gap-3 px-3 py-2 text-zinc-400 border border-transparent rounded-lg text-xs font-semibold relative transition-premium group hover:bg-zinc-900/10 hover:text-[#f4f4f5]"
            >
              <FileText className="w-4 h-4 text-zinc-450 group-hover:text-[#f4f4f5] transition-colors" />
              Carbon Transactions
            </a>

            <a 
              href="/environment/goals" 
              className="flex items-center gap-3 px-3 py-2 text-emerald-450 border border-transparent rounded-lg text-xs font-semibold relative transition-premium group"
            >
              <span className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-emerald-500 rounded-full" />
              <Target className="w-4 h-4 text-emerald-450" />
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
              className="flex items-center gap-3 px-3 py-2 text-zinc-400 border border-transparent rounded-lg text-xs font-semibold relative transition-premium group hover:bg-zinc-900/10 hover:text-[#f4f4f5]"
            >
              <FileSpreadsheet className="w-4 h-4 text-zinc-400 group-hover:text-[#f4f4f5] transition-colors" />
              Environmental Reports
            </a>
            
            {/* Active ESG Modules */}
            <div className="pt-6 pb-2 px-3 text-[8.5px] uppercase font-bold tracking-widest text-zinc-500">
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

        <div className="p-4 border-t border-[#1f1f23]/40 space-y-2 text-zinc-500 text-xs">
          <a href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-[#18181b] hover:text-[#f4f4f5] rounded-lg transition-premium font-medium">
            <HelpCircle className="w-4 h-4 text-zinc-400" />
            Help Center
          </a>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto z-10 relative">
        <header className="h-16 border-b border-[#1f1f23]/30 px-8 flex items-center justify-between bg-[#09090b]/50 backdrop-blur-md shrink-0">
          <div className="flex flex-col">
            <span className="text-[8.5px] font-mono tracking-widest text-zinc-550 uppercase">Environmental Node &gt; Goals</span>
            <h1 className="text-sm font-extrabold text-[#f4f4f5] tracking-tight -mt-0.5 font-mono font-bold">Sustainability Goals Registry</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchGoals()}
              disabled={loading}
              className="p-2 rounded-lg bg-[#18181b] hover:bg-[#27272a] text-zinc-400 hover:text-[#f4f4f5] border border-[#27272a]/40 transition-premium disabled:opacity-40"
              title="Poll goals data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        <div className="p-8 space-y-6 flex-1">
          {/* Toast Alert */}
          {toast && (
            <div className={`fixed bottom-8 right-8 z-50 p-4 border rounded-xl shadow-2xl flex items-center gap-3 transition-premium ${
              toast.type === 'success' ? 'bg-[#09090b]/90 border-emerald-500/20 text-emerald-300' : 'bg-[#09090b]/90 border-rose-500/20 text-rose-300'
            }`}>
              {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <ShieldAlert className="w-4 h-4 shrink-0" />}
              <span className="text-xs font-semibold">{toast.message}</span>
            </div>
          )}

          {/* Intro Panel */}
          <div className="bg-[#141417]/50 border border-[#27272a]/30 rounded-2xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1.5">
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 rounded text-[8.5px] font-bold uppercase tracking-widest">
                  Strategic Planning Layer
                </span>
                <h2 className="text-base font-bold text-[#f4f4f5]">Environmental Sustainability Targets</h2>
                <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                  Establish, modify, and monitor corporate sustainability targets. Progress percentages, carbon saved, and remaining reduction required are automatically computed from live Carbon Transactions.
                </p>
              </div>

              <button
                onClick={handleOpenCreate}
                className="flex items-center gap-1.5 px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-[#09090b] text-xs font-bold rounded-xl transition-premium border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)] shrink-0"
              >
                <Plus className="w-4 h-4 shrink-0" />
                Create New Goal
              </button>
            </div>
          </div>

          {/* KPI Cards Section */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="bg-[#141417]/30 border border-[#27272a]/20 rounded-2xl p-4.5">
              <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">Active Goals</span>
              <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">{kpiData.active}</span>
            </div>
            <div className="bg-[#141417]/30 border border-[#27272a]/20 rounded-2xl p-4.5">
              <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">Completed</span>
              <span className="text-xl font-bold font-mono text-emerald-450 mt-1 block">{kpiData.completed}</span>
            </div>
            <div className="bg-[#141417]/30 border border-[#27272a]/20 rounded-2xl p-4.5">
              <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">At Risk</span>
              <span className="text-xl font-bold font-mono text-rose-450 mt-1 block">{kpiData.atRisk}</span>
            </div>
            <div className="bg-[#141417]/30 border border-[#27272a]/20 rounded-2xl p-4.5">
              <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">Average Progress</span>
              <span className="text-xl font-bold font-mono text-zinc-100 mt-1 block">{kpiData.averageProgress}%</span>
            </div>
            <div className="bg-[#141417]/30 border border-[#27272a]/20 rounded-2xl p-4.5">
              <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">Target Reduction</span>
              <span className="text-xl font-bold font-mono text-sky-400 mt-1 block">{kpiData.totalTargetReduction.toLocaleString()} <span className="text-[10px] text-zinc-500">t</span></span>
            </div>
            <div className="bg-[#141417]/30 border border-[#27272a]/20 rounded-2xl p-4.5">
              <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">Total Carbon Saved</span>
              <span className="text-xl font-bold font-mono text-emerald-455 mt-1 block">{kpiData.totalCarbonSaved.toLocaleString()} <span className="text-[10px] text-zinc-500">t</span></span>
            </div>
          </div>

          {/* Filtering and Toolbar panel */}
          <div className="bg-[#141417]/50 border border-[#27272a]/30 rounded-2xl p-4.5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#27272a]/20 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-450 font-bold">Ledger Filters</span>
                <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase">Dynamic</span>
              </div>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setDeptFilter('all');
                  setCategoryFilter('all');
                  setPriorityFilter('all');
                  setStatusFilter('all');
                }}
                className="text-[10px] text-zinc-500 hover:text-zinc-300 font-semibold transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 w-full lg:w-auto flex-1">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-zinc-550 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search goal name, owner..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9.5 pr-4 py-2 bg-[#09090b]/80 border border-[#27272a]/20 rounded-xl text-xs text-[#f4f4f5] placeholder-zinc-505 focus:outline-none focus:border-zinc-700 transition-premium"
                  />
                </div>

                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="px-3.5 py-2 bg-[#09090b]/80 border border-[#27272a]/20 rounded-xl text-xs text-zinc-305 focus:outline-none cursor-pointer hover:border-zinc-700 transition-premium"
                >
                  <option value="all">All Departments</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3.5 py-2 bg-[#09090b]/80 border border-[#27272a]/20 rounded-xl text-xs text-zinc-305 focus:outline-none cursor-pointer hover:border-zinc-700 transition-premium"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3.5 py-2 bg-[#09090b]/80 border border-[#27272a]/20 rounded-xl text-xs text-zinc-305 focus:outline-none cursor-pointer hover:border-zinc-700 transition-premium"
                >
                  <option value="all">All Priorities</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3.5 py-2 bg-[#09090b]/80 border border-[#27272a]/20 rounded-xl text-xs text-zinc-305 focus:outline-none cursor-pointer hover:border-zinc-700 transition-premium"
                >
                  <option value="all">All Statuses</option>
                  <option value="Draft">Draft</option>
                  <option value="Active">Active</option>
                  <option value="On Track">On Track</option>
                  <option value="At Risk">At Risk</option>
                  <option value="Completed">Completed</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              {/* View toggle and exporter */}
              <div className="flex items-center gap-3 shrink-0 w-full lg:w-auto justify-end">
                <div className="flex bg-[#09090b] border border-[#27272a]/30 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode('card')}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'card' ? 'bg-zinc-800 text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                    title="Card analytical view"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'table' ? 'bg-zinc-800 text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                    title="Table grid view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleExportGoals('csv')}
                    className="flex items-center gap-1 px-3 py-2 bg-[#18181b] border border-[#27272a]/30 hover:bg-[#27272a] text-zinc-200 text-xs font-bold rounded-xl transition-premium cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    CSV
                  </button>
                  <button
                    onClick={() => handleExportGoals('json')}
                    className="flex items-center gap-1 px-3 py-2 bg-[#18181b] border border-[#27272a]/30 hover:bg-[#27272a] text-zinc-200 text-xs font-bold rounded-xl transition-premium cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    JSON
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Loader or Content Views */}
          {loading ? (
            <div className="space-y-4 py-8 animate-pulse">
              <div className="h-24 bg-[#141417]/50 rounded-2xl w-full"></div>
              <div className="h-24 bg-[#141417]/50 rounded-2xl w-full"></div>
              <div className="h-24 bg-[#141417]/50 rounded-2xl w-full"></div>
            </div>
          ) : filteredGoals.length === 0 ? (
            <div className="bg-[#141417]/30 border border-[#27272a]/20 rounded-2xl p-12 text-center text-zinc-500 font-semibold">
              No sustainability goals match the current query filter.
            </div>
          ) : viewMode === 'card' ? (
            /* Rich Analytical Card View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGoals.map((goal) => (
                <div 
                  key={goal.id} 
                  className="bg-[#141417]/50 border border-[#27272a]/30 rounded-2xl p-5 hover:border-emerald-500/30 transition-premium relative flex flex-col justify-between group shadow-[0_4px_25px_rgba(0,0,0,0.4)]"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-zinc-500 block uppercase font-bold">{goal.category}</span>
                        <h3 
                          onClick={() => handleInspectGoal(goal.id)}
                          className="font-bold text-sm text-[#f4f4f5] cursor-pointer hover:text-emerald-450 hover:underline group-hover:text-emerald-400 transition-colors"
                        >
                          {goal.name}
                        </h3>
                      </div>
                      
                      {/* Dynamic status badge */}
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] font-bold border ${
                        goal.status === 'Completed' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                          : goal.status === 'On Track'
                          ? 'bg-sky-500/10 text-sky-400 border-sky-500/25'
                          : goal.status === 'At Risk'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/25'
                          : 'bg-[#18181b] text-zinc-500 border-zinc-800'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${
                          goal.status === 'Completed' ? 'bg-emerald-500' :
                          goal.status === 'On Track' ? 'bg-sky-500 animate-pulse' :
                          goal.status === 'At Risk' ? 'bg-rose-500 animate-ping' : 'bg-zinc-650'
                        }`} />
                        {goal.status}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-2 min-h-[32px] leading-relaxed">
                      {goal.description || 'No description provided.'}
                    </p>

                    <div className="grid grid-cols-2 gap-3 text-[11px] font-medium bg-[#09090b]/40 border border-[#27272a]/15 p-2.5 rounded-xl">
                      <div>
                        <span className="text-zinc-500 block text-[9px] uppercase font-mono">Department</span>
                        <span className="text-zinc-200 block truncate">{goal.department?.name}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[9px] uppercase font-mono">Owner / Priority</span>
                        <span className="text-zinc-200 block truncate">{goal.owner} • <span className={`font-bold ${goal.priority === 'High' ? 'text-rose-400' : goal.priority === 'Medium' ? 'text-amber-400' : 'text-zinc-400'}`}>{goal.priority}</span></span>
                      </div>
                    </div>

                    {/* Progress Bar Section */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-zinc-500">Progress toward target</span>
                        <span className="text-emerald-400 font-bold">{goal.progressPercent}%</span>
                      </div>
                      <div className="w-full bg-zinc-950 h-2.5 rounded-full overflow-hidden border border-zinc-850">
                        <div 
                          className="bg-gradient-to-r from-emerald-600 to-emerald-450 h-full rounded-full transition-all duration-1000"
                          style={{ width: `${goal.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center pt-2 text-[10px] font-mono border-t border-[#27272a]/20">
                      <div>
                        <span className="text-zinc-500 block text-[8px] uppercase">Current</span>
                        <span className="text-zinc-200 font-bold block">{goal.currentCarbon.toFixed(1)} t</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[8px] uppercase">Target</span>
                        <span className="text-emerald-400 font-bold block">{goal.targetCarbon.toFixed(1)} t</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[8px] uppercase">Remaining</span>
                        <span className="text-sky-400 font-bold block">{goal.remainingReduction.toFixed(1)} t</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#27272a]/20 mt-4.5 pt-3.5">
                    <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Target: {new Date(goal.targetDate).toLocaleDateString()}
                    </span>

                    <div className="flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleInspectGoal(goal.id)}
                        className="p-1.5 hover:bg-[#18181b] hover:text-[#f4f4f5] rounded-lg text-zinc-500 transition-premium cursor-pointer"
                        title="View Goal Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(goal)}
                        className="p-1.5 hover:bg-[#18181b] hover:text-[#f4f4f5] rounded-lg text-zinc-500 transition-premium cursor-pointer"
                        title="Edit Target Settings"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleArchiveGoal(goal)}
                        className={`p-1.5 hover:bg-[#18181b] rounded-lg transition-premium cursor-pointer ${
                          goal.status === 'Archived' ? 'hover:text-emerald-450 text-zinc-500' : 'hover:text-rose-450 text-zinc-500'
                        }`}
                        title={goal.status === 'Archived' ? 'Restore Goal' : 'Archive Goal'}
                      >
                        {goal.status === 'Archived' ? <RotateCcw className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Enterprise Grid Table View */
            <div className="bg-[#141417]/50 border border-[#27272a]/30 rounded-2xl p-6 shadow-md overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#1f1f23]/40 text-zinc-500 text-[9px] font-bold uppercase tracking-widest font-mono select-none">
                    <th className="pb-3.5 px-3">Goal Name</th>
                    <th className="pb-3.5 px-3">Department</th>
                    <th className="pb-3.5 px-3">Category</th>
                    <th className="pb-3.5 px-3 text-right">Baseline</th>
                    <th className="pb-3.5 px-3 text-right">Target</th>
                    <th className="pb-3.5 px-3 text-right">Current</th>
                    <th className="pb-3.5 px-3 text-right">Carbon Saved</th>
                    <th className="pb-3.5 px-3 text-right">Progress</th>
                    <th className="pb-3.5 px-3 text-center">Status</th>
                    <th className="pb-3.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f1f23]/20 text-xs text-zinc-300">
                  {filteredGoals.map((goal) => (
                    <tr key={goal.id} className="hover:bg-[#18181b]/35 transition-premium group">
                      <td className="py-3.5 px-3">
                        <span 
                          onClick={() => handleInspectGoal(goal.id)}
                          className="font-bold text-zinc-200 cursor-pointer hover:text-emerald-450 hover:underline transition-colors"
                        >
                          {goal.name}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">Owner: {goal.owner} • Priority: {goal.priority}</span>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-zinc-300">{goal.department?.name}</td>
                      <td className="py-3.5 px-3 font-medium text-zinc-450 text-[11px]">{goal.category}</td>
                      <td className="py-3.5 px-3 text-right font-mono text-zinc-450">{goal.baselineCarbon.toFixed(1)} t</td>
                      <td className="py-3.5 px-3 text-right font-mono text-emerald-400">{goal.targetCarbon.toFixed(1)} t</td>
                      <td className="py-3.5 px-3 text-right font-mono text-zinc-300">{goal.currentCarbon.toFixed(1)} t</td>
                      <td className="py-3.5 px-3 text-right font-mono text-emerald-500 font-bold">{goal.carbonSaved.toFixed(1)} t</td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-400">{goal.progressPercent}%</td>
                      <td className="py-3.5 px-3 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                          goal.status === 'Completed' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                            : goal.status === 'On Track'
                            ? 'bg-sky-500/10 text-sky-400 border-sky-500/25'
                            : goal.status === 'At Risk'
                            ? 'bg-rose-500/10 text-rose-455 border-rose-500/20'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${
                            goal.status === 'Completed' ? 'bg-emerald-500 animate-pulse' :
                            goal.status === 'On Track' ? 'bg-sky-500' :
                            goal.status === 'At Risk' ? 'bg-rose-500' : 'bg-zinc-500'
                          } shrink-0`} />
                          {goal.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex justify-end gap-2.5 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleInspectGoal(goal.id)}
                            className="p-1.5 hover:bg-[#18181b] hover:text-[#f4f4f5] rounded-lg text-zinc-500 transition-premium cursor-pointer"
                            title="View goal details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(goal)}
                            className="p-1.5 hover:bg-[#18181b] hover:text-[#f4f4f5] rounded-lg text-zinc-500 transition-premium cursor-pointer"
                            title="Edit target parameters"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleArchiveGoal(goal)}
                            className={`p-1.5 hover:bg-[#18181b] rounded-lg transition-premium cursor-pointer ${
                              goal.status === 'Archived' ? 'hover:text-emerald-450 text-zinc-500' : 'hover:text-rose-400 text-zinc-500'
                            }`}
                            title={goal.status === 'Archived' ? 'Restore Goal' : 'Archive Goal'}
                          >
                            {goal.status === 'Archived' ? <RotateCcw className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* CREATE & EDIT FORM MODAL */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transform scale-100 transition-all duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950">
              <h3 className="text-sm font-extrabold text-zinc-150 font-mono">
                {editingGoal ? `Modify Goal: "${editingGoal.name}"` : 'Create Sustainability Goal'}
              </h3>
              <button 
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <AlertCircle className="w-4 h-4" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-zinc-300">
              {formErrors.apiError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formErrors.apiError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1.5">Goal Objective Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Cut logistics gas emissions by 25%"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium"
                />
                {formErrors.name && <p className="text-[10px] text-rose-400 mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1.5">Goal Description</label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="Provide scope parameters, targeted initiatives, and planning references..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">Department Scope</label>
                  <select
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 transition-premium"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  {formErrors.departmentId && <p className="text-[10px] text-rose-400 mt-1">{formErrors.departmentId}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">Goal Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 transition-premium"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">Baseline Carbon (tCO2e)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="baselineCarbon"
                    placeholder="e.g. 500"
                    value={formData.baselineCarbon}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium"
                  />
                  {formErrors.baselineCarbon && <p className="text-[10px] text-rose-400 mt-1">{formErrors.baselineCarbon}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">Target Carbon (tCO2e)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="targetCarbon"
                    placeholder="e.g. 400 (Must be < Baseline)"
                    value={formData.targetCarbon}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium"
                  />
                  {formErrors.targetCarbon && <p className="text-[10px] text-rose-400 mt-1">{formErrors.targetCarbon}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 transition-premium"
                  />
                  {formErrors.startDate && <p className="text-[10px] text-rose-400 mt-1">{formErrors.startDate}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">Target Date</label>
                  <input
                    type="date"
                    name="targetDate"
                    value={formData.targetDate}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 transition-premium"
                  />
                  {formErrors.targetDate && <p className="text-[10px] text-rose-400 mt-1">{formErrors.targetDate}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 transition-premium"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">Goal Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 transition-premium"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="On Track">On Track</option>
                    <option value="At Risk">At Risk</option>
                    <option value="Completed">Completed</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">Goal Owner</label>
                  <input
                    type="text"
                    name="owner"
                    placeholder="e.g. Sarah Connor"
                    value={formData.owner}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium"
                  />
                  {formErrors.owner && <p className="text-[10px] text-rose-400 mt-1">{formErrors.owner}</p>}
                </div>
              </div>

              {/* Progress and Carbon saved calculated automatically notice */}
              <div className="p-3 bg-zinc-950/65 border border-zinc-850 rounded-xl flex items-start gap-2.5">
                <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-zinc-500 leading-relaxed">
                  <span className="font-bold text-zinc-400">Automatic Progress Calculations:</span> Progress %, current emissions, and carbon saved will be derived automatically from Carbon Transactions. Manual overriding is not supported to ensure historical audit trails are preserved.
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4.5 py-2.5 bg-[#18181b] hover:bg-[#27272a] text-zinc-400 hover:text-zinc-200 font-bold rounded-xl transition-premium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-[#09090b] font-extrabold rounded-xl transition-premium border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)] flex items-center gap-1.5 cursor-pointer"
                >
                  {formSubmitting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  {editingGoal ? 'Save Target Changes' : 'Establish Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILED GOAL INSPECTOR MODAL */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden transform scale-100 transition-all duration-300">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-zinc-800 bg-zinc-950 shrink-0">
              <div className="flex flex-col">
                <span className="text-[8.5px] font-mono tracking-widest text-zinc-550 uppercase">Strategic Planning Node &gt; Goal Detailed Audit</span>
                <h3 className="text-sm font-extrabold text-zinc-100 font-mono mt-0.5">
                  {detailData ? detailData.goal.name : 'Inspecting Target Objective...'}
                </h3>
              </div>
              <button 
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setDetailData(null);
                }}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <AlertCircle className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {detailLoading || !detailData ? (
                <div className="space-y-4 py-12 animate-pulse">
                  <div className="h-6 bg-zinc-950 rounded w-1/3 mx-auto"></div>
                  <div className="h-24 bg-zinc-950 rounded w-full"></div>
                  <div className="h-48 bg-zinc-950 rounded w-full"></div>
                </div>
              ) : (
                <div className="space-y-8 text-zinc-300">
                  
                  {/* Top Stats Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-[#141417]/40 border border-[#27272a]/20 p-4 rounded-2xl text-center">
                      <span className="text-[8.5px] text-zinc-500 font-bold block uppercase tracking-wider font-mono">Baseline Carbon</span>
                      <span className="text-lg font-bold font-mono text-zinc-100 mt-1 block">{detailData.goal.baselineCarbon.toFixed(1)} tCO2e</span>
                    </div>
                    <div className="bg-[#141417]/40 border border-[#27272a]/20 p-4 rounded-2xl text-center">
                      <span className="text-[8.5px] text-zinc-500 font-bold block uppercase tracking-wider font-mono">Current Carbon</span>
                      <span className="text-lg font-bold font-mono text-zinc-100 mt-1 block">{detailData.goal.currentCarbon.toFixed(1)} tCO2e</span>
                    </div>
                    <div className="bg-[#141417]/40 border border-[#27272a]/20 p-4 rounded-2xl text-center">
                      <span className="text-[8.5px] text-emerald-450 font-bold block uppercase tracking-wider font-mono">Target Carbon</span>
                      <span className="text-lg font-bold font-mono text-emerald-400 mt-1 block">{detailData.goal.targetCarbon.toFixed(1)} tCO2e</span>
                    </div>
                    <div className="bg-[#141417]/40 border border-[#27272a]/20 p-4 rounded-2xl text-center">
                      <span className="text-[8.5px] text-sky-400 font-bold block uppercase tracking-wider font-mono">Remaining Reduction</span>
                      <span className="text-lg font-bold font-mono text-sky-450 mt-1 block">{detailData.goal.remainingReduction.toFixed(1)} tCO2e</span>
                    </div>
                  </div>

                  {/* Split Section: General Info & Performance Math */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#141417]/30 border border-[#27272a]/20 p-5 rounded-2xl space-y-4">
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono border-b border-[#27272a]/20 pb-2">General Information</h4>
                      
                      <div className="grid grid-cols-2 gap-y-3.5 text-xs">
                        <div>
                          <span className="text-zinc-500 block text-[10px]">Department Scope</span>
                          <span className="text-zinc-200 font-semibold">{detailData.goal.department?.name}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[10px]">Priority / Owner</span>
                          <span className="text-zinc-200 font-semibold">{detailData.goal.priority} / {detailData.goal.owner}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[10px]">Start Date</span>
                          <span className="text-zinc-200 font-mono text-[11px]">{new Date(detailData.goal.startDate).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[10px]">Deadline Target Date</span>
                          <span className="text-zinc-200 font-mono text-[11px]">{new Date(detailData.goal.targetDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <span className="text-zinc-500 block text-[10px] mb-1">Target Description</span>
                        <p className="text-xs text-zinc-400 leading-relaxed bg-[#09090b]/40 border border-[#27272a]/10 p-3 rounded-xl">
                          {detailData.goal.description || 'No detailed planning description provided.'}
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#141417]/30 border border-[#27272a]/20 p-5 rounded-2xl space-y-4">
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono border-b border-[#27272a]/20 pb-2">Performance Metrics</h4>
                      
                      <div className="space-y-4 text-xs">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-zinc-500">Target Reduction Scope</span>
                            <span className="text-sky-400 font-bold">{detailData.goal.targetReduction.toFixed(1)} tCO2e</span>
                          </div>
                          <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-850">
                            <div className="bg-sky-500 h-full rounded-full" style={{ width: '100%' }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-zinc-500">Carbon Saved So Far</span>
                            <span className="text-emerald-400 font-bold">{detailData.goal.carbonSaved.toFixed(1)} tCO2e ({detailData.goal.progressPercent}%)</span>
                          </div>
                          <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-850">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${detailData.goal.progressPercent}%` }} />
                          </div>
                        </div>

                        <div className="p-3 bg-zinc-950/60 border border-zinc-850 rounded-xl space-y-1">
                          <span className="font-semibold text-zinc-400 text-[10px] block">Calculation Method Logics:</span>
                          <p className="text-[10px] text-zinc-500 leading-relaxed">
                            <span className="text-zinc-400">Carbon Saved</span> represents the positive variance between the Baseline benchmark and actual cumulative emissions recorded.
                            <br />
                            <code className="text-emerald-500 font-bold block mt-1">Progress % = (Carbon Saved / (Baseline - Target)) * 100</code>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recharts Trend Chart Section */}
                  {detailData.trend && detailData.trend.length > 0 && (
                    <div className="bg-[#141417]/30 border border-[#27272a]/20 p-5 rounded-2xl space-y-4">
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono border-b border-[#27272a]/20 pb-2">Monthly Carbon Emissions Trend</h4>
                      
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={detailData.trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25}/>
                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.3} />
                            <XAxis dataKey="month" stroke="#71717a" fontSize={9} tickLine={false} />
                            <YAxis stroke="#71717a" fontSize={9} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', fontSize: '11px', color: '#f4f4f5' }} />
                            <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                            <Area type="monotone" dataKey="emissions" name="Actual Emissions (tCO2e)" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorEmissions)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Milestones timeline section */}
                  {detailData.timeline && detailData.timeline.length > 0 && (
                    <div className="bg-[#141417]/30 border border-[#27272a]/20 p-5 rounded-2xl space-y-4">
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono border-b border-[#27272a]/20 pb-2">Progress Milestones Timeline</h4>
                      
                      <div className="relative pl-6 border-l border-zinc-800 space-y-6">
                        {detailData.timeline.map((milestone, idx) => (
                          <div key={idx} className="relative">
                            <span className={`absolute -left-[30px] top-1 w-2 h-2 rounded-full border ${milestone.completed ? 'bg-emerald-500 border-emerald-500' : 'bg-zinc-950 border-zinc-650'}`} />
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-zinc-200">{milestone.title}</span>
                                <span className="text-[9px] text-zinc-550 font-mono">{new Date(milestone.date).toLocaleDateString()}</span>
                              </div>
                              <p className="text-[11px] text-zinc-450">{milestone.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Related Carbon Transactions Section */}
                  <div className="bg-[#141417]/30 border border-[#27272a]/20 p-5 rounded-2xl space-y-4">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono border-b border-[#27272a]/20 pb-2">Related Carbon Transactions Ledger</h4>
                    
                    {detailData.relatedTransactions && detailData.relatedTransactions.length === 0 ? (
                      <p className="text-xs text-zinc-500 text-center py-4 font-mono italic">No Carbon Transactions have been logged for this category scope within the goal period.</p>
                    ) : (
                      <div className="overflow-x-auto max-h-60">
                        <table className="w-full text-left text-[11px] border-collapse">
                          <thead>
                            <tr className="border-b border-[#27272a]/45 text-zinc-500 font-mono font-bold uppercase tracking-wider select-none">
                              <th className="pb-2">Tx Number</th>
                              <th className="pb-2">Date</th>
                              <th className="pb-2">Operation/Activity</th>
                              <th className="pb-2 text-right">Quantity</th>
                              <th className="pb-2 text-right font-bold text-zinc-400">Carbon (tCO2e)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#27272a]/15 text-zinc-400">
                            {detailData.relatedTransactions.map((tx: any) => (
                              <tr key={tx.id} className="hover:bg-[#18181b]/35">
                                <td className="py-2 font-mono font-bold text-emerald-450">{tx.txId}</td>
                                <td className="py-2 font-mono">{new Date(tx.timestamp).toLocaleDateString()}</td>
                                <td className="py-2 truncate max-w-[200px]" title={tx.operation}>{tx.operation}</td>
                                <td className="py-2 text-right font-mono">{tx.quantity.toLocaleString()} {tx.unit}</td>
                                <td className="py-2 text-right font-mono font-bold text-rose-400">{tx.carbon.toFixed(3)} t</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-4 border-t border-zinc-800 bg-zinc-950 flex justify-end shrink-0">
              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setDetailData(null);
                }}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
