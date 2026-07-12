import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/social/participation
// List participations with pagination, filters (approvalStatus, activityId, employeeId)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '10', 10)));
    const skip = (page - 1) * limit;

    // Filters
    const approvalStatus = searchParams.get('approvalStatus');
    const activityId = searchParams.get('activityId');
    const employeeId = searchParams.get('employeeId');

    const where: Record<string, unknown> = {};

    if (approvalStatus) {
      where.approvalStatus = approvalStatus;
    }

    if (activityId) {
      const parsedActivityId = parseInt(activityId, 10);
      if (isNaN(parsedActivityId)) {
        return NextResponse.json(
          { error: 'Invalid activityId. Must be a number.' },
          { status: 400 }
        );
      }
      where.activityId = parsedActivityId;
    }

    if (employeeId) {
      where.employeeId = employeeId;
    }

    const [participations, total] = await Promise.all([
      prisma.employeeParticipation.findMany({
        where,
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              department: true,
            },
          },
          activity: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.employeeParticipation.count({ where }),
    ]);

    return NextResponse.json({
      data: participations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching participations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch participations' },
      { status: 500 }
    );
  }
}

// POST /api/social/participation
// Register an employee for a CSR activity
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const errors: string[] = [];

    // Validate employeeId
    if (!body.employeeId || typeof body.employeeId !== 'string') {
      errors.push('employeeId must be a valid string UUID.');
    }

    // Validate activityId
    if (body.activityId === undefined || body.activityId === null) {
      errors.push('activityId is required.');
    } else {
      const parsedActivityId = Number(body.activityId);
      if (isNaN(parsedActivityId) || !Number.isInteger(parsedActivityId)) {
        errors.push('activityId must be a valid integer.');
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    const employeeId = body.employeeId;
    const activityId = Number(body.activityId);

    // Verify employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      return NextResponse.json(
        { error: `Employee with id ${employeeId} not found.` },
        { status: 404 }
      );
    }

    // Verify activity exists and has valid status
    const activity = await prisma.csrActivity.findUnique({
      where: { id: activityId },
      include: {
        _count: {
          select: { participations: true },
        },
      },
    });

    if (!activity) {
      return NextResponse.json(
        { error: `CSR activity with id ${activityId} not found.` },
        { status: 404 }
      );
    }

    const participation = await prisma.employeeParticipation.create({
      data: {
        employeeId,
        activityId,
        hoursContributed: body.hoursContributed ? Number(body.hoursContributed) : null,
        proofUrl: body.proofUrl || null,
        approvalStatus: 'PENDING',
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            department: true,
          },
        },
        activity: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json(
      { data: participation, message: 'Successfully registered for activity' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating participation:', error);
    return NextResponse.json(
      { error: 'Failed to register for activity' },
      { status: 500 }
    );
  }
}
