import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { UpdateGoalSchema } from '@/environment/validators/goal';

function getTransactionsFilter(category: string) {
  switch (category) {
    case 'Reduce Fleet Emissions':
      return { source: 'Fleet' };
    case 'Reduce Electricity Consumption':
    case 'Renewable Energy Adoption':
      return { source: 'Electricity' };
    case 'Reduce Manufacturing Emissions':
      return { source: 'Manufacturing' };
    case 'Packaging Waste Reduction':
      return { source: 'Waste Management' };
    default:
      return {};
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const goal = await prisma.sustainabilityGoal.findUnique({
      where: { id },
      include: {
        department: true
      }
    });

    if (!goal) {
      return NextResponse.json({ error: 'Sustainability Goal not found' }, { status: 404 });
    }

    const txFilter = getTransactionsFilter(goal.category);

    // Get all matching transactions for lists and charts
    const transactions = await prisma.carbonTransaction.findMany({
      where: {
        departmentId: goal.departmentId,
        ...txFilter,
        timestamp: {
          gte: goal.startDate,
          lte: goal.targetDate
        },
        status: {
          not: 'Archived'
        }
      },
      orderBy: {
        timestamp: 'asc'
      }
    });

    const currentCarbon = transactions.reduce((sum, tx) => sum + tx.carbon, 0);
    const targetReduction = Math.max(0.1, goal.baselineCarbon - goal.targetCarbon);
    const carbonSaved = Math.max(0, goal.baselineCarbon - currentCarbon);
    const remainingReduction = Math.max(0, currentCarbon - goal.targetCarbon);
    const progressPercent = parseFloat(
      Math.min(100, Math.max(0, (carbonSaved / targetReduction) * 100)).toFixed(2)
    );
    const remainingPercent = parseFloat((100 - progressPercent).toFixed(2));

    const now = new Date();

    // Determine status automatically
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

        if (progressPercent >= elapsedPercent * 0.85) {
          calculatedStatus = 'On Track';
        } else {
          calculatedStatus = 'At Risk';
        }
      }
    }

    // Build trend chart: aggregate by month
    const monthlyAggregation: Record<string, { month: string; emissions: number; target: number; baseline: number }> = {};
    
    // Seed all months between start and target
    const currentIter = new Date(goal.startDate);
    const endIter = new Date(goal.targetDate);
    // Limit safety
    let safetyCounter = 0;
    while (currentIter <= endIter && safetyCounter < 36) {
      const label = currentIter.toLocaleString('default', { month: 'short', year: '2-digit' });
      monthlyAggregation[label] = {
        month: label,
        emissions: 0,
        target: goal.targetCarbon / 12, // monthly target ratio
        baseline: goal.baselineCarbon / 12
      };
      currentIter.setMonth(currentIter.getMonth() + 1);
      safetyCounter++;
    }

    // Populate actuals
    transactions.forEach(tx => {
      const label = new Date(tx.timestamp).toLocaleString('default', { month: 'short', year: '2-digit' });
      if (monthlyAggregation[label]) {
        monthlyAggregation[label].emissions += tx.carbon;
      }
    });

    const trend = Object.values(monthlyAggregation);

    // Build timeline milestones
    const timeline = [
      {
        title: 'Goal Established',
        date: goal.startDate,
        description: `Baseline emissions benchmark set at ${goal.baselineCarbon} tCO2e. Goal Target: ${goal.targetCarbon} tCO2e.`,
        completed: true
      },
      {
        title: 'Current Status Check',
        date: now,
        description: `Current emissions evaluated at ${currentCarbon.toFixed(2)} tCO2e. Remaining reduction: ${remainingReduction.toFixed(2)} tCO2e.`,
        completed: now >= goal.startDate
      },
      {
        title: 'Target Deadline',
        date: goal.targetDate,
        description: `Final assessment of the ${((targetReduction / goal.baselineCarbon) * 100).toFixed(0)}% reduction target.`,
        completed: now >= goal.targetDate
      }
    ];

    return NextResponse.json({
      goal: {
        ...goal,
        currentCarbon,
        targetReduction,
        carbonSaved,
        remainingReduction,
        progressPercent,
        remainingPercent,
        status: calculatedStatus
      },
      relatedTransactions: transactions,
      trend,
      timeline
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existingGoal = await prisma.sustainabilityGoal.findUnique({
      where: { id }
    });

    if (!existingGoal) {
      return NextResponse.json({ error: 'Sustainability Goal not found' }, { status: 404 });
    }

    // Enforce business constraint: "Archived goals cannot receive updates"
    if (existingGoal.status === 'Archived') {
      // Allow modifying ONLY status (e.g., restoring it)
      if (Object.keys(body).length !== 1 || body.status === undefined) {
        return NextResponse.json({ error: 'Archived goals cannot receive updates unless restoring status.' }, { status: 400 });
      }
    }

    // Enforce business constraint: "Completed goals become read-only"
    // Wait: Let's see if we should block all updates except status change for Completed goals
    if (existingGoal.status === 'Completed') {
      if (body.baselineCarbon !== undefined || body.targetCarbon !== undefined || body.startDate !== undefined || body.targetDate !== undefined) {
        return NextResponse.json({ error: 'Completed goals are read-only and parameters cannot be changed.' }, { status: 400 });
      }
    }

    // Validate update fields
    const validation = UpdateGoalSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({
        error: 'Validation failed',
        details: validation.error.flatten().fieldErrors
      }, { status: 400 });
    }

    const updated = await prisma.sustainabilityGoal.update({
      where: { id },
      data: validation.data,
      include: {
        department: true
      }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update goal: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existingGoal = await prisma.sustainabilityGoal.findUnique({
      where: { id }
    });

    if (!existingGoal) {
      return NextResponse.json({ error: 'Sustainability Goal not found' }, { status: 404 });
    }

    // Soft delete / Archive
    const updated = await prisma.sustainabilityGoal.update({
      where: { id },
      data: {
        status: 'Archived'
      }
    });

    return NextResponse.json({ success: true, message: 'Sustainability Goal archived successfully', goal: updated });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to archive goal: ' + error.message }, { status: 500 });
  }
}
