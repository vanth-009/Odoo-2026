"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Calendar, Award, CheckCircle2, Clock, PlayCircle, X } from 'lucide-react';
import JoinActivityModal from '@/components/JoinActivityModal';
import { useToast } from '@/components/Toast';

interface CSRActivity {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
  xpReward: number;
  imageUrl?: string;
  category: {
    id: number;
    name: string;
  };
}

interface CSRCategory {
  id: number;
  name: string;
  icon?: string;
  color?: string;
}

export default function CSRActivitiesPage() {
  const [activities, setActivities] = useState<CSRActivity[]>([]);
  const [categories, setCategories] = useState<CSRCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Join Modal State
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);
  const [selectedActivityTitle, setSelectedActivityTitle] = useState('');
  const { toast } = useToast();
  
  // Form state
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'UPCOMING',
    xpReward: 20,
    categoryId: '',
    organizerName: 'System',
    location: '',
    maxParticipants: 50
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const actRes = await fetch('/api/social/csr-activities?limit=100');
      if (actRes.ok) {
        const json = await actRes.json();
        setActivities(json.data || []);
      }
      const catRes = await fetch('/api/social/categories');
      if (catRes.ok) {
        const json = await catRes.json();
        setCategories(json.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.categoryId) {
      alert('Please select a category.');
      return;
    }
    try {
      const response = await fetch('/api/social/csr-activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newActivity,
          categoryId: Number(newActivity.categoryId)
        }),
      });
      
      if (response.ok) {
        setIsModalOpen(false);
        fetchData();
        // Reset form
        setNewActivity({
          title: '',
          description: '',
          startDate: '',
          endDate: '',
          status: 'UPCOMING',
          xpReward: 20,
          categoryId: '',
          organizerName: 'System',
          location: '',
          maxParticipants: 50
        });
      } else {
        const errJson = await response.json();
        alert(errJson.error || 'Failed to create activity.');
      }
    } catch (error) {
      console.error('Error creating activity:', error);
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || activity.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || String(activity.category?.id) === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ONGOING':
        return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: PlayCircle };
      case 'UPCOMING':
        return { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Clock };
      case 'COMPLETED':
        return { color: 'text-slate-400', bg: 'bg-white/5', border: 'border-white/10', icon: CheckCircle2 };
      default:
        return { color: 'text-slate-400', bg: 'bg-white/5', border: 'border-white/10', icon: Clock };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">CSR Activities</h3>
          <p className="text-slate-400 text-sm mt-1">Manage and track Corporate Social Responsibility initiatives.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors shadow-lg shadow-emerald-500/20 font-medium text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Activity
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col sm:flex-row gap-4 backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search activities by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>
        <div className="flex gap-4">
          <div className="relative w-40">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 transition-colors"
            >
              <option value="ALL" className="bg-slate-900">All Statuses</option>
              <option value="UPCOMING" className="bg-slate-900">Upcoming</option>
              <option value="ONGOING" className="bg-slate-900">Ongoing</option>
              <option value="COMPLETED" className="bg-slate-900">Completed</option>
            </select>
          </div>
          <div className="relative w-44">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 transition-colors"
            >
              <option value="ALL" className="bg-slate-900">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Activity Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      ) : filteredActivities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => {
            const statusConfig = getStatusConfig(activity.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div key={activity.id} className="border border-white/10 bg-white/5 rounded-xl hover:border-white/20 transition-colors group flex flex-col backdrop-blur-md overflow-hidden">
                {activity.imageUrl && (
                  <div className="w-full h-40 bg-black/40 relative shrink-0">
                    <img src={activity.imageUrl} alt={activity.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4 gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {activity.category?.name || 'Uncategorized'}
                    </span>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {activity.status}
                    </div>
                  </div>
                
                <h4 className="text-base font-semibold text-white mb-2 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                  {activity.title}
                </h4>
                
                <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                  {activity.description}
                </p>
                
                <div className="space-y-3 mt-auto border-t border-white/5 pt-4">
                  <div className="flex items-center text-xs text-slate-300">
                    <Calendar className="w-3.5 h-3.5 mr-2 text-slate-500" />
                    {new Date(activity.startDate).toLocaleDateString()} - {new Date(activity.endDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-xs font-semibold text-amber-400 bg-amber-400/10 w-fit px-2.5 py-1 rounded-lg border border-amber-400/20">
                    <Award className="w-3.5 h-3.5 mr-1.5" />
                    {activity.xpReward} XP Reward
                  </div>
                </div>
                
                <button 
                  disabled={activity.status === 'COMPLETED'}
                  onClick={() => {
                    setSelectedActivityId(activity.id);
                    setSelectedActivityTitle(activity.title);
                    setIsJoinModalOpen(true);
                  }}
                  className={`w-full py-2.5 rounded-lg font-bold transition-colors mt-6 shadow-[0_0_15px_rgba(16,185,129,0.2)] text-sm ${activity.status === 'COMPLETED' ? 'bg-white/10 text-slate-400 cursor-not-allowed shadow-none' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}
                >
                  {activity.status === 'COMPLETED' ? 'Completed' : 'Join Activity'}
                </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="border border-white/10 bg-white/5 rounded-xl p-12 text-center backdrop-blur-md">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-4">
            <Search className="w-6 h-6 text-slate-400" />
          </div>
          <h4 className="text-lg font-medium text-white mb-1">No activities found</h4>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            {searchQuery || statusFilter !== 'ALL' || categoryFilter !== 'ALL'
              ? "We couldn't find any activities matching your current filters. Try adjusting your search criteria."
              : "There are no CSR activities yet. Create your first one to get started!"}
          </p>
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="border border-white/10 bg-slate-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
              <h3 className="text-lg font-semibold text-white">Create CSR Activity</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateActivity} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Activity Category</label>
                <select
                  required
                  value={newActivity.categoryId}
                  onChange={(e) => setNewActivity({...newActivity, categoryId: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                >
                  <option value="" className="bg-slate-900">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                  placeholder="e.g. Coastal Mangrove Restoration Drive"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                  placeholder="Provide brief details about the schedule, requirements, and volunteering impact..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={newActivity.startDate}
                    onChange={(e) => setNewActivity({...newActivity, startDate: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={newActivity.endDate}
                    onChange={(e) => setNewActivity({...newActivity, endDate: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors [color-scheme:dark]"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Organizer Name</label>
                  <input
                    type="text"
                    required
                    value={newActivity.organizerName}
                    onChange={(e) => setNewActivity({...newActivity, organizerName: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={newActivity.location}
                    onChange={(e) => setNewActivity({...newActivity, location: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                    placeholder="e.g. San Francisco Bay, CA"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">XP Reward</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newActivity.xpReward}
                    onChange={(e) => setNewActivity({...newActivity, xpReward: parseInt(e.target.value) || 0})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Max Participants</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newActivity.maxParticipants}
                    onChange={(e) => setNewActivity({...newActivity, maxParticipants: parseInt(e.target.value) || 0})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors shadow-lg shadow-emerald-500/20 font-medium text-xs"
                >
                  Create Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Join Activity Modal */}
      <JoinActivityModal 
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        activityId={selectedActivityId}
        activityTitle={selectedActivityTitle}
        onSuccess={() => {
          toast(`Successfully joined ${selectedActivityTitle}.`, "success");
        }}
      />
    </div>
  );
}
