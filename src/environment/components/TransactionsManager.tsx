'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, RefreshCw, CheckCircle2, ShieldAlert, Sparkles,
  Users2, Landmark, Gamepad2, Settings2, HelpCircle, ArrowRight,
  Plus, Search, Download, Edit2, Archive, Eye, RotateCcw, AlertCircle, FileText, Package, Database, Calendar, Target, BarChart2, FileSpreadsheet, Trophy
} from 'lucide-react';
import { Department, ProductESGProfile, EmissionFactor } from '../types';
import Modal from './Modal';

// Extend carbon transaction interface locally for display
interface FullCarbonTransaction {
  id: string;
  txId: string;
  timestamp: string | Date;
  departmentId: string;
  department: Department;
  source: string;
  productId?: string | null;
  productProfile?: ProductESGProfile | null;
  product: string;
  operation: string;
  emissionFactorId?: string | null;
  emissionFactor?: EmissionFactor | null;
  quantity: number;
  unit: string;
  factorValue: number;
  carbon: number;
  formula: string;
  createdBy: string;
  status: string;
  notes?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface TransactionsManagerProps {
  departments: Department[];
  activeProducts: ProductESGProfile[];
  activeFactors: EmissionFactor[];
}

export default function TransactionsManager({ departments, activeProducts, activeFactors }: TransactionsManagerProps) {
  const [transactions, setTransactions] = useState<FullCarbonTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Combinable Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Sorting & Pagination
  const [sortField, setSortField] = useState<'timestamp' | 'carbon' | 'quantity'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Selected Transaction for Detail Inspector
  const [selectedTx, setSelectedTx] = useState<FullCarbonTransaction | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Form State for Create/Edit Modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<FullCarbonTransaction | null>(null);
  const [formData, setFormData] = useState({
    timestamp: '',
    departmentId: '',
    source: 'Manual Entry',
    productId: '',
    product: '',
    operation: '',
    emissionFactorId: '',
    quantity: '',
    notes: '',
    status: 'Verified' as 'Draft' | 'Calculated' | 'Verified' | 'Archived',
    createdBy: 'System'
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchTransactions = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search: searchQuery,
        departmentId: deptFilter,
        source: sourceFilter,
        productId: productFilter,
        category: categoryFilter,
        status: statusFilter,
        startDate,
        endDate,
        sortField,
        sortOrder,
        page: '1',
        limit: '1000' // Get all to paginate locally for smooth client experience
      });

      const res = await fetch(`/api/environment/transactions?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
      }
    } catch (err) {
      triggerToast('Failed to sync transactions', 'error');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Trigger sync on filter/sort changes
  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deptFilter, sourceFilter, productFilter, categoryFilter, statusFilter, startDate, endDate, sortField, sortOrder]);

  // Handle Search Input Debounce/Triggers
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTransactions();
  };

  // Archive / Toggle Status Handler
  const handleArchiveTx = async (tx: FullCarbonTransaction) => {
    const isArchived = tx.status === 'Archived';
    const actionLabel = isArchived ? 'restored' : 'archived';
    
    try {
      const res = await fetch(`/api/environment/transactions/${tx.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: isArchived ? 'Verified' : 'Archived' })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to toggle status');
      }

