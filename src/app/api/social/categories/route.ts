import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest) {
  try {
    const categories = await prisma.csrCategory.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { activities: true },
        },
      },
    });

    return NextResponse.json({ data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const errors: string[] = [];

    if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
      errors.push('Name is required and must be at least 2 characters long.');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    const trimmedName = body.name.trim();

    const existing = await prisma.csrCategory.findFirst({
      where: { name: trimmedName },
    });

    if (existing) {
      return NextResponse.json(
        { error: `A category with the name "${trimmedName}" already exists.` },
        { status: 409 }
      );
    }

    const category = await prisma.csrCategory.create({
      data: {
        name: trimmedName,
        description: body.description?.trim() || null,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      },
    });

    return NextResponse.json(
      { data: category, message: 'Category created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
