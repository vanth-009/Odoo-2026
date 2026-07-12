import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { UpdateFactorSchema } from '@/environment/validators/factor';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const factor = await prisma.emissionFactor.findUnique({
      where: { id },
      include: {
        _count: {
          select: { transactions: true }
        }
      }
    });

    if (!factor) {
      return NextResponse.json({ error: 'Emission factor not found' }, { status: 404 });
    }

    return NextResponse.json(factor);
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

    // Zod validation
    const validation = UpdateFactorSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validation.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    // Check if emission factor exists
    const factor = await prisma.emissionFactor.findUnique({
      where: { id }
    });
    if (!factor) {
      return NextResponse.json({ error: 'Emission factor not found' }, { status: 404 });
    }

    const data = validation.data;

    // Check unique name constraints if name is changing
    if (data.name && data.name.trim() !== factor.name) {
      const nameConflict = await prisma.emissionFactor.findUnique({
        where: { name: data.name.trim() }
      });
      if (nameConflict) {
        return NextResponse.json({ error: 'An emission factor with this name already exists' }, { status: 400 });
      }
    }

    const updatedFactor = await prisma.emissionFactor.update({
      where: { id },
      data: {
        name: data.name !== undefined ? data.name.trim() : undefined,
        category: data.category !== undefined ? data.category.trim() : undefined,
        subcategory: data.subcategory !== undefined ? data.subcategory?.trim() || null : undefined,
        unit: data.unit !== undefined ? data.unit.trim() : undefined,
        value: data.value !== undefined ? data.value : undefined,
        source: data.source !== undefined ? data.source.trim() : undefined,
        version: data.version !== undefined ? data.version.trim() : undefined,
        effectiveDate: data.effectiveDate !== undefined ? data.effectiveDate : undefined,
        description: data.description !== undefined ? data.description?.trim() || null : undefined,
        status: data.status !== undefined ? data.status : undefined
      }
    });

    return NextResponse.json(updatedFactor);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update emission factor: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if emission factor exists
    const factor = await prisma.emissionFactor.findUnique({
      where: { id }
    });
    if (!factor) {
      return NextResponse.json({ error: 'Emission factor not found' }, { status: 404 });
    }

    // Perform soft delete by setting status to ARCHIVED
    const archivedFactor = await prisma.emissionFactor.update({
      where: { id },
      data: { status: 'ARCHIVED' }
    });

    return NextResponse.json({ 
      message: 'Emission factor archived successfully', 
      factor: archivedFactor 
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to archive emission factor: ' + error.message }, { status: 500 });
  }
}
