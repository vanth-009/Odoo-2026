import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

type RouteContext = { params: Promise<{ id: string }> };

// PATCH /api/social/participation/[id]/approve
// Approve a participation if status is PENDING
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const participationId = parseInt(id, 10);

    if (isNaN(participationId)) {
      return NextResponse.json(
        { error: 'Invalid participation ID. Must be a number.' },
        { status: 400 }
      );
    }

    const participation = await prisma.employeeParticipation.findUnique({
      where: { id: participationId },
      include: {
        activity: true,
      },
    });

    if (!participation) {
      return NextResponse.json(
        { error: `Participation with id ${participationId} not found.` },
        { status: 404 }
      );
    }

    if (participation.approvalStatus !== 'PENDING') {
      return NextResponse.json(
        {
          error: `Cannot approve participation with status "${participation.approvalStatus}". Only PENDING participations can be approved.`,
        },
        { status: 400 }
      );
    }

    // Read requireProof setting
    const fs = require('fs');
    const path = require('path');
    const settingsPath = path.join(process.cwd(), 'src/lib/settings.json');
    let requireProof = false;
    try {
      if (fs.existsSync(settingsPath)) {
        const data = fs.readFileSync(settingsPath, 'utf-8');
        const parsed = JSON.parse(data);
        requireProof = !!parsed.requireProof;
      }
    } catch (e) {
      console.error("Failed to read settings in approve route", e);
    }

    if (requireProof && (!participation.proofUrl || participation.proofUrl.trim() === '')) {
      return NextResponse.json(
        {
          error: 'An attached proof file is required to approve this CSR Activity participation.',
        },
        { status: 400 }
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update the participation record to APPROVED
      const up = await tx.employeeParticipation.update({
        where: { id: participationId },
        data: {
          approvalStatus: 'APPROVED',
          approvalDate: new Date(),
          approvedBy: 'Admin',
          pointsEarned: participation.activity.xpReward ?? 0,
        },
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              department: true,
            },
          },
          activity: {
            select: {
              id: true,
              title: true,
              xpReward: true,
            },
          },
        },
      });

      // 2. Create XPTransaction entry if xpReward > 0
      const xpReward = participation.activity.xpReward ?? 0;
      if (xpReward > 0) {
        await tx.xPTransaction.create({
          data: {
            employeeId: up.employee.id,
            xp: xpReward,
            activityName: `Completed CSR Activity: ${up.activity.title}`
          }
        });
      }

      // 3. Run auto badge check helper
      const { checkAndAwardBadges } = require('@/lib/badgeAwards');
      await checkAndAwardBadges(up.employee.id, tx);

      // 4. Create notification
      await tx.notification.create({
        data: {
          employeeId: up.employee.id,
          title: "CSR Participation Approved",
          message: `Your participation in the CSR activity "${up.activity.title}" has been approved! You earned ${up.pointsEarned} XP.`,
          type: "CSR/Challenge approval decisions",
          referenceType: "CsrParticipation",
          referenceId: up.id.toString(),
        }
      });

      return up;
    });

    return NextResponse.json({
      data: updated,
      message: 'Participation approved successfully',
    });
  } catch (error) {
    console.error('Error approving participation:', error);
    return NextResponse.json(
      { error: 'Failed to approve participation' },
      { status: 500 }
    );
  }
}
