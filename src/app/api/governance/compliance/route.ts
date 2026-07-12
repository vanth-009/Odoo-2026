import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest) {
  try {
    const dbIssues = await prisma.complianceIssue.findMany({
      include: {
        evidences: true,
        ownerEmployee: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const issues = dbIssues.map(issue => {
      // Parse evidences
      const mappedEvidence = issue.evidences.map(e => {
        let title = 'Evidence Document';
        let description = '';
        let fileType = 'pdf';
        try {
          const parsed = JSON.parse(e.fileType);
          title = parsed.title || title;
          description = parsed.description || description;
          fileType = parsed.fileType || fileType;
        } catch {
          title = e.fileType || title;
        }
        return {
          id: e.id,
          title,
          description,
          fileUrl: e.fileUrl,
          fileType,
          uploadedAt: e.createdAt.toISOString(),
          uploadedBy: e.uploadedBy,
        };
      });

      return {
        id: issue.id,
        title: issue.title,
        description: issue.description || '',
        severity: issue.severity,
        status: issue.status,
        remediationDeadline: issue.dueDate ? issue.dueDate.toISOString() : '',
        remediatedAt: issue.closedDate ? issue.closedDate.toISOString() : null,
        remediationOwner: issue.ownerEmployee 
          ? `${issue.ownerEmployee.firstName} ${issue.ownerEmployee.lastName}`
          : 'System Admin',
        evidence: mappedEvidence,
      };
    });

    return NextResponse.json({ data: issues });
  } catch (error) {
    console.error('Error fetching compliance issues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch compliance issues' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const errors: string[] = [];

    if (!body.title || typeof body.title !== 'string' || body.title.trim().length < 3) {
      errors.push('Title is required and must be at least 3 characters.');
    }

    if (!body.description || typeof body.description !== 'string' || body.description.trim().length < 5) {
      errors.push('Description is required.');
    }

    if (!body.remediationOwner || typeof body.remediationOwner !== 'string') {
      errors.push('Remediation owner is required.');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    const title = body.title.trim();
    const description = body.description.trim();
    const severity = body.severity || 'MEDIUM';
    const status = body.status || 'OPEN';
    const remediationDeadline = body.remediationDeadline ? new Date(body.remediationDeadline) : null;
    const remediationOwner = body.remediationOwner.trim();

    const defaultDept = await prisma.department.findFirst();
    if (!defaultDept) {
      return NextResponse.json(
        { error: 'No departments found in the database. Please seed the database first.' },
        { status: 500 }
      );
    }

    // Find owner employee
    const nameParts = remediationOwner.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    let employee = await prisma.employee.findFirst({
      where: {
        firstName: { equals: firstName },
        lastName: { equals: lastName },
      },
    });

    if (!employee) {
      employee = await prisma.employee.findFirst();
    }

    const issue = await prisma.complianceIssue.create({
      data: {
        title,
        description,
        severity,
        status,
        dueDate: remediationDeadline,
        ownerEmployeeId: employee ? employee.id : null,
        departmentId: defaultDept.id,
      },
      include: {
        evidences: true,
      },
    });

    const mappedIssue = {
      id: issue.id,
      title: issue.title,
      description: issue.description || '',
      severity: issue.severity,
      status: issue.status,
      remediationDeadline: issue.dueDate ? issue.dueDate.toISOString() : '',
      remediatedAt: issue.closedDate ? issue.closedDate.toISOString() : null,
      remediationOwner: remediationOwner,
      evidence: [],
    };

    return NextResponse.json(
      { data: mappedIssue, message: 'Compliance issue created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating compliance issue:', error);
    return NextResponse.json(
      { error: 'Failed to create compliance issue' },
      { status: 500 }
    );
  }
}
