import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest) {
  try {
    const [dbPolicies, employeesCount] = await Promise.all([
      prisma.policy.findMany({
        include: {
          versions: true,
          acknowledgements: true,
        },
        orderBy: { policyName: 'asc' },
      }),
      prisma.employee.count(),
    ]);

    const policies = dbPolicies.map(p => ({
      id: p.id,
      title: p.policyName,
      category: p.category,
      description: p.description || '',
      status: p.status,
      effectiveDate: p.effectiveDate.toISOString(),
      versions: p.versions.map(v => ({
        id: v.id,
        versionString: v.versionNumber,
        isActive: v.versionNumber === p.version,
        changeSummary: v.changeSummary || '',
        effectiveDate: v.effectiveDate.toISOString(),
      })),
      acknowledgements: p.acknowledgements.map(a => ({
        id: a.id,
        employeeId: a.employeeId,
      })),
    }));

    return NextResponse.json({
      data: policies,
      employeesCount,
    });
  } catch (error) {
    console.error('Error fetching policies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch policies' },
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

    if (!body.category || typeof body.category !== 'string') {
      errors.push('Category is required.');
    }

    if (!body.versionString || typeof body.versionString !== 'string') {
      errors.push('Version string is required.');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    const title = body.title.trim();
    const category = body.category;
    const description = body.description?.trim() || '';
    const status = body.status || 'ACTIVE';
    const effectiveDate = body.effectiveDate ? new Date(body.effectiveDate) : new Date();
    const versionString = body.versionString.trim();
    const changeSummary = body.changeSummary?.trim() || 'Initial version publication';

    // Check duplicate title by policyName field
    const existing = await prisma.policy.findFirst({
      where: { policyName: title },
    });

    if (existing) {
      return NextResponse.json(
        { error: `A policy with title "${title}" already exists.` },
        { status: 409 }
      );
    }

    // Start a transaction to create Policy and its initial Version
    const policy = await prisma.$transaction(async (tx) => {
      const p = await tx.policy.create({
        data: {
          policyName: title,
          category,
          description,
          status,
          effectiveDate,
          version: versionString,
        },
      });

      await tx.policyVersion.create({
        data: {
          policyId: p.id,
          versionNumber: versionString,
          changeSummary,
          effectiveDate,
        },
      });

      return tx.policy.findUnique({
        where: { id: p.id },
        include: {
          versions: true,
          acknowledgements: true,
        },
      });
    });

    if (!policy) {
      throw new Error('Failed to retrieve created policy.');
    }

    const mappedPolicy = {
      id: policy.id,
      title: policy.policyName,
      category: policy.category,
      description: policy.description || '',
      status: policy.status,
      effectiveDate: policy.effectiveDate.toISOString(),
      versions: policy.versions.map(v => ({
        id: v.id,
        versionString: v.versionNumber,
        isActive: v.versionNumber === policy.version,
        changeSummary: v.changeSummary || '',
        effectiveDate: v.effectiveDate.toISOString(),
      })),
      acknowledgements: [],
    };

    return NextResponse.json(
      { data: mappedPolicy, message: 'Policy created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating policy:', error);
    return NextResponse.json(
      { error: 'Failed to create policy' },
      { status: 500 }
    );
  }
}
