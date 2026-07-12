import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { issueId } = body;

    if (!issueId) {
      return NextResponse.json(
        { error: 'issueId is required.' },
        { status: 400 }
      );
    }

    const updated = await prisma.complianceIssue.update({
      where: { id: issueId },
      data: {
        status: 'CLOSED',
        closedDate: new Date()
      }
    });

    return NextResponse.json({
      message: 'Compliance issue verified and closed successfully',
      data: updated
    });
  } catch (error) {
    console.error('Error closing compliance issue:', error);
    return NextResponse.json(
      { error: 'Failed to verify and close compliance issue' },
      { status: 500 }
    );
  }
}
