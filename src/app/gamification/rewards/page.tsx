"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Gift, Award, Calendar, Check, X, 
  Trash2, Edit2, ShieldAlert, Sparkles, ShoppingBag, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Reward {
  id: string;
  name: string;
  costXp: number;
  stock: number;
  status: string; // ACTIVE, DISABLED
  description: string;
}

interface Redemption {
  id: string;
  employeeName: string;
  employeeCode: string;
  departmentName: string;
  rewardName: string;
  xpUsed: number;
  status: string; // PENDING, APPROVED, DELIVERED, REJECTED
  createdAt: string;
}

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'queue'>('catalog');
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Form modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  const [formState, setFormState] = useState({
    name: '',
    costXp: '100',
    stock: '10',
    description: '',
    status: 'ACTIVE'
  });

  const [stockInput, setStockInput] = useState('10');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gamification/rewards');
      if (res.ok) {
        const json = await res.json();
        setRewards(json.rewards || []);
        setRedemptions(json.redemptions || []);
      }
    } catch (error) {
      console.error('Error fetching rewards details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateReward = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/gamification/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE',
          ...formState
        })
      });

      if (res.ok) {
        toast.success('Reward item added to catalog!');
        setIsCreateModalOpen(false);
        setFormState({
          name: '',
          costXp: '100',
          stock: '10',
          description: '',
          status: 'ACTIVE'
        });
        fetchData();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to add reward.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection failed.');
    }
  };

  const handleUpdateStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReward) return;
    try {
      const res = await fetch('/api/gamification/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_STOCK',
          rewardId: selectedReward.id,
          stock: stockInput
        })
      });

      if (res.ok) {
        toast.success('Inventory stock level updated.');
        setIsStockModalOpen(false);
        fetchData();
      } else {
        toast.error('Failed to update stock.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection failed.');
    }
  };

  const handleProcessRedemption = async (redId: string, status: 'APPROVED' | 'DELIVERED' | 'REJECTED') => {
    try {
      const res = await fetch('/api/gamification/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REDEMPTION_STATUS',
          redemptionId: redId,
          status
        })
      });

      if (res.ok) {
        toast.success(`Redemption marked as ${status.toLowerCase()} successfully.`);
        fetchData();
      } else {
        toast.error('Failed to process redemption.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection failed.');
    }
  };

  const filteredRewards = rewards.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRedemptions = redemptions.filter(red => 
    red.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    red.rewardName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRedemptionStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/20';
      case 'APPROVED':
        return 'bg-blue-500/10 text-blue-455 border border-blue-500/20';
      case 'REJECTED':
        return 'bg-rose-500/10 text-rose-450 border border-rose-500/20';
      default:
        return 'bg-amber-500/10 text-amber-450 border border-amber-500/20';
    }
  };

  return (
    <div className="space-y-6 text-slate-100 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">Rewards Store Catalog</h3>
          <p className="text-slate-400 text-sm mt-1">Manage catalog items, update stock counts, and approve reward redemption requests.</p>
        </div>
        {activeTab === 'catalog' && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors shadow-lg shadow-emerald-500/20 font-bold text-xs"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Reward Item
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-px">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all outline-none ${
            activeTab === 'catalog'
              ? 'border-emerald-500 text-emerald-455 bg-emerald-500/[0.01]'
              : 'border-transparent text-zinc-500 hover:text-white'
          }`}
        >
          <Gift className="w-4 h-4 inline mr-1.5" /> Rewards Storefront
        </button>
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all outline-none ${
            activeTab === 'queue'
              ? 'border-emerald-500 text-emerald-455 bg-emerald-500/[0.01]'
              : 'border-transparent text-zinc-500 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4 inline mr-1.5" /> Redemptions Queue
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col sm:flex-row gap-4 backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={activeTab === 'catalog' ? "Search reward store items..." : "Search redemptions queue by employee or reward..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Content panels */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      ) : activeTab === 'catalog' ? (
        
        /* Catalog Store Grid layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredRewards.length === 0 ? (
            <div className="md:col-span-4 p-12 text-center text-zinc-550 border border-dashed border-white/10 rounded-xl bg-white/[0.01] italic">
              No reward items found matching filter.
            </div>
          ) : filteredRewards.map((reward) => (
            <div key={reward.id} className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-md shadow-xl flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-start">
                  <div className="w-9 h-9 rounded-lg bg-zinc-950/80 border border-white/10 flex items-center justify-center text-amber-400 shadow-md">
                    <Gift className="w-5 h-5" />
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold ${
                    reward.stock > 0 
                      ? 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/10'
                      : 'bg-rose-500/10 text-rose-450 border border-rose-500/10'
                  }`}>
                    {reward.stock > 0 ? `${reward.stock} in Stock` : 'Out of Stock'}
                  </span>
                </div>
                <h4 className="font-bold text-white text-xs mt-3 leading-snug">{reward.name}</h4>
                <p className="text-[10px] text-zinc-450 mt-1 line-clamp-2 leading-relaxed">{reward.description}</p>
              </div>

              <div className="border-t border-white/5 pt-3.5 flex items-center justify-between">
                <span className="text-amber-400 font-black text-xs">{reward.costXp} XP Points</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedReward(reward);
                      setStockInput(String(reward.stock));
                      setIsStockModalOpen(true);
                    }}
                    className="p-1.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded font-semibold text-[10px] text-slate-300 transition-colors"
                  >
                    Set Stock
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      ) : (

        /* Redemptions queue list logs */
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-zinc-400 uppercase bg-black/25">
                <tr>
                  <th className="px-6 py-4 rounded-tl-lg font-medium">Employee</th>
                  <th className="px-6 py-4 font-medium">Reward Claimed</th>
                  <th className="px-6 py-4 font-medium">XP Points Used</th>
                  <th className="px-6 py-4 font-medium">Redeemed Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 rounded-tr-lg font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRedemptions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400 bg-transparent">
                      No reward redemptions found in the queue.
                    </td>
                  </tr>
                ) : filteredRedemptions.map((red) => (
                  <tr key={red.id} className="hover:bg-white/[0.02] transition-colors">
                    
                    {/* Employee profile */}
                    <td className="px-6 py-4 font-bold text-white flex flex-col">
                      <span>{red.employeeName}</span>
                      <span className="text-[9px] font-normal text-zinc-500">{red.departmentName} ({red.employeeCode})</span>
                    </td>

                    {/* Reward name */}
                    <td className="px-6 py-4 font-semibold text-slate-200">
                      {red.rewardName}
                    </td>

                    {/* Cost */}
                    <td className="px-6 py-4 font-bold text-amber-400 pl-8">
                      -{red.xpUsed} XP
                    </td>

                    {/* Redeemed date */}
                    <td className="px-6 py-4 text-slate-400 font-mono text-[10.5px]">
                      {new Date(red.createdAt).toLocaleDateString()}
                    </td>

                    {/* Status badge */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getRedemptionStatusColor(red.status)}`}>
                        {red.status}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="px-6 py-4 text-right">
                      {red.status === 'PENDING' ? (
                        <div className="inline-flex gap-1.5">
                          <button
                            onClick={() => handleProcessRedemption(red.id, 'APPROVED')}
                            className="p-1 px-2 text-[10px] font-bold bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500 hover:text-white rounded text-blue-450 transition-all"
                          >
                            Approve Order
                          </button>
                          <button
                            onClick={() => handleProcessRedemption(red.id, 'REJECTED')}
                            className="p-1 px-2 text-[10px] font-bold bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:text-white rounded text-rose-400 transition-all"
                          >
                            Reject &amp; Refund
                          </button>
                        </div>
                      ) : red.status === 'APPROVED' ? (
                        <button
                          onClick={() => handleProcessRedemption(red.id, 'DELIVERED')}
                          className="p-1 px-2 text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500 hover:text-black rounded text-emerald-400 transition-all"
                        >
                          Mark Delivered
                        </button>
                      ) : (
                        <span className="text-[10px] text-zinc-650 italic">Completed</span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      )}

      {/* Add Reward Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="border border-white/10 bg-[#0c0c0e] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-scaleIn">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
              <h3 className="text-base font-bold text-white">Add Reward Item</h3>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateReward} className="p-6 space-y-4">
              
              <div>
                <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Reward Name</label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({...formState, name: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  placeholder="e.g. Starbucks Gift Card"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">XP Points Cost</label>
                  <input
                    type="number"
                    required
                    value={formState.costXp}
                    onChange={(e) => setFormState({...formState, costXp: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Stock Count</label>
                  <input
                    type="number"
                    required
                    value={formState.stock}
                    onChange={(e) => setFormState({...formState, stock: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                    placeholder="10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Description</label>
                <textarea
                  required
                  rows={2}
                  value={formState.description}
                  onChange={(e) => setFormState({...formState, description: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none resize-none"
                  placeholder="Summarize reward details..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6 bg-[#0c0c0e]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-350 hover:text-white hover:bg-white/5 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-xs shadow-lg shadow-emerald-500/10 transition-colors"
                >
                  Add Item
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Edit Stock Modal */}
      {isStockModalOpen && selectedReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="border border-white/10 bg-[#0c0c0e] rounded-2xl w-full max-w-xs overflow-hidden shadow-2xl animate-scaleIn">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
              <div>
                <h3 className="text-base font-bold text-white">Adjust Stock Level</h3>
                <p className="text-[10px] text-zinc-550 mt-0.5">{selectedReward.name}</p>
              </div>
              <button 
                onClick={() => setIsStockModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateStockSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">Stock Inventory Count</label>
                <input
                  type="number"
                  required
                  value={stockInput}
                  onChange={(e) => setStockInput(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6 bg-[#0c0c0e]">
                <button
                  type="button"
                  onClick={() => setIsStockModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-350 hover:text-white hover:bg-white/5 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-xs shadow-lg shadow-emerald-500/10 transition-colors"
                >
                  Update Stock
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
