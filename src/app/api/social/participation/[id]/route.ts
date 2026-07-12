import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(
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

    const participation = await prisma.employeeParticipation.findUnique({
      where: { id: participationId },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            department: true,
          },
        },
        activity: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!participation) {
      return NextResponse.json(
        { error: `Participation with id ${participationId} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: participation });
  } catch (error) {
    console.error('Error fetching participation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch participation' },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const existing = await prisma.employeeParticipation.findUnique({
      where: { id: participationId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: `Participation with id ${participationId} not found.` },
        { status: 404 }
      );
    }

    const body = await request.json();
    const errors: string[] = [];

    if (body.hoursContributed !== undefined) {
      const hours = Number(body.hoursContributed);
      if (isNaN(hours) || hours < 0) {
        errors.push('hoursContributed must be a non-negative number.');
      }
    }

    if (body.proofUrl !== undefined && body.proofUrl !== null) {
      if (typeof body.proofUrl !== 'string') {
        errors.push('proofUrl must be a string.');
      }
    }

    if (body.feedback !== undefined && body.feedback !== null) {
      if (typeof body.feedback !== 'string') {
        errors.push('feedback must be a string.');
      }
    }

    if (body.rating !== undefined && body.rating !== null) {
      const rating = Number(body.rating);
      if (isNaN(rating) || !Number.isInteger(rating) || rating < 1 || rating > 5) {
        errors.push('rating must be an integer between 1 and 5.');
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    const updateData: Record<string, any> = {};
    if (body.hoursContributed !== undefined) updateData.hoursContributed = Number(body.hoursContributed);
    if (body.proofUrl !== undefined) updateData.proofUrl = body.proofUrl;
    if (body.feedback !== undefined) updateData.feedback = body.feedback;
    if (body.rating !== undefined) updateData.rating = body.rating !== null ? Number(body.rating) : null;

    const participation = await prisma.employeeParticipation.update({
      where: { id: participationId },
      data: updateData,
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

    return NextResponse.json({
      data: participation,
      message: 'Participation updated successfully',
    });
  } catch (error) {
    console.error('Error updating participation:', error);
    return NextResponse.json(
      { error: 'Failed to update participation' },
      { status: 500 }
    );
  }
}
