import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET all rewards and redemptions queue
export async function GET(_request: NextRequest) {
  try {
    const [rewardsList, redemptionsList] = await Promise.all([
      prisma.reward.findMany({
        orderBy: { name: 'asc' }
      }),
      prisma.rewardRedemption.findMany({
        include: {
          reward: { select: { name: true, costXp: true } },
          employee: {
            select: {
              firstName: true,
              lastName: true,
              employeeCode: true,
              department: { select: { name: true } }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    const rewards = rewardsList.map(r => ({
      id: r.id,
      name: r.name,
      costXp: r.costXp,
      stock: r.stock,
      status: r.status,
      description: r.description || '',
      createdAt: r.createdAt.toISOString()
    }));

    const redemptions = redemptionsList.map(red => ({
      id: red.id,
      employeeName: `${red.employee.firstName} ${red.employee.lastName}`,
      employeeCode: red.employee.employeeCode,
      departmentName: red.employee.department?.name || 'Unassigned',
      rewardName: red.reward.name,
      xpUsed: red.xpUsed,
      status: red.status, // PENDING, APPROVED, DELIVERED, REJECTED
      createdAt: red.createdAt.toISOString(),
      updatedAt: red.updatedAt.toISOString()
    }));

    return NextResponse.json({ rewards, redemptions });
  } catch (error) {
    console.error('Error fetching rewards & redemptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rewards stats' },
      { status: 500 }
    );
  }
}

// POST handle creation, stock edits, or redemption approval state transitions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'action parameter is required.' },
        { status: 400 }
      );
    }

    // 1. Create a new Reward item
    if (action === 'CREATE') {
      const { name, costXp, stock, description, status } = body;
      if (!name || costXp === undefined) {
        return NextResponse.json(
          { error: 'name and costXp are required.' },
          { status: 400 }
        );
      }

      const reward = await prisma.reward.create({
        data: {
          name: name.trim(),
          costXp: parseInt(costXp, 10),
          stock: stock !== undefined ? parseInt(stock, 10) : 10,
          description: description?.trim() || '',
          status: status || 'ACTIVE'
        }
      });

      return NextResponse.json({
        message: 'Reward added to catalog successfully.',
        data: reward
      }, { status: 201 });
    }

    // 2. Edit stock of a Reward item
    if (action === 'UPDATE_STOCK') {
      const { rewardId, stock } = body;
      if (!rewardId || stock === undefined) {
        return NextResponse.json(
          { error: 'rewardId and stock count are required.' },
          { status: 400 }
        );
      }

      const updated = await prisma.reward.update({
        where: { id: rewardId },
        data: {
          stock: parseInt(stock, 10)
        }
      });

      return NextResponse.json({
        message: 'Reward stock updated successfully.',
        data: updated
      });
    }

    // 3. Process redemption status transition (PENDING -> APPROVED -> DELIVERED -> REJECTED)
    if (action === 'REDEMPTION_STATUS') {
      const { redemptionId, status } = body;
      if (!redemptionId || !status) {
        return NextResponse.json(
          { error: 'redemptionId and status are required.' },
          { status: 400 }
        );
      }

      const currentRed = await prisma.rewardRedemption.findUnique({
        where: { id: redemptionId },
        include: { reward: true }
      });

      if (!currentRed) {
        return NextResponse.json(
          { error: 'Redemption record not found.' },
          { status: 404 }
        );
      }

      const result = await prisma.$transaction(async (tx) => {
        // If transitioning from non-rejected to REJECTED, refund employee XP
        if (status === 'REJECTED' && currentRed.status !== 'REJECTED') {
          await tx.xPTransaction.create({
            data: {
              employeeId: currentRed.employeeId,
              xp: currentRed.xpUsed,
              activityName: `Refund: Rejected redemption of ${currentRed.reward.name}`
            }
          });

          // Restore stock since order is cancelled
          await tx.reward.update({
            where: { id: currentRed.rewardId },
            data: { stock: { increment: 1 } }
          });
        }

        // Update status of order
        const updated = await tx.rewardRedemption.update({
          where: { id: redemptionId },
          data: { status }
        });

        return updated;
      });

      return NextResponse.json({
        message: `Redemption marked as ${status}`,
        data: result
      });
    }

    return NextResponse.json(
      { error: `Action "${action}" is not supported.` },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error managing rewards/redemptions:', error);
    return NextResponse.json(
      { error: 'Failed to process reward request' },
      { status: 500 }
    );
  }
}
