import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { VehicleForm } from '@/components/vehicles/vehicle-form';

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) return notFound();
  return <VehicleForm vehicle={vehicle} />;
}
