import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { CreateTransactionSchema } from '@/environment/validators/transaction';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query params
    const search = searchParams.get('search') || '';
    const departmentId = searchParams.get('departmentId') || '';
    const sortField = searchParams.get('sortField') || 'timestamp';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    const skip = (page - 1) * limit;

    // Build Prisma query filter
    const where: any = {};

    if (search) {
      where.OR = [
        { operation: { contains: search } },
        { product: { contains: search } },
        { txId: { contains: search } }
      ];
    }

    if (departmentId && departmentId !== 'all') {
      where.departmentId = departmentId;
    }

    // Determine sort ordering
    const orderBy: any = {};
    if (sortField === 'department') {
      orderBy.department = { name: sortOrder };
    } else {
      orderBy[sortField] = sortOrder;
    }

    // Execute queries in parallel
    const [transactions, totalCount] = await Promise.all([
      prisma.carbonTransaction.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          department: true
        }
      }),
      prisma.carbonTransaction.count({ where })
    ]);

    return NextResponse.json({
      transactions,
      pagination: {
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Zod validation
    const validation = CreateTransactionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validation.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const { departmentId, operation, product, carbon } = validation.data;

    // Verify department exists
    const dept = await prisma.department.findUnique({
      where: { id: departmentId }
    });
    
    if (!dept) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }

    // Generate random transaction ID: TX-10000+
    const count = await prisma.carbonTransaction.count();
    const txId = `TX-${10001 + count}`;

    const newTx = await prisma.carbonTransaction.create({
      data: {
        txId,
        departmentId,
        operation,
        product,
        carbon,
        timestamp: new Date(),
        status: 'Approved'
      },
      include: {
        department: true
      }
    });

    // Also adjust department carbon metrics (or recalculate on dashboard retrieval)
    return NextResponse.json(newTx, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create transaction: ' + error.message }, { status: 500 });
  }
}
