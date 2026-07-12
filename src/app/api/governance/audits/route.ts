import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest) {
  try {
    const dbAudits = await prisma.audit.findMany({
      include: {
        findings: true,
        auditorEmployee: true,
      },
      orderBy: { startDate: 'desc' },
    });

    const audits = dbAudits.map(a => {
      // Parse auditor email/name from remarks if not using auditorEmployee relation
      let auditorName = 'External Auditor';
      let auditorEmail = 'external@audit.net';
      if (a.remarks && a.remarks.startsWith('Auditor:')) {
        const match = a.remarks.match(/Auditor:\s*(.*?)\s*\((.*?)\)/);
        if (match) {
          auditorName = match[1];
          auditorEmail = match[2];
        }
      } else if (a.auditorEmployee) {
        auditorName = `${a.auditorEmployee.firstName} ${a.auditorEmployee.lastName}`;
        auditorEmail = a.auditorEmployee.email;
      }

      return {
        id: a.id,
        title: a.name,
        scope: a.auditType,
        status: a.status,
        startDate: a.startDate.toISOString(),
        endDate: a.endDate ? a.endDate.toISOString() : '',
        auditorName,
        auditorEmail,
        findings: a.findings.map(f => ({
          id: f.id,
          title: f.title,
          description: f.description || '',
          severity: f.severity,
          status: f.status,
        }))
      };
    });

    return NextResponse.json({ data: audits });
  } catch (error) {
    console.error('Error fetching audits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audits' },
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

    if (!body.scope || typeof body.scope !== 'string' || body.scope.trim().length < 3) {
      errors.push('Scope is required.');
    }

    if (!body.startDate) {
      errors.push('startDate is required.');
    }

    if (!body.endDate) {
      errors.push('endDate is required.');
    }

    if (!body.auditorName || typeof body.auditorName !== 'string') {
      errors.push('Auditor name is required.');
    }

    if (!body.auditorEmail || typeof body.auditorEmail !== 'string') {
      errors.push('Auditor email is required.');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    const title = body.title.trim();
    const scope = body.scope.trim();
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);
    const auditorName = body.auditorName.trim();
    const auditorEmail = body.auditorEmail.trim();
    const status = body.status || 'SCHEDULED';

    if (endDate <= startDate) {
      return NextResponse.json(
        { error: 'endDate must be after startDate.' },
        { status: 400 }
      );
    }

    // Get default department
    const defaultDept = await prisma.department.findFirst();
    if (!defaultDept) {
      return NextResponse.json(
        { error: 'No departments found in the database. Please seed the database first.' },
        { status: 500 }
      );
    }

    const audit = await prisma.audit.create({
      data: {
        name: title,
        auditType: scope,
        startDate,
        endDate,
        status,
        departmentId: defaultDept.id,
        remarks: `Auditor: ${auditorName} (${auditorEmail})`,
      },
      include: {
        findings: true,
      },
    });

    const mappedAudit = {
      id: audit.id,
      title: audit.name,
      scope: audit.auditType,
      status: audit.status,
      startDate: audit.startDate.toISOString(),
      endDate: audit.endDate ? audit.endDate.toISOString() : '',
      auditorName,
      auditorEmail,
      findings: [],
    };

    return NextResponse.json(
      { data: mappedAudit, message: 'Audit scheduled successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating audit:', error);
    return NextResponse.json(
      { error: 'Failed to schedule audit' },
      { status: 500 }
    );
  }
}
