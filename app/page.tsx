import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { VehicleTable } from '@/components/vehicles/vehicle-table';

export default async function HomePage() {
  const vehicles = await prisma.vehicle.findMany({ include: { images: true, reminders: true }, orderBy: { createdAt: 'desc' } });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Vehicle Tracker</h1>
        <Link className="rounded bg-slate-900 px-3 py-2 text-sm text-white" href="/vehicles/new">Add vehicle</Link>
      </div>
      <VehicleTable vehicles={vehicles} />
    </div>
  );
}
