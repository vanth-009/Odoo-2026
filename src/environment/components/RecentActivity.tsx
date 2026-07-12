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

  // Filter & Search Logic (Client-side to feel instant, backed by paginated views if needed)
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
      // Select a random department from list to attach mock emissions to
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
      
      // Generate actual download link
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
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-zinc-800 rounded w-1/4 mb-4"></div>
        <div className="h-40 bg-zinc-800 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col h-full">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
        <div>
          <h3 className="text-base font-semibold text-zinc-100">Carbon Activity Ledger</h3>
          <p className="text-zinc-500 text-xs mt-0.5">Real-time carbon-generating activities and operations</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Search ledger..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none w-36 lg:w-44"
          />

          <select
            value={deptFilter}
            onChange={(e) => {
              setDeptFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none"
          >
            <option value="all">All Depts</option>
            {Array.from(new Set(initialTransactions.map(t => t.department))).map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-lg transition-colors border border-zinc-700"
          >
            <Upload className="w-3.5 h-3.5" />
            Import
          </button>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-lg transition-colors border border-zinc-700"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1 min-h-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-850 text-zinc-400 text-[11px] font-semibold uppercase tracking-wider">
              <th className="pb-3">Transaction ID</th>
              <th className="pb-3">Department</th>
              <th className="pb-3">Operation / Activity</th>
              <th className="pb-3">Source / Scope</th>
              <th className="pb-3 text-right">Carbon (tCO2e)</th>
              <th className="pb-3">Timestamp</th>
              <th className="pb-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-850 text-xs text-zinc-300">
            {paginatedTxs.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-zinc-500">
                  No activity found matching filters.
                </td>
              </tr>
            ) : (
              paginatedTxs.map((tx) => (
                <tr key={tx.id} className="hover:bg-zinc-850/20 transition-colors">
                  <td className="py-3 font-mono font-semibold text-[10px] text-zinc-400">{tx.txId}</td>
                  <td className="py-3 font-medium text-zinc-200">{tx.department}</td>
                  <td className="py-3 max-w-[200px] truncate">{tx.operation}</td>
                  <td className="py-3">{tx.product}</td>
                  <td className="py-3 text-right font-mono text-zinc-200 font-semibold">{tx.carbon}</td>
                  <td className="py-3 text-zinc-500 font-mono text-[10px]">
                    {new Date(tx.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-zinc-850 text-xs">
          <span className="text-zinc-500">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredTxs.length)} of {filteredTxs.length} entries
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2.5 py-1 bg-zinc-800 border border-zinc-750 hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-800 text-zinc-300 rounded text-[11px] transition-colors"
            >
              Previous
            </button>
            <span className="px-2.5 py-1 font-semibold text-zinc-400">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 bg-zinc-800 border border-zinc-750 hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-800 text-zinc-300 rounded text-[11px] transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Import Modal */}
      <Modal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} title="Import Environmental Data">
        <form onSubmit={handleImportSubmit} className="space-y-4">
          {importError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4.5 h-4.5 shrink-0" />
              <span>{importError}</span>
            </div>
          )}

          {/* Tab Selection */}
          <div className="p-1.5 bg-zinc-950 border border-zinc-850 rounded-lg flex gap-2">
            <button 
              type="button"
              className="flex-1 py-1.5 rounded-md text-xs font-semibold bg-zinc-800 text-zinc-200"
            >
              Manual Transaction Entry
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Department</label>
            <select
              value={importDept}
              onChange={(e) => setImportDept(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Operation Name</label>
            <input
              type="text"
              placeholder="e.g. Logistics Delivery Route #108"
              value={importOp}
              onChange={(e) => setImportOp(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Source / Activity Product</label>
              <input
                type="text"
                placeholder="e.g. Grid Electricity, Diesel"
                value={importProduct}
                onChange={(e) => setImportProduct(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Carbon Emissions (tCO2e)</label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 15.6"
                value={importCarbon}
                onChange={(e) => setImportCarbon(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Or File Upload Section */}
          <div className="border border-dashed border-zinc-800 rounded-lg p-4 bg-zinc-950 flex flex-col items-center justify-center">
            <Upload className="w-6 h-6 text-zinc-500 mb-2" />
            <span className="text-[10px] text-zinc-400 text-center font-medium">
              Or drag & drop your sustainability CSV ledger here
            </span>
            <input 
              type="file" 
              accept=".csv"
              onChange={(e) => setImportFile(e.target.files ? e.target.files[0] : null)}
              className="text-[10px] text-zinc-500 file:mr-4 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700 mt-3"
            />
          </div>

          {importing && importFile && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-zinc-500 font-semibold">
                <span>Reading Ledger File...</span>
                <span>{importProgress}%</span>
              </div>
              <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${importProgress}%` }}></div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-850">
            <button
              type="button"
              onClick={() => setIsImportModalOpen(false)}
              className="px-4 py-2 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={importing}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-zinc-100 text-xs font-semibold rounded-lg transition-colors"
            >
              {importing ? 'Processing...' : 'Upload & Log Data'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Export Modal */}
      <Modal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} title="Export Environmental Report">
        <form onSubmit={handleExportSubmit} className="space-y-5">
          {exportSuccess ? (
            <div className="py-6 flex flex-col items-center justify-center text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3 animate-bounce" />
              <h4 className="text-zinc-100 text-sm font-semibold">Export File Generated!</h4>
              <p className="text-zinc-500 text-xs mt-1">Your ledger download is starting automatically...</p>
            </div>
          ) : (
            <>
              <div>
                <p className="text-zinc-400 text-xs">
                  Compile and export the carbon transactions list filtered by current criteria.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2">Export Format</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setExportFormat('csv')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                      exportFormat === 'csv' 
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                        : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Microsoft CSV
                  </button>

                  <button
                    type="button"
                    onClick={() => setExportFormat('pdf')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                      exportFormat === 'pdf' 
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                        : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Adobe PDF
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-850">
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(false)}
                  className="px-4 py-2 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={exporting}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-zinc-100 text-xs font-semibold rounded-lg transition-colors"
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
