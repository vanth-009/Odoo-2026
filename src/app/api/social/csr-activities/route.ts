import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/social/csr-activities
// List activities with pagination, filters (status, categoryId, search)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '10', 10)));
    const skip = (page - 1) * limit;

    // Filters
    const status = searchParams.get('status');
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status;
    }

    if (categoryId) {
      const parsedCategoryId = parseInt(categoryId, 10);
      if (isNaN(parsedCategoryId)) {
        return NextResponse.json(
          { error: 'Invalid categoryId. Must be a number.' },
          { status: 400 }
        );
      }
      where.categoryId = parsedCategoryId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { organizerName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [activities, total] = await Promise.all([
      prisma.csrActivity.findMany({
        where,
        include: {
          category: true,
          _count: {
            select: { participations: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.csrActivity.count({ where }),
    ]);

    return NextResponse.json({
      data: activities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching CSR activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CSR activities' },
      { status: 500 }
    );
  }
}

// POST /api/social/csr-activities
// Create a new CSR activity
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const errors: string[] = [];

    // Required field validations
    if (!body.title || typeof body.title !== 'string' || body.title.trim().length < 3) {
      errors.push('Title is required and must be at least 3 characters long.');
    }

    if (!body.description || typeof body.description !== 'string' || body.description.trim().length < 10) {
      errors.push('Description is required and must be at least 10 characters long.');
    }

    if (body.categoryId === undefined || body.categoryId === null) {
      errors.push('categoryId is required.');
    } else {
      const parsedCategoryId = Number(body.categoryId);
      if (isNaN(parsedCategoryId) || !Number.isInteger(parsedCategoryId)) {
        errors.push('categoryId must be a valid integer.');
      }
    }

    if (!body.startDate) {
      errors.push('startDate is required.');
    }

    if (!body.endDate) {
      errors.push('endDate is required.');
    }

    if (body.startDate && body.endDate) {
      const start = new Date(body.startDate);
      const end = new Date(body.endDate);
      if (isNaN(start.getTime())) {
        errors.push('startDate must be a valid date.');
      }
      if (isNaN(end.getTime())) {
        errors.push('endDate must be a valid date.');
      }
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end <= start) {
        errors.push('endDate must be after startDate.');
      }
    }

    if (!body.organizerName || typeof body.organizerName !== 'string' || body.organizerName.trim().length === 0) {
      errors.push('organizerName is required.');
    }

    // Optional field validations
    if (body.xpReward !== undefined && body.xpReward !== null) {
      const xp = Number(body.xpReward);
      if (isNaN(xp) || !Number.isInteger(xp) || xp <= 0) {
        errors.push('xpReward must be a positive integer.');
      }
    }

    if (body.maxParticipants !== undefined && body.maxParticipants !== null) {
      const maxP = Number(body.maxParticipants);
      if (isNaN(maxP) || !Number.isInteger(maxP) || maxP <= 0) {
        errors.push('maxParticipants must be a positive integer.');
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    // Verify category exists
    const category = await prisma.csrCategory.findUnique({
      where: { id: Number(body.categoryId) },
    });

    if (!category) {
      return NextResponse.json(
        { error: `Category with id ${body.categoryId} not found.` },
        { status: 404 }
      );
    }

    const activity = await prisma.csrActivity.create({
      data: {
        title: body.title.trim(),
        description: body.description.trim(),
        categoryId: Number(body.categoryId),
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        organizerName: body.organizerName.trim(),
        ...(body.xpReward !== undefined && { xpReward: Number(body.xpReward) }),
        ...(body.maxParticipants !== undefined && { maxParticipants: Number(body.maxParticipants) }),
        ...(body.location && { location: body.location.trim() }),
        ...(body.status && { status: body.status }),
        ...(body.imageUrl && { imageUrl: body.imageUrl.trim() }),
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(
      { data: activity, message: 'CSR activity created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating CSR activity:', error);
    return NextResponse.json(
      { error: 'Failed to create CSR activity' },
      { status: 500 }
    );
  }
}
