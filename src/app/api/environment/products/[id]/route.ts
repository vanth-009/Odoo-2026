import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { UpdateProductSchema } from '@/environment/validators/product';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.productESGProfile.findUnique({
      where: { id },
      include: {
        preferredEmissionFactor: true,
        _count: {
          select: { transactions: true }
        }
      }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product ESG profile not found' }, { status: 404 });
    }

    return NextResponse.json(product);
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

    // Validate request
    const validation = UpdateProductSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({
        error: 'Validation failed',
        details: validation.error.flatten().fieldErrors
      }, { status: 400 });
    }

    const product = await prisma.productESGProfile.findUnique({
      where: { id }
    });
    if (!product) {
      return NextResponse.json({ error: 'Product ESG profile not found' }, { status: 404 });
    }

    const data = validation.data;

    // Check code uniqueness if code is changing
    if (data.code && data.code.trim() !== product.code) {
      const conflict = await prisma.productESGProfile.findUnique({
        where: { code: data.code.trim() }
      });
      if (conflict) {
        return NextResponse.json({ error: 'A product with this SKU / Code already exists' }, { status: 400 });
      }
    }

    const updatedProduct = await prisma.productESGProfile.update({
      where: { id },
      data: {
        name: data.name !== undefined ? data.name.trim() : undefined,
        code: data.code !== undefined ? data.code.trim() : undefined,
        category: data.category !== undefined ? data.category.trim() : undefined,
        supplier: data.supplier !== undefined ? data.supplier.trim() : undefined,
        packagingType: data.packagingType !== undefined ? data.packagingType.trim() : undefined,
        recyclablePercent: data.recyclablePercent !== undefined ? data.recyclablePercent : undefined,
        manufacturingCountry: data.manufacturingCountry !== undefined ? data.manufacturingCountry.trim() : undefined,
        lifecycleStage: data.lifecycleStage !== undefined ? data.lifecycleStage.trim() : undefined,
        hazardClass: data.hazardClass !== undefined ? (data.hazardClass?.trim() || null) : undefined,
        carbonCategory: data.carbonCategory !== undefined ? (data.carbonCategory?.trim() || null) : undefined,
        preferredEmissionFactorId: data.preferredEmissionFactorId !== undefined ? (data.preferredEmissionFactorId || null) : undefined,
        esgRating: data.esgRating !== undefined ? data.esgRating.trim() : undefined,
        description: data.description !== undefined ? (data.description?.trim() || null) : undefined,
        status: data.status !== undefined ? data.status : undefined
      },
      include: {
        preferredEmissionFactor: true
      }
    });

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update product ESG profile: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.productESGProfile.findUnique({
      where: { id }
    });
    if (!product) {
      return NextResponse.json({ error: 'Product ESG profile not found' }, { status: 404 });
    }

    // Soft delete / archive product
    const archivedProduct = await prisma.productESGProfile.update({
      where: { id },
      data: { status: 'ARCHIVED' }
    });

    return NextResponse.json({
      message: 'Product ESG profile archived successfully',
      product: archivedProduct
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to archive product ESG profile: ' + error.message }, { status: 500 });
  }
}
