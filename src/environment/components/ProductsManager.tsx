'use client';

import React, { useState, useMemo } from 'react';
import { 
  BarChart3, RefreshCw, CheckCircle2, ShieldAlert, Sparkles,
  Users2, Landmark, Gamepad2, Settings2, HelpCircle, ArrowRight,
  Plus, Search, Download, Edit2, Archive, Eye, RotateCcw, AlertCircle, FileText, Package, Target, BarChart2, FileSpreadsheet
} from 'lucide-react';
import { ProductESGProfile, EmissionFactor } from '../types';
import Modal from './Modal';

interface ProductsManagerProps {
  initialProducts: ProductESGProfile[];
  activeFactors: EmissionFactor[];
}

export default function ProductsManager({ initialProducts, activeFactors }: ProductsManagerProps) {
  const [products, setProducts] = useState<ProductESGProfile[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<'name' | 'code' | 'esgRating' | 'recyclablePercent'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // Selected product for Detail Inspector
  const [selectedProduct, setSelectedProduct] = useState<ProductESGProfile | null>(null);
  const [linkedTxCount, setLinkedTxCount] = useState<number>(0);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Form State for Create/Edit Modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductESGProfile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: '',
    supplier: '',
    packagingType: '',
    recyclablePercent: '',
    manufacturingCountry: '',
    lifecycleStage: '',
    hazardClass: '',
    carbonCategory: '',
    preferredEmissionFactorId: '',
    esgRating: 'A',
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

  const fetchProducts = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch('/api/environment/products');
      if (res.ok) {
        const freshProducts = await res.json();
        setProducts(freshProducts);
      }
    } catch (err) {
      triggerToast('Failed to sync products list', 'error');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Archive / Toggle Status Handler
  const handleArchiveProduct = async (product: ProductESGProfile) => {
    const isArchive = product.status === 'ACTIVE';
    const actionLabel = isArchive ? 'archived' : 'activated';
    
    try {
      const res = await fetch(`/api/environment/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: isArchive ? 'ARCHIVED' : 'ACTIVE' })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to toggle product status');
      }

      triggerToast(`Product "${product.name}" ${actionLabel}!`);
      fetchProducts(true);
      if (selectedProduct?.id === product.id) {
        setIsDetailModalOpen(false);
      }
    } catch (err: any) {
      triggerToast(err.message, 'error');
    }
  };

  // Open Form Modal for Creating
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      code: '',
      category: '',
      supplier: '',
      packagingType: '',
      recyclablePercent: '100',
      manufacturingCountry: '',
      lifecycleStage: 'Production',
      hazardClass: '',
      carbonCategory: 'Scope 3 Purchased Goods',
      preferredEmissionFactorId: '',
      esgRating: 'A',
      description: '',
      status: 'ACTIVE'
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open Form Modal for Editing
  const handleOpenEdit = (product: ProductESGProfile) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      code: product.code,
      category: product.category,
      supplier: product.supplier,
      packagingType: product.packagingType,
      recyclablePercent: product.recyclablePercent.toString(),
      manufacturingCountry: product.manufacturingCountry,
      lifecycleStage: product.lifecycleStage,
      hazardClass: product.hazardClass || '',
      carbonCategory: product.carbonCategory || '',
      preferredEmissionFactorId: product.preferredEmissionFactorId || '',
      esgRating: product.esgRating,
      description: product.description || '',
      status: product.status
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
    if (!formData.code || formData.code.trim().length < 1) {
      errors.code = 'Product Code / SKU is required';
    }
    if (!formData.category || formData.category.trim().length < 1) {
      errors.category = 'Category is required';
    }
    if (!formData.supplier || formData.supplier.trim().length < 1) {
      errors.supplier = 'Supplier reference is required';
    }
    if (!formData.packagingType || formData.packagingType.trim().length < 1) {
      errors.packagingType = 'Packaging type is required (e.g. None, Paper)';
    }

    const pct = Number(formData.recyclablePercent);
    if (formData.recyclablePercent === '' || isNaN(pct) || pct < 0 || pct > 100) {
      errors.recyclablePercent = 'Recyclable percentage must be a number between 0 and 100';
    }

    if (!formData.manufacturingCountry || formData.manufacturingCountry.trim().length < 1) {
      errors.manufacturingCountry = 'Manufacturing country is required';
    }
    if (!formData.lifecycleStage || formData.lifecycleStage.trim().length < 1) {
      errors.lifecycleStage = 'Lifecycle stage is required';
    }

    // SKU Code Uniqueness check on local list
    const normalizedCode = formData.code.trim().toLowerCase();
    const isDuplicate = products.some(
      p => p.code.toLowerCase() === normalizedCode && p.id !== editingProduct?.id
    );
    if (isDuplicate) {
      errors.code = 'A product with this SKU / Code already exists.';
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
      recyclablePercent: Number(formData.recyclablePercent),
      preferredEmissionFactorId: formData.preferredEmissionFactorId || null,
      hazardClass: formData.hazardClass || null,
      carbonCategory: formData.carbonCategory || null,
      description: formData.description || null
    };

    try {
      const url = editingProduct 
        ? `/api/environment/products/${editingProduct.id}` 
        : '/api/environment/products';
      const method = editingProduct ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save product profile');
      }

      triggerToast(editingProduct ? 'Product ESG Profile updated successfully' : 'Product ESG Profile created successfully');
      setIsFormModalOpen(false);
      fetchProducts(true);
    } catch (err: any) {
      setFormErrors({ apiError: err.message });
    } finally {
      setFormSubmitting(false);
    }
  };

  // Export Data Handler (Simulated Download)
  const handleExportProducts = (format: 'csv' | 'json') => {
    try {
      let dataStr = '';
      let filename = `ecosphere_product_profiles_${Date.now()}`;
      
      if (format === 'json') {
        dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredProducts, null, 2));
        filename += '.json';
      } else {
        // Build CSV columns
        const headers = 'ID,Name,SKU_Code,Category,Supplier,ESGRating,Packaging,RecyclablePercent,MfgCountry,LifecycleStage,Status\n';
        const rows = filteredProducts.map(p => (
          `"${p.id}","${p.name}","${p.code}","${p.category}","${p.supplier}","${p.esgRating}","${p.packagingType}",${p.recyclablePercent},"${p.manufacturingCountry}","${p.lifecycleStage}","${p.status}"`
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
      triggerToast(`Products list exported in ${format.toUpperCase()} format!`);
    } catch (err) {
      triggerToast('Export failed', 'error');
    }
  };

  // Inspect detail view
  const handleInspectProduct = async (product: ProductESGProfile) => {
    try {
      const res = await fetch(`/api/environment/products/${product.id}`);
      if (res.ok) {
        const fullDetails = await res.json();
        setSelectedProduct(fullDetails);
        setLinkedTxCount(fullDetails._count?.transactions || 0);
      } else {
        setSelectedProduct(product);
        setLinkedTxCount(0);
      }
    } catch (err) {
      setSelectedProduct(product);
      setLinkedTxCount(0);
    }
    setIsDetailModalOpen(true);
  };

  // Category and ESG Ratings list for filters
  const categoriesList = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category)));
  }, [products]);

  const esgRatingsList = ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC'];

  // Search & Filter & Sort Pipeline
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      const matchesRating = ratingFilter === 'all' || p.esgRating === ratingFilter;
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchesSearch && matchesCategory && matchesRating && matchesStatus;
    });
  }, [products, searchQuery, categoryFilter, ratingFilter, statusFilter]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    sorted.sort((a, b) => {
      let aField = a[sortField];
      let bField = b[sortField];

      if (aField === undefined || bField === undefined) return 0;

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
  }, [filteredProducts, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  const handleSort = (field: 'name' | 'code' | 'esgRating' | 'recyclablePercent') => {
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
              className="flex items-center gap-3 px-3 py-2 text-zinc-400 border border-transparent rounded-lg text-xs font-semibold relative transition-premium group hover:bg-zinc-900/10 hover:text-[#f4f4f5]"
            >
              <Settings2 className="w-4 h-4 text-zinc-400 group-hover:text-[#f4f4f5] transition-colors" />
              Emission Factors
            </a>

            <a 
              href="/environment/products" 
              className="flex items-center gap-3 px-3 py-2 text-emerald-450 border border-transparent rounded-lg text-xs font-semibold relative transition-premium group"
            >
              <span className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-emerald-500 rounded-full" />
              <Package className="w-4 h-4 text-emerald-400" />
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
            <span className="text-[8.5px] font-mono tracking-widest text-zinc-550 uppercase">Environmental Node &gt; Products</span>
            <h1 className="text-sm font-extrabold text-[#f4f4f5] tracking-tight -mt-0.5 font-mono">Product ESG Profiles</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchProducts()}
              disabled={loading}
              className="p-2 rounded-lg bg-[#18181b] hover:bg-[#27272a] text-zinc-400 hover:text-[#f4f4f5] border border-[#27272a]/40 transition-premium disabled:opacity-40"
              title="Poll product profiles"
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
                <h2 className="text-base font-bold text-[#f4f4f5]">Environmental Product Characteristics Registry</h2>
                <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                  Track and audit the environmental footprint, supplier metrics, packaging attributes, recyclable percentages, and carbon conversion mappings of materials and products.
                </p>
              </div>

              <button
                onClick={handleOpenCreate}
                className="flex items-center gap-1.5 px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-[#09090b] text-xs font-bold rounded-xl transition-premium border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)] shrink-0"
              >
                <Plus className="w-4 h-4 shrink-0" />
                Add Product Profile
              </button>
            </div>
          </div>

          {/* Filters Dashboard */}
          <div className="bg-[#141417]/50 border border-[#27272a]/30 rounded-2xl p-4.5 flex flex-col lg:flex-row justify-between items-center gap-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 min-w-[200px] lg:flex-none">
                <Search className="w-3.5 h-3.5 text-zinc-550 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search SKU, name, supplier..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9.5 pr-4 py-2 bg-[#09090b]/80 border border-[#27272a]/20 rounded-xl text-xs text-[#f4f4f5] placeholder-zinc-505 focus:outline-none focus:border-zinc-700 transition-premium w-full lg:w-60"
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
                value={ratingFilter}
                onChange={(e) => {
                  setRatingFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3.5 py-2 bg-[#09090b]/80 border border-[#27272a]/20 rounded-xl text-xs text-zinc-305 focus:outline-none cursor-pointer hover:border-zinc-700 transition-premium"
              >
                <option value="all">All ESG Ratings</option>
                {esgRatingsList.map(rate => (
                  <option key={rate} value={rate}>{rate} Rating</option>
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

            <div className="flex gap-2 shrink-0 w-full lg:w-auto justify-end">
              <button
                onClick={() => handleExportProducts('csv')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#18181b] border border-[#27272a]/30 hover:bg-[#27272a] text-zinc-200 text-xs font-bold rounded-xl transition-premium cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
              <button
                onClick={() => handleExportProducts('json')}
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
                        Product Name {sortField === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                      </th>
                      <th className="pb-3.5 px-3 cursor-pointer hover:text-zinc-300" onClick={() => handleSort('code')}>
                        SKU / Code {sortField === 'code' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                      </th>
                      <th className="pb-3.5 px-3">Category</th>
                      <th className="pb-3.5 px-3">Supplier</th>
                      <th className="pb-3.5 px-3 text-center cursor-pointer hover:text-zinc-300" onClick={() => handleSort('esgRating')}>
                        ESG Rating {sortField === 'esgRating' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                      </th>
                      <th className="pb-3.5 px-3">Packaging Type</th>
                      <th className="pb-3.5 px-3 text-right cursor-pointer hover:text-zinc-300" onClick={() => handleSort('recyclablePercent')}>
                        Recyclable % {sortField === 'recyclablePercent' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                      </th>
                      <th className="pb-3.5 px-3">Preferred Factor</th>
                      <th className="pb-3.5 px-3 text-center">Status</th>
                      <th className="pb-3.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f1f23]/20 text-xs text-zinc-300">
                    {paginatedProducts.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-12 text-center text-zinc-500 font-medium">
                          No product profiles matched the criteria.
                        </td>
                      </tr>
                    ) : (
                      paginatedProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-[#18181b]/35 transition-premium group">
                          <td className="py-3.5 px-3">
                            <span 
                              onClick={() => handleInspectProduct(product)}
                              className="font-bold text-zinc-200 cursor-pointer hover:text-emerald-450 hover:underline transition-colors"
                            >
                              {product.name}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-mono text-[11px] text-zinc-450">{product.code}</td>
                          <td className="py-3.5 px-3 font-semibold text-zinc-300">{product.category}</td>
                          <td className="py-3.5 px-3 text-zinc-450">{product.supplier}</td>
                          <td className="py-3.5 px-3 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                              product.esgRating.startsWith('A') 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                : product.esgRating.startsWith('B') 
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}>
                              {product.esgRating}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-zinc-500 font-medium">{product.packagingType}</td>
                          <td className="py-3.5 px-3 text-right font-mono text-zinc-250 font-bold">
                            {product.recyclablePercent}%
                          </td>
                          <td className="py-3.5 px-3">
                            {product.preferredEmissionFactor ? (
                              <div>
                                <span className="font-semibold text-zinc-200 block text-[11px]">
                                  {product.preferredEmissionFactor.name}
                                </span>
                                <span className="text-[9px] text-zinc-500 font-mono block">
                                  {product.preferredEmissionFactor.value.toFixed(4)} tCO2e / {product.preferredEmissionFactor.unit}
                                </span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-zinc-600 font-mono italic">None</span>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[8.5px] font-bold border ${
                              product.status === 'ACTIVE' 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                                : 'bg-[#18181b] text-zinc-505 border-zinc-800'
                            }`}>
                              <span className={`w-1 h-1 rounded-full ${product.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-700'} shrink-0`} />
                              {product.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <div className="flex justify-end gap-2.5 opacity-80 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleInspectProduct(product)}
                                className="p-1.5 hover:bg-[#18181b] hover:text-[#f4f4f5] rounded-lg text-zinc-500 transition-premium"
                                title="View product details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleOpenEdit(product)}
                                className="p-1.5 hover:bg-[#18181b] hover:text-[#f4f4f5] rounded-lg text-zinc-500 transition-premium"
                                title="Edit product ESG attributes"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleArchiveProduct(product)}
                                className={`p-1.5 hover:bg-[#18181b] rounded-lg transition-premium ${
                                  product.status === 'ACTIVE' ? 'hover:text-rose-400 text-zinc-500' : 'hover:text-emerald-400 text-zinc-500'
                                }`}
                                title={product.status === 'ACTIVE' ? 'Archive product' : 'Activate product'}
                              >
                                {product.status === 'ACTIVE' ? <Archive className="w-3.5 h-3.5" /> : <RotateCcw className="w-3.5 h-3.5" />}
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
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} entries
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
        title={editingProduct ? `Edit Product "${editingProduct.name}"` : 'Add Product ESG Profile'}
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
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Product Name</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Steel Structural Rods"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium"
              />
              {formErrors.name && <p className="text-[10px] text-rose-400 mt-1">{formErrors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Product SKU / Code</label>
              <input
                type="text"
                name="code"
                placeholder="e.g. PROD-STL-001"
                value={formData.code}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium"
              />
              {formErrors.code && <p className="text-[10px] text-rose-400 mt-1">{formErrors.code}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Category</label>
              <input
                type="text"
                name="category"
                placeholder="e.g. Structural Metal, Packaging"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium"
              />
              {formErrors.category && <p className="text-[10px] text-rose-400 mt-1">{formErrors.category}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Supplier</label>
              <input
                type="text"
                name="supplier"
                placeholder="e.g. Apex Steel Industries"
                value={formData.supplier}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium"
              />
              {formErrors.supplier && <p className="text-[10px] text-rose-400 mt-1">{formErrors.supplier}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Packaging Type</label>
              <input
                type="text"
                name="packagingType"
                placeholder="e.g. None, Paper Sacks, Plastic Wrap"
                value={formData.packagingType}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium"
              />
              {formErrors.packagingType && <p className="text-[10px] text-rose-400 mt-1">{formErrors.packagingType}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Recyclable Percentage (%)</label>
              <input
                type="number"
                name="recyclablePercent"
                placeholder="e.g. 95"
                value={formData.recyclablePercent}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium"
              />
              {formErrors.recyclablePercent && <p className="text-[10px] text-rose-400 mt-1">{formErrors.recyclablePercent}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Manufacturing Country</label>
              <input
                type="text"
                name="manufacturingCountry"
                placeholder="e.g. Germany, Poland"
                value={formData.manufacturingCountry}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium"
              />
              {formErrors.manufacturingCountry && <p className="text-[10px] text-rose-400 mt-1">{formErrors.manufacturingCountry}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Lifecycle Stage</label>
              <select
                name="lifecycleStage"
                value={formData.lifecycleStage}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-305 focus:outline-none focus:border-emerald-500 cursor-pointer transition-premium"
              >
                <option value="Raw Material Extraction">Raw Material Extraction</option>
                <option value="Production">Production</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Transport / Distribution">Transport / Distribution</option>
                <option value="Operational Use">Operational Use</option>
                <option value="Use Stage">Use Stage</option>
                <option value="Combustion / End of Life">Combustion / End of Life</option>
                <option value="End of Life disposal">End of Life disposal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Hazard Classification (Optional)</label>
              <input
                type="text"
                name="hazardClass"
                placeholder="e.g. Non-Hazardous, Flammable Class 3"
                value={formData.hazardClass}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Carbon Category (Optional)</label>
              <input
                type="text"
                name="carbonCategory"
                placeholder="e.g. Scope 3 Purchased Goods"
                value={formData.carbonCategory}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Preferred Emission Factor</label>
              <select
                name="preferredEmissionFactorId"
                value={formData.preferredEmissionFactorId}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-305 focus:outline-none focus:border-emerald-500 cursor-pointer transition-premium"
              >
                <option value="">-- Optional / None --</option>
                {activeFactors.map(factor => (
                  <option key={factor.id} value={factor.id}>
                    {factor.name} ({factor.value} tCO2e / {factor.unit})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">ESG Rating</label>
              <select
                name="esgRating"
                value={formData.esgRating}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-305 focus:outline-none focus:border-emerald-500 cursor-pointer transition-premium"
              >
                <option value="AAA">AAA Rating (Leader)</option>
                <option value="AA">AA Rating</option>
                <option value="A">A Rating</option>
                <option value="BBB">BBB Rating (Average)</option>
                <option value="BB">BB Rating</option>
                <option value="B">B Rating</option>
                <option value="CCC">CCC Rating (Laggard)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-1.5">Description (Optional)</label>
            <textarea
              name="description"
              placeholder="Provide a brief context or notes regarding this product..."
              rows={2}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium"
            />
          </div>

          {editingProduct && (
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Status</label>
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
          )}

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
              {formSubmitting ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>

      {/* DETAIL INSPECTOR MODAL */}
      <Modal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        title="Product ESG Profile Details"
      >
        {selectedProduct && (
          <div className="space-y-6">
            
            {/* Header Identity */}
            <div className="p-4 bg-zinc-950/80 border border-zinc-850 rounded-2xl flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 font-mono tracking-wider block">{selectedProduct.code}</span>
                <h3 className="text-sm font-bold text-zinc-100">{selectedProduct.name}</h3>
                <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold border text-zinc-400 border-zinc-800 bg-zinc-900 uppercase">
                  {selectedProduct.category}
                </span>
              </div>
              <div className="text-right space-y-1">
                <span className="text-[9px] text-zinc-550 block font-mono uppercase">ESG Status</span>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                  selectedProduct.status === 'ACTIVE' 
                    ? 'bg-emerald-500/10 text-emerald-450 border-emerald-500/20' 
                    : 'bg-[#18181b] text-zinc-505 border-zinc-800'
                }`}>
                  <span className={`w-1 h-1 rounded-full ${selectedProduct.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-zinc-755'}`} />
                  {selectedProduct.status}
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
                    <span className="text-zinc-550 block text-[9.5px]">Product Name:</span>
                    <span className="font-semibold text-zinc-300">{selectedProduct.name}</span>
                  </div>
                  <div>
                    <span className="text-zinc-550 block text-[9.5px]">Product SKU / SKU Code:</span>
                    <span className="font-mono text-zinc-350">{selectedProduct.code}</span>
                  </div>
                  <div>
                    <span className="text-zinc-550 block text-[9.5px]">ESG Rating Scale:</span>
                    <span className="font-semibold text-emerald-450">{selectedProduct.esgRating}</span>
                  </div>
                </div>
              </div>

              {/* Environmental Attributes */}
              <div className="space-y-3.5 bg-zinc-950/30 p-3.5 border border-zinc-900 rounded-xl">
                <h4 className="text-[10px] font-mono uppercase font-bold text-zinc-500 tracking-wider border-b border-zinc-900 pb-1.5">
                  Environmental Attributes
                </h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-zinc-550 block text-[9.5px]">Recyclable Content:</span>
                    <span className="font-bold text-emerald-400">{selectedProduct.recyclablePercent}%</span>
                  </div>
                  <div>
                    <span className="text-zinc-550 block text-[9.5px]">Origin (Mfg Country):</span>
                    <span className="font-semibold text-zinc-350">{selectedProduct.manufacturingCountry}</span>
                  </div>
                  <div>
                    <span className="text-zinc-550 block text-[9.5px]">Lifecycle Stage:</span>
                    <span className="font-semibold text-zinc-350">{selectedProduct.lifecycleStage}</span>
                  </div>
                  {selectedProduct.hazardClass && (
                    <div>
                      <span className="text-zinc-550 block text-[9.5px]">Hazard Classification:</span>
                      <span className="font-semibold text-zinc-350">{selectedProduct.hazardClass}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Packaging attributes */}
              <div className="space-y-3.5 bg-zinc-950/30 p-3.5 border border-zinc-900 rounded-xl">
                <h4 className="text-[10px] font-mono uppercase font-bold text-zinc-500 tracking-wider border-b border-zinc-900 pb-1.5">
                  Packaging Attributes
                </h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-zinc-550 block text-[9.5px]">Packaging Material Type:</span>
                    <span className="font-semibold text-zinc-350">{selectedProduct.packagingType}</span>
                  </div>
                </div>
              </div>

              {/* Supplier Information */}
              <div className="space-y-3.5 bg-zinc-950/30 p-3.5 border border-zinc-900 rounded-xl">
                <h4 className="text-[10px] font-mono uppercase font-bold text-zinc-500 tracking-wider border-b border-zinc-900 pb-1.5">
                  Supplier Information
                </h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-zinc-550 block text-[9.5px]">Corporate Supplier:</span>
                    <span className="font-semibold text-zinc-300">{selectedProduct.supplier}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Carbon Information */}
            <div className="space-y-3.5 bg-zinc-950/30 p-4 border border-zinc-900 rounded-xl">
              <h4 className="text-[10px] font-mono uppercase font-bold text-zinc-500 tracking-wider border-b border-zinc-900 pb-1.5">
                Carbon Mapping & Factor Reference
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-zinc-550 block text-[9.5px]">Carbon Inventory Scope Category:</span>
                  <span className="font-semibold text-zinc-300">{selectedProduct.carbonCategory || 'Not Mapped'}</span>
                </div>
                <div>
                  <span className="text-zinc-550 block text-[9.5px]">Preferred Conversion Multiplier:</span>
                  {selectedProduct.preferredEmissionFactor ? (
                    <div>
                      <span className="font-bold text-emerald-450">{selectedProduct.preferredEmissionFactor.name}</span>
                      <span className="block font-mono text-[10px] text-zinc-500">
                        {selectedProduct.preferredEmissionFactor.value} tCO2e per {selectedProduct.preferredEmissionFactor.unit}
                      </span>
                    </div>
                  ) : (
                    <span className="text-zinc-505 italic">None Linked</span>
                  )}
                </div>
              </div>
            </div>

            {/* Future Relationships Placeholders */}
            <div className="space-y-3.5 bg-zinc-950/40 p-4 border border-zinc-900 rounded-xl">
              <h4 className="text-[10px] font-mono uppercase font-bold text-zinc-550 tracking-wider border-b border-zinc-900 pb-1.5">
                Integration & Future Relationships
              </h4>
              
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-zinc-950/60 p-2.5 border border-zinc-900 rounded-lg">
                  <span className="text-[9px] text-zinc-500 font-mono block uppercase">Carbon Ledger</span>
                  <span className="text-xs font-bold text-zinc-400 block mt-1">{linkedTxCount} Transactions</span>
                </div>
                <div className="bg-zinc-950/60 p-2.5 border border-zinc-900 rounded-lg">
                  <span className="text-[9px] text-zinc-500 font-mono block uppercase">ESG Goals</span>
                  <span className="text-xs font-bold text-zinc-450 block mt-1">Pending Link</span>
                </div>
                <div className="bg-zinc-950/60 p-2.5 border border-zinc-900 rounded-lg">
                  <span className="text-[9px] text-zinc-500 font-mono block uppercase">Disclosures</span>
                  <span className="text-xs font-bold text-zinc-450 block mt-1">Pending Report</span>
                </div>
              </div>
              <p className="text-[9.5px] text-zinc-550 italic leading-relaxed text-center">
                Note: Environmental transaction bindings and goal compliance linkings are scheduled for implementation in the next phase.
              </p>
            </div>

            {/* Description/Context */}
            {selectedProduct.description && (
              <div className="space-y-1 bg-zinc-950/10 p-3 rounded-lg border border-zinc-900">
                <span className="text-[9px] text-zinc-550 font-mono uppercase">Profile Description Context:</span>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">{selectedProduct.description}</p>
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
