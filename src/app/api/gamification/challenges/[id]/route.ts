import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

type RouteContext = { params: Promise<{ id: string }> };

// PUT edit challenge
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { error: 'Invalid challenge ID.' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const existing = await prisma.challenge.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json(
        { error: `Challenge with id ${id} not found.` },
        { status: 404 }
      );
    }

    const title = body.title?.trim() || existing.title;
    const category = body.category || existing.category;
    const description = body.description?.trim() !== undefined ? body.description.trim() : existing.description;
    const difficulty = body.difficulty || existing.difficulty;
    const evidenceRequired = body.evidenceRequired?.trim() !== undefined ? body.evidenceRequired.trim() : existing.evidenceRequired;
    const xp = body.xp !== undefined ? parseInt(body.xp, 10) : existing.xp;
    const startDate = body.startDate ? new Date(body.startDate) : existing.startDate;
    const deadline = body.deadline ? new Date(body.deadline) : existing.deadline;
    const status = body.status || existing.status;

    const updated = await prisma.challenge.update({
      where: { id },
      data: {
        title,
        category,
        description,
        difficulty,
        evidenceRequired,
        xp,
        startDate,
        deadline,
        status
      }
    });

    return NextResponse.json({
      message: 'Challenge updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Error updating challenge:', error);
    return NextResponse.json(
      { error: 'Failed to update challenge' },
      { status: 500 }
    );
  }
}

// DELETE delete challenge
export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { error: 'Invalid challenge ID.' },
        { status: 400 }
      );
    }

    const existing = await prisma.challenge.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json(
        { error: `Challenge with id ${id} not found.` },
        { status: 404 }
      );
    }

    await prisma.challenge.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Challenge deleted/archived successfully'
    });
  } catch (error) {
    console.error('Error deleting challenge:', error);
    return NextResponse.json(
      { error: 'Failed to delete challenge' },
      { status: 500 }
    );
  }
}
