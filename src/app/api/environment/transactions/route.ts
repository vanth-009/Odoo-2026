import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { CreateTransactionSchema } from '@/environment/validators/transaction';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query params
    const search = searchParams.get('search') || '';
    const departmentId = searchParams.get('departmentId') || '';
    const source = searchParams.get('source') || '';
    const productId = searchParams.get('productId') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    
    const sortField = searchParams.get('sortField') || 'timestamp';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    const skip = (page - 1) * limit;

    // Build Prisma query filter
    const where: any = {};

    // Combinable filters
    if (search) {
      where.OR = [
        { txId: { contains: search } },
        { operation: { contains: search } },
        { product: { contains: search } },
        { notes: { contains: search } }
      ];
    }

    if (departmentId && departmentId !== 'all') {
      where.departmentId = departmentId;
    }

    if (source && source !== 'all') {
      where.source = source;
    }

    if (productId && productId !== 'all') {
      where.productId = productId;
    }

    if (category && category !== 'all') {
      where.emissionFactor = {
        category: category
      };
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) {
        where.timestamp.gte = new Date(startDate);
      }
      if (endDate) {
        // Set end date to end of day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.timestamp.lte = end;
      }
    }

    // Determine sort ordering
    const orderBy: any = {};
    if (sortField === 'department') {
      orderBy.department = { name: sortOrder };
    } else if (sortField === 'productProfile') {
      orderBy.productProfile = { name: sortOrder };
    } else if (sortField === 'emissionFactor') {
      orderBy.emissionFactor = { name: sortOrder };
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
          department: true,
          emissionFactor: true,
          productProfile: true
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

    const data = validation.data;

    // Verify department exists
    const dept = await prisma.department.findUnique({
      where: { id: data.departmentId }
    });
    if (!dept) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }

    // Retrieve emission factor to calculate emissions
    const factor = await prisma.emissionFactor.findUnique({
      where: { id: data.emissionFactorId }
    });
    if (!factor) {
      return NextResponse.json({ error: 'Emission Factor not found or invalid' }, { status: 404 });
    }
    if (factor.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Selected Emission Factor is archived and cannot be used' }, { status: 400 });
    }

    // If a product is selected, verify it exists and is active
    if (data.productId) {
      const product = await prisma.productESGProfile.findUnique({
        where: { id: data.productId }
      });
      if (!product) {
        return NextResponse.json({ error: 'Product profile not found' }, { status: 404 });
      }
      if (product.status !== 'ACTIVE') {
        return NextResponse.json({ error: 'Product is archived and cannot be selected for new transactions' }, { status: 400 });
      }
    }

    // Generate transaction ID
    const count = await prisma.carbonTransaction.count();
    const txId = `TX-${10001 + count}`;

    // Calculate emissions
    const carbonVal = parseFloat((data.quantity * factor.value).toFixed(4));
    const formulaStr = `Quantity (${data.quantity} ${factor.unit}) × Factor (${factor.value} tCO2e/${factor.unit})`;

    const newTx = await prisma.carbonTransaction.create({
      data: {
        txId,
        timestamp: data.timestamp,
        departmentId: data.departmentId,
        source: data.source,
        productId: data.productId || null,
        product: data.product,
        operation: data.operation,
        emissionFactorId: data.emissionFactorId,
        quantity: data.quantity,
        unit: factor.unit,
        factorValue: factor.value,
        carbon: carbonVal,
        formula: formulaStr,
        createdBy: data.createdBy || 'System',
        status: data.status,
        notes: data.notes || null
      },
      include: {
        department: true,
        emissionFactor: true,
        productProfile: true
      }
    });

    return NextResponse.json(newTx, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create carbon transaction: ' + error.message }, { status: 500 });
  }
}
