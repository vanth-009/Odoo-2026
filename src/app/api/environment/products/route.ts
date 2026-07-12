import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { CreateProductSchema } from '@/environment/validators/product';

export async function GET() {
  try {
    const products = await prisma.productESGProfile.findMany({
      include: {
        preferredEmissionFactor: {
          select: {
            id: true,
            name: true,
            value: true,
            unit: true
          }
        }
      },
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    });
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request
    const validation = CreateProductSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({
        error: 'Validation failed',
        details: validation.error.flatten().fieldErrors
      }, { status: 400 });
    }

    const data = validation.data;

    // Check unique code (SKU)
    const existing = await prisma.productESGProfile.findUnique({
      where: { code: data.code.trim() }
    });
    if (existing) {
      return NextResponse.json({ error: 'A product with this SKU / Code already exists.' }, { status: 400 });
    }

    const newProduct = await prisma.productESGProfile.create({
      data: {
        name: data.name.trim(),
        code: data.code.trim(),
        category: data.category.trim(),
        supplier: data.supplier.trim(),
        packagingType: data.packagingType.trim(),
        recyclablePercent: data.recyclablePercent,
        manufacturingCountry: data.manufacturingCountry.trim(),
        lifecycleStage: data.lifecycleStage.trim(),
        hazardClass: data.hazardClass?.trim() || null,
        carbonCategory: data.carbonCategory?.trim() || null,
        preferredEmissionFactorId: data.preferredEmissionFactorId || null,
        esgRating: data.esgRating.trim(),
        description: data.description?.trim() || null,
        status: data.status
      },
      include: {
        preferredEmissionFactor: true
      }
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create product ESG profile: ' + error.message }, { status: 500 });
  }
}
