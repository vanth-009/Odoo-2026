import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
      const parsedEmployeeId = parseInt(employeeId, 10);
      if (isNaN(parsedEmployeeId)) {
        return NextResponse.json(
          { error: 'Invalid employeeId. Must be a number.' },
          { status: 400 }
        );
      }
      where.employeeId = parsedEmployeeId;
    }

    const [participations, total] = await Promise.all([
      prisma.csrParticipation.findMany({
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
      prisma.csrParticipation.count({ where }),
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
    if (body.employeeId === undefined || body.employeeId === null) {
      errors.push('employeeId is required.');
    } else {
      const parsedEmployeeId = Number(body.employeeId);
      if (isNaN(parsedEmployeeId) || !Number.isInteger(parsedEmployeeId)) {
        errors.push('employeeId must be a valid integer.');
      }
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

    const employeeId = Number(body.employeeId);
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

    if (activity.status !== 'UPCOMING' && activity.status !== 'ONGOING') {
      return NextResponse.json(
        {
          error: `Cannot register for activity with status "${activity.status}". Activity must be UPCOMING or ONGOING.`,
        },
        { status: 400 }
      );
    }

    // Check if already registered
    const existingParticipation = await prisma.csrParticipation.findFirst({
      where: {
        employeeId,
        activityId,
      },
    });

    if (existingParticipation) {
      return NextResponse.json(
        { error: 'Employee is already registered for this activity.' },
        { status: 409 }
      );
    }

    // Check max capacity
    if (activity.maxParticipants && activity._count.participations >= activity.maxParticipants) {
      return NextResponse.json(
        { error: 'This activity has reached its maximum number of participants.' },
        { status: 400 }
      );
    }

    const participation = await prisma.csrParticipation.create({
      data: {
        employeeId,
        activityId,
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
