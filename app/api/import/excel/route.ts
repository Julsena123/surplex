import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { prisma } from '@/lib/prisma';
import { parseFlexibleDate } from '@/lib/date';
import { computeStatus } from '@/lib/status';

const map = {
  'Automobilio marke': 'vehicleTitle',
  'Vin Nr.': 'vin',
  Metai: 'year',
  'Nuvežimo Data': 'arrivalDate',
  'Aukciono Nr.': 'auctionNo',
  'Min Kaina': 'minPrice',
  'Parduota data': 'soldDate',
  'Parduota Kaina': 'soldPrice'
} as const;

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const file = form.get('file');
  const sheetName = (form.get('sheet') as string) || 'Sheet1';
  if (!(file instanceof File)) return NextResponse.json({ error: 'File required' }, { status: 400 });
  const data = Buffer.from(await file.arrayBuffer());
  const wb = XLSX.read(data, { type: 'buffer' });
  const ws = wb.Sheets[sheetName];
  if (!ws) return NextResponse.json({ error: 'Sheet not found' }, { status: 400 });
  const rows = XLSX.utils.sheet_to_json<Record<string, any>>(ws);

  let created = 0,
    updated = 0,
    skipped = 0;
  const errors: Array<{ row: number; field: string; reason: string }> = [];

  for (const [index, row] of rows.entries()) {
    const vin = String(row['Vin Nr.'] || '').trim();
    if (!vin) {
      skipped++;
      continue;
    }
    try {
      const payload: any = {
        vehicleTitle: String(row['Automobilio marke'] || '').trim() || 'Untitled vehicle',
        vin,
        year: row['Metai'] ? Number(row['Metai']) : null,
        arrivalDate: parseFlexibleDate(String(row['Nuvežimo Data'] || '')),
        auctionNo: row['Aukciono Nr.'] ? String(row['Aukciono Nr.']) : null,
        minPrice: row['Min Kaina'] ? Number(row['Min Kaina']) : null,
        soldDate: parseFlexibleDate(String(row['Parduota data'] || '')),
        soldPrice: row['Parduota Kaina'] ? Number(row['Parduota Kaina']) : null
      };
      payload.status = computeStatus(payload);
      const existing = await prisma.vehicle.findUnique({ where: { vin } });
      if (existing) {
        await prisma.vehicle.update({ where: { vin }, data: payload });
        updated++;
      } else {
        await prisma.vehicle.create({ data: payload });
        created++;
      }
    } catch (error) {
      errors.push({ row: index + 2, field: 'vin', reason: error instanceof Error ? error.message : 'Unknown' });
    }
  }

  return NextResponse.json({ data: { created, updated, skipped, errors, mappedHeaders: map } });
}
