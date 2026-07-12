import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET all challenges with participation summaries
export async function GET(_request: NextRequest) {
  try {
    const list = await prisma.challenge.findMany({
      include: {
        participations: {
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
      orderBy: { createdAt: 'desc' }
    });

    const formatted = list.map(c => {
      const activeCount = c.participations.length;
      const completedCount = c.participations.filter(p => p.approvalStatus === 'APPROVED').length;

      return {
        id: c.id,
        title: c.title,
        category: c.category,
        description: c.description || '',
        difficulty: c.difficulty,
        evidenceRequired: c.evidenceRequired || '',
        xp: c.xp,
        startDate: c.startDate.toISOString(),
        deadline: c.deadline.toISOString(),
        status: c.status,
        createdBy: c.createdBy,
        createdAt: c.createdAt.toISOString(),
        participantsCount: activeCount,
        completionsCount: completedCount,
        participations: c.participations.map(p => ({
          id: p.id,
          employeeId: p.employeeId,
          employeeName: `${p.employee.firstName} ${p.employee.lastName}`,
          employeeCode: p.employee.employeeCode,
          departmentName: p.employee.department?.name || 'Unassigned',
          progress: p.progress,
          proof: p.proof || '',
          approvalStatus: p.approvalStatus,
          submittedAt: p.submittedAt ? p.submittedAt.toISOString() : null,
          approvedAt: p.approvedAt ? p.approvedAt.toISOString() : null,
          approvedBy: p.approvedBy || ''
        }))
      };
    });

    return NextResponse.json({ data: formatted });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch challenges' },
      { status: 500 }
    );
  }
}

// POST create challenge
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const errors: string[] = [];

    if (!body.title || typeof body.title !== 'string' || body.title.trim().length < 3) {
      errors.push('Title is required and must be at least 3 characters.');
    }

    if (!body.category || typeof body.category !== 'string') {
      errors.push('Category is required.');
    }

    if (!body.deadline) {
      errors.push('Deadline is required.');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    const title = body.title.trim();
    const category = body.category;
    const description = body.description?.trim() || '';
    const difficulty = body.difficulty || 'Medium';
    const evidenceRequired = body.evidenceRequired?.trim() || '';
    const xp = body.xp ? parseInt(body.xp, 10) : 100;
    const startDate = body.startDate ? new Date(body.startDate) : new Date();
    const deadline = new Date(body.deadline);
    const status = body.status || 'Draft';
    const createdBy = body.createdBy || 'Admin';

    if (deadline <= startDate) {
      return NextResponse.json(
        { error: 'Deadline date must be set after start date.' },
        { status: 400 }
      );
    }

    const challenge = await prisma.challenge.create({
      data: {
        title,
        category,
        description,
        difficulty,
        evidenceRequired,
        xp,
        startDate,
        deadline,
        status,
        createdBy
      }
    });

    return NextResponse.json(
      { data: challenge, message: 'Sustainability challenge created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating challenge:', error);
    return NextResponse.json(
      { error: 'Failed to create challenge' },
      { status: 500 }
    );
  }
}
