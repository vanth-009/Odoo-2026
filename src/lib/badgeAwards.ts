import fs from "fs";
import path from "path";

/**
 * Checks and auto-awards badges to an employee if the badgeAutoAward setting is enabled.
 * Designed to run inside database transactions to ensure consistency.
 */
export async function checkAndAwardBadges(employeeId: string, tx: any) {
  // 1. Read badgeAutoAward setting
  const settingsPath = path.join(process.cwd(), 'src/lib/settings.json');
  let badgeAutoAward = false;
  try {
    if (fs.existsSync(settingsPath)) {
      const data = fs.readFileSync(settingsPath, 'utf-8');
      const parsed = JSON.parse(data);
      badgeAutoAward = !!parsed.badgeAutoAward;
    }
  } catch (e) {
    console.error("Failed to read settings in badge awards helper", e);
  }

  // If auto-award is disabled, we halt checks immediately.
  if (!badgeAutoAward) {
    return;
  }

  try {
    // 2. Count approved challenges completed by the employee
    const completedCount = await tx.challengeParticipation.count({
      where: { employeeId, approvalStatus: 'APPROVED' }
    });

    // 3. Aggregate total XP earned by the employee
    const xpAgg = await tx.xPTransaction.aggregate({
      where: { employeeId },
      _sum: { xp: true }
    });
    const totalXp = xpAgg._sum.xp || 0;

    // 4. Fetch all active badges
    const activeBadges = await tx.badge.findMany({
      where: { status: 'ACTIVE' }
    });

    for (const b of activeBadges) {
      // Check if employee already has this badge
      const alreadyEarned = await tx.employeeBadge.findUnique({
        where: {
          employeeId_badgeId: { employeeId, badgeId: b.id }
        }
      });

      if (!alreadyEarned) {
        let shouldUnlock = false;

        // Check challenges threshold
        if (b.challengesCountThreshold > 0 && completedCount >= b.challengesCountThreshold) {
          shouldUnlock = true;
        }

        // Check XP threshold
        if (b.xpThreshold > 0 && totalXp >= b.xpThreshold) {
          shouldUnlock = true;
        }

        if (shouldUnlock) {
          // Unlock the badge
          await tx.employeeBadge.create({
            data: { employeeId, badgeId: b.id }
          });

          // Create notification alert for badge unlock
          await tx.notification.create({
            data: {
              employeeId,
              title: "New Badge Unlocked",
              message: `Congratulations! You unlocked the badge "${b.name}".`,
              type: "Badge Unlocks",
              referenceType: "Badge",
              referenceId: b.id,
            }
          });
        }
      }
    }
  } catch (error) {
    console.error("Error running auto-badge checks:", error);
  }
}
