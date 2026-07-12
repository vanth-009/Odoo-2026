import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/social/dashboard
// Return comprehensive social module dashboard data
export async function GET(_request: NextRequest) {
  try {
    // --- Total Activities + Breakdown by Status ---
    const [
      totalActivities,
      activitiesByStatus,
      totalParticipations,
      participationsByStatus,
      totalEmployees,
      volunteerHoursResult,
      xpDistributedResult,
    ] = await Promise.all([
      prisma.csrActivity.count(),
      prisma.csrActivity.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      prisma.employeeParticipation.count(),
      prisma.employeeParticipation.groupBy({
        by: ['approvalStatus'],
        _count: { id: true },
      }),
      prisma.employee.count(),
      prisma.employeeParticipation.aggregate({
        _sum: { hoursContributed: true },
        where: { approvalStatus: 'APPROVED' },
      }),
      prisma.employeeParticipation.aggregate({
        _sum: { pointsEarned: true },
      }),
    ]);

    const statusBreakdown: Record<string, number> = {};
    for (const item of activitiesByStatus) {
      statusBreakdown[item.status] = item._count.id;
    }

    const approvalStatusBreakdown: Record<string, number> = {};
    for (const item of participationsByStatus) {
      approvalStatusBreakdown[item.approvalStatus] = item._count.id;
    }

    const totalVolunteerHours = volunteerHoursResult._sum.hoursContributed ?? 0;
    const totalXpDistributed = xpDistributedResult._sum.pointsEarned ?? 0;

    // --- Recent Activities (last 5) ---
    const recentActivities = await prisma.csrActivity.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        category: true,
        _count: {
          select: { participations: true },
        },
      },
    });

    // --- Top Participants (top 5 by total pointsEarned) ---
    const topParticipantsRaw = await prisma.employeeParticipation.groupBy({
      by: ['employeeId'],
      _sum: { pointsEarned: true },
      orderBy: { _sum: { pointsEarned: 'desc' } },
      take: 5,
    });

    const topParticipantIds = topParticipantsRaw.map((p: any) => p.employeeId);
    const topEmployees = await prisma.employee.findMany({
      where: { id: { in: topParticipantIds } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        department: true,
      },
    });

    const topParticipants = topParticipantsRaw.map((p: any) => {
      const emp = topEmployees.find((e: any) => e.id === p.employeeId);
      return {
        employeeId: p.employeeId,
        firstName: emp?.firstName ?? 'Unknown',
        lastName: emp?.lastName ?? '',
        department: emp?.department ?? 'Unknown',
        totalPoints: p._sum.pointsEarned ?? 0,
      };
    });

    // --- Monthly Trend (last 6 months participation counts) ---
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const recentParticipations = await prisma.employeeParticipation.findMany({
      where: {
        createdAt: { gte: sixMonthsAgo },
      },
      select: {
        createdAt: true,
      },
    });

    const monthlyTrendMap: Record<string, number> = {};
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyTrendMap[key] = 0;
    }

    for (const p of recentParticipations) {
      const d = new Date(p.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (key in monthlyTrendMap) {
        monthlyTrendMap[key]++;
      }
    }

    const monthlyTrend = Object.entries(monthlyTrendMap).map(([month, count]) => ({
      month,
      participations: count,
    }));

    return NextResponse.json({
      data: {
        totalActivities,
        statusBreakdown,
        totalParticipations,
        approvalStatusBreakdown,
        totalEmployees,
        totalVolunteerHours,
        totalXpDistributed,
        recentActivities,
        topParticipants,
        monthlyTrend,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
