import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { computeStatus } from '@/lib/status';
import { handleApiError } from '@/lib/api';
import { VehicleUpdateSchema } from '@/lib/validation';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: { images: true, reminders: true }
  });
  if (!vehicle) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: vehicle });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = VehicleUpdateSchema.parse(body);
    const old = await prisma.vehicle.findUnique({ where: { id } });
    if (!old) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const merged = { ...old, ...parsed };
    const updated = await prisma.vehicle.update({
      where: { id },
      data: { ...parsed, status: computeStatus(merged) }
    });
    return NextResponse.json({ data: updated });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.vehicle.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
