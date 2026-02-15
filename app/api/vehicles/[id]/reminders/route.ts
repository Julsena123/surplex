import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api';
import { ReminderSchema } from '@/lib/validation';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = ReminderSchema.parse(body);
    if (!parsed.remindAt) return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
    const reminder = await prisma.reminder.create({
      data: { ...parsed, remindAt: parsed.remindAt, vehicleId: id }
    });
    return NextResponse.json({ data: reminder }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