      triggerToast(`Transaction ${tx.txId} successfully ${actionLabel}!`);
      fetchTransactions(true);
      if (selectedTx?.id === tx.id) {
        setIsDetailModalOpen(false);
      }
    } catch (err: any) {
      triggerToast(err.message, 'error');
    }
  };

  // Real-time calculation helper
  const liveCalculation = useMemo(() => {
    const qty = parseFloat(formData.quantity);
    const factorId = formData.emissionFactorId;
    
    if (isNaN(qty) || qty <= 0 || !factorId) {
      return { carbon: 0, unit: '', formula: 'Pending inputs...' };
    }

    const factor = activeFactors.find(f => f.id === factorId);
    if (!factor) {
      return { carbon: 0, unit: '', formula: 'Emission Factor not found' };
    }

    const carbon = parseFloat((qty * factor.value).toFixed(4));
    return {
      carbon,
      unit: factor.unit,
      formula: `Quantity (${qty} ${factor.unit}) × Factor (${factor.value} tCO2e/${factor.unit})`
    };
  }, [formData.quantity, formData.emissionFactorId, activeFactors]);

  // Open Form Modal for Creating
  const handleOpenCreate = () => {
    setEditingTx(null);
    setFormData({
      timestamp: new Date().toISOString().split('T')[0],
      departmentId: departments[0]?.id || '',
      source: 'Manual Entry',
      productId: '',
      product: '',
      operation: '',
      emissionFactorId: activeFactors[0]?.id || '',
      quantity: '',
      notes: '',
      status: 'Verified',
      createdBy: 'System'
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open Form Modal for Editing
  const handleOpenEdit = (tx: FullCarbonTransaction) => {
    setEditingTx(tx);
    setFormData({
      timestamp: new Date(tx.timestamp).toISOString().split('T')[0],
      departmentId: tx.departmentId,
      source: tx.source as any,
      productId: tx.productId || '',
      product: tx.product,
      operation: tx.operation,
      emissionFactorId: tx.emissionFactorId || '',
      quantity: tx.quantity.toString(),
      notes: tx.notes || '',
      status: tx.status as any,
      createdBy: tx.createdBy
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Input Change Handler for Form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const updated = { ...prev, [name]: value };

      // Autofill product display name or select active factor unit if needed
      if (name === 'productId') {
        const prod = activeProducts.find(p => p.id === value);
        updated.product = prod ? prod.name : '';
      }
      
      return updated;
    });

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Form Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.timestamp) {
      errors.timestamp = 'Date is required';
    }
    if (!formData.departmentId) {
      errors.departmentId = 'Department is required';
    }
    if (!formData.operation || formData.operation.trim().length < 3) {
      errors.operation = 'Operational activity description must be at least 3 characters';
    }
    if (!formData.emissionFactorId) {
      errors.emissionFactorId = 'An active emission factor is required';
    }
    
    const qty = parseFloat(formData.quantity);
    if (formData.quantity === '' || isNaN(qty) || qty <= 0) {
      errors.quantity = 'Quantity must be a positive number greater than zero';
    }

    if (!formData.product || formData.product.trim().length < 1) {
      errors.product = 'Product identifier name is required';
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
      timestamp: new Date(formData.timestamp),
      departmentId: formData.departmentId,
      source: formData.source,
      productId: formData.productId || null,
      product: formData.product.trim(),
      operation: formData.operation.trim(),
      emissionFactorId: formData.emissionFactorId,
      quantity: parseFloat(formData.quantity),
      notes: formData.notes || null,
      status: formData.status,
      createdBy: formData.createdBy || 'System'
    };

    try {
      const url = editingTx 
        ? `/api/environment/transactions/${editingTx.id}` 
        : '/api/environment/transactions';
      const method = editingTx ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save transaction');
      }

      triggerToast(editingTx ? 'Transaction updated successfully' : 'Transaction created successfully');
      setIsFormModalOpen(false);
      fetchTransactions(true);
    } catch (err: any) {
      setFormErrors({ apiError: err.message });
    } finally {
      setFormSubmitting(false);
    }
  };

  // Export Data Handler
  const handleExportTransactions = (format: 'csv' | 'json') => {
    try {
      let dataStr = '';
      let filename = `ecosphere_carbon_ledger_${Date.now()}`;
      
      if (format === 'json') {
        dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(transactions, null, 2));
        filename += '.json';
      } else {
        const headers = 'TransactionNumber,Date,Department,Source,Product,Qty,Unit,FactorVal,CarbonEmission,Formula,Status\n';
        const rows = transactions.map(t => (
          `"${t.txId}","${new Date(t.timestamp).toLocaleDateString()}","${t.department?.name}","${t.source}","${t.product}",${t.quantity},"${t.unit}",${t.factorValue},${t.carbon},"${t.formula}","${t.status}"`
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
      triggerToast(`Ledger exported in ${format.toUpperCase()} format!`);
    } catch (err) {
      triggerToast('Export failed', 'error');
    }
  };

  // Inspect detail view
  const handleInspectTx = async (tx: FullCarbonTransaction) => {
    setSelectedTx(tx);
    setIsDetailModalOpen(true);
  };

  // Emission categories for filters
  const emissionCategories = useMemo(() => {
    return Array.from(new Set(activeFactors.map(f => f.category)));
  }, [activeFactors]);

  // Sort and pagination pipeline
  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return transactions.slice(start, start + ITEMS_PER_PAGE);
  }, [transactions, currentPage]);

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
              className="flex items-center gap-3 px-3 py-2 text-emerald-450 border border-transparent rounded-lg text-xs font-semibold relative transition-premium group animate-fade-in"
            >
              <span className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-emerald-500 rounded-full" />
              <FileText className="w-4 h-4 text-emerald-450" />
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

            <a 
              href="/gamification" 
              className="flex items-center gap-3 px-3 py-2 text-zinc-400 border border-transparent rounded-lg text-xs font-semibold relative transition-premium group hover:bg-zinc-900/10 hover:text-[#f4f4f5]"
            >
              <Trophy className="w-4 h-4 text-zinc-400 group-hover:text-[#f4f4f5] transition-colors" />
              Gamification Hub
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
            <span className="text-[8.5px] font-mono tracking-widest text-zinc-550 uppercase">Environmental Node &gt; Transactions</span>
            <h1 className="text-sm font-extrabold text-[#f4f4f5] tracking-tight -mt-0.5 font-mono">Carbon Transactions Ledger</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchTransactions()}
              disabled={loading}
              className="p-2 rounded-lg bg-[#18181b] hover:bg-[#27272a] text-zinc-400 hover:text-[#f4f4f5] border border-[#27272a]/40 transition-premium disabled:opacity-40"
              title="Poll carbon ledger"
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
                  Transactional Backbone
                </span>
                <h2 className="text-base font-bold text-[#f4f4f5]">Carbon Ledger Core Engine</h2>
                <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                  Monitor, calculate, and audit Scope 1, Scope 2, and Scope 3 carbon emission occurrences. All metrics represent static snapshots at calculation time to preserve historical integrity.
                </p>
              </div>

              <button
                onClick={handleOpenCreate}
                className="flex items-center gap-1.5 px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-[#09090b] text-xs font-bold rounded-xl transition-premium border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)] shrink-0"
              >
                <Plus className="w-4 h-4 shrink-0" />
                Add Manual Transaction
              </button>
            </div>
          </div>

          {/* Combinable Advanced Filters Panel */}
          <div className="bg-[#141417]/50 border border-[#27272a]/30 rounded-2xl p-4.5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#27272a]/20 pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-450 font-bold">Combinable Ledger Filters</span>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setDeptFilter('all');
                  setSourceFilter('all');
                  setProductFilter('all');
                  setCategoryFilter('all');
                  setStatusFilter('all');
                  setStartDate('');
                  setEndDate('');
                }}
                className="text-[10px] text-zinc-500 hover:text-zinc-300 font-semibold transition-colors"
              >
                Reset All Filters
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-550 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Tx Num, activity, notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#09090b]/80 border border-[#27272a]/20 rounded-xl text-xs text-[#f4f4f5] placeholder-zinc-505 focus:outline-none focus:border-zinc-700 transition-premium"
                />
              </div>

              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="w-full px-3 py-2 bg-[#09090b]/80 border border-[#27272a]/20 rounded-xl text-xs text-zinc-305 focus:outline-none cursor-pointer hover:border-zinc-700 transition-premium"
              >
                <option value="all">All Departments</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>

              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="w-full px-3 py-2 bg-[#09090b]/80 border border-[#27272a]/20 rounded-xl text-xs text-zinc-305 focus:outline-none cursor-pointer hover:border-zinc-700 transition-premium"
              >
                <option value="all">All Transaction Sources</option>
                <option value="Purchase">Purchase</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Fleet">Fleet</option>
                <option value="Electricity">Electricity</option>
                <option value="Business Travel">Business Travel</option>
                <option value="Waste Management">Waste Management</option>
                <option value="Manual Entry">Manual Entry</option>
              </select>

              <select
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="w-full px-3 py-2 bg-[#09090b]/80 border border-[#27272a]/20 rounded-xl text-xs text-zinc-305 focus:outline-none cursor-pointer hover:border-zinc-700 transition-premium"
              >
                <option value="all">All Products</option>
                {activeProducts.map(p => (
                  <option key={p.id} value={p.id}>{p.name} [{p.code}]</option>
                ))}
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 bg-[#09090b]/80 border border-[#27272a]/20 rounded-xl text-xs text-zinc-305 focus:outline-none cursor-pointer hover:border-zinc-700 transition-premium"
              >
                <option value="all">All Factor Categories</option>
                {emissionCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-[#09090b]/80 border border-[#27272a]/20 rounded-xl text-xs text-zinc-305 focus:outline-none cursor-pointer hover:border-zinc-700 transition-premium"
              >
                <option value="all">All Statuses</option>
                <option value="Draft">Draft</option>
                <option value="Calculated">Calculated</option>
                <option value="Verified">Verified</option>
                <option value="Archived">Archived</option>
              </select>

              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-2 py-1.5 bg-[#09090b]/80 border border-[#27272a]/20 rounded-xl text-[10px] text-zinc-300 focus:outline-none hover:border-zinc-700 transition-premium"
                  title="Start Date"
                />
                <span className="text-[10px] text-zinc-550">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-2 py-1.5 bg-[#09090b]/80 border border-[#27272a]/20 rounded-xl text-[10px] text-zinc-300 focus:outline-none hover:border-zinc-700 transition-premium"
                  title="End Date"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-zinc-200 text-xs font-semibold py-2 rounded-xl transition-premium cursor-pointer"
                >
                  Apply Filters
                </button>
                <button
                  type="button"
                  onClick={() => handleExportTransactions('csv')}
                  className="px-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 rounded-xl text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                  title="Export CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Data Table */}
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
                      <th className="pb-3.5 px-3">Tx Number</th>
                      <th className="pb-3.5 px-3 cursor-pointer hover:text-zinc-300" onClick={() => setSortField('timestamp')}>
                        Date {sortField === 'timestamp' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                      </th>
                      <th className="pb-3.5 px-3">Department</th>
                      <th className="pb-3.5 px-3">Source</th>
                      <th className="pb-3.5 px-3">Product Name</th>
                      <th className="pb-3.5 px-3 text-right cursor-pointer hover:text-zinc-300" onClick={() => setSortField('quantity')}>
                        Quantity {sortField === 'quantity' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                      </th>
                      <th className="pb-3.5 px-3">Unit</th>
                      <th className="pb-3.5 px-3">Emission Factor</th>
                      <th className="pb-3.5 px-3 text-right cursor-pointer hover:text-zinc-300" onClick={() => setSortField('carbon')}>
                        Calculated carbon {sortField === 'carbon' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                      </th>
                      <th className="pb-3.5 px-3 text-center">Status</th>
                      <th className="pb-3.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f1f23]/20 text-xs text-zinc-300">
                    {paginatedTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="py-12 text-center text-zinc-500 font-medium">
                          No transactions found matching the selected filters.
                        </td>
                      </tr>
                    ) : (
                      paginatedTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-[#18181b]/35 transition-premium group">
                          <td className="py-3.5 px-3 font-mono font-bold text-emerald-450">{tx.txId}</td>
                          <td className="py-3.5 px-3 text-zinc-450 font-mono text-[11px]">
                            {new Date(tx.timestamp).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 px-3 font-semibold text-zinc-200">{tx.department?.name}</td>
                          <td className="py-3.5 px-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${
                              tx.source === 'Manual Entry'
                                ? 'bg-amber-500/5 text-amber-400 border-amber-500/10'
                                : 'bg-[#18181b] text-zinc-400 border-zinc-800'
                            }`}>
                              {tx.source}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-medium text-zinc-300">{tx.product}</td>
                          <td className="py-3.5 px-3 text-right font-mono font-bold">{tx.quantity.toLocaleString()}</td>
                          <td className="py-3.5 px-3 font-mono text-[11px] text-zinc-550">{tx.unit}</td>
                          <td className="py-3.5 px-3 text-zinc-400">
                            {tx.emissionFactor ? (
                              <div>
                                <span className="font-semibold block text-[11px]">{tx.emissionFactor.name}</span>
                                <span className="text-[9px] text-zinc-500 font-mono">Scope Category: {tx.emissionFactor.category}</span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-zinc-650 italic">Unlinked Factor</span>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-right text-emerald-400 font-mono font-bold">
                            {tx.carbon.toFixed(4)} <span className="text-[9px] text-zinc-550">tCO2e</span>
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                              tx.status === 'Verified' 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                                : tx.status === 'Calculated'
                                ? 'bg-sky-500/10 text-sky-400 border-sky-500/25'
                                : tx.status === 'Draft'
                                ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                                : 'bg-rose-500/10 text-rose-450 border-rose-500/20'
                            }`}>
                              <span className={`w-1 h-1 rounded-full ${
                                tx.status === 'Verified' ? 'bg-emerald-500 animate-pulse' :
                                tx.status === 'Calculated' ? 'bg-sky-500' :
                                tx.status === 'Draft' ? 'bg-zinc-500' : 'bg-rose-500'
                              } shrink-0`} />
                              {tx.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <div className="flex justify-end gap-2.5 opacity-80 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleInspectTx(tx)}
                                className="p-1.5 hover:bg-[#18181b] hover:text-[#f4f4f5] rounded-lg text-zinc-500 transition-premium"
                                title="View transaction details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleOpenEdit(tx)}
                                className="p-1.5 hover:bg-[#18181b] hover:text-[#f4f4f5] rounded-lg text-zinc-500 transition-premium"
                                title="Edit carbon parameters"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleArchiveTx(tx)}
                                className={`p-1.5 hover:bg-[#18181b] rounded-lg transition-premium ${
                                  tx.status === 'Archived' ? 'hover:text-emerald-450 text-zinc-500' : 'hover:text-rose-400 text-zinc-500'
                                }`}
                                title={tx.status === 'Archived' ? 'Restore Transaction' : 'Archive Transaction'}
                              >
                                {tx.status === 'Archived' ? <RotateCcw className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
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
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, transactions.length)} of {transactions.length} entries
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

      {/* FORM MODAL */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingTx ? `Edit Transaction "${editingTx.txId}"` : 'Record Manual Carbon Transaction'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formErrors.apiError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formErrors.apiError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Transaction Date</label>
              <input
                type="date"
                name="timestamp"
                value={formData.timestamp}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-250 focus:outline-none focus:border-emerald-500 transition-premium"
              />
              {formErrors.timestamp && <p className="text-[10px] text-rose-400 mt-1">{formErrors.timestamp}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Department Name</label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-305 focus:outline-none focus:border-emerald-500 cursor-pointer transition-premium"
              >
                <option value="">-- Select Department --</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
              {formErrors.departmentId && <p className="text-[10px] text-rose-400 mt-1">{formErrors.departmentId}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Transaction Source</label>
              <select
                name="source"
                value={formData.source}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-305 focus:outline-none focus:border-emerald-500 cursor-pointer transition-premium"
              >
                <option value="Manual Entry">Manual Entry</option>
                <option value="Purchase">Purchase</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Fleet">Fleet</option>
                <option value="Electricity">Electricity</option>
                <option value="Business Travel">Business Travel</option>
                <option value="Waste Management">Waste Management</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Related Product Profile (Optional)</label>
              <select
                name="productId"
                value={formData.productId}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-305 focus:outline-none focus:border-emerald-500 cursor-pointer transition-premium"
              >
                <option value="">-- None / General Activity --</option>
                {activeProducts.map(p => (
                  <option key={p.id} value={p.id}>{p.name} [{p.code}]</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Activity Product Identifier / Name</label>
              <input
                type="text"
                name="product"
                placeholder="e.g. B20 Biodiesel Fuel"
                value={formData.product}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium"
              />
              {formErrors.product && <p className="text-[10px] text-rose-400 mt-1">{formErrors.product}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Operational Activity / Description</label>
              <input
                type="text"
                name="operation"
                placeholder="e.g. Refueling backup power generator B"
                value={formData.operation}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium"
              />
              {formErrors.operation && <p className="text-[10px] text-rose-400 mt-1">{formErrors.operation}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Emission Factor Reference</label>
              <select
                name="emissionFactorId"
                value={formData.emissionFactorId}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-305 focus:outline-none focus:border-emerald-500 cursor-pointer transition-premium"
              >
                <option value="">-- Select Factor --</option>
                {activeFactors.map(factor => (
                  <option key={factor.id} value={factor.id}>
                    {factor.name} ({factor.value} tCO2e/{factor.unit})
                  </option>
                ))}
              </select>
              {formErrors.emissionFactorId && <p className="text-[10px] text-rose-400 mt-1">{formErrors.emissionFactorId}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">
                Quantity {liveCalculation.unit && `(in ${liveCalculation.unit})`}
              </label>
              <input
                type="number"
                name="quantity"
                placeholder="e.g. 1500"
                step="any"
                value={formData.quantity}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium"
              />
              {formErrors.quantity && <p className="text-[10px] text-rose-400 mt-1">{formErrors.quantity}</p>}
            </div>
          </div>

          {/* Live Automatic Calculation Box */}
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-450 font-bold">Estimated Emissions (Live)</span>
              <span className="text-[9px] text-zinc-550 font-mono">Calculated Automatically</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-emerald-400 font-mono">
                {liveCalculation.carbon.toFixed(4)}
              </span>
              <span className="text-xs text-zinc-400 font-semibold">tCO2e</span>
            </div>
            <div className="text-[10px] font-mono text-zinc-500">
              <span className="font-semibold text-zinc-450 block mb-0.5">Formula trace:</span>
              {liveCalculation.formula}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Audit Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-305 focus:outline-none focus:border-emerald-500 cursor-pointer transition-premium"
              >
                <option value="Draft">Draft</option>
                <option value="Calculated">Calculated</option>
                <option value="Verified">Verified</option>
                {editingTx && <option value="Archived">Archived</option>}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Created By</label>
              <input
                type="text"
                name="createdBy"
                value={formData.createdBy}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 transition-premium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-1.5">Transaction Notes / Audit trail context</label>
            <textarea
              name="notes"
              placeholder="e.g. Verified against supplier purchase invoice INV-49271..."
              rows={2}
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3.5 border-t border-zinc-850 mt-4">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="px-4 py-2 bg-[#18181b] border border-[#27272a]/30 hover:bg-[#27272a] text-zinc-300 text-xs font-bold rounded-xl transition-premium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formSubmitting}
              className="px-4.5 py-2 bg-emerald-650 hover:bg-emerald-700 text-[#09090b] text-xs font-bold rounded-xl transition-premium shadow-[0_0_20px_rgba(16,185,129,0.1)] disabled:opacity-50 cursor-pointer"
            >
              {formSubmitting ? 'Saving...' : editingTx ? 'Save Changes' : 'Record Transaction'}
            </button>
          </div>
        </form>
      </Modal>

      {/* DETAIL INSPECTOR MODAL */}
      <Modal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        title="Carbon Transaction Inspector"
      >
        {selectedTx && (
          <div className="space-y-6">
            
            {/* Header Identity */}
            <div className="p-4 bg-zinc-950/80 border border-zinc-850 rounded-2xl flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 font-mono tracking-wider block">TRANSACTION RECORD</span>
                <h3 className="text-sm font-bold text-zinc-100">{selectedTx.txId}</h3>
                <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold border text-emerald-450 border-emerald-500/20 bg-emerald-500/5 uppercase font-mono">
                  {selectedTx.source}
                </span>
              </div>
              <div className="text-right space-y-1">
                <span className="text-[9px] text-zinc-550 block font-mono uppercase">Audit Status</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                  selectedTx.status === 'Verified' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                    : selectedTx.status === 'Calculated'
                    ? 'bg-sky-500/10 text-sky-400 border-sky-500/25'
                    : selectedTx.status === 'Draft'
                    ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    : 'bg-rose-500/10 text-rose-455 border-rose-500/20'
                }`}>
                  <span className={`w-1 h-1 rounded-full ${
                    selectedTx.status === 'Verified' ? 'bg-emerald-500' :
                    selectedTx.status === 'Calculated' ? 'bg-sky-500' :
                    selectedTx.status === 'Draft' ? 'bg-zinc-500' : 'bg-rose-500'
                  }`} />
                  {selectedTx.status}
                </span>
              </div>
            </div>

            {/* Grid Sections */}
            <div className="grid grid-cols-2 gap-5">
              
              {/* General Information */}
              <div className="space-y-3.5 bg-zinc-950/30 p-3.5 border border-zinc-900 rounded-xl">
                <h4 className="text-[10px] font-mono uppercase font-bold text-zinc-500 tracking-wider border-b border-zinc-900 pb-1.5">
                  General Information
                </h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-zinc-550 block text-[9.5px]">Operational Activity:</span>
                    <span className="font-semibold text-zinc-300">{selectedTx.operation}</span>
                  </div>
                  <div>
                    <span className="text-zinc-550 block text-[9.5px]">Transaction Date:</span>
                    <span className="font-mono text-zinc-350">{new Date(selectedTx.timestamp).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-zinc-550 block text-[9.5px]">Department Node:</span>
                    <span className="font-semibold text-zinc-300">{selectedTx.department?.name}</span>
                  </div>
                </div>
              </div>

              {/* Calculation Details */}
              <div className="space-y-3.5 bg-zinc-950/30 p-3.5 border border-zinc-900 rounded-xl">
                <h4 className="text-[10px] font-mono uppercase font-bold text-zinc-500 tracking-wider border-b border-zinc-900 pb-1.5">
                  Calculation Details
                </h4>
                <div className="space-y-2 text-xs font-mono">
                  <div>
                    <span className="text-zinc-550 block text-[9.5px] font-sans">Operational Quantity:</span>
                    <span className="font-bold text-zinc-300">{selectedTx.quantity.toLocaleString()} {selectedTx.unit}</span>
                  </div>
                  <div>
                    <span className="text-zinc-550 block text-[9.5px] font-sans">Factor Value (At snapshot):</span>
                    <span className="font-bold text-zinc-350">{selectedTx.factorValue} tCO2e / {selectedTx.unit}</span>
                  </div>
                  <div>
                    <span className="text-zinc-550 block text-[9.5px] font-sans">Final Calculated Carbon:</span>
                    <span className="font-extrabold text-emerald-400">{selectedTx.carbon} tCO2e</span>
                  </div>
                </div>
              </div>

              {/* Related Product */}
              <div className="space-y-3.5 bg-zinc-950/30 p-3.5 border border-zinc-900 rounded-xl">
                <h4 className="text-[10px] font-mono uppercase font-bold text-zinc-500 tracking-wider border-b border-zinc-900 pb-1.5">
                  Related Product Profile
                </h4>
                {selectedTx.productProfile ? (
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-zinc-550 block text-[9.5px]">Product Name:</span>
                      <span className="font-semibold text-zinc-300">{selectedTx.productProfile.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-zinc-550 block text-[9.5px]">SKU / Code:</span>
                        <span className="font-mono text-[11px] text-zinc-350">{selectedTx.productProfile.code}</span>
                      </div>
                      <div>
                        <span className="text-zinc-550 block text-[9.5px]">Category:</span>
                        <span className="font-semibold text-zinc-350">{selectedTx.productProfile.category}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-zinc-555 italic py-4">
                    No static product profile is mapped to this transaction. Displays as raw text reference: "{selectedTx.product}"
                  </div>
                )}
              </div>

              {/* Related Emission Factor */}
              <div className="space-y-3.5 bg-zinc-950/30 p-3.5 border border-zinc-900 rounded-xl">
                <h4 className="text-[10px] font-mono uppercase font-bold text-zinc-500 tracking-wider border-b border-zinc-900 pb-1.5">
                  Related Emission Factor
                </h4>
                {selectedTx.emissionFactor ? (
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-zinc-555 block text-[9.5px]">Factor name:</span>
                      <span className="font-semibold text-zinc-300">{selectedTx.emissionFactor.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-zinc-555 block text-[9.5px]">Category:</span>
                        <span className="font-semibold text-zinc-350">{selectedTx.emissionFactor.category}</span>
                      </div>
                      <div>
                        <span className="text-zinc-555 block text-[9.5px]">Source:</span>
                        <span className="text-zinc-350">{selectedTx.emissionFactor.source}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-zinc-555 italic py-4">
                    The original emission factor record has been removed. Values preserved in ledger context.
                  </div>
                )}
              </div>
            </div>

            {/* Environmental Impact Scale */}
            <div className="space-y-3.5 bg-zinc-950/30 p-4 border border-zinc-900 rounded-xl">
              <h4 className="text-[10px] font-mono uppercase font-bold text-zinc-500 tracking-wider border-b border-zinc-900 pb-1.5">
                Environmental Impact
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-zinc-450 font-bold">
                  <span>Carbon Footprint Footprint Scale</span>
                  <span className="font-mono text-emerald-450">{selectedTx.carbon.toFixed(4)} tCO2e</span>
                </div>
                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-850">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 transition-all duration-500" 
                    style={{ width: `${Math.min(100, Math.max(5, (selectedTx.carbon / 500) * 100))}%` }}
                  />
                </div>
                <div className="flex justify-between text-[8px] font-mono text-zinc-600 uppercase">
                  <span>Low (&lt; 10 tCO2e)</span>
                  <span>Moderate (10 - 150)</span>
                  <span>Significant (&gt; 150 tCO2e)</span>
                </div>
              </div>
            </div>

            {/* Audit Trail & Formula */}
            <div className="space-y-3 bg-zinc-950/40 p-4 border border-zinc-900 rounded-xl">
              <h4 className="text-[10px] font-mono uppercase font-bold text-zinc-550 tracking-wider border-b border-zinc-900 pb-1">
                Audit Trail Information
              </h4>
              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-zinc-550 block text-[9.5px]">Calculation Formula Trace:</span>
                  <div className="p-2.5 bg-zinc-950/70 border border-zinc-900 rounded-lg text-emerald-400 font-mono text-[11px]">
                    {selectedTx.formula}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-zinc-555 block text-[9.5px]">Operator ID / Created By:</span>
                    <span className="font-semibold text-zinc-350">{selectedTx.createdBy}</span>
                  </div>
                  <div>
                    <span className="text-zinc-555 block text-[9.5px]">Record Created At:</span>
                    <span className="font-mono text-zinc-400">{new Date(selectedTx.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description/Context */}
            {selectedTx.notes && (
              <div className="space-y-1 bg-zinc-950/10 p-3 rounded-lg border border-zinc-900">
                <span className="text-[9px] text-zinc-550 font-mono uppercase">Transaction Notes:</span>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">{selectedTx.notes}</p>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-zinc-850">
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Close Panel
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
