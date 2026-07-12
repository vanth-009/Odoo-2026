"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Trophy, Award, X, Trash2, Edit2, HelpCircle, Check, 
  UserCheck, ShieldAlert, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Winner {
  employeeName: string;
  employeeCode: string;
  departmentName: string;
  earnedAt: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockRule: string;
  xpThreshold: number;
  challengesCountThreshold: number;
  status: string; // ACTIVE, DISABLED
  earnedCount: number;
  winners: Winner[];
}

export default function BadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    icon: '🏅',
    unlockRule: '',
    xpThreshold: '0',
    challengesCountThreshold: '0',
    status: 'ACTIVE'
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gamification/badges');
      if (res.ok) {
        const json = await res.json();
        const dataList = json.data || [];
        setBadges(dataList);

        if (selectedBadge) {
          const match = dataList.find((b: any) => b.id === selectedBadge.id);
          if (match) setSelectedBadge(match);
        } else if (dataList.length > 0) {
          setSelectedBadge(dataList[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/gamification/badges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState)
      });

      if (res.ok) {
        toast.success('Badge milestone created successfully!');
        setIsModalOpen(false);
        setFormState({
          name: '',
          description: '',
          icon: '🏅',
          unlockRule: '',
          xpThreshold: '0',
          challengesCountThreshold: '0',
          status: 'ACTIVE'
        });
        fetchData();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to create badge.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection failed.');
    }
  };

  const filteredBadges = badges.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.unlockRule.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-slate-100 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">Milestones &amp; Badges</h3>
          <p className="text-slate-400 text-sm mt-1">Configure unlock criteria rules and audit employee carbon-achievement credentials.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors shadow-lg shadow-emerald-500/20 font-bold text-xs"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Create Badge
        </button>
      </div>

      {/* Filter */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col sm:flex-row gap-4 backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search badges by title or rules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Grid Layout */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Left Table List */}
          <div className="xl:col-span-2 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl flex flex-col">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-xs text-left">
                <thead className="text-zinc-400 uppercase bg-black/25">
                  <tr>
                    <th className="px-6 py-4 rounded-tl-lg font-medium">Badge Milestone</th>
                    <th className="px-6 py-4 font-medium">Unlock Rule</th>
                    <th className="px-6 py-4 font-medium">Employees Earned</th>
                    <th className="px-6 py-4 rounded-tr-lg font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredBadges.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-400 bg-transparent">
                        No badges found matching filters.
                      </td>
                    </tr>
                  ) : filteredBadges.map((b) => (
                    <tr 
                      key={b.id} 
                      onClick={() => setSelectedBadge(b)}
                      className={`cursor-pointer transition-colors ${selectedBadge?.id === b.id ? 'bg-white/10' : 'hover:bg-white/[0.02]'}`}
                    >
                      <td className="px-6 py-4 font-semibold text-white flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-lg bg-zinc-950/80 border border-white/10 flex items-center justify-center text-xl shadow-md">
                          {b.icon}
                        </div>
                        <div className="flex flex-col">
                          <span>{b.name}</span>
                          <span className="text-[10px] font-normal text-zinc-500 line-clamp-1">{b.description}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-350">{b.unlockRule}</td>
                      <td className="px-6 py-4 text-emerald-450 font-bold text-sm pl-8">
                        {b.earnedCount}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Panel: Detail Card & Winners list */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl flex flex-col min-h-[500px]">
            {selectedBadge ? (
              <div className="space-y-6 flex flex-col h-full overflow-y-auto max-h-[700px] pr-1">
                
                {/* Header card */}
                <div className="text-center p-6 bg-black/40 border border-white/5 rounded-xl flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-zinc-950/85 border border-white/15 flex items-center justify-center text-4xl shadow-lg relative mb-3">
                    {selectedBadge.icon}
                  </div>
                  <h4 className="font-bold text-white text-base mb-1">{selectedBadge.name}</h4>
                  <p className="text-xs text-zinc-400 leading-normal max-w-[200px]">{selectedBadge.description}</p>
                </div>

                {/* Unlock Rules */}
                <div className="bg-black/20 border border-white/5 p-3.5 rounded-lg text-xs">
                  <span className="block text-[8.5px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Unlock Criteria Rules</span>
                  <p className="text-emerald-400 font-semibold italic">"{selectedBadge.unlockRule}"</p>
                </div>

                {/* Earned Winners list */}
                <div className="flex-1 flex flex-col">
                  <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-3.5 flex items-center gap-1">
                    <UserCheck className="w-4 h-4 text-emerald-500" /> Recent Awardees ({selectedBadge.winners?.length || 0})
                  </span>
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {selectedBadge.winners?.length === 0 ? (
                      <p className="text-xs text-zinc-555 italic">Milestone not unlocked by any employees yet.</p>
                    ) : (
                      selectedBadge.winners.map((w, idx) => (
                        <div key={idx} className="p-2.5 bg-white/[0.01] border border-white/5 rounded-lg flex items-center justify-between text-xs">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-200">{w.employeeName}</span>
                            <span className="text-[9px] text-zinc-500">{w.departmentName} ({w.employeeCode})</span>
                          </div>
                          <span className="text-[9.5px] text-zinc-500 font-mono">
                            {new Date(w.earnedAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500">
                <Trophy className="w-12 h-12 mb-2 text-slate-600" />
                <h4 className="font-semibold text-sm text-slate-350 mb-1">No Badge Selected</h4>
                <p className="text-xs text-slate-500 max-w-[200px]">Select a badge milestone from the left to audit criteria and award list.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Create Badge Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="border border-white/10 bg-[#0c0c0e] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-scaleIn">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
              <h3 className="text-base font-bold text-white">Create Badge Milestone</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateBadge} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Badge Name</label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({...formState, name: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  placeholder="e.g. Carbon Slayer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Badge Icon (Emoji)</label>
                  <input
                    type="text"
                    required
                    value={formState.icon}
                    onChange={(e) => setFormState({...formState, icon: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                    placeholder="🏅 or 🏆"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Status</label>
                  <select
                    required
                    value={formState.status}
                    onChange={(e) => setFormState({...formState, status: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="DISABLED">Disabled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Criteria Rule Summary</label>
                <input
                  type="text"
                  required
                  value={formState.unlockRule}
                  onChange={(e) => setFormState({...formState, unlockRule: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  placeholder="e.g. Complete 5 Waste Challenges"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">XP Unlock Threshold</label>
                  <input
                    type="number"
                    value={formState.xpThreshold}
                    onChange={(e) => setFormState({...formState, xpThreshold: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Challenges Count Threshold</label>
                  <input
                    type="number"
                    value={formState.challengesCountThreshold}
                    onChange={(e) => setFormState({...formState, challengesCountThreshold: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Badge Description</label>
                <textarea
                  required
                  rows={2}
                  value={formState.description}
                  onChange={(e) => setFormState({...formState, description: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none resize-none"
                  placeholder="Notes explaining badge milestone details..."
                />
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
                  Save Milestone
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
