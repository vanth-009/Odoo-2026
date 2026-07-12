import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '10', 10)));
    const skip = (page - 1) * limit;

    const [programs, total] = await Promise.all([
      prisma.trainingProgram.findMany({
        include: {
          _count: {
            select: { completions: true },
          },
          completions: {
            select: {
              status: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.trainingProgram.count(),
    ]);

    const programsWithStats = programs.map((program) => {
      const totalEnrolled = program.completions.length;
      const totalCompleted = program.completions.filter(
        (c) => c.status === 'COMPLETED'
      ).length;
      const completionRate =
        totalEnrolled > 0
          ? parseFloat(((totalCompleted / totalEnrolled) * 100).toFixed(2))
          : 0;

      const { completions: _completions, ...programData } = program;

      return {
        ...programData,
        stats: {
          enrolledCount: totalEnrolled,
          completedCount: totalCompleted,
          completionRate,
        },
      };
    });

    return NextResponse.json({
      data: programsWithStats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching training programs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training programs' },
      { status: 500 }
    );
  }
}
