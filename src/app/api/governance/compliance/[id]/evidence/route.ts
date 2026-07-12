import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id: issueId } = await context.params;

    if (!issueId) {
      return NextResponse.json(
        { error: 'Invalid compliance issue ID.' },
        { status: 400 }
      );
    }

    const issue = await prisma.complianceIssue.findUnique({
      where: { id: issueId },
    });

    if (!issue) {
      return NextResponse.json(
        { error: `Compliance issue with id ${issueId} not found.` },
        { status: 404 }
      );
    }

    const body = await request.json();
    const errors: string[] = [];

    if (!body.title || typeof body.title !== 'string' || body.title.trim().length < 3) {
      errors.push('Title is required and must be at least 3 characters.');
    }

    if (!body.fileUrl || typeof body.fileUrl !== 'string') {
      errors.push('File URL / path is required.');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    const title = body.title.trim();
    const description = body.description?.trim() || '';
    const fileUrl = body.fileUrl.trim();
    const uploadedBy = body.uploadedBy?.trim() || 'System';

    // Start a transaction to create Evidence and update ComplianceIssue status if needed
    const evidence = await prisma.$transaction(async (tx) => {
      const serializedType = JSON.stringify({
        title,
        description,
        fileType: 'pdf'
      });

      const ev = await tx.evidence.create({
        data: {
          issueId,
          uploadedBy,
          fileUrl,
          fileType: serializedType,
        },
      });

      // If the issue was OPEN, transition it to UNDER_INVESTIGATION
      if (issue.status === 'OPEN') {
        await tx.complianceIssue.update({
          where: { id: issueId },
          data: { status: 'UNDER_INVESTIGATION' },
        });
      }

      return ev;
    });

    return NextResponse.json(
      { data: evidence, message: 'Evidence submitted successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading compliance evidence:', error);
    return NextResponse.json(
      { error: 'Failed to upload evidence' },
      { status: 500 }
    );
  }
}
