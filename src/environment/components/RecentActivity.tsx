'use client';

import React, { useState, useMemo } from 'react';
import { Download, Upload, AlertCircle, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { CarbonTransaction } from '../types';
import Modal from './Modal';

interface RecentActivityProps {
  initialTransactions: CarbonTransaction[];
  departments: { id: string; name: string }[];
  onTransactionAdded: () => void;
  isLoading?: boolean;
}

export default function RecentActivity({ 
  initialTransactions, 
  departments, 
  onTransactionAdded, 
  isLoading 
}: RecentActivityProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  
  // Import Form State
  const [importDept, setImportDept] = useState('');
  const [importOp, setImportOp] = useState('');
  const [importProduct, setImportProduct] = useState('');
  const [importCarbon, setImportCarbon] = useState('');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState('');

  // Export State
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const ITEMS_PER_PAGE = 6;

  // Filter & Search Logic
  const filteredTxs = useMemo(() => {
    return initialTransactions.filter((tx) => {
      const matchesSearch = 
        tx.operation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.txId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDept = deptFilter === 'all' || tx.department === deptFilter;
      
      return matchesSearch && matchesDept;
    });
  }, [initialTransactions, searchQuery, deptFilter]);

  const totalPages = Math.ceil(filteredTxs.length / ITEMS_PER_PAGE);
  
  const paginatedTxs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTxs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTxs, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setImportError('');

    if (importFile) {
      // CSV File upload simulation
      setImporting(true);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setImportProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          completeSimulatedImport();
        }
      }, 300);
      return;
    }

    // Manual quick entry validation
    if (!importDept || !importOp || !importProduct || !importCarbon) {
      setImportError('Please fill out all fields or upload a carbon CSV file.');
      return;
    }

    if (isNaN(Number(importCarbon)) || Number(importCarbon) <= 0) {
      setImportError('Carbon value must be a valid number greater than 0.');
      return;
    }

    setImporting(true);
    try {
      const response = await fetch('/api/environment/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          departmentId: importDept,
          operation: importOp,
          product: importProduct,
          carbon: Number(importCarbon)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to import transaction');
      }

      setImportDept('');
      setImportOp('');
      setImportProduct('');
      setImportCarbon('');
      setIsImportModalOpen(false);
      onTransactionAdded();
    } catch (err: any) {
      setImportError(err.message);
    } finally {
      setImporting(false);
    }
  };

  const completeSimulatedImport = async () => {
    try {
      const randomDeptId = departments[Math.floor(Math.random() * departments.length)]?.id;
      if (!randomDeptId) throw new Error('No departments available for mapping.');

      const response = await fetch('/api/environment/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          departmentId: randomDeptId,
          operation: `Bulk Import: ${importFile?.name || 'carbon_ledger.csv'}`,
          product: 'Mixed Fuel (Bulk)',
          carbon: parseFloat((50 + Math.random() * 120).toFixed(1))
        })
      });

      if (!response.ok) throw new Error('Failed to submit imported data');

      setImportFile(null);
      setImportProgress(0);
      setIsImportModalOpen(false);
      onTransactionAdded();
    } catch (err: any) {
      setImportError(err.message);
    } finally {
      setImporting(false);
    }
  };

  const handleExportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setExporting(true);
    setExportSuccess(false);

    // Simulate PDF/CSV build
    setTimeout(() => {
      setExporting(false);
      setExportSuccess(true);
      
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredTxs, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `ecosphere_carbon_report_${Date.now()}.${exportFormat}`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setTimeout(() => {
        setIsExportModalOpen(false);
        setExportSuccess(false);
      }, 1500);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="bg-[#141417]/50 border border-[#27272a]/30 rounded-2xl p-6 animate-pulse space-y-4">
        <div className="h-6 bg-[#09090b] rounded w-1/4"></div>
        <div className="h-44 bg-[#09090b] rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#141417]/50 border border-[#27272a]/30 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:border-emerald-500/10 transition-premium flex flex-col h-full">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5 pb-4 border-b border-[#1f1f23]/40">
        <div>
          <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-505 font-mono">Carbon Ledger</span>
          <h3 className="text-base font-bold text-[#f4f4f5] mt-0.5">Carbon Activity Ledger</h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search ledger..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3.5 py-1.5 bg-[#09090b]/80 border border-[#27272a]/20 rounded-xl text-xs text-[#f4f4f5] placeholder-zinc-500 focus:outline-none w-36 lg:w-48 focus:border-zinc-700 transition-premium"
          />

          <select
            value={deptFilter}
            onChange={(e) => {
              setDeptFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 bg-[#09090b]/80 border border-[#27272a]/20 rounded-xl text-xs text-zinc-300 focus:outline-none cursor-pointer transition-premium"
          >
            <option value="all">All Departments</option>
            {Array.from(new Set(initialTransactions.map(t => t.department))).map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#18181b] hover:bg-[#27272a] text-zinc-200 text-xs font-bold rounded-xl transition-premium border border-[#27272a]/40"
          >
            <Upload className="w-3.5 h-3.5" />
            Import
          </button>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#18181b] hover:bg-[#27272a] text-zinc-200 text-xs font-bold rounded-xl transition-premium border border-[#27272a]/40"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* Modernized Table */}
      <div className="overflow-x-auto flex-1 min-h-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#1f1f23]/40 text-zinc-500 text-[9px] font-bold uppercase tracking-widest font-mono">
              <th className="pb-3 px-3">Transaction ID</th>
              <th className="pb-3 px-3">Department</th>
              <th className="pb-3 px-3">Operation / Activity</th>
              <th className="pb-3 px-3">Source / Scope</th>
              <th className="pb-3 px-3 text-right">Carbon (tCO2e)</th>
              <th className="pb-3 px-3">Timestamp</th>
              <th className="pb-3 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1f1f23]/20 text-xs text-zinc-300">
            {paginatedTxs.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-zinc-500 font-medium">
                  No activity found matching filters.
                </td>
              </tr>
            ) : (
              paginatedTxs.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#18181b]/30 transition-premium group">
                  <td className="py-3.5 px-3 font-mono font-bold text-[9.5px] text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    {tx.txId}
                  </td>
                  <td className="py-3.5 px-3 font-bold text-zinc-200">{tx.department}</td>
                  <td className="py-3.5 px-3 max-w-[200px] truncate font-medium text-zinc-300">{tx.operation}</td>
                  <td className="py-3.5 px-3 text-zinc-450 font-medium">{tx.product}</td>
                  <td className="py-3.5 px-3 text-right font-mono text-[#f4f4f5] font-bold">{tx.carbon}</td>
                  <td className="py-3.5 px-3 text-zinc-500 font-mono text-[9.5px]">
                    {new Date(tx.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[8.5px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-5 pt-4 border-t border-[#1f1f23]/40 text-xs">
          <span className="text-zinc-500 font-medium">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredTxs.length)} of {filteredTxs.length} entries
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

      {/* Import Modal */}
      <Modal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} title="Import Environmental Ledger">
        <form onSubmit={handleImportSubmit} className="space-y-4">
          {importError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4.5 h-4.5 shrink-0" />
              <span>{importError}</span>
            </div>
          )}

          <div className="p-1 bg-[#09090b] border border-[#27272a]/20 rounded-xl flex gap-2">
            <button 
              type="button"
              className="flex-1 py-1.5 rounded-lg text-xs font-bold bg-[#18181b] text-zinc-200"
            >
              Quick Transaction Import
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-1.5">Department Node</label>
            <select
              value={importDept}
              onChange={(e) => setImportDept(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#09090b] border border-[#27272a]/20 rounded-xl text-xs text-zinc-305 focus:outline-none focus:border-emerald-500 transition-premium cursor-pointer"
            >
              <option value="">Select Node</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-1.5">Operation Name</label>
            <input
              type="text"
              placeholder="e.g. Delivery Route Zone A Fleet"
              value={importOp}
              onChange={(e) => setImportOp(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#09090b] border border-[#27272a]/20 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Source Material</label>
              <input
                type="text"
                placeholder="e.g. Diesel Fuel"
                value={importProduct}
                onChange={(e) => setImportProduct(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#09090b] border border-[#27272a]/20 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Carbon (tCO2e)</label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 10.4"
                value={importCarbon}
                onChange={(e) => setImportCarbon(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#09090b] border border-[#27272a]/20 rounded-xl text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-premium"
              />
            </div>
          </div>

          <div className="border border-dashed border-[#27272a]/45 rounded-xl p-4 bg-[#09090b]/50 flex flex-col items-center justify-center">
            <Upload className="w-6 h-6 text-zinc-550 mb-2" />
            <span className="text-[10px] text-zinc-500 text-center font-bold">
              Or drag & drop CSV telemetry ledger
            </span>
            <input 
              type="file" 
              accept=".csv"
              onChange={(e) => setImportFile(e.target.files ? e.target.files[0] : null)}
              className="text-[10px] text-zinc-550 file:mr-4 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-[#18181b] file:text-zinc-305 hover:file:bg-[#27272a] mt-3"
            />
          </div>

          {importing && importFile && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-zinc-500 font-bold">
                <span>Reading Ledger File...</span>
                <span>{importProgress}%</span>
              </div>
              <div className="w-full h-1 bg-[#09090b] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${importProgress}%` }}></div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-[#1f1f23]/40">
            <button
              type="button"
              onClick={() => setIsImportModalOpen(false)}
              className="px-4.5 py-2.5 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={importing}
              className="flex items-center gap-1.5 px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-[#09090b] text-xs font-bold rounded-xl transition-premium"
            >
              {importing ? 'Processing...' : 'Upload & Log Data'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Export Modal */}
      <Modal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} title="Compile Carbon Report">
        <form onSubmit={handleExportSubmit} className="space-y-5">
          {exportSuccess ? (
            <div className="py-6 flex flex-col items-center justify-center text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-505 mb-3 animate-bounce" />
              <h4 className="text-[#f4f4f5] text-sm font-bold">Export Generated!</h4>
              <p className="text-zinc-505 text-xs mt-1 font-medium">Ledger download will start automatically...</p>
            </div>
          ) : (
            <>
              <div>
                <p className="text-zinc-405 text-xs font-medium leading-relaxed">
                  Compile and export the carbon transactions list filtered by current criteria.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-2">Export Format</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setExportFormat('csv')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-premium ${
                      exportFormat === 'csv' 
                        ? 'bg-[#10b981]/10 border-[#10b981] text-emerald-400' 
                        : 'bg-[#09090b] border-[#27272a]/20 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Microsoft CSV
                  </button>

                  <button
                    type="button"
                    onClick={() => setExportFormat('pdf')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-premium ${
                      exportFormat === 'pdf' 
                        ? 'bg-[#10b981]/10 border-[#10b981] text-emerald-400' 
                        : 'bg-[#09090b] border-[#27272a]/20 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Adobe PDF
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1f1f23]/40">
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(false)}
                  className="px-4.5 py-2.5 bg-zinc-850 hover:bg-zinc-800 text-zinc-350 text-xs font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={exporting}
                  className="flex items-center gap-1.5 px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-[#09090b] text-xs font-bold rounded-xl transition-premium"
                >
                  {exporting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Generating Report...
                    </>
                  ) : (
                    'Download Report'
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
}
