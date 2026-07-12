"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Target, Calendar, User, Eye, Edit2, Copy, Trash2, 
  X, CheckCircle, BarChart3, HelpCircle, Layers, Award, Sparkles, Check
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Participant {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  departmentName: string;
  progress: number;
  proof: string;
  approvalStatus: string;
  submittedAt: string | null;
  approvedAt: string | null;
  approvedBy: string;
}

interface Challenge {
  id: string;
  title: string;
  category: string;
  description: string;
  difficulty: string;
  evidenceRequired: string;
  xp: number;
  startDate: string;
  deadline: string;
  status: string;
  createdBy: string;
  createdAt: string;
  participantsCount: number;
  completionsCount: number;
  participations: Participant[];
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  
  // Tabs for details
  const [detailTab, setDetailTab] = useState<'overview' | 'participants' | 'submissions' | 'analytics'>('overview');

  // Modal forms
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formState, setFormState] = useState({
    title: '',
    category: 'Environmental',
    description: '',
    difficulty: 'Medium',
    xp: '100',
    evidenceRequired: '',
    startDate: '',
    deadline: '',
    status: 'Draft'
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gamification/challenges');
      if (res.ok) {
        const json = await res.json();
        const dataList = json.data || [];
        setChallenges(dataList);

        if (selectedChallenge) {
          const match = dataList.find((c: any) => c.id === selectedChallenge.id);
          if (match) setSelectedChallenge(match);
        } else if (dataList.length > 0) {
          setSelectedChallenge(dataList[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setModalMode('create');
    setFormState({
      title: '',
      category: 'Environmental',
      description: '',
      difficulty: 'Medium',
      xp: '100',
      evidenceRequired: '',
      startDate: new Date().toISOString().split('T')[0],
      deadline: '',
      status: 'Draft'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Challenge) => {
    setModalMode('edit');
    setFormState({
      title: c.title,
      category: c.category,
      description: c.description,
      difficulty: c.difficulty,
      xp: String(c.xp),
      evidenceRequired: c.evidenceRequired,
      startDate: c.startDate.split('T')[0],
      deadline: c.deadline.split('T')[0],
      status: c.status
    });
    setIsModalOpen(true);
  };

  const handleDuplicate = async (c: Challenge) => {
    try {
      const res = await fetch('/api/gamification/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${c.title} (Copy)`,
          category: c.category,
          description: c.description,
          difficulty: c.difficulty,
          xp: String(c.xp),
          evidenceRequired: c.evidenceRequired,
          startDate: c.startDate,
          deadline: c.deadline,
          status: 'Draft',
          createdBy: 'Admin'
        })
      });

      if (res.ok) {
        toast.success('Challenge duplicated as Draft!');
        fetchData();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to duplicate challenge.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection failed.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this challenge?')) return;
    try {
      const res = await fetch(`/api/gamification/challenges/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast.success('Challenge deleted successfully.');
        setSelectedChallenge(null);
        fetchData();
      } else {
        toast.error('Failed to delete challenge.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection failed.');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = modalMode === 'create' 
        ? '/api/gamification/challenges'
        : `/api/gamification/challenges/${selectedChallenge?.id}`;
      const method = modalMode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState)
      });

      if (res.ok) {
        toast.success(modalMode === 'create' ? 'Challenge created successfully!' : 'Challenge updated successfully!');
        setIsModalOpen(false);
        fetchData();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Submission failed.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection failed.');
    }
  };

  const filteredChallenges = challenges.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiff = difficultyFilter === 'ALL' || c.difficulty === difficultyFilter;
    return matchesSearch && matchesDiff;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/20';
      case 'Completed':
        return 'bg-blue-500/10 text-blue-450 border border-blue-500/20';
      case 'Under Review':
        return 'bg-amber-500/10 text-amber-450 border border-amber-500/20';
      case 'Draft':
        return 'bg-zinc-800 text-zinc-400 border border-zinc-700';
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'text-emerald-400';
      case 'Hard':
        return 'text-red-400';
      default:
        return 'text-amber-400';
    }
  };

  // Compute Analytics
  const completionPercentage = selectedChallenge?.participantsCount 
    ? Math.round((selectedChallenge.completionsCount / selectedChallenge.participantsCount) * 100)
    : 0;

  const departmentCounts: { [name: string]: number } = {};
  selectedChallenge?.participations.forEach(p => {
    departmentCounts[p.departmentName] = (departmentCounts[p.departmentName] || 0) + 1;
  });

  return (
    <div className="space-y-6 text-slate-100 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">Sustainability Challenges</h3>
          <p className="text-slate-400 text-sm mt-1">Design, monitor, and coordinate sustainability action challenges for corporate ESG engagement.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors shadow-lg shadow-emerald-500/20 font-bold text-xs"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Create Challenge
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col sm:flex-row gap-4 backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search challenges by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
        <div className="relative w-48">
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none"
          >
            <option value="ALL" className="bg-slate-900">All Difficulties</option>
            <option value="Easy" className="bg-slate-900">Easy</option>
            <option value="Medium" className="bg-slate-900">Medium</option>
            <option value="Hard" className="bg-slate-900">Hard</option>
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
          
          {/* Challenges Directory List */}
          <div className="xl:col-span-2 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl flex flex-col">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-xs text-left">
                <thead className="text-zinc-400 uppercase bg-black/25">
                  <tr>
                    <th className="px-6 py-4 rounded-tl-lg font-medium">Challenge Title</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Difficulty</th>
                    <th className="px-6 py-4 font-medium">XP Reward</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 rounded-tr-lg font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredChallenges.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-400 bg-transparent">
                        No challenges found matching filters.
                      </td>
                    </tr>
                  ) : filteredChallenges.map((c) => (
                    <tr 
                      key={c.id} 
                      onClick={() => setSelectedChallenge(c)}
                      className={`cursor-pointer transition-colors ${selectedChallenge?.id === c.id ? 'bg-white/10' : 'hover:bg-white/[0.02]'}`}
                    >
                      <td className="px-6 py-4 font-semibold text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                          <Target className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span>{c.title}</span>
                          <span className="text-[10px] font-normal text-zinc-500 line-clamp-1">{c.description}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-350">{c.category}</td>
                      <td className={`px-6 py-4 font-bold ${getDifficultyColor(c.difficulty)}`}>{c.difficulty}</td>
                      <td className="px-6 py-4 text-amber-400 font-bold">{c.xp} XP</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(c.status)}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleOpenEdit(c)}
                            title="Edit"
                            className="p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-white"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDuplicate(c)}
                            title="Duplicate"
                            className="p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-white"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            title="Delete"
                            className="p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Panel: Challenge Detail & Tabbed Sections */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl flex flex-col min-h-[500px]">
            {selectedChallenge ? (
              <div className="space-y-6 flex flex-col h-full overflow-y-auto max-h-[700px] pr-1">
                
                {/* Header detail */}
                <div className="border-b border-white/5 pb-4">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Challenge Profile</span>
                  <h4 className="text-sm font-bold text-white mb-1.5 leading-snug">{selectedChallenge.title}</h4>
                  <div className="flex flex-wrap items-center gap-2.5 mt-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${getStatusColor(selectedChallenge.status)}`}>
                      {selectedChallenge.status}
                    </span>
                    <span className="text-[10px] text-zinc-400">XP payout: {selectedChallenge.xp}</span>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-white/5">
                  {(['overview', 'participants', 'submissions', 'analytics'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setDetailTab(tab)}
                      className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider border-b-2 text-center transition-all ${
                        detailTab === tab 
                          ? 'border-emerald-500 text-emerald-450 bg-emerald-500/[0.01]' 
                          : 'border-transparent text-zinc-500 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1">
                  
                  {/* OVERVIEW TAB */}
                  {detailTab === 'overview' && (
                    <div className="space-y-4 text-xs">
                      <div className="bg-black/25 p-3 rounded-lg border border-white/5 leading-relaxed text-slate-350">
                        <span className="block text-[8.5px] font-bold text-zinc-550 uppercase tracking-widest mb-1">Challenge Summary</span>
                        <p>{selectedChallenge.description || 'No description provided.'}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/25 p-3 rounded-lg border border-white/5">
                          <span className="block text-[8.5px] font-bold text-zinc-550 uppercase tracking-widest">Difficulty</span>
                          <span className={`font-bold mt-1 block ${getDifficultyColor(selectedChallenge.difficulty)}`}>{selectedChallenge.difficulty}</span>
                        </div>
                        <div className="bg-black/25 p-3 rounded-lg border border-white/5">
                          <span className="block text-[8.5px] font-bold text-zinc-550 uppercase tracking-widest">Category</span>
                          <span className="font-bold text-slate-200 mt-1 block">{selectedChallenge.category}</span>
                        </div>
                      </div>

                      <div className="bg-black/25 p-3 rounded-lg border border-white/5">
                        <span className="block text-[8.5px] font-bold text-zinc-550 uppercase tracking-widest mb-1">Evidence Required (Proof)</span>
                        <p className="text-slate-300 italic">"{selectedChallenge.evidenceRequired || 'Self-reporting progress.'}"</p>
                      </div>

                      <div className="bg-white/[0.01] p-3 rounded-lg border border-white/5 flex items-center justify-between">
                        <span className="text-[10px] text-zinc-400">Launch Timeline:</span>
                        <span className="font-mono font-semibold text-slate-200">
                          {new Date(selectedChallenge.startDate).toLocaleDateString()} - {new Date(selectedChallenge.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* PARTICIPANTS TAB */}
                  {detailTab === 'participants' && (
                    <div className="space-y-3">
                      <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Registered Employees ({selectedChallenge.participations?.length || 0})</span>
                      <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                        {selectedChallenge.participations?.length === 0 ? (
                          <p className="text-xs text-zinc-550 italic">No registrations for this challenge yet.</p>
                        ) : (
                          selectedChallenge.participations.map(p => (
                            <div key={p.id} className="p-2.5 bg-black/20 border border-white/5 rounded-lg flex items-center justify-between text-xs">
                              <div className="flex flex-col">
                                <span className="font-bold text-white">{p.employeeName}</span>
                                <span className="text-[9px] text-zinc-500">{p.departmentName} ({p.employeeCode})</span>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="text-emerald-450 font-bold">{p.progress}% Completed</span>
                                <span className="text-[8.5px] text-zinc-550 mt-0.5">Status: {p.approvalStatus}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* SUBMISSIONS TAB */}
                  {detailTab === 'submissions' && (
                    <div className="space-y-3">
                      <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Uploaded Evidence Files</span>
                      <div className="space-y-3.5 max-h-[250px] overflow-y-auto pr-1">
                        {selectedChallenge.participations?.filter(p => p.submittedAt).length === 0 ? (
                          <p className="text-xs text-zinc-550 italic">No submissions submitted for review yet.</p>
                        ) : (
                          selectedChallenge.participations.filter(p => p.submittedAt).map(p => (
                            <div key={p.id} className="p-3 bg-black/30 border border-white/5 rounded-lg text-xs space-y-2">
                              <div className="flex justify-between items-start">
                                <div className="flex flex-col">
                                  <span className="font-bold text-slate-200">{p.employeeName}</span>
                                  <span className="text-[8.5px] text-zinc-500">Submitted on {p.submittedAt ? new Date(p.submittedAt).toLocaleDateString() : ''}</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                  p.approvalStatus === 'APPROVED' 
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : p.approvalStatus === 'REJECTED'
                                      ? 'bg-red-500/10 text-red-400'
                                      : 'bg-amber-500/10 text-amber-400'
                                }`}>
                                  {p.approvalStatus}
                                </span>
                              </div>
                              <div className="bg-black/20 p-2 rounded text-[10px] text-zinc-400 italic">
                                "{p.proof}"
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* ANALYTICS TAB */}
                  {detailTab === 'analytics' && (
                    <div className="space-y-4 text-xs">
                      
                      <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-2">
                        <span className="block text-[8.5px] font-bold text-zinc-500 uppercase tracking-widest">Completion rate</span>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-black text-white">{completionPercentage}%</span>
                          <div className="flex-1 bg-white/5 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${completionPercentage}%` }} />
                          </div>
                        </div>
                        <span className="block text-[9px] text-zinc-500 mt-1">{selectedChallenge.completionsCount} of {selectedChallenge.participantsCount} participants completed</span>
                      </div>

                      <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                        <span className="block text-[8.5px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Department Participation</span>
                        {Object.keys(departmentCounts).length === 0 ? (
                          <p className="text-[10px] text-zinc-550 italic">No participation metrics loaded.</p>
                        ) : (
                          <div className="space-y-2">
                            {Object.entries(departmentCounts).map(([dept, count]) => (
                              <div key={dept} className="flex justify-between items-center text-[10px] border-b border-white/[0.02] pb-1">
                                <span className="text-slate-350">{dept}</span>
                                <span className="font-bold text-white">{count} employees</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500">
                <Target className="w-12 h-12 mb-2 text-slate-600" />
                <h4 className="font-semibold text-sm text-slate-300 mb-1">No Challenge Selected</h4>
                <p className="text-xs text-slate-500 max-w-[200px]">Select a challenge from the list to inspect details, overview rules, participant logs, and completion rates.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Create / Edit Challenge Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="border border-white/10 bg-[#0c0c0e] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scaleIn">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
              <h3 className="text-base font-bold text-white">
                {modalMode === 'create' ? 'Create Sustainability Challenge' : 'Edit Challenge Parameters'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Challenge Title</label>
                <input
                  type="text"
                  required
                  value={formState.title}
                  onChange={(e) => setFormState({...formState, title: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  placeholder="e.g. Zero-Plastic Week"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Category</label>
                  <select
                    required
                    value={formState.category}
                    onChange={(e) => setFormState({...formState, category: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Environmental">Environmental</option>
                    <option value="Social Engagement">Social Engagement</option>
                    <option value="Office Operations">Office Operations</option>
                    <option value="Energy Conservation">Energy Conservation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Difficulty</label>
                  <select
                    required
                    value={formState.difficulty}
                    onChange={(e) => setFormState({...formState, difficulty: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">XP Points Reward</label>
                <input
                  type="number"
                  required
                  value={formState.xp}
                  onChange={(e) => setFormState({...formState, xp: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Description / Rules</label>
                <textarea
                  required
                  rows={2}
                  value={formState.description}
                  onChange={(e) => setFormState({...formState, description: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50 resize-none text-xs"
                  placeholder="Detail the guidelines and thresholds..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Evidence Required (Checklist Details)</label>
                <textarea
                  required
                  rows={2}
                  value={formState.evidenceRequired}
                  onChange={(e) => setFormState({...formState, evidenceRequired: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50 resize-none text-xs"
                  placeholder="What document or screenshot must participants submit as proof?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formState.startDate}
                    onChange={(e) => setFormState({...formState, startDate: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Deadline Date</label>
                  <input
                    type="date"
                    required
                    value={formState.deadline}
                    onChange={(e) => setFormState({...formState, deadline: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none [color-scheme:dark]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Challenge Status</label>
                <select
                  required
                  value={formState.status}
                  onChange={(e) => setFormState({...formState, status: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Draft">Draft</option>
                  <option value="Active">Active</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Completed">Completed</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6 bg-[#0c0c0e]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-350 hover:text-white hover:bg-white/5 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-xs shadow-lg shadow-emerald-500/10 transition-colors"
                >
                  Save Challenge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
