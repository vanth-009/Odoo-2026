import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET all badges with earn stats
export async function GET(_request: NextRequest) {
  try {
    const list = await prisma.badge.findMany({
      include: {
        employeeBadges: {
          include: {
            employee: {
              select: {
                firstName: true,
                lastName: true,
                employeeCode: true,
                department: { select: { name: true } }
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    const formatted = list.map(b => ({
      id: b.id,
      name: b.name,
      description: b.description || '',
      icon: b.icon,
      unlockRule: b.unlockRule,
      xpThreshold: b.xpThreshold,
      challengesCountThreshold: b.challengesCountThreshold,
      status: b.status, // ACTIVE, DISABLED
      earnedCount: b.employeeBadges.length,
      winners: b.employeeBadges.map(eb => ({
        employeeName: `${eb.employee.firstName} ${eb.employee.lastName}`,
        employeeCode: eb.employee.employeeCode,
        departmentName: eb.employee.department?.name || 'Unassigned',
        earnedAt: eb.earnedAt.toISOString()
      }))
    }));

    return NextResponse.json({ data: formatted });
  } catch (error) {
    console.error('Error fetching badges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch badges' },
      { status: 500 }
    );
  }
}

// POST create a new badge milestone
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const errors: string[] = [];

    if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 3) {
      errors.push('Badge name is required and must be at least 3 characters.');
    }

    if (!body.unlockRule || typeof body.unlockRule !== 'string') {
      errors.push('Unlock rule description is required.');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    const name = body.name.trim();
    const description = body.description?.trim() || '';
    const icon = body.icon?.trim() || '🏅';
    const unlockRule = body.unlockRule.trim();
    const xpThreshold = body.xpThreshold ? parseInt(body.xpThreshold, 10) : 0;
    const challengesCountThreshold = body.challengesCountThreshold ? parseInt(body.challengesCountThreshold, 10) : 0;
    const status = body.status || 'ACTIVE';

    const existing = await prisma.badge.findUnique({
      where: { name }
    });

    if (existing) {
      return NextResponse.json(
        { error: `A badge with name "${name}" already exists.` },
        { status: 409 }
      );
    }

    const badge = await prisma.badge.create({
      data: {
        name,
        description,
        icon,
        unlockRule,
        xpThreshold,
        challengesCountThreshold,
        status
      }
    });

    return NextResponse.json(
      { data: badge, message: 'Achievement badge created successfully.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating badge:', error);
    return NextResponse.json(
      { error: 'Failed to create badge' },
      { status: 500 }
    );
  }
}
