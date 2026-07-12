import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { CreateFactorSchema } from '@/environment/validators/factor';

export async function GET() {
  try {
    const factors = await prisma.emissionFactor.findMany({
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    });
    return NextResponse.json(factors);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Zod validation
    const validation = CreateFactorSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validation.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const { name, category, subcategory, unit, value, source, version, effectiveDate, description, status } = validation.data;

    // Check unique constraint by name
    const existing = await prisma.emissionFactor.findUnique({
      where: { name: name.trim() }
    });
    if (existing) {
      return NextResponse.json({ error: 'An emission factor with this name already exists.' }, { status: 400 });
    }

    const newFactor = await prisma.emissionFactor.create({
      data: {
        name: name.trim(),
        category: category.trim(),
        subcategory: subcategory?.trim() || null,
        unit: unit.trim(),
        value,
        source: source.trim(),
        version: version.trim(),
        effectiveDate,
        description: description?.trim() || null,
        status
      }
    });

    return NextResponse.json(newFactor, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create emission factor: ' + error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, value } = body;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing factor ID' }, { status: 400 });
    }

    if (value === undefined || isNaN(Number(value)) || Number(value) <= 0) {
      return NextResponse.json({ error: 'Emission factor value must be a positive number' }, { status: 400 });
    }

    const updatedFactor = await prisma.emissionFactor.update({
      where: { id },
      data: { value: Number(value) }
    });

    return NextResponse.json(updatedFactor);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update emission factor: ' + error.message }, { status: 500 });
  }
}

