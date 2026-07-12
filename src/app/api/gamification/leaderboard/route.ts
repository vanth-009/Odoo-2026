import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get('departmentId');

    const whereClause: any = {};
    if (departmentId && departmentId !== 'all') {
      whereClause.departmentId = departmentId;
    }

    const employees = await prisma.employee.findMany({
      where: whereClause,
      include: {
        department: { select: { name: true } },
        xpTransactions: true,
        earnedBadges: true
      }
    });

    const list = employees.map(e => {
      const totalXp = e.xpTransactions.reduce((acc, t) => acc + t.xp, 0);
      const badgesCount = e.earnedBadges.length;

      return {
        id: e.id,
        employeeName: `${e.firstName} ${e.lastName}`,
        employeeCode: e.employeeCode,
        departmentName: e.department?.name || 'Unassigned',
        xp: totalXp,
        badges: badgesCount
      };
    }).sort((a, b) => b.xp - a.xp);

    // Add rank fields
    const ranked = list.map((item, idx) => ({
      rank: idx + 1,
      ...item
    }));

    const departments = await prisma.department.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({
      leaderboard: ranked,
      departments
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard data' },
      { status: 500 }
    );
  }
}
