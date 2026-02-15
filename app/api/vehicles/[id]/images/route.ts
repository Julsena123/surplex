import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const formData = await request.formData();
  const files = formData.getAll('files').filter((f): f is File => f instanceof File);
  if (!files.length) return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });

  const created = await Promise.all(
    files.map(async (file) => {
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const target = path.join(uploadDir, filename);
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(target, buffer);
      return prisma.image.create({ data: { vehicleId: id, url: `/uploads/${filename}` } });
    })
  );

  return NextResponse.json({ data: created }, { status: 201 });
}
