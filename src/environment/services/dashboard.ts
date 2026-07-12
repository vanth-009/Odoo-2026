import { prisma } from '@/lib/db';
import { DashboardData } from '../types';

export async function getDashboardMetrics(): Promise<DashboardData> {
  // 1. Fetch departments and their scores
  const departments = await prisma.department.findMany({
    include: {
      transactions: true,
      goals: true,
    },
  });

  // 2. Fetch all transactions
  const allTransactions = await prisma.carbonTransaction.findMany({
    orderBy: { timestamp: 'desc' },
    include: { department: true }
  });

  // 3. Fetch all active goals
  const allGoals = await prisma.sustainabilityGoal.findMany({
    include: { department: true }
  });

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const firstDayCurrentMonth = new Date(currentYear, currentMonth, 1);
  const firstDayPrevMonth = new Date(currentYear, currentMonth - 1, 1);
  const lastDayPrevMonth = new Date(currentYear, currentMonth, 0);

  // 4. Calculate Emissions for Current Month and Previous Month
  let currentMonthEmissions = 0;
  let prevMonthEmissions = 0;
  let totalEmissions = 0;

  allTransactions.forEach((tx) => {
    const txDate = new Date(tx.timestamp);
    totalEmissions += tx.carbon;

    if (txDate >= firstDayCurrentMonth && txDate <= now) {
      currentMonthEmissions += tx.carbon;
    } else if (txDate >= firstDayPrevMonth && txDate <= lastDayPrevMonth) {
      prevMonthEmissions += tx.carbon;
    }
  });

  // Round to 1 decimal place
  totalEmissions = parseFloat(totalEmissions.toFixed(1));
  currentMonthEmissions = parseFloat(currentMonthEmissions.toFixed(1));
  prevMonthEmissions = parseFloat(prevMonthEmissions.toFixed(1));

  // Calculate Month-over-Month percentage change
  let momChange = 0;
  if (prevMonthEmissions > 0) {
    momChange = parseFloat((((currentMonthEmissions - prevMonthEmissions) / prevMonthEmissions) * 100).toFixed(1));
  }

  // 5. Environmental Score Calculations (Average of department scores)
  const avgScore = departments.length > 0 
    ? Math.round(departments.reduce((acc, d) => acc + d.score, 0) / departments.length)
    : 80;

  // 6. Sustainability Goals Stats
  const activeGoals = allGoals.filter(g => g.status !== 'Completed').length;
  const goalsAchieved = allGoals.filter(g => g.status === 'Completed').length;

  // 7. Departments exceeding target
  const deptStats = departments.map((d) => {
    const deptTxs = allTransactions.filter(t => t.departmentId === d.id);
    const currentEmissions = parseFloat(deptTxs.reduce((acc, t) => acc + t.carbon, 0).toFixed(1));
    const status = currentEmissions > d.targetEmissions 
      ? 'Critical' 
      : (currentEmissions > d.targetEmissions * 0.85 ? 'Warning' : 'On Track');

    return {
      id: d.id,
      name: d.name,
      targetEmissions: d.targetEmissions,
      currentEmissions,
      score: d.score,
      status: status as 'On Track' | 'Warning' | 'Critical',
      trend: d.trend as 'up' | 'down'
    };
  });

  const deptsExceedingTarget = deptStats.filter(d => d.currentEmissions > d.targetEmissions).length;

  // 8. Monthly Carbon Trends (12 months)
  const monthsName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const trendMap = new Map<string, number>();

  // Initialize last 12 months with 0
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${monthsName[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
    trendMap.set(key, 0);
  }

  allTransactions.forEach((tx) => {
    const txDate = new Date(tx.timestamp);
    const key = `${monthsName[txDate.getMonth()]} ${txDate.getFullYear().toString().slice(-2)}`;
    if (trendMap.has(key)) {
      trendMap.set(key, parseFloat((trendMap.get(key)! + tx.carbon).toFixed(1)));
    }
  });

  const monthlyTrends = Array.from(trendMap.entries()).map(([month, carbon]) => ({
    month,
    carbon
  }));

  // 9. Carbon Source Breakdown (by product)
  const sourceMap = new Map<string, number>();
  allTransactions.forEach((tx) => {
    sourceMap.set(tx.product, parseFloat(((sourceMap.get(tx.product) || 0) + tx.carbon).toFixed(1)));
  });

  const sourceBreakdown = Array.from(sourceMap.entries()).map(([name, carbon]) => ({
    name,
    carbon
  })).sort((a, b) => b.carbon - a.carbon);

  // 10. Hotspots (highest carbon operations)
  const hotspots = allTransactions
    .slice(0, 5)
    .map(tx => ({
      operation: tx.operation,
      department: tx.department.name,
      carbon: tx.carbon,
      percentage: totalEmissions > 0 ? parseFloat(((tx.carbon / totalEmissions) * 100).toFixed(1)) : 0
    }));

  // 11. Alerts & Insights
  const alerts: any[] = [];
  
  // Check if any department exceeds target
  deptStats.forEach((dept) => {
    if (dept.currentEmissions > dept.targetEmissions) {
      alerts.push({
        id: `alert-dept-${dept.id}`,
        severity: 'high',
        message: `Department '${dept.name}' has exceeded its annual carbon target of ${dept.targetEmissions} tCO2e.`,
        action: 'Adjust operational limits or procure offsets.',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Check goals behind schedule
  allGoals.forEach((goal) => {
    if (goal.status === 'Behind Schedule') {
      alerts.push({
        id: `alert-goal-${goal.id}`,
        severity: 'medium',
        message: `Sustainability Goal '${goal.name}' under ${goal.department.name} is behind schedule.`,
        action: `Review progress with owner ${goal.owner}.`,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Default system insight
  if (alerts.length === 0) {
    alerts.push({
      id: 'alert-system-ok',
      severity: 'info',
      message: 'All environmental metrics are currently within nominal limits.',
      action: 'Maintain current efficiency policies.',
      timestamp: new Date().toISOString()
    });
  }

  const netCarbonSaved = parseFloat((deptStats.reduce((acc, d) => acc + (d.targetEmissions - d.currentEmissions), 0)).toFixed(1));

  return {
    kpis: {
      totalEmissions,
      currentMonthEmissions,
      prevMonthEmissions,
      momChange,
      avgScore,
      activeGoals,
      goalsAchieved,
      deptsExceedingTarget,
      netCarbonSaved
    },
    departments: deptStats,
    monthlyTrends,
    sourceBreakdown,
    hotspots,
    recentActivity: allTransactions.slice(0, 8).map(tx => ({
      id: tx.id,
      txId: tx.txId,
      department: tx.department.name,
      operation: tx.operation,
      product: tx.product,
      carbon: tx.carbon,
      timestamp: tx.timestamp,
      status: tx.status
    })),
    goals: await Promise.all(
      allGoals.map(async (g) => {
        // Find category filter
        let txFilter = {};
        switch (g.category) {
          case 'Reduce Fleet Emissions':
            txFilter = { source: 'Fleet' };
            break;
          case 'Reduce Electricity Consumption':
          case 'Renewable Energy Adoption':
            txFilter = { source: 'Electricity' };
            break;
          case 'Reduce Manufacturing Emissions':
            txFilter = { source: 'Manufacturing' };
            break;
          case 'Packaging Waste Reduction':
            txFilter = { source: 'Waste Management' };
            break;
        }

        const aggregate = await prisma.carbonTransaction.aggregate({
          where: {
            departmentId: g.departmentId,
            ...txFilter,
            timestamp: {
              gte: g.startDate,
              lte: g.targetDate
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
        const targetReduction = Math.max(0.1, g.baselineCarbon - g.targetCarbon);
        const carbonSaved = Math.max(0, g.baselineCarbon - currentCarbon);
        const remainingReduction = Math.max(0, currentCarbon - g.targetCarbon);
        const progressPercent = parseFloat(
          Math.min(100, Math.max(0, (carbonSaved / targetReduction) * 100)).toFixed(1)
        );

        let calculatedStatus: 'On Track' | 'Behind Schedule' | 'Completed' = 'On Track';
        if (currentCarbon <= g.targetCarbon) {
          calculatedStatus = 'Completed';
        } else if (now > g.targetDate) {
          calculatedStatus = 'Behind Schedule';
        } else {
          const totalDuration = g.targetDate.getTime() - g.startDate.getTime();
          const elapsed = now.getTime() - g.startDate.getTime();
          const elapsedPercent = totalDuration > 0 ? (elapsed / totalDuration) * 100 : 0;
          if (progressPercent < elapsedPercent * 0.85) {
            calculatedStatus = 'Behind Schedule';
          }
        }

        return {
          id: g.id,
          name: g.name,
          department: g.department.name,
          owner: g.owner,
          progress: progressPercent,
          target: g.targetCarbon,
          remaining: remainingReduction,
          deadline: g.targetDate,
          status: calculatedStatus,
          risk: (g.priority === 'High' ? 'High' : g.priority === 'Medium' ? 'Medium' : 'Low') as 'Low' | 'Medium' | 'High' | 'None'
        };
      })
    ),
    alerts
  };
}

