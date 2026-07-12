'use client';

import React, { useState, useMemo } from 'react';
import { 
  BarChart3, RefreshCw, CheckCircle2, ShieldAlert, Sparkles,
  Users2, Landmark, Gamepad2, Settings2, HelpCircle, ArrowRight,
  Plus, Search, Download, Edit2, Archive, Eye, RotateCcw, AlertCircle, FileText, Package, Target, BarChart2, FileSpreadsheet
} from 'lucide-react';
import { EmissionFactor } from '../types';
import Modal from './Modal';

interface FactorsManagerProps {
  initialFactors: EmissionFactor[];
}

export default function FactorsManager({ initialFactors }: FactorsManagerProps) {
  const [factors, setFactors] = useState<EmissionFactor[]>(initialFactors);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<'name' | 'category' | 'value'>('category');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // Selected factor for Detail View
  const [selectedFactor, setSelectedFactor] = useState<EmissionFactor | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Form State for Create/Edit Modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingFactor, setEditingFactor] = useState<EmissionFactor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    unit: '',
    value: '',
    source: '',
    version: '1.0.0',
    effectiveDate: new Date().toISOString().split('T')[0],
    description: '',
    status: 'ACTIVE' as 'ACTIVE' | 'ARCHIVED'
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchFactors = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch('/api/environment/factors');
      if (res.ok) {
        const freshFactors = await res.json();
        setFactors(freshFactors);
      }
    } catch (err) {
      triggerToast('Failed to poll emission factors', 'error');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Archive (Soft delete) Handler
  const handleArchiveFactor = async (factor: EmissionFactor) => {
    const isArchive = factor.status === 'ACTIVE';
    const actionLabel = isArchive ? 'archived' : 'activated';
    
    try {
      const res = await fetch(`/api/environment/factors/${factor.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: isArchive ? 'ARCHIVED' : 'ACTIVE' })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to toggle status');
      }

      triggerToast(`Emission factor "${factor.name}" ${actionLabel}!`);
      fetchFactors(true);
      if (selectedFactor?.id === factor.id) {
        setIsDetailModalOpen(false);
      }
    } catch (err: any) {
      triggerToast(err.message, 'error');
    }
  };

  // Open Form Modal for Creating
  const handleOpenCreate = () => {
    setEditingFactor(null);
    setFormData({
      name: '',
      category: '',
      subcategory: '',
      unit: '',
      value: '',
      source: '',
      version: '1.0.0',
      effectiveDate: new Date().toISOString().split('T')[0],
      description: '',
      status: 'ACTIVE'
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open Form Modal for Editing
  const handleOpenEdit = (factor: EmissionFactor) => {
    setEditingFactor(factor);
    setFormData({
      name: factor.name,
      category: factor.category,
      subcategory: factor.subcategory || '',
      unit: factor.unit,
      value: factor.value.toString(),
      source: factor.source,
      version: factor.version,
      effectiveDate: new Date(factor.effectiveDate).toISOString().split('T')[0],
      description: factor.description || '',
      status: factor.status
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Input Change Handler for Form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Form Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    if (!formData.category || formData.category.trim().length < 1) {
      errors.category = 'Category is required';
    }
    if (!formData.unit || formData.unit.trim().length < 1) {
      errors.unit = 'Unit is required (e.g. kWh, liters)';
    }
    if (!formData.value || isNaN(Number(formData.value)) || Number(formData.value) <= 0) {
      errors.value = 'CO2 Factor coefficient must be a positive number';
    }
    if (!formData.source || formData.source.trim().length < 2) {
      errors.source = 'Source reference is required';
    }
    if (!formData.version || formData.version.trim().length < 1) {
      errors.version = 'Version tag is required';
    }
    if (!formData.effectiveDate) {
      errors.effectiveDate = 'Effective date is required';
    }

    // Name uniqueness within database (checked client-side first on existing factors list)
    const normalizedName = formData.name.trim().toLowerCase();
    const isDuplicate = factors.some(
      f => f.name.toLowerCase() === normalizedName && f.id !== editingFactor?.id
    );
    if (isDuplicate) {
      errors.name = 'An emission factor with this name already exists.';
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
      ...formData,
      value: Number(formData.value),
      effectiveDate: new Date(formData.effectiveDate).toISOString()
    };

    try {
      const url = editingFactor 
        ? `/api/environment/factors/${editingFactor.id}` 
        : '/api/environment/factors';
      const method = editingFactor ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to submit form');
      }

      triggerToast(editingFactor ? 'Emission factor updated successfully' : 'Emission factor registered successfully');
      setIsFormModalOpen(false);
      fetchFactors(true);
    } catch (err: any) {
      setFormErrors({ apiError: err.message });
    } finally {
      setFormSubmitting(false);
    }
  };

  // Export Data Handler (Simulated Download)
  const handleExportFactors = (format: 'csv' | 'json') => {
    try {
      let dataStr = '';
      let filename = `ecosphere_emission_factors_${Date.now()}`;
      
      if (format === 'json') {
        dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredFactors, null, 2));
        filename += '.json';
      } else {
        // Build CSV columns
        const headers = 'ID,Name,Category,Subcategory,Unit,CO2_Factor,Source,Version,Effective_Date,Status\n';
        const rows = filteredFactors.map(f => (
          `"${f.id}","${f.name}","${f.category}","${f.subcategory || ''}","${f.unit}",${f.value},"${f.source}","${f.version}","${new Date(f.effectiveDate).toLocaleDateString()}",${f.status}`
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
      triggerToast(`Factors list exported in ${format.toUpperCase()} format!`);
    } catch (err) {
      triggerToast('Export failed', 'error');
    }
  };

  // Inspect detail view
  const handleInspectFactor = async (factor: EmissionFactor) => {
    try {
      const res = await fetch(`/api/environment/factors/${factor.id}`);
      if (res.ok) {
        const fullDetails = await res.json();
        setSelectedFactor(fullDetails);
      } else {
        setSelectedFactor(factor); // Fallback to list details
      }
    } catch (err) {
      setSelectedFactor(factor);
    }
    setIsDetailModalOpen(true);
  };

  // Categories list for filter dropdown
  const categoriesList = useMemo(() => {
    return Array.from(new Set(factors.map(f => f.category)));
  }, [factors]);

  // Search & Filter & Sort Pipeline
  const filteredFactors = useMemo(() => {
    return factors.filter(f => {
      const matchesSearch = 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.subcategory && f.subcategory.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = categoryFilter === 'all' || f.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || f.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [factors, searchQuery, categoryFilter, statusFilter]);

  const sortedFactors = useMemo(() => {
    const sorted = [...filteredFactors];
    sorted.sort((a, b) => {
      let aField = a[sortField];
      let bField = b[sortField];

      // Handle strings
      if (typeof aField === 'string' && typeof bField === 'string') {
        return sortOrder === 'asc' 
          ? aField.localeCompare(bField) 
          : bField.localeCompare(aField);
      }
      // Handle numbers
      if (typeof aField === 'number' && typeof bField === 'number') {
        return sortOrder === 'asc' ? aField - bField : bField - aField;
      }
      return 0;
    });
    return sorted;
  }, [filteredFactors, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedFactors.length / ITEMS_PER_PAGE);
  const paginatedFactors = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedFactors.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedFactors, currentPage]);

  const handleSort = (field: 'name' | 'category' | 'value') => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
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
              className="flex items-center gap-3 px-3 py-2 text-emerald-450 border border-transparent rounded-lg text-xs font-semibold relative transition-premium group"
            >
              <span className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-emerald-500 rounded-full" />
              <Settings2 className="w-4 h-4 text-emerald-400" />
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
            
            <div className="pt-6 pb-2 px-3 text-[8.5px] uppercase font-bold tracking-widest text-zinc-500">
              Other Systems
            </div>

            <div className="flex items-center justify-between px-3 py-2 text-zinc-500 rounded-lg text-xs font-medium cursor-not-allowed border border-transparent">
              <span className="flex items-center gap-3">
                <Users2 className="w-4 h-4 text-zinc-650" />
                Social System
              </span>
              <span className="text-[7.5px] bg-[#18181b] text-zinc-600 px-1.5 py-0.5 rounded font-mono font-bold uppercase">Locked</span>
            </div>

            <div className="flex items-center justify-between px-3 py-2 text-zinc-500 rounded-lg text-xs font-medium cursor-not-allowed border border-transparent">
              <span className="flex items-center gap-3">
                <Landmark className="w-4 h-4 text-zinc-650" />
                Governance System
              </span>
              <span className="text-[7.5px] bg-[#18181b] text-zinc-600 px-1.5 py-0.5 rounded font-mono font-bold uppercase">Locked</span>
            </div>

            <div className="flex items-center justify-between px-3 py-2 text-zinc-500 rounded-lg text-xs font-medium cursor-not-allowed border border-transparent">
              <span className="flex items-center gap-3">
                <Gamepad2 className="w-4 h-4 text-zinc-650" />
                Gamification System
              </span>
              <span className="text-[7.5px] bg-[#18181b] text-zinc-600 px-1.5 py-0.5 rounded font-mono font-bold uppercase">Locked</span>
            </div>
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
            <span className="text-[8.5px] font-mono tracking-widest text-zinc-550 uppercase">Environmental Node &gt; Coefficients</span>
            <h1 className="text-sm font-extrabold text-[#f4f4f5] tracking-tight -mt-0.5 font-mono">Emission Factors Management</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchFactors()}
              disabled={loading}
              className="p-2 rounded-lg bg-[#18181b] hover:bg-[#27272a] text-zinc-400 hover:text-[#f4f4f5] border border-[#27272a]/40 transition-premium disabled:opacity-40"
              title="Poll emission factors"
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

          {/* Intro Description */}
          <div className="bg-[#141417]/50 border border-[#27272a]/30 rounded-2xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1.5">
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 rounded text-[8.5px] font-bold uppercase tracking-widest">
                  Environmental Core System
                </span>
                <h2 className="text-base font-bold text-[#f4f4f5]">Carbon Conversion Coefficients Registry</h2>
                <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                  These factors represent values defining how operational activities convert raw consumption metrics (kWh, liters, miles) into metric tons of CO₂ equivalent (tCO2e).
                </p>
              </div>

              <button
                onClick={handleOpenCreate}
                className="flex items-center gap-1.5 px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-[#09090b] text-xs font-bold rounded-xl transition-premium border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)] shrink-0"
              >
                <Plus className="w-4 h-4 shrink-0" />
                Add Emission Factor
              </button>
            </div>
          </div>

          {/* Filters Dashboard */}
          <div className="bg-[#141417]/50 border border-[#27272a]/30 rounded-2xl p-4.5 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <Search className="w-3.5 h-3.5 text-zinc-550 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search name, subcategory..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9.5 pr-4 py-2 bg-[#09090b]/80 border border-[#27272a]/20 rounded-xl text-xs text-[#f4f4f5] placeholder-zinc-505 focus:outline-none focus:border-zinc-700 transition-premium w-full md:w-60"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3.5 py-2 bg-[#09090b]/80 border border-[#27272a]/20 rounded-xl text-xs text-zinc-305 focus:outline-none cursor-pointer hover:border-zinc-700 transition-premium"
              >
                <option value="all">All Categories</option>
                {categoriesList.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3.5 py-2 bg-[#09090b]/80 border border-[#27272a]/20 rounded-xl text-xs text-zinc-305 focus:outline-none cursor-pointer hover:border-zinc-700 transition-premium"
              >
                <option value="all">All Statuses</option>
                <option value="ACTIVE">Active Only</option>
                <option value="ARCHIVED">Archived Only</option>
              </select>
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => handleExportFactors('csv')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#18181b] border border-[#27272a]/30 hover:bg-[#27272a] text-zinc-200 text-xs font-bold rounded-xl transition-premium cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
              <button
                onClick={() => handleExportFactors('json')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#18181b] border border-[#27272a]/30 hover:bg-[#27272a] text-zinc-200 text-xs font-bold rounded-xl transition-premium cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export JSON
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-[#141417]/50 border border-[#27272a]/30 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
            {loading ? (
              <div className="space-y-4 py-8 animate-pulse">
                <div className="h-8 bg-[#09090b] rounded w-full"></div>
                <div className="h-8 bg-[#09090b] rounded w-full"></div>
                <div className="h-8 bg-[#09090b] rounded w-full"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#1f1f23]/40 text-zinc-500 text-[9px] font-bold uppercase tracking-widest font-mono select-none">
                      <th className="pb-3.5 px-3 cursor-pointer hover:text-zinc-300" onClick={() => handleSort('name')}>
                        Name {sortField === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                      </th>
                      <th className="pb-3.5 px-3 cursor-pointer hover:text-zinc-300" onClick={() => handleSort('category')}>
                        Category / Sub {sortField === 'category' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                      </th>
                      <th className="pb-3.5 px-3">Unit</th>
                      <th className="pb-3.5 px-3 text-right cursor-pointer hover:text-zinc-300" onClick={() => handleSort('value')}>
                        CO₂ Coefficient {sortField === 'value' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                      </th>
                      <th className="pb-3.5 px-3">Source reference</th>
                      <th className="pb-3.5 px-3 font-mono text-center">Version</th>
                      <th className="pb-3.5 px-3 text-center">Status</th>
                      <th className="pb-3.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f1f23]/20 text-xs text-zinc-300">
                    {paginatedFactors.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-zinc-500 font-medium">
                          No emission factors matched the criteria.
                        </td>
                      </tr>
                    ) : (
                      paginatedFactors.map((factor) => (
                        <tr key={factor.id} className="hover:bg-[#18181b]/35 transition-premium group">
                          <td className="py-3.5 px-3">
                            <span 
                              onClick={() => handleInspectFactor(factor)}
                              className="font-bold text-zinc-200 cursor-pointer hover:text-emerald-450 hover:underline transition-colors"
                            >
                              {factor.name}
                            </span>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="font-semibold text-zinc-200 block">{factor.category}</span>
                            <span className="text-[9.5px] text-zinc-550 block font-mono">{factor.subcategory || 'Generic'}</span>
                          </td>
                          <td className="py-3.5 px-3 font-mono text-zinc-450">{factor.unit}</td>
                          <td className="py-3.5 px-3 text-right font-mono text-[#f4f4f5] font-extrabold text-[12.5px]">
                            {factor.value.toFixed(4)}
                          </td>
                          <td className="py-3.5 px-3 text-zinc-500 font-medium max-w-[200px] truncate" title={factor.source}>
                            {factor.source}
                          </td>
                          <td className="py-3.5 px-3 text-center font-mono text-[10px] text-zinc-500">
                            {factor.version}
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[8.5px] font-bold border ${
                              factor.status === 'ACTIVE' 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                                : 'bg-[#18181b] text-zinc-505 border-zinc-800'
                            }`}>
                              <span className={`w-1 h-1 rounded-full ${factor.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-700'} shrink-0`} />
                              {factor.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <div className="flex justify-end gap-2.5 opacity-80 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleInspectFactor(factor)}
                                className="p-1.5 hover:bg-[#18181b] hover:text-[#f4f4f5] rounded-lg text-zinc-500 transition-premium"
                                title="View details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleOpenEdit(factor)}
                                className="p-1.5 hover:bg-[#18181b] hover:text-[#f4f4f5] rounded-lg text-zinc-500 transition-premium"
                                title="Edit properties"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleArchiveFactor(factor)}
                                className={`p-1.5 hover:bg-[#18181b] rounded-lg transition-premium ${
                                  factor.status === 'ACTIVE' ? 'hover:text-rose-400 text-zinc-500' : 'hover:text-emerald-400 text-zinc-500'
                                }`}
                                title={factor.status === 'ACTIVE' ? 'Archive factor' : 'Activate factor'}
                              >
                                {factor.status === 'ACTIVE' ? <Archive className="w-3.5 h-3.5" /> : <RotateCcw className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-5 pt-4 border-t border-[#1f1f23]/40 text-xs">
                <span className="text-zinc-500 font-medium">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredFactors.length)} of {filteredFactors.length} entries
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3.5 py-1.5 bg-[#18181b] border border-[#27272a]/30 hover:bg-[#27272a] disabled:opacity-30 disabled:hover:bg-[#18181b] text-zinc-300 rounded-xl text-[11px] font-bold transition-premium cursor-pointer"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1.5 font-bold text-zinc-400 font-mono">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3.5 py-1.5 bg-[#18181b] border border-[#27272a]/30 hover:bg-[#27272a] disabled:opacity-30 disabled:hover:bg-[#18181b] text-zinc-300 rounded-xl text-[11px] font-bold transition-premium cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* CREATE & EDIT FORM MODAL */}
      <Modal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)} 
        title={editingFactor ? `Edit "${editingFactor.name}"` : 'Register Emission Factor'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formErrors.apiError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formErrors.apiError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-1.5">Factor Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Diesel Fuel Type II"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium"
            />
            {formErrors.name && <p className="text-[10px] text-rose-400 mt-1">{formErrors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Category</label>
              <input
                type="text"
                name="category"
                placeholder="e.g. Fuel, Material, Electricity"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium"
              />
              {formErrors.category && <p className="text-[10px] text-rose-400 mt-1">{formErrors.category}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Subcategory</label>
              <input
                type="text"
                name="subcategory"
                placeholder="e.g. Mobile Combustion"
                value={formData.subcategory}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Unit (Conversion Input)</label>
              <input
                type="text"
                name="unit"
                placeholder="e.g. kWh, liters, kg"
                value={formData.unit}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium"
              />
              {formErrors.unit && <p className="text-[10px] text-rose-400 mt-1">{formErrors.unit}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">CO₂ Factor (tCO2e per Unit)</label>
              <input
                type="text"
                name="value"
                placeholder="e.g. 0.00268"
                value={formData.value}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium"
              />
              {formErrors.value && <p className="text-[10px] text-rose-400 mt-1">{formErrors.value}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Source Registry reference</label>
              <input
                type="text"
                name="source"
                placeholder="e.g. EPA Hub 2025"
                value={formData.source}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium"
              />
              {formErrors.source && <p className="text-[10px] text-rose-400 mt-1">{formErrors.source}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Version</label>
              <input
                type="text"
                name="version"
                placeholder="e.g. 1.0.0"
                value={formData.version}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium"
              />
              {formErrors.version && <p className="text-[10px] text-rose-400 mt-1">{formErrors.version}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Effective Date</label>
              <input
                type="date"
                name="effectiveDate"
                value={formData.effectiveDate}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-305 focus:outline-none focus:border-emerald-500 transition-premium"
              />
              {formErrors.effectiveDate && <p className="text-[10px] text-rose-400 mt-1">{formErrors.effectiveDate}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Default Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-305 focus:outline-none focus:border-emerald-500 cursor-pointer transition-premium"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-1.5">Coefficient Description</label>
            <textarea
              name="description"
              placeholder="Provide carbon audit scope notes or mapping conditions..."
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-850">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="px-4.5 py-2.5 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formSubmitting}
              className="flex items-center gap-1.5 px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-[#09090b] text-xs font-bold rounded-xl transition-premium"
            >
              {formSubmitting ? 'Submitting...' : (editingFactor ? 'Save Changes' : 'Register Factor')}
            </button>
          </div>
        </form>
      </Modal>

      {/* DETAILS VIEW INSPECT MODAL */}
      <Modal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        title="Emission Factor Specifications"
      >
        {selectedFactor && (
          <div className="space-y-5">
            {/* Header Identity */}
            <div className="bg-[#09090b]/80 border border-[#27272a]/20 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[8px] text-zinc-500 font-mono tracking-wider block uppercase">NAME</span>
                <span className="text-sm font-bold text-zinc-100">{selectedFactor.name}</span>
              </div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[8.5px] font-bold border uppercase tracking-wider ${
                selectedFactor.status === 'ACTIVE' 
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                  : 'text-zinc-505 bg-zinc-800/40 border-zinc-700/30'
              }`}>
                {selectedFactor.status}
              </span>
            </div>

            {/* Matrix Metadata grid */}
            <div className="grid grid-cols-2 gap-4.5 border-y border-[#1f1f23]/40 py-4.5">
              <div>
                <span className="text-[8.5px] text-zinc-550 font-bold block uppercase">Category</span>
                <span className="text-xs font-semibold text-zinc-300">{selectedFactor.category}</span>
              </div>
              <div>
                <span className="text-[8.5px] text-zinc-550 font-bold block uppercase">Subcategory</span>
                <span className="text-xs font-semibold text-zinc-300">{selectedFactor.subcategory || 'Generic'}</span>
              </div>
              <div>
                <span className="text-[8.5px] text-zinc-550 font-bold block uppercase">Source unit</span>
                <span className="text-xs font-semibold text-zinc-300 font-mono">{selectedFactor.unit}</span>
              </div>
              <div>
                <span className="text-[8.5px] text-zinc-550 font-bold block uppercase">CO₂ Coefficient Factor</span>
                <span className="text-sm font-black text-emerald-405 font-mono">
                  {selectedFactor.value} <span className="text-[9px] font-normal text-zinc-500">tCO2e/{selectedFactor.unit}</span>
                </span>
              </div>
              <div>
                <span className="text-[8.5px] text-zinc-550 font-bold block uppercase">Effective Date</span>
                <span className="text-xs font-semibold text-zinc-300 font-mono">
                  {new Date(selectedFactor.effectiveDate).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-[8.5px] text-zinc-550 font-bold block uppercase">Coefficient Version</span>
                <span className="text-xs font-semibold text-zinc-300 font-mono">{selectedFactor.version}</span>
              </div>
            </div>

            {/* Source Reference Block */}
            <div className="bg-[#09090b]/40 border border-[#27272a]/15 p-3 rounded-xl">
              <span className="text-[8.5px] text-zinc-550 font-bold block uppercase mb-1">Source reference</span>
              <span className="text-xs text-zinc-400 font-medium leading-relaxed block">{selectedFactor.source}</span>
            </div>

            {/* Description Scope */}
            {selectedFactor.description && (
              <div className="space-y-1">
                <span className="text-[8.5px] text-zinc-550 font-bold block uppercase">Coefficient Scope Notes</span>
                <p className="text-xs text-zinc-400 leading-relaxed font-medium bg-[#09090b]/20 p-3 rounded-xl border border-[#27272a]/10">
                  {selectedFactor.description}
                </p>
              </div>
            )}

            {/* Foward Relations Placeholders */}
            <div className="pt-4 border-t border-[#1f1f23]/40 space-y-3.5">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-[9.5px] text-zinc-200 font-bold uppercase tracking-widest font-mono flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-zinc-500" />
                    Linked Carbon Transactions
                  </span>
                  <span className="text-[10px] font-bold text-zinc-500 bg-[#09090b] px-2 py-0.5 border border-[#27272a]/30 rounded font-mono">
                    {(selectedFactor as any)._count?.transactions || 0} Records
                  </span>
                </div>
                <p className="text-[9.5px] text-zinc-500 leading-normal mt-1">
                  Active entries linking this conversion coefficient in environmental audits. Existing historical ledger records remain valid if this coefficient is archived.
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <span className="text-[9.5px] text-zinc-200 font-bold uppercase tracking-widest font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
                    Linked Products / Scopes
                  </span>
                  <span className="text-[10px] font-bold text-zinc-505 bg-[#09090b] px-2 py-0.5 border border-[#27272a]/30 rounded font-mono">
                    0 mapped
                  </span>
                </div>
                <p className="text-[9.5px] text-zinc-500 leading-normal mt-1">
                  Products in catalog mapping their manufacturing raw carbon footprints to this conversion coefficient.
                </p>
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[#1f1f23]/40">
              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  handleOpenEdit(selectedFactor);
                }}
                className="px-4.5 py-2.5 bg-zinc-850 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit Specifications
              </button>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-[#09090b] text-xs font-bold rounded-xl transition-premium"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
