import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const dept = await prisma.department.findUnique({
      where: { id },
      include: {
        goals: true,
        transactions: {
          where: {
            status: {
              not: 'Archived'
            }
          },
          orderBy: {
            timestamp: 'asc'
          },
          include: {
            productProfile: true
          }
        }
      }
    });

    if (!dept) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const startCurrentMonth = new Date(currentYear, currentMonth, 1);
    const startPrevMonth = new Date(currentYear, currentMonth - 1, 1);
    const endPrevMonth = new Date(currentYear, currentMonth, 0);

    // 1. Calculate General Info
    let ytdEmissions = 0;
    let currentMonthEmissions = 0;
    let prevMonthEmissions = 0;

    dept.transactions.forEach((tx) => {
      const txDate = new Date(tx.timestamp);
      if (txDate.getFullYear() === currentYear) {
        ytdEmissions += tx.carbon;
      }
      if (txDate >= startCurrentMonth && txDate <= now) {
        currentMonthEmissions += tx.carbon;
      } else if (txDate >= startPrevMonth && txDate <= endPrevMonth) {
        prevMonthEmissions += tx.carbon;
      }
    });

    ytdEmissions = parseFloat(ytdEmissions.toFixed(1));
    currentMonthEmissions = parseFloat(currentMonthEmissions.toFixed(1));
    prevMonthEmissions = parseFloat(prevMonthEmissions.toFixed(1));

    // 2. Operational Sources Breakdown
    const sourcesMap: Record<string, number> = {
      Fleet: 0,
      Manufacturing: 0,
      Electricity: 0,
      Travel: 0,
      Waste: 0,
      Purchase: 0
    };

    dept.transactions.forEach((tx) => {
      let sourceKey = tx.source;
      if (sourceKey === 'Business Travel') sourceKey = 'Travel';
      if (sourceKey === 'Waste Management') sourceKey = 'Waste';
      
      if (sourcesMap[sourceKey] !== undefined) {
        sourcesMap[sourceKey] += tx.carbon;
      } else {
        // Fallback for general categories
        sourcesMap['Purchase'] += tx.carbon;
      }
    });

    const operationalSources = Object.entries(sourcesMap).map(([name, carbon]) => ({
      name,
      carbon: parseFloat(carbon.toFixed(1))
    }));

    // 3. Product Impact
    const productsMap: Record<string, { name: string; code: string; carbon: number; count: number }> = {};
    let totalAssignedProductCarbon = 0;

    dept.transactions.forEach((tx) => {
      if (tx.productId) {
        totalAssignedProductCarbon += tx.carbon;
        if (!productsMap[tx.productId]) {
          productsMap[tx.productId] = {
            name: tx.productProfile?.name || tx.product,
            code: tx.productProfile?.code || 'N/A',
            carbon: 0,
            count: 0
          };
        }
        productsMap[tx.productId].carbon += tx.carbon;
        productsMap[tx.productId].count += 1;
      }
    });

    const productImpacts = Object.entries(productsMap).map(([id, p]) => ({
      id,
      name: p.name,
      code: p.code,
      carbon: parseFloat(p.carbon.toFixed(1)),
      transactions: p.count,
      contribution: totalAssignedProductCarbon > 0 ? parseFloat(((p.carbon / totalAssignedProductCarbon) * 100).toFixed(1)) : 0,
      trend: p.carbon > (prevMonthEmissions / 5) ? 'up' : 'down' // simple heuristic
    })).sort((a, b) => b.carbon - a.carbon).slice(0, 5);

    // 4. 12 Months Trend Data
    const monthsName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTrends: { month: string; carbon: number; target: number }[] = [];

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = `${monthsName[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      
      let monthCarbon = 0;
      dept.transactions.forEach((tx) => {
        const txDate = new Date(tx.timestamp);
        if (txDate.getMonth() === d.getMonth() && txDate.getFullYear() === d.getFullYear()) {
          monthCarbon += tx.carbon;
        }
      });

      monthlyTrends.push({
        month: label,
        carbon: parseFloat(monthCarbon.toFixed(1)),
        target: parseFloat((dept.targetEmissions / 12).toFixed(1))
      });
    }

    // 5. Goals detail calculations
    const goalsList = await Promise.all(
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
        const progress = parseFloat(
          Math.min(100, Math.max(0, (carbonSaved / targetReduction) * 100)).toFixed(1)
        );

        let calculatedStatus = goal.status;
        if (goal.status !== 'Archived' && goal.status !== 'Draft') {
          if (currentCarbon <= goal.targetCarbon) {
            calculatedStatus = 'Completed';
          } else if (now > goal.targetDate) {
            calculatedStatus = 'At Risk';
          } else {
            const totalDuration = goal.targetDate.getTime() - goal.startDate.getTime();
            const elapsed = now.getTime() - goal.startDate.getTime();
            const elapsedPercent = totalDuration > 0 ? (elapsed / totalDuration) * 100 : 0;
            if (progress >= elapsedPercent * 0.85) {
              calculatedStatus = 'On Track';
            } else {
              calculatedStatus = 'At Risk';
            }
          }
        }

        return {
          id: goal.id,
          name: goal.name,
          progress,
          status: calculatedStatus,
          deadline: goal.targetDate,
          owner: goal.owner,
          targetCarbon: goal.targetCarbon,
          currentCarbon: parseFloat(currentCarbon.toFixed(1))
        };
      })
    );

    // 6. Generate Insights (Premium Analytical Cards)
    const insights: { type: 'success' | 'warning' | 'info'; message: string; description: string }[] = [];

    // Analyze electricity emissions
    const electricityEmissions = sourcesMap['Electricity'];
    const totalDeptEmissions = parseFloat(Object.values(sourcesMap).reduce((a, b) => a + b, 0).toFixed(1));
    
    if (electricityEmissions > totalDeptEmissions * 0.35) {
      insights.push({
        type: 'warning',
        message: 'Electricity consumption remains high',
        description: `Scope 2 grid electricity accounts for ${((electricityEmissions / totalDeptEmissions) * 100).toFixed(0)}% of total departmental emissions. Transitioning to local solar is recommended.`
      });
    } else {
      insights.push({
        type: 'success',
        message: 'Electricity footprint is highly optimized',
        description: 'Green energy integration or energy efficiency systems are maintaining electricity below 35% of total carbon output.'
      });
    }

    // Compare MoM emissions
    if (prevMonthEmissions > 0) {
      const reduction = prevMonthEmissions - currentMonthEmissions;
      const pct = (reduction / prevMonthEmissions) * 100;
      if (pct > 5) {
        insights.push({
          type: 'success',
          message: `Emissions dropped by ${pct.toFixed(0)}% MoM`,
          description: `Carbon footprint decreased from ${prevMonthEmissions} tCO2e to ${currentMonthEmissions} tCO2e this month. Operational controls are performing exceptionally.`
        });
      } else if (pct < -5) {
        insights.push({
          type: 'warning',
          message: `Emissions surged by ${Math.abs(pct).toFixed(0)}% MoM`,
          description: `Cumulative carbon footprint increased from ${prevMonthEmissions} tCO2e to ${currentMonthEmissions} tCO2e. Requires administrative review of current-month manufacturing run logs.`
        });
      }
    }

    // Goal achievements
    const completedGoals = goalsList.filter(g => g.status === 'Completed').length;
    if (completedGoals > 0 && dept.goals.length > 0) {
      insights.push({
        type: 'success',
        message: 'Sustainability goals successfully met',
        description: `This department has met ${completedGoals} of its ${dept.goals.length} target sustainability milestones. Progress remains solid.`
      });
    } else if (goalsList.some(g => g.status === 'At Risk')) {
      insights.push({
        type: 'warning',
        message: 'Target milestone deadlines at risk',
        description: 'Active goals have fallen behind the expected timeline benchmarks. Review resource allocations with goal owners.'
      });
    }

    // Default general insight
    if (insights.length < 3) {
      insights.push({
        type: 'info',
        message: 'Nominal operational status',
        description: 'Department carbon telemetry and product recycling coefficients are running within standard audit parameters.'
      });
    }

    return NextResponse.json({
      department: {
        id: dept.id,
        name: dept.name,
        manager: dept.manager,
        employeeCount: dept.employeeCount,
        targetEmissions: dept.targetEmissions,
        ytdEmissions,
        currentMonthEmissions,
        prevMonthEmissions
      },
      operationalSources,
      productImpacts,
      monthlyTrends,
      goals: goalsList,
      insights
    });
  } catch (error: any) {
    console.error('Failed to query specific department details:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
