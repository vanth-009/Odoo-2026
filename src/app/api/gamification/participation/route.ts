import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET all participations
export async function GET(_request: NextRequest) {
  try {
    const list = await prisma.challengeParticipation.findMany({
      include: {
        challenge: {
          select: {
            title: true,
            xp: true,
            category: true,
            difficulty: true
          }
        },
        employee: {
          select: {
            firstName: true,
            lastName: true,
            employeeCode: true,
            department: { select: { name: true } }
          }
        }
      },
      orderBy: { submittedAt: 'desc' }
    });

    const formatted = list.map(item => ({
      id: item.id,
      challengeId: item.challengeId,
      challengeTitle: item.challenge.title,
      challengeXp: item.challenge.xp,
      challengeCategory: item.challenge.category,
      employeeId: item.employeeId,
      employeeName: `${item.employee.firstName} ${item.employee.lastName}`,
      employeeCode: item.employee.employeeCode,
      departmentName: item.employee.department?.name || 'Unassigned',
      progress: item.progress,
      proof: item.proof || '',
      approvalStatus: item.approvalStatus, // PENDING, APPROVED, REJECTED, RESUBMIT_REQUESTED
      submittedAt: item.submittedAt ? item.submittedAt.toISOString() : null,
      approvedAt: item.approvedAt ? item.approvedAt.toISOString() : null,
      approvedBy: item.approvedBy || ''
    }));

    return NextResponse.json({ data: formatted });
  } catch (error) {
    console.error('Error fetching participations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch participations' },
      { status: 500 }
    );
  }
}

// POST update participation status (Approve / Reject / Request Resubmission)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { participationId, action, approvedBy, feedback } = body;

    if (!participationId || !action) {
      return NextResponse.json(
        { error: 'participationId and action are required.' },
        { status: 400 }
      );
    }

    const currentPart = await prisma.challengeParticipation.findUnique({
      where: { id: participationId },
      include: { challenge: true }
    });

    if (!currentPart) {
      return NextResponse.json(
        { error: 'Challenge participation record not found.' },
        { status: 404 }
      );
    }

    const employeeId = currentPart.employeeId;
    const challengeId = currentPart.challengeId;

    const result = await prisma.$transaction(async (tx) => {
      let statusString = 'PENDING';
      let approvedAtDate = null;

      if (action === 'APPROVE') {
        statusString = 'APPROVED';
        approvedAtDate = new Date();

        // 1. Award XP to the employee
        await tx.xPTransaction.create({
          data: {
            employeeId,
            challengeId,
            xp: currentPart.challenge.xp,
            activityName: `Completed Challenge: ${currentPart.challenge.title}`
          }
        });

        // 2. Compute current stats for badge check
        const completedCount = await tx.challengeParticipation.count({
          where: { employeeId, approvalStatus: 'APPROVED' }
        });

        // Include this current challenge since it is being approved in this transaction
        const totalCompleted = completedCount + 1;

        const xpAgg = await tx.xPTransaction.aggregate({
          where: { employeeId },
          _sum: { xp: true }
        });
        const totalXp = (xpAgg._sum.xp || 0) + currentPart.challenge.xp;

        // 3. Automated Badge unlock checks
        const badges = await tx.badge.findMany({ where: { status: 'ACTIVE' } });
        for (const b of badges) {
          const alreadyEarned = await tx.employeeBadge.findUnique({
            where: {
              employeeId_badgeId: { employeeId, badgeId: b.id }
            }
          });

          if (!alreadyEarned) {
            let shouldUnlock = false;
            if (b.challengesCountThreshold > 0 && totalCompleted >= b.challengesCountThreshold) {
              shouldUnlock = true;
            }
            if (b.xpThreshold > 0 && totalXp >= b.xpThreshold) {
              shouldUnlock = true;
            }

            if (shouldUnlock) {
              await tx.employeeBadge.create({
                data: { employeeId, badgeId: b.id }
              });

              await tx.notification.create({
                data: {
                  employeeId,
                  title: "New Badge Unlocked",
                  message: `Congratulations! You unlocked the badge "${b.name}".`,
                  type: "Badge Unlocked",
                  referenceType: "Badge",
                  referenceId: b.id,
                }
              });
            }
          }
        }

      } else if (action === 'REJECT') {
        statusString = 'REJECTED';
      } else if (action === 'RESUBMIT') {
        statusString = 'RESUBMIT_REQUESTED';
      }

      // Update participation record
      const updated = await tx.challengeParticipation.update({
        where: { id: participationId },
        data: {
          approvalStatus: statusString,
          approvedAt: approvedAtDate,
          approvedBy: approvedBy || 'Admin',
          proof: feedback ? `Review Feedback: ${feedback}` : currentPart.proof
        }
      });

      await tx.notification.create({
        data: {
          employeeId: currentPart.employeeId,
          title: `Challenge Submission ${statusString}`,
          message: `Your submission for the challenge "${currentPart.challenge?.title || 'Challenge'}" has been marked as ${statusString}. ${feedback ? `Feedback: ${feedback}` : ''}`,
          type: "CSR/Challenge approval decisions",
          referenceType: "ChallengeParticipation",
          referenceId: updated.id,
        }
      });

      return updated;
    });

    return NextResponse.json({
      message: `Challenge submission marked as ${action}`,
      data: result
    });
  } catch (error) {
    console.error('Error updating challenge participation:', error);
    return NextResponse.json(
      { error: 'Failed to update challenge submission status' },
      { status: 500 }
    );
  }
}
