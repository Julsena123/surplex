import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { computeStatus } from '@/lib/status';
import { handleApiError } from '@/lib/api';
import { VehicleCreateSchema } from '@/lib/validation';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const search = params.get('search') || '';
  const status = params.get('status');
  const sort = params.get('sort') || 'updatedAt';

  const where: Prisma.VehicleWhereInput = {
    ...(search
      ? {
          OR: [
            { vehicleTitle: { contains: search, mode: 'insensitive' } },
            { vin: { contains: search, mode: 'insensitive' } }
          ]
        }
      : {}),
    ...(status ? { status: status as any } : {})
  };

  const orderBy: Prisma.VehicleOrderByWithRelationInput =
    sort === 'minPrice' || sort === 'soldPrice' || sort === 'arrivalDate' || sort === 'auctionEndDate'
      ? { [sort]: 'asc' }
      : { updatedAt: 'desc' };

  const vehicles = await prisma.vehicle.findMany({
    where,
    include: { images: true, reminders: true },
    orderBy
  });

  return NextResponse.json({ data: vehicles });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = VehicleCreateSchema.parse(body);
    const data = { ...parsed, status: computeStatus(parsed) };
    const created = await prisma.vehicle.create({ data });
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
