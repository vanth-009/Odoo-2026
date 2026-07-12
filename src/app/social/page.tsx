import React from 'react';
import { prisma } from '@/lib/db';
import { 
  HeartHandshake, 
  Users, 
  Clock, 
  Star,
  Activity,
  Award,
  Calendar
} from 'lucide-react';

export const revalidate = 0; // Disable caching to fetch live data

export default async function SocialDashboardPage() {
  // Fetch data from database
  const totalActivities = await prisma.csrActivity.count();
  const totalParticipations = await prisma.employeeParticipation.count();
  
  const hoursAgg = await prisma.employeeParticipation.aggregate({
    _sum: { hoursContributed: true }
  });
  const totalHours = hoursAgg._sum.hoursContributed || 0;
  
  const xpAgg = await prisma.employeeParticipation.aggregate({
    _sum: { pointsEarned: true }
  });
  const totalXp = xpAgg._sum.pointsEarned || 0;

  const recentActivities = await prisma.csrActivity.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { category: true }
  });

  const topParticipantsRaw = await prisma.employeeParticipation.groupBy({
    by: ['employeeId'],
    _sum: { pointsEarned: true },
    orderBy: {
      _sum: { pointsEarned: 'desc' }
    },
    take: 5,
  });

  const employeeIds = topParticipantsRaw.map(p => p.employeeId);
  const employees = await prisma.employee.findMany({
    where: { id: { in: employeeIds } },
    select: { 
      id: true, 
      firstName: true, 
      lastName: true, 
      avatarUrl: true, 
      department: { select: { name: true } } 
    }
  });

  const topParticipants = topParticipantsRaw.map(p => {
    const emp = employees.find(e => e.id === p.employeeId);
    return {
      ...p,
      employee: emp
    };
  });

  return (
    <div className="space-y-8 text-slate-100">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent w-fit">
          Social Performance Summary
        </h2>
        <p className="text-sm text-slate-400">Monitor CSR activities, community engagement, and employee volunteer impacts.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 rounded-xl border border-white/10 bg-white/5 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-emerald-500/30 transition-all backdrop-blur-md">
          <div className="p-3 bg-[#10b981]/10 text-emerald-400 rounded-lg">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Total Activities</p>
            <h3 className="text-2xl font-bold">{totalActivities}</h3>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-white/10 bg-white/5 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-teal-500/30 transition-all backdrop-blur-md">
          <div className="p-3 bg-[#2dd4bf]/10 text-teal-400 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Participations</p>
            <h3 className="text-2xl font-bold">{totalParticipations}</h3>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-white/10 bg-white/5 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-emerald-500/30 transition-all backdrop-blur-md">
          <div className="p-3 bg-[#10b981]/10 text-emerald-400 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Hours Volunteered</p>
            <h3 className="text-2xl font-bold">{totalHours} hrs</h3>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-white/10 bg-white/5 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-teal-500/30 transition-all backdrop-blur-md">
          <div className="p-3 bg-[#2dd4bf]/10 text-teal-400 rounded-lg">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">XP Awarded</p>
            <h3 className="text-2xl font-bold">{totalXp} XP</h3>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activities */}
        <div className="p-6 rounded-xl border border-white/10 bg-white/5 shadow-sm flex flex-col gap-6 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold">Recent Activities</h3>
          </div>
          <div className="flex flex-col gap-4">
            {recentActivities.length === 0 ? (
              <p className="text-sm text-slate-400">No recent activities found.</p>
            ) : (
              recentActivities.map(activity => (
                <div key={activity.id} className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex flex-col gap-1">
                    <h4 className="font-medium text-sm text-white">{activity.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(activity.startDate).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{activity.category?.name || 'Uncategorized'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#10b981]/10 text-emerald-400 border border-[#10b981]/20">
                      {activity.status}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-bold text-teal-400">
                      {activity.xpReward} XP
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Participants */}
        <div className="p-6 rounded-xl border border-white/10 bg-white/5 shadow-sm flex flex-col gap-6 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-teal-400" />
            <h3 className="text-lg font-semibold">Top Volunteer Leaderboard</h3>
          </div>
          <div className="flex flex-col gap-4">
            {topParticipants.length === 0 ? (
              <p className="text-sm text-slate-400">No participation records found.</p>
            ) : (
              topParticipants.map((participant, index) => (
                <div key={participant.employeeId} className="flex items-center gap-4 p-4 rounded-lg bg-black/20 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 font-bold text-sm text-slate-400">
                    #{index + 1}
                  </div>
                  {participant.employee?.avatarUrl ? (
                    <img src={participant.employee.avatarUrl} alt={participant.employee.firstName} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold border border-white/10">
                      {participant.employee?.firstName.charAt(0)}{participant.employee?.lastName.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 flex flex-col">
                    <h4 className="font-medium text-sm text-white">
                      {participant.employee?.firstName} {participant.employee?.lastName}
                    </h4>
                    <span className="text-xs text-slate-400">{participant.employee?.department?.name || 'Unknown Dept'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                    <Award className="w-4 h-4" />
                    {participant._sum.pointsEarned} XP
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
