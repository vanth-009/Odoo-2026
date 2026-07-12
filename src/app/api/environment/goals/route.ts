import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { CreateGoalSchema } from '@/environment/validators/goal';

// Helper to filter Carbon Transactions by Goal Category
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
      return {}; // Empty filter matches all sources for general reduction goals
  }
}

export async function GET() {
  try {
    const goals = await prisma.sustainabilityGoal.findMany({
      include: {
        department: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const now = new Date();

    // Dynamically calculate progress metrics based on real-time Carbon Transactions
    const enrichedGoals = await Promise.all(
      goals.map(async (goal) => {
        const txFilter = getTransactionsFilter(goal.category);
        
        // Query transactions sum
        const aggregate = await prisma.carbonTransaction.aggregate({
          where: {
            departmentId: goal.departmentId,
            ...txFilter,
            timestamp: {
              gte: goal.startDate,
              lte: goal.targetDate
            },
            status: {
              not: 'Archived' // Do not count archived transactions
            }
          },
          _sum: {
            carbon: true
          }
        });

        const currentCarbon = aggregate._sum.carbon || 0;
        const targetReduction = Math.max(0.1, goal.baselineCarbon - goal.targetCarbon);
        const carbonSaved = Math.max(0, goal.baselineCarbon - currentCarbon);
        const remainingReduction = Math.max(0, currentCarbon - goal.targetCarbon);
        
        // Progress percentage calculation: how close are we to reaching the target
        const progressPercent = parseFloat(
          Math.min(100, Math.max(0, (carbonSaved / targetReduction) * 100)).toFixed(2)
        );
        const remainingPercent = parseFloat((100 - progressPercent).toFixed(2));

        // Determine status automatically
        let calculatedStatus = goal.status;
        if (goal.status !== 'Archived' && goal.status !== 'Draft') {
          if (currentCarbon <= goal.targetCarbon) {
            calculatedStatus = 'Completed';
          } else if (now > goal.targetDate) {
            calculatedStatus = 'At Risk';
          } else {
            // Compare progress vs elapsed time to determine if it is on track or at risk
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

        return {
          ...goal,
          currentCarbon,
          targetReduction,
          carbonSaved,
          remainingReduction,
          progressPercent,
          remainingPercent,
          status: calculatedStatus
        };
      })
    );

    return NextResponse.json(enrichedGoals);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Server-side Zod validation
    const validation = CreateGoalSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validation.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const { 
      name, description, departmentId, category, 
      baselineCarbon, targetCarbon, startDate, targetDate, 
      owner, priority, status 
    } = validation.data;

    // Verify department exists
    const dept = await prisma.department.findUnique({
      where: { id: departmentId }
    });
    
    if (!dept) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }

    const newGoal = await prisma.sustainabilityGoal.create({
      data: {
        name,
        description,
        departmentId,
        category,
        baselineCarbon,
        targetCarbon,
        startDate: new Date(startDate),
        targetDate: new Date(targetDate),
        owner,
        priority,
        status
      },
      include: {
        department: true
      }
    });

    return NextResponse.json(newGoal, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create goal: ' + error.message }, { status: 500 });
  }
}
