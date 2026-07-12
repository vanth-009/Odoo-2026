"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, Trophy, Medal, Star, ShieldAlert, Award, Gift, 
  Clock, CheckCircle2, ShoppingBag, Target, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

interface EmployeeSummary {
  id: string;
  name: string;
  employeeCode: string;
  departmentName: string;
  totalXp: number;
  badgesCount: number;
  challengesCompleted: number;
  rewardsRedeemed: number;
}

interface TimelineEvent {
  key: string;
  title: string;
  description: string;
  date: string;
  type: 'challenge' | 'badge' | 'reward';
}

export default function AchievementsPage() {
  const [employees, setEmployees] = useState<EmployeeSummary[]>([]);
  const [selectedEmp, setSelectedEmp] = useState<EmployeeSummary | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchEmployeesList = async () => {
    setIsLoading(true);
    try {
      // Query rankings list to get overall employee scores
      const res = await fetch('/api/gamification/leaderboard');
      if (res.ok) {
        const json = await res.json();
        const rawList = json.leaderboard || [];
        
        // Map to EmployeeSummary objects
        const mappedList: EmployeeSummary[] = rawList.map((e: any) => ({
          id: e.id,
          name: e.employeeName,
          employeeCode: e.employeeCode,
          departmentName: e.departmentName,
          totalXp: e.xp,
          badgesCount: e.badges,
          challengesCompleted: 0, // calculated on selection or loaded
          rewardsRedeemed: 0
        }));

        setEmployees(mappedList);
        if (mappedList.length > 0) {
          setSelectedEmp(mappedList[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTimelineData = async (employeeId: string) => {
    try {
      // Query participations, XP, and rewards catalog to compile the timeline
      const [partsRes, rewardsRes, badgesRes] = await Promise.all([
        fetch('/api/gamification/participation'),
        fetch('/api/gamification/rewards'),
        fetch('/api/gamification/badges')
      ]);

      const events: TimelineEvent[] = [];
      let challengesCount = 0;
      let redemptionsCount = 0;

      if (partsRes.ok) {
        const json = await partsRes.json();
        const pList = json.data || [];
        // Filter approvals for this employee
        pList.filter((p: any) => p.employeeId === employeeId).forEach((p: any) => {
          if (p.approvalStatus === 'APPROVED' && p.approvedAt) {
            challengesCount++;
            events.push({
              key: `part-${p.id}`,
              title: `Completed ${p.challengeTitle}`,
              description: `Successfully resolved the challenge criteria. Earned +${p.challengeXp} XP points.`,
              date: new Date(p.approvedAt).toLocaleDateString(),
              type: 'challenge'
            });
          }
        });
      }

      if (rewardsRes.ok) {
        const json = await rewardsRes.json();
        const rList = json.redemptions || [];
        // Filter redemptions for this employee
        rList.filter((r: any) => r.employeeCode === selectedEmp?.employeeCode).forEach((r: any) => {
          redemptionsCount++;
          events.push({
            key: `red-${r.id}`,
            title: `Redeemed ${r.rewardName}`,
            description: `Exchanged ${r.xpUsed} XP points. Order status: ${r.status}.`,
            date: new Date(r.createdAt).toLocaleDateString(),
            type: 'reward'
          });
        });
      }

      if (badgesRes.ok) {
        const json = await badgesRes.json();
        const bList = json.data || [];
        // Filter badge earned winners matching employeeCode
        bList.forEach((b: any) => {
          const match = b.winners?.find((w: any) => w.employeeCode === selectedEmp?.employeeCode);
          if (match) {
            events.push({
              key: `badge-${b.id}`,
              title: `Unlocked ${b.name} Badge`,
              description: `Unlocked milestone milestone: "${b.unlockRule}"`,
              date: new Date(match.earnedAt).toLocaleDateString(),
              type: 'badge'
            });
          }
        });
      }

      // Sort timeline chronologically (latest first)
      events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setTimeline(events);

      // Update selected summary
      if (selectedEmp) {
        setSelectedEmp(prev => prev ? {
          ...prev,
          challengesCompleted: challengesCount,
          rewardsRedeemed: redemptionsCount
        } : null);
      }

    } catch (err) {
      console.error('Error compiling timeline:', err);
    }
  };

  useEffect(() => {
    fetchEmployeesList();
  }, []);

  useEffect(() => {
    if (selectedEmp) {
      fetchTimelineData(selectedEmp.id);
    }
  }, [selectedEmp?.id]);

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.employeeCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-slate-100 animate-fadeIn">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-white">Achievements &amp; Timelines</h3>
        <p className="text-slate-400 text-sm mt-1">Audit employee profile progress, unlocked badges, and redemption histories.</p>
      </div>

      {/* Main Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Left: Employee Selection sidebar */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl flex flex-col space-y-4">
            <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Select Employee Profile</span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search employee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:outline-none"
              />
            </div>
            
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {filteredEmployees.map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => setSelectedEmp(emp)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors flex items-center justify-between text-xs ${
                    selectedEmp?.id === emp.id
                      ? 'border-emerald-500/50 bg-emerald-500/[0.04]'
                      : 'border-white/5 hover:bg-white/5'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-white">{emp.name}</span>
                    <span className="text-[9px] text-zinc-500">{emp.departmentName} ({emp.employeeCode})</span>
                  </div>
                  <span className="font-black text-amber-400 shrink-0">{emp.totalXp} XP</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Selection detail & Timeline nodes */}
          <div className="xl:col-span-2 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl flex flex-col min-h-[500px]">
            {selectedEmp ? (
              <div className="space-y-6 flex flex-col h-full">
                
                {/* 1. Employee profile stats matrix */}
                <div className="flex justify-between items-start border-b border-white/5 pb-5">
                  <div>
                    <h4 className="font-black text-lg text-white">{selectedEmp.name}</h4>
                    <p className="text-xs text-zinc-400">{selectedEmp.departmentName} Dept — employee Code: {selectedEmp.employeeCode}</p>
                  </div>
                  <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg font-black text-sm">
                    {selectedEmp.totalXp} XP Points
                  </div>
                </div>

                {/* Scorecards */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-black/25 border border-white/5 rounded-lg text-center">
                    <span className="block text-[8.5px] font-bold text-zinc-550 uppercase tracking-widest">Badges Earned</span>
                    <span className="text-lg font-bold text-white mt-1 block">🏆 {selectedEmp.badgesCount}</span>
                  </div>
                  <div className="p-3 bg-black/25 border border-white/5 rounded-lg text-center">
                    <span className="block text-[8.5px] font-bold text-zinc-550 uppercase tracking-widest">Challenges Completed</span>
                    <span className="text-lg font-bold text-white mt-1 block">🎯 {selectedEmp.challengesCompleted}</span>
                  </div>
                  <div className="p-3 bg-black/25 border border-white/5 rounded-lg text-center">
                    <span className="block text-[8.5px] font-bold text-zinc-550 uppercase tracking-widest">Rewards Redeemed</span>
                    <span className="text-lg font-bold text-white mt-1 block">🎁 {selectedEmp.rewardsRedeemed}</span>
                  </div>
                </div>

                {/* 2. CHRONOLOGICAL VERTICAL TIMELINE */}
                <div className="flex-1 flex flex-col pt-4 border-t border-white/5">
                  <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-6">Achievement Timeline History</span>
                  
                  <div className="relative pl-6 border-l border-white/10 space-y-6 ml-3 max-h-[350px] overflow-y-auto">
                    {timeline.length === 0 ? (
                      <div className="text-zinc-550 italic text-xs py-4 pl-2">
                        No achievement milestones logged for this employee profile. Complete challenges to earn badges and rewards!
                      </div>
                    ) : (
                      timeline.map((event) => (
                        <div key={event.key} className="relative group text-xs">
                          {/* Timeline dot identifier icon */}
                          <div className={`absolute -left-[37px] top-0 w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                            event.type === 'challenge' 
                              ? 'bg-emerald-500 border-emerald-400 text-black'
                              : event.type === 'badge'
                                ? 'bg-purple-500 border-purple-400 text-white'
                                : 'bg-rose-500 border-rose-450 text-white'
                          }`}>
                            {event.type === 'challenge' && <Target className="w-3 h-3" />}
                            {event.type === 'badge' && <Trophy className="w-3 h-3" />}
                            {event.type === 'reward' && <Gift className="w-3 h-3" />}
                          </div>
                          
                          {/* Event info card */}
                          <div className="p-3.5 bg-black/35 border border-white/5 rounded-xl space-y-1 ml-2">
                            <div className="flex justify-between items-start gap-2">
                              <span className="font-black text-white text-xs">{event.title}</span>
                              <span className="text-[9.5px] text-zinc-550 font-mono">{event.date}</span>
                            </div>
                            <p className="text-zinc-400 leading-normal text-[11px]">{event.description}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500">
                <Clock className="w-12 h-12 mb-2 text-slate-650" />
                <h4 className="font-semibold text-sm text-slate-350 mb-1">No Profile Selected</h4>
                <p className="text-xs text-slate-500 max-w-[200px]">Select an employee from the left directory list to view carbon XP totals and unlocked achievement timelines.</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
