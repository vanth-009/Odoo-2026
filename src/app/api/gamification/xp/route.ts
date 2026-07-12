import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { checkAndAwardBadges } from '@/lib/badgeAwards';

export const dynamic = 'force-dynamic';

// GET all XP transactions with employee details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get('departmentId');
    const employeeId = searchParams.get('employeeId');

    const whereClause: any = {};
    if (employeeId && employeeId !== 'all') {
      whereClause.employeeId = employeeId;
    }
    if (departmentId && departmentId !== 'all') {
      whereClause.employee = { departmentId };
    }

    const list = await prisma.xPTransaction.findMany({
      where: whereClause,
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            employeeCode: true,
            department: { select: { name: true } }
          }
        },
        challenge: {
          select: {
            title: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = list.map(item => ({
      id: item.id,
      employeeName: `${item.employee.firstName} ${item.employee.lastName}`,
      employeeCode: item.employee.employeeCode,
      departmentName: item.employee.department?.name || 'Unassigned',
      xp: item.xp,
      challengeTitle: item.challenge?.title || null,
      activityName: item.activityName,
      createdAt: item.createdAt.toISOString()
    }));

    // Also return list of employees and departments for filters
    const [employees, departments] = await Promise.all([
      prisma.employee.findMany({
        select: { id: true, firstName: true, lastName: true, employeeCode: true },
        orderBy: { firstName: 'asc' }
      }),
      prisma.department.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' }
      })
    ]);

    return NextResponse.json({
      data: formatted,
      filterOptions: {
        employees: employees.map(e => ({ id: e.id, name: `${e.firstName} ${e.lastName} (${e.employeeCode})` })),
        departments
      }
    });
  } catch (error) {
    console.error('Error fetching XP transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch XP transactions' },
      { status: 500 }
    );
  }
}

// POST create manual XP adjustment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { employeeId, xp, activityName } = body;

    if (!employeeId || xp === undefined || !activityName) {
      return NextResponse.json(
        { error: 'employeeId, xp count, and activityName description are required.' },
        { status: 400 }
      );
    }

    const employee = await prisma.employee.findUnique({
      where: { id: employeeId }
    });

    if (!employee) {
      return NextResponse.json(
        { error: `Employee with ID ${employeeId} not found.` },
        { status: 404 }
      );
    }

    const xpAmount = parseInt(xp, 10);
    if (isNaN(xpAmount)) {
      return NextResponse.json(
        { error: 'XP value must be a valid integer.' },
        { status: 400 }
      );
    }

    const transaction = await prisma.$transaction(async (tx) => {
      // Create manual XP transaction ledger entry
      const t = await tx.xPTransaction.create({
        data: {
          employeeId,
          xp: xpAmount,
          activityName: `Manual Adjustment: ${activityName.trim()}`
        }
      });

      // Recalculate employee total XP and run automated badge award checks
      await checkAndAwardBadges(employeeId, tx);

      return t;
    });

    return NextResponse.json(
      { data: transaction, message: 'XP adjustment recorded successfully.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating manual XP adjustment:', error);
    return NextResponse.json(
      { error: 'Failed to adjust XP' },
      { status: 550 }
    );
  }
}
