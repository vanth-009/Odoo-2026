import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      include: {
        goals: true,
        transactions: {
          where: {
            status: {
              not: 'Archived'
            }
          }
        }
      }
    });

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const startCurrentMonth = new Date(currentYear, currentMonth, 1);
    const startPrevMonth = new Date(currentYear, currentMonth - 1, 1);
    const endPrevMonth = new Date(currentYear, currentMonth, 0);

    const scoredDepartments = await Promise.all(
      departments.map(async (dept) => {
        // Calculate emissions
        let totalEmissions = 0;
        let currentMonthEmissions = 0;
        let prevMonthEmissions = 0;

        dept.transactions.forEach((tx) => {
          totalEmissions += tx.carbon;
          const txDate = new Date(tx.timestamp);
          if (txDate >= startCurrentMonth && txDate <= now) {
            currentMonthEmissions += tx.carbon;
          } else if (txDate >= startPrevMonth && txDate <= endPrevMonth) {
            prevMonthEmissions += tx.carbon;
          }
        });

        // 1. Carbon Reduction Progress (40% Weight)
        // Average progress of active goals. If no goals, default to 70.
        let avgProgress = 70;
        let completedCount = 0;
        const totalGoals = dept.goals.length;

        if (totalGoals > 0) {
          let progressSum = 0;
          
          const goalDetails = await Promise.all(
            dept.goals.map(async (goal) => {
              let sourceFilter = {};
              switch (goal.category) {
                case 'Reduce Fleet Emissions':
                  sourceFilter = { source: 'Fleet' };
                  break;
                case 'Reduce Electricity Consumption':
                case 'Renewable Energy Adoption':
                  sourceFilter = { source: 'Electricity' };
                  break;
                case 'Reduce Manufacturing Emissions':
                  sourceFilter = { source: 'Manufacturing' };
                  break;
                case 'Packaging Waste Reduction':
                  sourceFilter = { source: 'Waste Management' };
                  break;
              }

              const aggregate = await prisma.carbonTransaction.aggregate({
                where: {
                  departmentId: dept.id,
                  ...sourceFilter,
                  timestamp: {
                    gte: goal.startDate,
                    lte: goal.targetDate
                  },
                  status: {
                    not: 'Archived'
                  }
                },
                _sum: {
                  carbon: true
                }
              });

              const currentCarbon = aggregate._sum.carbon || 0;
              const targetReduction = Math.max(0.1, goal.baselineCarbon - goal.targetCarbon);
              const carbonSaved = Math.max(0, goal.baselineCarbon - currentCarbon);
              const progress = Math.min(100, Math.max(0, (carbonSaved / targetReduction) * 100));
              
              if (currentCarbon <= goal.targetCarbon || goal.status === 'Completed') {
                completedCount++;
              }
              
              return progress;
            })
          );

          progressSum = goalDetails.reduce((sum, p) => sum + p, 0);
          avgProgress = progressSum / totalGoals;
        }

        // 2. Goal Achievement (25% Weight)
        const goalAchievementScore = totalGoals > 0 ? (completedCount / totalGoals) * 100 : 70;

        // 3. Emission Trend (20% Weight)
        // Compare current month emissions to previous month emissions.
        let trendScore = 100;
        let trendPercent = 0;
        if (prevMonthEmissions > 0) {
          trendPercent = ((currentMonthEmissions - prevMonthEmissions) / prevMonthEmissions) * 100;
          if (trendPercent > 0) {
            trendScore = Math.max(0, 100 - trendPercent);
          }
        } else if (currentMonthEmissions > 0) {
          trendScore = 50;
          trendPercent = 100;
        }

        // 4. Operational Efficiency (15% Weight)
        // Compare total emissions to target emissions limit.
        let efficiencyScore = 100;
        if (totalEmissions > dept.targetEmissions) {
          const overagePercent = ((totalEmissions - dept.targetEmissions) / dept.targetEmissions) * 100;
          efficiencyScore = Math.max(0, 100 - overagePercent);
        }

        // Calculate Weighted Total Score
        const rawScore = 
          (avgProgress * 0.40) + 
          (goalAchievementScore * 0.25) + 
          (trendScore * 0.20) + 
          (efficiencyScore * 0.15);
        
        const finalScore = Math.round(rawScore);

        // Determine Status Flag
        let status: 'Green' | 'Yellow' | 'Red' = 'Green';
        if (finalScore < 70) {
          status = 'Red';
        } else if (finalScore < 85) {
          status = 'Yellow';
        }

        // Carbon Saved Estimation
        const carbonSaved = Math.max(0, dept.targetEmissions - totalEmissions);

        return {
          id: dept.id,
          name: dept.name,
          manager: dept.manager,
          employeeCount: dept.employeeCount,
          targetEmissions: dept.targetEmissions,
          totalEmissions: parseFloat(totalEmissions.toFixed(1)),
          currentMonthEmissions: parseFloat(currentMonthEmissions.toFixed(1)),
          prevMonthEmissions: parseFloat(prevMonthEmissions.toFixed(1)),
          trendPercent: parseFloat(trendPercent.toFixed(1)),
          score: finalScore,
          status,
          carbonSaved: parseFloat(carbonSaved.toFixed(1)),
          goalsCount: totalGoals,
          goalsCompleted: completedCount,
          activeGoals: totalGoals - completedCount,
          scoringBreakdown: {
            progress: parseFloat(avgProgress.toFixed(1)),
            goalAchievement: parseFloat(goalAchievementScore.toFixed(1)),
            trend: parseFloat(trendScore.toFixed(1)),
            efficiency: parseFloat(efficiencyScore.toFixed(1))
          }
        };
      })
    );

    // Calculate Organization-wide Environmental KPIs
    const totalDepts = scoredDepartments.length;
    const avgOrgScore = totalDepts > 0 
      ? Math.round(scoredDepartments.reduce((sum, d) => sum + d.score, 0) / totalDepts) 
      : 80;

    const highestDept = totalDepts > 0 
      ? scoredDepartments.reduce((prev, curr) => prev.score > curr.score ? prev : curr) 
      : null;

    const lowestDept = totalDepts > 0 
      ? scoredDepartments.reduce((prev, curr) => prev.score < curr.score ? prev : curr) 
      : null;

    const orgEmissions = parseFloat(scoredDepartments.reduce((sum, d) => sum + d.totalEmissions, 0).toFixed(1));
    const orgSaved = parseFloat(scoredDepartments.reduce((sum, d) => sum + d.carbonSaved, 0).toFixed(1));
    const orgGoalsCompleted = scoredDepartments.reduce((sum, d) => sum + d.goalsCompleted, 0);

    const kpis = {
      totalDepartments: totalDepts,
      averageScore: avgOrgScore,
      highestPerformingDepartment: highestDept?.name || 'N/A',
      highestPerformingScore: highestDept?.score || 0,
      lowestPerformingDepartment: lowestDept?.name || 'N/A',
      lowestPerformingScore: lowestDept?.score || 0,
      totalEmissions: orgEmissions,
      carbonSaved: orgSaved,
      goalsCompleted: orgGoalsCompleted
    };

    return NextResponse.json({
      departments: scoredDepartments,
      kpis
    });
  } catch (error: any) {
    console.error('Failed to aggregate department analytics:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
