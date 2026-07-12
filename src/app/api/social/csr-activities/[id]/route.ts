import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/social/csr-activities/[id]
// Get a single CSR activity with category, participations, and count
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const activityId = parseInt(id, 10);

    if (isNaN(activityId)) {
      return NextResponse.json(
        { error: 'Invalid activity ID. Must be a number.' },
        { status: 400 }
      );
    }

    const activity = await prisma.csrActivity.findUnique({
      where: { id: activityId },
      include: {
        category: true,
        participations: {
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
          },
        },
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

    return NextResponse.json({ data: activity });
  } catch (error) {
    console.error('Error fetching CSR activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CSR activity' },
      { status: 500 }
    );
  }
}

// PUT /api/social/csr-activities/[id]
// Update a CSR activity (partial validation)
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const activityId = parseInt(id, 10);

    if (isNaN(activityId)) {
      return NextResponse.json(
        { error: 'Invalid activity ID. Must be a number.' },
        { status: 400 }
      );
    }

    const existing = await prisma.csrActivity.findUnique({
      where: { id: activityId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: `CSR activity with id ${activityId} not found.` },
        { status: 404 }
      );
    }

    const body = await request.json();
    const errors: string[] = [];

    // Partial validation — only validate fields that are provided
    if (body.title !== undefined) {
      if (typeof body.title !== 'string' || body.title.trim().length < 3) {
        errors.push('Title must be at least 3 characters long.');
      }
    }

    if (body.description !== undefined) {
      if (typeof body.description !== 'string' || body.description.trim().length < 10) {
        errors.push('Description must be at least 10 characters long.');
      }
    }

    if (body.categoryId !== undefined) {
      const parsedCategoryId = Number(body.categoryId);
      if (isNaN(parsedCategoryId) || !Number.isInteger(parsedCategoryId)) {
        errors.push('categoryId must be a valid integer.');
      } else {
        const category = await prisma.csrCategory.findUnique({
          where: { id: parsedCategoryId },
        });
        if (!category) {
          errors.push(`Category with id ${body.categoryId} not found.`);
        }
      }
    }

    if (body.startDate !== undefined) {
      const start = new Date(body.startDate);
      if (isNaN(start.getTime())) {
        errors.push('startDate must be a valid date.');
      }
    }

    if (body.endDate !== undefined) {
      const end = new Date(body.endDate);
      if (isNaN(end.getTime())) {
        errors.push('endDate must be a valid date.');
      }
    }

    // Cross-field validation for dates
    const effectiveStart = body.startDate ? new Date(body.startDate) : existing.startDate;
    const effectiveEnd = body.endDate ? new Date(body.endDate) : existing.endDate;
    if (effectiveEnd <= effectiveStart) {
      errors.push('endDate must be after startDate.');
    }

    if (body.organizerName !== undefined) {
      if (typeof body.organizerName !== 'string' || body.organizerName.trim().length === 0) {
        errors.push('organizerName must not be empty.');
      }
    }

    if (body.xpReward !== undefined && body.xpReward !== null) {
      const xp = Number(body.xpReward);
      if (isNaN(xp) || !Number.isInteger(xp) || xp <= 0) {
        errors.push('xpReward must be a positive integer.');
      }
    }

    if (body.maxParticipants !== undefined && body.maxParticipants !== null) {
      const maxP = Number(body.maxParticipants);
      if (isNaN(maxP) || !Number.isInteger(maxP) || maxP <= 0) {
        errors.push('maxParticipants must be a positive integer.');
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: Record<string, unknown> = {};
    if (body.title !== undefined) updateData.title = body.title.trim();
    if (body.description !== undefined) updateData.description = body.description.trim();
    if (body.categoryId !== undefined) updateData.categoryId = Number(body.categoryId);
    if (body.startDate !== undefined) updateData.startDate = new Date(body.startDate);
    if (body.endDate !== undefined) updateData.endDate = new Date(body.endDate);
    if (body.organizerName !== undefined) updateData.organizerName = body.organizerName.trim();
    if (body.xpReward !== undefined) updateData.xpReward = Number(body.xpReward);
    if (body.maxParticipants !== undefined) updateData.maxParticipants = Number(body.maxParticipants);
    if (body.location !== undefined) updateData.location = body.location?.trim() || null;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl?.trim() || null;

    const activity = await prisma.csrActivity.update({
      where: { id: activityId },
      data: updateData,
      include: {
        category: true,
      },
    });

    return NextResponse.json({
      data: activity,
      message: 'CSR activity updated successfully',
    });
  } catch (error) {
    console.error('Error updating CSR activity:', error);
    return NextResponse.json(
      { error: 'Failed to update CSR activity' },
      { status: 500 }
    );
  }
}

// DELETE /api/social/csr-activities/[id]
// Delete activity — only if status is DRAFT or CANCELLED
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const activityId = parseInt(id, 10);

    if (isNaN(activityId)) {
      return NextResponse.json(
        { error: 'Invalid activity ID. Must be a number.' },
        { status: 400 }
      );
    }

    const activity = await prisma.csrActivity.findUnique({
      where: { id: activityId },
    });

    if (!activity) {
      return NextResponse.json(
        { error: `CSR activity with id ${activityId} not found.` },
        { status: 404 }
      );
    }

    if (activity.status !== 'DRAFT' && activity.status !== 'CANCELLED') {
      return NextResponse.json(
        {
          error: `Cannot delete activity with status "${activity.status}". Only DRAFT or CANCELLED activities can be deleted.`,
        },
        { status: 400 }
      );
    }

    await prisma.csrActivity.delete({
      where: { id: activityId },
    });

    return NextResponse.json({
      message: 'CSR activity deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting CSR activity:', error);
    return NextResponse.json(
      { error: 'Failed to delete CSR activity' },
      { status: 500 }
    );
  }
}
