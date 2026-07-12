"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, AlertTriangle, ShieldAlert, FileText, CheckCircle, 
  X, ExternalLink, Image, FileCode, UploadCloud, Check, HelpCircle, 
  ArrowRight, ShieldCheck, User, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Evidence {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: 'image' | 'pdf' | 'document';
  uploadedAt: string;
  uploadedBy: string;
}

interface ComplianceIssue {
  id: string;
  title: string;
  description: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'UNDER_INVESTIGATION' | 'REMEDIATED' | 'RESOLVED' | 'CLOSED' | 'ACCEPTED_RISK';
  remediationDeadline: string;
  remediatedAt: string | null;
  remediationOwner: string;
  resolution: string | null;
  evidence: Evidence[];
}

export default function CompliancePage() {
  const [issues, setIssues] = useState<ComplianceIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setCategoryFilter] = useState('ALL');
  const [selectedIssue, setSelectedIssue] = useState<ComplianceIssue | null>(null);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);

  // Resolution Form States
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isSubmittingResolution, setIsSubmittingResolution] = useState(false);

  // Form State for new Evidence
  const [newEvidence, setNewEvidence] = useState({
    title: '',
    description: '',
    uploadedBy: 'Compliance Officer'
  });
  
  // File Upload states
  const [selectedFileType, setSelectedFileType] = useState<'image' | 'pdf' | 'document'>('pdf');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/governance/compliance');
      if (res.ok) {
        const json = await res.json();
        const list = json.data || [];
        setIssues(list);
        
        // Refresh selected issue references if active
        if (selectedIssue) {
          const match = list.find((i: any) => i.id === selectedIssue.id);
          if (match) setSelectedIssue(match);
        }
      }
    } catch (error) {
      console.error('Error fetching compliance issues:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setIsUploading(true);
      setUploadProgress(10);
      
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            return 100;
          }
          return prev + 25;
        });
      }, 150);
    }
  };

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue) return;
    if (!selectedFile) {
      toast.error('Please select an evidence file.');
      return;
    }

    try {
      const fileExtension = selectedFile.name.split('.').pop() || 'pdf';
      const fileUrl = `/uploads/compliance_${selectedIssue.id.slice(0, 5)}_${Date.now()}.${fileExtension}`;

      const res = await fetch(`/api/governance/compliance/${selectedIssue.id}/evidence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newEvidence.title,
          description: newEvidence.description,
          fileUrl,
          fileType: selectedFileType,
          uploadedBy: newEvidence.uploadedBy
        })
      });

      if (res.ok) {
        toast.success('Evidence proof uploaded successfully!');
        setIsEvidenceModalOpen(false);
        await fetchData();

        // Reset
        setNewEvidence({
          title: '',
          description: '',
          uploadedBy: 'Compliance Officer'
        });
        setSelectedFile(null);
        setUploadProgress(0);
      } else {
        const errJson = await res.json();
        toast.error(errJson.error || 'Failed to submit evidence.');
      }
    } catch (error) {
      console.error('Error adding evidence:', error);
      toast.error('Server submission failed.');
    }
  };

  // Submit Resolution notes (Transitions state to RESOLVED)
  const handleResolveIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue) return;
    if (!resolutionNotes.trim()) {
      toast.error('Please provide details on how the issue was resolved.');
      return;
    }

    setIsSubmittingResolution(true);
    try {
      const res = await fetch('/api/governance/compliance/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issueId: selectedIssue.id,
          resolution: resolutionNotes
        })
      });

      if (res.ok) {
        toast.success('Compliance issue resolved successfully!');
        setResolutionNotes('');
        await fetchData();
      } else {
        toast.error('Failed to resolve issue.');
      }
    } catch (err) {
      console.error('Error resolving', err);
      toast.error('Server connection failed.');
    } finally {
      setIsSubmittingResolution(false);
    }
  };

  // Verify proof and close compliance issue (Transitions state to CLOSED)
  const handleVerifyAndClose = async () => {
    if (!selectedIssue) return;
    try {
      const res = await fetch('/api/governance/compliance/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueId: selectedIssue.id })
      });

      if (res.ok) {
        toast.success('Compliance issue verified and officially closed!');
        await fetchData();
      } else {
        toast.error('Failed to verify and close issue.');
      }
    } catch (err) {
      console.error('Error closing', err);
      toast.error('Server connection failed.');
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || issue.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case 'HIGH':
      case 'CRITICAL':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'REMEDIATED':
      case 'RESOLVED':
        return 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/20';
      case 'CLOSED':
        return 'bg-zinc-800 text-zinc-400 border border-zinc-700';
      case 'UNDER_INVESTIGATION':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'OPEN':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  // Determine active steps for compliance workflow
  const getWorkflowSteps = (issue: ComplianceIssue) => {
    const isAssigned = issue.remediationOwner && issue.remediationOwner !== 'Unassigned' && issue.remediationOwner !== 'System Admin';
    const isEvidenceAdded = issue.evidence && issue.evidence.length > 0;
    const isResolved = issue.status === 'RESOLVED' || issue.status === 'REMEDIATED' || issue.status === 'CLOSED';
    const isClosed = issue.status === 'CLOSED';

    return [
      { key: 'reported', label: 'Reported', active: true },
      { key: 'assigned', label: 'Assigned', active: !!isAssigned },
      { key: 'evidence', label: 'Evidence Added', active: isEvidenceAdded },
      { key: 'resolved', label: 'Resolved', active: isResolved },
      { key: 'verified', label: 'Verified', active: isClosed },
      { key: 'closed', label: 'Closed', active: isClosed },
    ];
  };

  return (
    <div className="space-y-6 text-slate-100 animate-fadeIn">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-white">Compliance Control Panel</h3>
        <p className="text-slate-400 text-sm mt-1">Track compliance risk alerts, remediation tasks, and submit mandatory audit proof files.</p>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col sm:flex-row gap-4 backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search compliance issues by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
        <div className="relative w-48">
          <select
            value={severityFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50"
          >
            <option value="ALL" className="bg-slate-900">All Severities</option>
            <option value="HIGH" className="bg-slate-900">High Risk</option>
            <option value="MEDIUM" className="bg-slate-900">Medium Risk</option>
            <option value="LOW" className="bg-slate-900">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Main Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Left: Issues List Table */}
          <div className="xl:col-span-2 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl flex flex-col">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-xs text-left">
                <thead className="text-zinc-400 uppercase bg-black/25">
                  <tr>
                    <th className="px-6 py-4 rounded-tl-lg font-medium">Compliance Issue</th>
                    <th className="px-6 py-4 font-medium">Severity</th>
                    <th className="px-6 py-4 font-medium">Owner</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 rounded-tr-lg font-medium">Deadline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredIssues.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-400 bg-transparent">
                        No compliance issues found matching filters.
                      </td>
                    </tr>
                  ) : filteredIssues.map((issue) => (
                    <tr 
                      key={issue.id} 
                      onClick={() => setSelectedIssue(issue)}
                      className={`cursor-pointer transition-colors ${selectedIssue?.id === issue.id ? 'bg-white/10' : 'hover:bg-white/[0.02]'}`}
                    >
                      <td className="px-6 py-4 font-semibold text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-450">
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                        <span>{issue.title}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${getSeverityBadgeClass(issue.severity)}`}>
                          {issue.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-350">{issue.remediationOwner}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(issue.status)}`}>
                          {issue.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-350 font-mono text-[10.5px]">
                        {issue.remediationDeadline ? new Date(issue.remediationDeadline).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Issue Details & Workflow Pane */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl flex flex-col min-h-[500px]">
            {selectedIssue ? (
              <div className="space-y-6 flex flex-col h-full overflow-y-auto max-h-[700px] pr-1">
                
                {/* Details Header */}
                <div className="flex justify-between items-start border-b border-white/5 pb-4">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1.5 leading-snug">{selectedIssue.title}</h4>
                    <p className="text-[10px] text-zinc-400 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-zinc-550" /> Remediation Owner: {selectedIssue.remediationOwner}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadgeClass(selectedIssue.severity)}`}>
                    {selectedIssue.severity}
                  </span>
                </div>

                {/* VISUAL WORKFLOW PROGRESS TIMELINE */}
                <div className="bg-black/35 p-4 rounded-xl border border-white/5">
                  <span className="block text-[8.5px] font-bold text-zinc-550 uppercase tracking-widest mb-3">Compliance Issue Workflow</span>
                  <div className="flex flex-col gap-3">
                    {getWorkflowSteps(selectedIssue).map((step, idx, arr) => (
                      <div key={step.key} className="flex items-center gap-3.5 text-xs">
                        {/* Circle badge */}
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] border transition-all ${
                          step.active 
                            ? 'bg-emerald-500 border-emerald-400 text-black shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                            : 'bg-zinc-900 border-white/10 text-zinc-500'
                        }`}>
                          {step.active ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                        </div>
                        {/* Label */}
                        <div className="flex-1">
                          <span className={`font-semibold ${step.active ? 'text-white' : 'text-zinc-500'}`}>{step.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-black/20 border border-white/5 p-3.5 rounded-lg text-xs leading-relaxed text-slate-350">
                  <span className="block text-[8.5px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Description</span>
                  <p>{selectedIssue.description}</p>
                </div>

                {/* Evidence Proof required list */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest">Evidence Required</span>
                      <span className="text-xs font-bold text-white mt-0.5">Proof File Registry ({selectedIssue.evidence?.length || 0})</span>
                    </div>
                    {selectedIssue.status !== 'CLOSED' && (
                      <button 
                        onClick={() => setIsEvidenceModalOpen(true)}
                        className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20"
                      >
                        <Plus className="w-3.5 h-3.5" /> Submit Proof
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
                    {selectedIssue.evidence?.length === 0 ? (
                      <div className="p-4 text-center border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                        <HelpCircle className="w-6 h-6 mx-auto opacity-30 text-zinc-450 mb-1" />
                        <p className="text-[10px] text-zinc-550 italic">No proof files submitted yet.</p>
                      </div>
                    ) : (
                      selectedIssue.evidence.map(item => (
                        <div key={item.id} className="p-3 bg-black/25 border border-white/5 rounded-lg flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center text-zinc-450 shrink-0">
                              {item.fileType === 'image' && <Image className="w-4 h-4 text-amber-400" />}
                              {item.fileType === 'pdf' && <FileText className="w-4 h-4 text-emerald-400" />}
                              {item.fileType === 'document' && <FileCode className="w-4 h-4 text-blue-400" />}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-slate-200 truncate max-w-[120px]">{item.title}</span>
                              <span className="text-[8.5px] text-zinc-500 truncate max-w-[120px]">{item.description}</span>
                            </div>
                          </div>
                          {item.fileUrl && (
                            <a 
                              href={item.fileUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="p-1 hover:bg-white/10 rounded text-emerald-400 shrink-0"
                              title="Download Proof File"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Resolution Workflow Block */}
                <div className="bg-white/[0.01] p-4 rounded-xl border border-white/5 text-xs space-y-3.5">
                  <span className="block text-[8.5px] font-bold text-zinc-550 uppercase tracking-widest">Remediation Status &amp; Resolution</span>
                  
                  {selectedIssue.status === 'CLOSED' ? (
                    <div className="space-y-2">
                      <p className="text-zinc-350 italic font-medium">"{selectedIssue.resolution}"</p>
                      <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] rounded-lg font-bold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Remediation verified & closed on {selectedIssue.remediatedAt ? new Date(selectedIssue.remediatedAt).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>
                  ) : selectedIssue.status === 'RESOLVED' || selectedIssue.status === 'REMEDIATED' ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                        <span className="block text-[8.5px] font-bold text-zinc-500 mb-1">Submitted Resolution Summary</span>
                        <p className="text-zinc-300">"{selectedIssue.resolution}"</p>
                      </div>
                      
                      <div className="border-t border-white/5 pt-3 flex flex-col gap-2">
                        <span className="text-[10px] text-zinc-450 italic">Verify proof evidence files above before closing this compliance risk audit.</span>
                        <button
                          type="button"
                          onClick={handleVerifyAndClose}
                          className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-lg text-xs flex items-center justify-center gap-1 shadow-lg shadow-emerald-500/10 transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4" /> Verify Proof & Close Issue
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Form to resolve issue */
                    <form onSubmit={handleResolveIssueSubmit} className="space-y-2.5">
                      <label className="block text-[9px] text-zinc-400 font-semibold">Enter Action Resolution Notes</label>
                      <textarea
                        rows={2}
                        value={resolutionNotes}
                        onChange={(e) => setResolutionNotes(e.target.value)}
                        placeholder="Detail the steps taken to fix the compliance issue..."
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/50 resize-none text-xs"
                      />
                      <button
                        type="submit"
                        disabled={isSubmittingResolution || !resolutionNotes.trim()}
                        className="w-full py-2 bg-emerald-550 border border-emerald-500/20 hover:bg-emerald-500 hover:text-black text-emerald-450 font-bold rounded-lg text-xs flex items-center justify-center gap-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {isSubmittingResolution ? 'Submitting...' : 'Resolve Issue (Remediate)'}
                      </button>
                    </form>
                  )}
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500">
                <AlertTriangle className="w-12 h-12 mb-2 text-slate-650" />
                <h4 className="font-semibold text-sm text-slate-350 mb-1">No Issue Selected</h4>
                <p className="text-xs text-slate-500 max-w-[200px]">Select an active compliance risk alert from the table to view remediation status, deadline dates, and linked evidence items.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Evidence Modal */}
      {isEvidenceModalOpen && selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="border border-white/10 bg-[#0c0c0e] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scaleIn">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/[0.01]">
              <div>
                <h3 className="text-base font-bold text-white">Upload Remediation Proof</h3>
                <p className="text-[10px] text-zinc-400 mt-0.5">Link official evidence logs for: {selectedIssue.title}</p>
              </div>
              <button 
                onClick={() => {
                  setIsEvidenceModalOpen(false);
                  setSelectedFile(null);
                }}
                className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddEvidence} className="p-6 space-y-4">
              
              <div>
                <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-2">Select Proof Type Required</label>
                <div className="grid grid-cols-3 gap-3">
                  
                  {/* Upload Image Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFileType('image');
                      setSelectedFile(null);
                    }}
                    className={`p-3.5 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all outline-none ${
                      selectedFileType === 'image'
                        ? 'border-amber-500/50 bg-amber-500/[0.04] text-amber-400'
                        : 'border-white/10 hover:border-white/20 text-zinc-400'
                    }`}
                  >
                    <Image className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Upload Image</span>
                  </button>

                  {/* Upload PDF Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFileType('pdf');
                      setSelectedFile(null);
                    }}
                    className={`p-3.5 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all outline-none ${
                      selectedFileType === 'pdf'
                        ? 'border-emerald-500/50 bg-emerald-500/[0.04] text-emerald-400'
                        : 'border-white/10 hover:border-white/20 text-zinc-400'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Upload PDF</span>
                  </button>

                  {/* Upload Document Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFileType('document');
                      setSelectedFile(null);
                    }}
                    className={`p-3.5 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all outline-none ${
                      selectedFileType === 'document'
                        ? 'border-blue-500/50 bg-blue-500/[0.04] text-blue-400'
                        : 'border-white/10 hover:border-white/20 text-zinc-400'
                    }`}
                  >
                    <FileCode className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Upload Document</span>
                  </button>

                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Evidence Title</label>
                <input
                  type="text"
                  required
                  value={newEvidence.title}
                  onChange={(e) => setNewEvidence({...newEvidence, title: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  placeholder="e.g. Audit Findings Remediation Log"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Description / Notes</label>
                <textarea
                  required
                  rows={2}
                  value={newEvidence.description}
                  onChange={(e) => setNewEvidence({...newEvidence, description: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50 resize-none"
                  placeholder="Notes explaining proof contents..."
                />
              </div>

              {/* Styled File Upload Zone */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1.5">Proof Attachment</label>
                
                {!selectedFile ? (
                  <label className="border border-dashed border-white/10 hover:border-emerald-500/30 hover:bg-white/[0.01] rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors">
                    <UploadCloud className="w-8 h-8 text-zinc-550" />
                    <div className="text-center">
                      <span className="text-xs font-bold text-white block">Click to select files</span>
                      <span className="text-[10px] text-zinc-550 mt-0.5 block">
                        {selectedFileType === 'image' && 'Supports PNG, JPG, GIF'}
                        {selectedFileType === 'pdf' && 'Supports PDF certificate files'}
                        {selectedFileType === 'document' && 'Supports DOC, DOCX, XLS, XLSX, TXT'}
                      </span>
                    </div>
                    <input
                      type="file"
                      required
                      className="hidden"
                      onChange={handleFileChange}
                      accept={
                        selectedFileType === 'image' ? 'image/*' :
                        selectedFileType === 'pdf' ? 'application/pdf' :
                        '.doc,.docx,.xls,.xlsx,.txt'
                      }
                    />
                  </label>
                ) : (
                  <div className="p-4 rounded-xl border border-white/10 bg-black/25 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                        {uploadProgress === 100 ? <Check className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white truncate max-w-[200px]">{selectedFile.name}</span>
                        <span className="text-[9px] text-zinc-550">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="text-xs text-zinc-500 hover:text-white uppercase font-bold tracking-wider"
                    >
                      Clear
                    </button>
                  </div>
                )}

                {/* Progress bar */}
                {isUploading && (
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-3">
                    <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Uploaded By</label>
                <input
                  type="text"
                  required
                  value={newEvidence.uploadedBy}
                  onChange={(e) => setNewEvidence({...newEvidence, uploadedBy: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6 bg-[#0c0c0e]">
                <button
                  type="button"
                  onClick={() => {
                    setIsEvidenceModalOpen(false);
                    setSelectedFile(null);
                  }}
                  className="px-4 py-2 rounded-lg text-xs text-slate-350 hover:text-white hover:bg-white/5 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !selectedFile}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-xs shadow-lg shadow-emerald-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline Loader helper if lucide-react loader not defined
function Loader2({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
