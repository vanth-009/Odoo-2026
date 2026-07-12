import { prisma } from '@/lib/db';
import GamificationDashboardClient from './GamificationDashboardClient';

export const dynamic = 'force-dynamic';

export default async function GamificationPage() {
  const [
    totalChallenges,
    activeChallenges,
    badgesEarned,
    rewardsRedeemed,
    xpSumObj,
    rawParticipations,
    allTransactions,
    allParticipations,
    departments
  ] = await Promise.all([
    prisma.challenge.count(),
    prisma.challenge.count({ where: { status: 'Active' } }),
    prisma.employeeBadge.count(),
    prisma.rewardRedemption.count(),
    prisma.xPTransaction.aggregate({
      _sum: { xp: true }
    }),
    prisma.challengeParticipation.findMany({
      select: { employeeId: true },
      distinct: ['employeeId']
    }),
    prisma.xPTransaction.findMany({
      orderBy: { createdAt: 'asc' },
      take: 100
    }),
    prisma.challengeParticipation.findMany({
      orderBy: { createdAt: 'asc' },
      take: 100
    }),
    prisma.department.findMany({
      include: {
        employees: {
          include: {
            xpTransactions: true,
            challengeParticipations: true
          }
        }
      }
    })
  ]);

  const employeesParticipating = rawParticipations.length;
  const totalXpAwarded = xpSumObj._sum.xp || 0;

  // Build Weekly XP trend (Grouped by Date)
  const xpTrendMap: { [date: string]: number } = {};
  allTransactions.forEach(t => {
    const dStr = t.createdAt.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    xpTrendMap[dStr] = (xpTrendMap[dStr] || 0) + t.xp;
  });

  const xpEarnedOverTime = Object.entries(xpTrendMap).map(([date, xp]) => ({
    date,
    xp
  }));

  if (xpEarnedOverTime.length === 0) {
    xpEarnedOverTime.push(
      { date: '01 Jul', xp: 120 },
      { date: '05 Jul', xp: 240 },
      { date: '10 Jul', xp: 350 },
      { date: '12 Jul', xp: 450 }
    );
  }

  // Build Challenge completion trend
  const completionTrendMap: { [date: string]: number } = {};
  allParticipations.forEach(p => {
    if (p.approvalStatus === 'APPROVED' && p.submittedAt) {
      const dStr = p.submittedAt.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
      completionTrendMap[dStr] = (completionTrendMap[dStr] || 0) + 1;
    }
  });

  const challengeCompletionTrend = Object.entries(completionTrendMap).map(([date, count]) => ({
    date,
    completions: count
  }));

  if (challengeCompletionTrend.length === 0) {
    challengeCompletionTrend.push(
      { date: '01 Jul', completions: 1 },
      { date: '05 Jul', completions: 3 },
      { date: '10 Jul', completions: 5 },
      { date: '12 Jul', completions: 8 }
    );
  }

  // Build Top Departments and Participation Rates
  const departmentStats = departments.map(d => {
    let xpSum = 0;
    let participants = 0;
    d.employees.forEach(e => {
      const sum = e.xpTransactions.reduce((acc, t) => acc + t.xp, 0);
      xpSum += sum;
      if (e.challengeParticipations?.length > 0 || sum > 0) {
        participants++;
      }
    });

    return {
      name: d.name,
      totalXp: xpSum,
      employeeCount: d.employeeCount,
      participants,
      participationRate: d.employeeCount > 0 
        ? Math.round((participants / d.employeeCount) * 100) 
        : 0
    };
  }).sort((a, b) => b.totalXp - a.totalXp);

  const topDepartments = departmentStats.slice(0, 5);
  const participationByDepartment = departmentStats.map(d => ({
    name: d.name,
    rate: d.participationRate
  }));

  return (
    <GamificationDashboardClient 
      kpis={{
        totalChallenges,
        activeChallenges,
        employeesParticipating,
        totalXpAwarded,
        badgesEarned,
        rewardsRedeemed
      }}
      charts={{
        challengeCompletionTrend,
        xpEarnedOverTime,
        topDepartments,
        participationByDepartment
      }}
    />
  );
}
