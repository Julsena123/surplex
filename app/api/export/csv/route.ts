import { NextResponse } from 'next/server';
import { stringify } from 'csv-stringify/sync';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/date';

export async function GET() {
  const vehicles = await prisma.vehicle.findMany({ orderBy: { createdAt: 'asc' } });
  const records = vehicles.map((v) => ({
    'Automobilio marke': v.vehicleTitle,
    'Vin Nr.': v.vin,
    Metai: v.year ?? '',
    'Nuvežimo Data': formatDate(v.arrivalDate),
    'Aukciono Nr.': v.auctionNo ?? '',
    'Min Kaina': v.minPrice ?? '',
    'Parduota data': formatDate(v.soldDate),
    'Parduota Kaina': v.soldPrice ?? '',
    actionStartDate: formatDate(v.actionStartDate),
    actionEndDate: formatDate(v.actionEndDate),
    auctionStartDate: formatDate(v.auctionStartDate),
    auctionEndDate: formatDate(v.auctionEndDate),
    status: v.status,
    notes: v.notes ?? ''
  }));

  const csv = stringify(records, { header: true });
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="vehicles.csv"'
    }
  });
}
