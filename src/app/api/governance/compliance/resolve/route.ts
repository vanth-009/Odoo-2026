import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { issueId, resolution } = body;

    if (!issueId || !resolution || typeof resolution !== 'string') {
      return NextResponse.json(
        { error: 'issueId and resolution text are required.' },
        { status: 400 }
      );
    }

    const updated = await prisma.complianceIssue.update({
      where: { id: issueId },
      data: {
        status: 'RESOLVED',
        resolution: resolution.trim(),
        closedDate: new Date()
      }
    });

    return NextResponse.json({
      message: 'Compliance issue resolved successfully',
      data: updated
    });
  } catch (error) {
    console.error('Error resolving compliance issue:', error);
    return NextResponse.json(
      { error: 'Failed to resolve compliance issue' },
      { status: 550 }
    );
  }
}
