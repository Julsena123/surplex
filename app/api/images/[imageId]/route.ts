import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ imageId: string }> }) {
  const { imageId } = await params;
  const image = await prisma.image.findUnique({ where: { id: imageId } });
  if (!image) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await prisma.image.delete({ where: { id: imageId } });
  const filePath = path.join(process.cwd(), 'public', image.url);
  await fs.unlink(filePath).catch(() => undefined);
  return NextResponse.json({ ok: true });
}
