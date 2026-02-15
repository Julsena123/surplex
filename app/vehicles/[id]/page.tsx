import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/date';

export default async function VehicleDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = await prisma.vehicle.findUnique({ where: { id }, include: { images: true, reminders: true } });
  if (!vehicle) return notFound();
  return (
    <div className="space-y-4">
      <div className="flex justify-between"><h1 className="text-2xl font-bold">{vehicle.vehicleTitle}</h1><Link href={`/vehicles/${id}/edit`} className="rounded border px-3 py-2">Edit</Link></div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded border bg-white p-4">VIN: {vehicle.vin}<br/>Year: {vehicle.year ?? '-'}<br/>Arrival: {formatDate(vehicle.arrivalDate)}</div>
        <div className="rounded border bg-white p-4">Auction: {formatDate(vehicle.auctionStartDate)} - {formatDate(vehicle.auctionEndDate)}<br/>Action: {formatDate(vehicle.actionStartDate)} - {formatDate(vehicle.actionEndDate)}<br/>Status: {vehicle.status}</div>
      </div>
      <div className="rounded border bg-white p-4">Sale: {formatDate(vehicle.soldDate)} | {vehicle.soldPrice ?? '-'}<br/>Notes: {vehicle.notes ?? '-'}</div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{vehicle.images.map((img) => <a href={img.url} key={img.id}><img src={img.url} className="h-32 w-full rounded object-cover"/></a>)}</div>
      <form action={`/api/vehicles/${id}/images`} method="post" encType="multipart/form-data" className="rounded border bg-white p-4">
        <input type="file" name="files" multiple className="mb-2" />
        <button className="rounded bg-slate-900 px-3 py-2 text-white">Upload images</button>
      </form>
      <div className="space-y-2 rounded border bg-white p-4">
        <h2 className="font-semibold">Reminders</h2>
        {vehicle.reminders.map((r) => <div key={r.id}>{r.type} - {formatDate(r.remindAt)}</div>)}
      </div>
    </div>
  );
}
