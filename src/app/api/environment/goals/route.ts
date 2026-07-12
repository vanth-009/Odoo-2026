import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { CreateGoalSchema } from '@/environment/validators/goal';

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
    return NextResponse.json(goals);
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

    const { name, departmentId, owner, target, deadline } = validation.data;

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
        departmentId,
        owner,
        target,
        remaining: target,
        progress: 0,
        deadline: new Date(deadline),
        status: 'On Track',
        risk: 'Low'
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
