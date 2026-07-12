import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// 1. GET: Retrieve report history logs
export async function GET() {
  try {
    const history = await prisma.environmentalReport.findMany({
      orderBy: { generatedAt: 'desc' }
    });
    return NextResponse.json(history);
  } catch (error: any) {
    console.error('Failed to retrieve reports history:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. POST: Generate report dynamic dataset and persist log entry
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, 
      type, 
      departmentId, 
      dateRange, 
      source, 
      productId, 
      goalId, 
      format, 
      generatedBy = 'System' 
    } = body;

    if (!name || !type) {
      return NextResponse.json({ error: 'Name and Report Type are required parameters' }, { status: 400 });
    }

    // Persist metadata log in DB
    const persistedLog = await prisma.environmentalReport.create({
      data: {
        name,
        type,
        generatedBy,
        filters: JSON.stringify({ departmentId, dateRange, source, productId, goalId }),
        format,
        status: 'Ready'
      }
    });

    // --- AGGREGATION PIPELINE FOR REPORT PREVIEW ---
    // Fetch departments
    const departments = await prisma.department.findMany({
      include: { goals: true }
    });

    // Fetch transactions filter criteria
    const txWhereClause: any = {
      status: {
        not: 'Archived'
      }
    };

    if (departmentId && departmentId !== 'ALL') {
      txWhereClause.departmentId = departmentId;
    }
    if (source && source !== 'ALL') {
      txWhereClause.source = source;
    }
    if (productId && productId !== 'ALL') {
      txWhereClause.productId = productId;
    }

    // Date range filters
    const now = new Date();
    let startDate = new Date(now.getFullYear(), 0, 1); // default YTD
    if (dateRange === 'Q1') {
      startDate = new Date(now.getFullYear(), 0, 1);
      txWhereClause.timestamp = { gte: startDate, lte: new Date(now.getFullYear(), 2, 31) };
    } else if (dateRange === 'Q2') {
      startDate = new Date(now.getFullYear(), 3, 1);
      txWhereClause.timestamp = { gte: startDate, lte: new Date(now.getFullYear(), 5, 30) };
    } else if (dateRange === 'Q3') {
      startDate = new Date(now.getFullYear(), 6, 1);
      txWhereClause.timestamp = { gte: startDate, lte: new Date(now.getFullYear(), 8, 30) };
    } else if (dateRange === 'Q4') {
      startDate = new Date(now.getFullYear(), 9, 1);
      txWhereClause.timestamp = { gte: startDate, lte: new Date(now.getFullYear(), 11, 31) };
    } else if (dateRange === 'Monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      txWhereClause.timestamp = { gte: startDate, lte: now };
    } else {
      // YTD
      txWhereClause.timestamp = { gte: startDate, lte: now };
    }

    const transactions = await prisma.carbonTransaction.findMany({
      where: txWhereClause,
      include: {
        department: true,
        productProfile: true
      },
      orderBy: { timestamp: 'desc' }
    });

    // Aggregations
    let totalEmissions = 0;
    const sourcesMap: Record<string, number> = {
      Fleet: 0,
      Manufacturing: 0,
      Electricity: 0,
      Travel: 0,
      Waste: 0,
      Purchase: 0
    };

    const deptMap: Record<string, { name: string; carbon: number; count: number }> = {};
    const prodMap: Record<string, { name: string; code: string; carbon: number }> = {};

    transactions.forEach((tx) => {
      totalEmissions += tx.carbon;

      // Source breakdown mapping
      let sKey = tx.source;
      if (sKey === 'Business Travel') sKey = 'Travel';
      if (sKey === 'Waste Management') sKey = 'Waste';
      if (sourcesMap[sKey] !== undefined) {
        sourcesMap[sKey] += tx.carbon;
      } else {
        sourcesMap['Purchase'] += tx.carbon;
      }

      // Department breakdown
      if (!deptMap[tx.departmentId]) {
        deptMap[tx.departmentId] = { name: tx.department.name, carbon: 0, count: 0 };
      }
      deptMap[tx.departmentId].carbon += tx.carbon;
      deptMap[tx.departmentId].count += 1;

      // Product impact mapping
      if (tx.productId) {
        const pId = tx.productId;
        if (!prodMap[pId]) {
          prodMap[pId] = {
            name: tx.productProfile?.name || tx.product,
            code: tx.productProfile?.code || 'N/A',
            carbon: 0
          };
        }
        prodMap[pId].carbon += tx.carbon;
      }
    });

    totalEmissions = parseFloat(totalEmissions.toFixed(1));

    const operationalSources = Object.entries(sourcesMap).map(([name, carbon]) => ({
      name,
      carbon: parseFloat(carbon.toFixed(1))
    }));

    const departmentEmissions = Object.entries(deptMap).map(([id, d]) => ({
      id,
      name: d.name,
      carbon: parseFloat(d.carbon.toFixed(1)),
      transactions: d.count
    })).sort((a, b) => b.carbon - a.carbon);

    const productImpacts = Object.entries(prodMap).map(([id, p]) => ({
      id,
      name: p.name,
      code: p.code,
      carbon: parseFloat(p.carbon.toFixed(1))
    })).sort((a, b) => b.carbon - a.carbon).slice(0, 5);

    // Goal aggregates
    const goalsWhere: any = {};
    if (departmentId && departmentId !== 'ALL') {
      goalsWhere.departmentId = departmentId;
    }
    const goals = await prisma.sustainabilityGoal.findMany({
      where: goalsWhere,
      include: { department: true }
    });

    const goalsProgressList = await Promise.all(
      goals.map(async (g) => {
        let sourceFilter = {};
        switch (g.category) {
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
            departmentId: g.departmentId,
            ...sourceFilter,
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
        const progress = parseFloat(
          Math.min(100, Math.max(0, (carbonSaved / targetReduction) * 100)).toFixed(1)
        );

        return {
          name: g.name,
          department: g.department.name,
          progress,
          status: g.status,
          targetCarbon: g.targetCarbon,
          currentCarbon: parseFloat(currentCarbon.toFixed(1))
        };
      })
    );

    // Dynamic Executive Summary Generation
    const summaries: string[] = [];
    if (totalEmissions > 0) {
      if (departmentEmissions.length > 0) {
        const topDept = departmentEmissions[0];
        const pct = ((topDept.carbon / totalEmissions) * 100).toFixed(0);
        summaries.push(`The ${topDept.name} department produced the highest environmental impact, accounting for ${pct}% of total carbon emissions (${topDept.carbon} tCO2e).`);
      }
      
      const fleetEmissions = sourcesMap['Fleet'];
      if (fleetEmissions > totalEmissions * 0.3) {
        summaries.push(`Fleet logistics emissions remain a significant contributor, accounting for ${((fleetEmissions / totalEmissions) * 100).toFixed(0)}% of the total carbon output.`);
      }

      const electricityEmissions = sourcesMap['Electricity'];
      if (electricityEmissions < totalEmissions * 0.2) {
        summaries.push(`Electricity consumption has remained highly optimized, keeping indirect scope 2 emissions below 20% of the active baseline.`);
      } else {
        summaries.push(`Grid electricity usage demands review as indirect emissions exceed 20% of organizational limits.`);
      }
    } else {
      summaries.push("No operational carbon footprint was registered during the selected evaluation timeline scope.");
    }

    const completedGoals = goalsProgressList.filter(g => g.status === 'Completed').length;
    const atRiskGoals = goalsProgressList.filter(g => g.status === 'At Risk' || g.status === 'Behind Schedule').length;

    // Organization KPIs
    const totalDepts = departments.length;
    const avgScore = totalDepts > 0 ? Math.round(departments.reduce((s, d) => s + d.score, 0) / totalDepts) : 80;
    
    // Sort scores
    const sortedDeptsByScore = [...departments].sort((a, b) => b.score - a.score);
    const highestDept = sortedDeptsByScore[0]?.name || 'N/A';
    const lowestDept = sortedDeptsByScore[sortedDeptsByScore.length - 1]?.name || 'N/A';

    const kpis = {
      totalEmissions,
      carbonSaved: parseFloat(Math.max(0, 1200 - totalEmissions).toFixed(1)), // mockup baseline save
      averageEnvironmentalScore: avgScore,
      highestPerformingDepartment: highestDept,
      lowestPerformingDepartment: lowestDept,
      goalsCompleted: completedGoals,
      goalsAtRisk: atRiskGoals,
      averageMonthlyReduction: parseFloat((totalEmissions / 12).toFixed(1))
    };

    return NextResponse.json({
      report: persistedLog,
      preview: {
        executiveSummary: summaries,
        kpis,
        operationalSources,
        departmentEmissions,
        productImpacts,
        goals: goalsProgressList,
        insights: [
          { type: 'info', message: 'Operational efficiency controls', description: 'Introduce smart building energy management controls in offices to lower grid power load.' },
          { type: 'warning', message: 'Fleet fuel consumption', description: 'Accelerate the migration of Logistics delivery fleets to low-emission biodiesel B20 lines.' },
          { type: 'success', message: 'Material recycling levels', description: 'Product recyclability indicators are maintaining solid target scores, reducing landfill footprints.' }
        ]
      }
    });
  } catch (error: any) {
    console.error('Failed to generate report:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
