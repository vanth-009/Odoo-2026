import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET all acknowledgements
export async function GET(_request: NextRequest) {
  try {
    const list = await prisma.policyAcknowledgement.findMany({
      include: {
        policy: {
          select: {
            policyName: true,
          }
        },
        employee: {
          select: {
            firstName: true,
            lastName: true,
            employeeCode: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = list.map(item => ({
      id: item.id,
      policyId: item.policyId,
      policyTitle: item.policy.policyName,
      employeeName: `${item.employee.firstName} ${item.employee.lastName}`,
      employeeCode: item.employee.employeeCode,
      version: item.versionNumber,
      status: item.status, // Pending, Accepted, Rejected
      acceptedAt: item.acceptedAt ? item.acceptedAt.toISOString() : null,
      remarks: item.remarks || '',
    }));

    return NextResponse.json({ data: formatted });
  } catch (error) {
    console.error('Error fetching policy acknowledgements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch policy acknowledgements' },
      { status: 500 }
    );
  }
}

// POST update acknowledgement state (Accept / Reject)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { acknowledgementId, action, remarks } = body;

    if (!acknowledgementId || !action) {
      return NextResponse.json(
        { error: 'acknowledgementId and action are required.' },
        { status: 400 }
      );
    }

    const currentAck = await prisma.policyAcknowledgement.findUnique({
      where: { id: acknowledgementId },
    });

    if (!currentAck) {
      return NextResponse.json(
        { error: 'Policy acknowledgement log not found.' },
        { status: 404 }
      );
    }

    let statusString = 'Pending';
    let acceptedAt = null;

    if (action === 'ACCEPT') {
      statusString = 'Accepted';
      acceptedAt = new Date();
    } else if (action === 'REJECT') {
      statusString = 'Rejected';
    } else if (action === 'PENDING') {
      statusString = 'Pending';
    }

    const updated = await prisma.policyAcknowledgement.update({
      where: { id: acknowledgementId },
      data: {
        status: statusString,
        acceptedAt,
        remarks: remarks || '',
      },
    });

    return NextResponse.json({
      message: 'Policy acknowledgement updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating policy acknowledgement:', error);
    return NextResponse.json(
      { error: 'Failed to update policy acknowledgement' },
      { status: 500 }
    );
  }
}
