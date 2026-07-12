import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/social/training/[id]
// Get a single training program with completions list (include employee details)
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const programId = parseInt(id, 10);

    if (isNaN(programId)) {
      return NextResponse.json(
        { error: 'Invalid training program ID. Must be a number.' },
        { status: 400 }
      );
    }

    const program = await prisma.trainingProgram.findUnique({
      where: { id: programId },
      include: {
        completions: {
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
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { completions: true },
        },
      },
    });

    if (!program) {
      return NextResponse.json(
        { error: `Training program with id ${programId} not found.` },
        { status: 404 }
      );
    }

    // Compute stats
    const totalEnrolled = program.completions.length;
    const totalCompleted = program.completions.filter(
      (c) => c.status === 'COMPLETED'
    ).length;
    const completionRate =
      totalEnrolled > 0
        ? parseFloat(((totalCompleted / totalEnrolled) * 100).toFixed(2))
        : 0;

    return NextResponse.json({
      data: {
        ...program,
        stats: {
          enrolledCount: totalEnrolled,
          completedCount: totalCompleted,
          completionRate,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching training program:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training program' },
      { status: 500 }
    );
  }
}
