import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reminder = await prisma.reminder.findUnique({ where: { id }, include: { vehicle: true } });
  if (!reminder) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const stamp = reminder.remindAt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nUID:${reminder.id}\nDTSTAMP:${stamp}\nDTSTART:${stamp}\nSUMMARY:${reminder.type} - ${reminder.vehicle.vehicleTitle}\nDESCRIPTION:VIN ${reminder.vehicle.vin}\nEND:VEVENT\nEND:VCALENDAR`;
  return new NextResponse(ics, {
    headers: {
      'Content-Type': 'text/calendar',
      'Content-Disposition': `attachment; filename="reminder-${id}.ics"`
    }
  });
}
