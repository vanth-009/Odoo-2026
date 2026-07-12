import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { UpdateFactorSchema } from '@/environment/validators/factor';

export async function GET() {
  try {
    const factors = await prisma.emissionFactor.findMany({
      orderBy: {
        type: 'asc'
      }
    });
    return NextResponse.json(factors);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    // Zod validation
    const validation = UpdateFactorSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validation.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const { id, value } = validation.data;

    const updatedFactor = await prisma.emissionFactor.update({
      where: { id },
      data: { value }
    });

    return NextResponse.json(updatedFactor);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update emission factor: ' + error.message }, { status: 500 });
  }
}
