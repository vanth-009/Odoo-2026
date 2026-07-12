import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { UpdateTransactionSchema } from '@/environment/validators/transaction';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const tx = await prisma.carbonTransaction.findUnique({
      where: { id },
      include: {
        department: true,
        emissionFactor: true,
        productProfile: true
      }
    });

    if (!tx) {
      return NextResponse.json({ error: 'Carbon transaction not found' }, { status: 404 });
    }

    return NextResponse.json(tx);
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
    const validation = UpdateTransactionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({
        error: 'Validation failed',
        details: validation.error.flatten().fieldErrors
      }, { status: 400 });
    }

    const tx = await prisma.carbonTransaction.findUnique({
      where: { id },
      include: {
        emissionFactor: true
      }
    });
    if (!tx) {
      return NextResponse.json({ error: 'Carbon transaction not found' }, { status: 404 });
    }

    const data = validation.data;

    // Check product is active if changing productId
    if (data.productId !== undefined && data.productId !== tx.productId) {
      if (data.productId) {
        const product = await prisma.productESGProfile.findUnique({
          where: { id: data.productId }
        });
        if (!product) {
          return NextResponse.json({ error: 'Product profile not found' }, { status: 404 });
        }
        if (product.status !== 'ACTIVE') {
          return NextResponse.json({ error: 'Selected Product is archived and cannot be linked' }, { status: 400 });
        }
      }
    }

    // Determine quantity, factor value, and unit for recalculations
    let finalQty = tx.quantity;
    let finalFactorVal = tx.factorValue;
    let finalUnit = tx.unit;
    let factorName = tx.emissionFactor?.name || 'Emission Factor';

    if (data.quantity !== undefined) {
      finalQty = data.quantity;
    }

    if (data.emissionFactorId !== undefined && data.emissionFactorId !== tx.emissionFactorId) {
      if (data.emissionFactorId) {
        const newFactor = await prisma.emissionFactor.findUnique({
          where: { id: data.emissionFactorId }
        });
        if (!newFactor) {
          return NextResponse.json({ error: 'Emission factor not found' }, { status: 404 });
        }
        if (newFactor.status !== 'ACTIVE') {
          return NextResponse.json({ error: 'Selected Emission Factor is archived and cannot be used' }, { status: 400 });
        }
        finalFactorVal = newFactor.value;
        finalUnit = newFactor.unit;
        factorName = newFactor.name;
      }
    }

    // Recalculate carbon and formula if qty or factor changed
    let carbonVal = tx.carbon;
    let formulaStr = tx.formula;

    if (data.quantity !== undefined || (data.emissionFactorId !== undefined && data.emissionFactorId !== tx.emissionFactorId)) {
      carbonVal = parseFloat((finalQty * finalFactorVal).toFixed(4));
      formulaStr = `Quantity (${finalQty} ${finalUnit}) × Factor (${finalFactorVal} tCO2e/${finalUnit})`;
    }

    const updatedTx = await prisma.carbonTransaction.update({
      where: { id },
      data: {
        timestamp: data.timestamp !== undefined ? data.timestamp : undefined,
        departmentId: data.departmentId !== undefined ? data.departmentId : undefined,
        source: data.source !== undefined ? data.source : undefined,
        productId: data.productId !== undefined ? data.productId : undefined,
        product: data.product !== undefined ? data.product : undefined,
        operation: data.operation !== undefined ? data.operation : undefined,
        emissionFactorId: data.emissionFactorId !== undefined ? data.emissionFactorId : undefined,
        quantity: data.quantity !== undefined ? data.quantity : undefined,
        unit: finalUnit,
        factorValue: finalFactorVal,
        carbon: carbonVal,
        formula: formulaStr,
        createdBy: data.createdBy !== undefined ? data.createdBy : undefined,
        status: data.status !== undefined ? data.status : undefined,
        notes: data.notes !== undefined ? data.notes : undefined
      },
      include: {
        department: true,
        emissionFactor: true,
        productProfile: true
      }
    });

    return NextResponse.json(updatedTx);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update carbon transaction: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const tx = await prisma.carbonTransaction.findUnique({
      where: { id }
    });
    if (!tx) {
      return NextResponse.json({ error: 'Carbon transaction not found' }, { status: 404 });
    }

    // Soft delete / archive
    const archivedTx = await prisma.carbonTransaction.update({
      where: { id },
      data: { status: 'Archived' }
    });

    return NextResponse.json({
      message: 'Carbon transaction archived successfully',
      transaction: archivedTx
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to archive carbon transaction: ' + error.message }, { status: 500 });
  }
}
