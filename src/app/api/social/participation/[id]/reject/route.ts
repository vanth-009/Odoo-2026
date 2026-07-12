import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type RouteContext = { params: Promise<{ id: string }> };

// PATCH /api/social/participation/[id]/reject
// Reject a participation if status is PENDING. Requires rejectionReason (>=10 chars)
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const participationId = parseInt(id, 10);

    if (isNaN(participationId)) {
      return NextResponse.json(
        { error: 'Invalid participation ID. Must be a number.' },
        { status: 400 }
      );
    }

    const participation = await prisma.csrParticipation.findUnique({
      where: { id: participationId },
    });

    if (!participation) {
      return NextResponse.json(
        { error: `Participation with id ${participationId} not found.` },
        { status: 404 }
      );
    }

    if (participation.approvalStatus !== 'PENDING') {
      return NextResponse.json(
        {
          error: `Cannot reject participation with status "${participation.approvalStatus}". Only PENDING participations can be rejected.`,
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (
      !body.rejectionReason ||
      typeof body.rejectionReason !== 'string' ||
      body.rejectionReason.trim().length < 10
    ) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: ['rejectionReason is required and must be at least 10 characters long.'],
        },
        { status: 400 }
      );
    }

    const updated = await prisma.csrParticipation.update({
      where: { id: participationId },
      data: {
        approvalStatus: 'REJECTED',
        rejectionReason: body.rejectionReason.trim(),
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
          },
        },
      },
    });

    return NextResponse.json({
      data: updated,
      message: 'Participation rejected',
    });
  } catch (error) {
    console.error('Error rejecting participation:', error);
    return NextResponse.json(
      { error: 'Failed to reject participation' },
      { status: 500 }
    );
  }
}
