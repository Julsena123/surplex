import Link from 'next/link';
import { differenceInCalendarDays } from 'date-fns';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const vehicles = await prisma.vehicle.findMany();
  const pending = vehicles.filter((v) => v.status === 'PENDING').length;
  const sold = vehicles.filter((v) => v.status === 'SOLD').length;
  const notSold = vehicles.filter((v) => v.status === 'NOT_SOLD').length;
  const sumMin = vehicles.reduce((s, v) => s + (v.minPrice ?? 0), 0);
  const sumSold = vehicles.reduce((s, v) => s + (v.soldPrice ?? 0), 0);
  const deltas = vehicles.filter((v) => v.minPrice != null && v.soldPrice != null).map((v) => (v.soldPrice ?? 0) - (v.minPrice ?? 0));
  const avgDelta = deltas.length ? deltas.reduce((a, b) => a + b, 0) / deltas.length : 0;
  const next = vehicles.filter((v) => v.auctionEndDate && differenceInCalendarDays(v.auctionEndDate, new Date()) <= 7).sort((a,b)=>+new Date(a.auctionEndDate!) - +new Date(b.auctionEndDate!));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-3 md:grid-cols-3"><div className="rounded border bg-white p-4">Pending: {pending}</div><div className="rounded border bg-white p-4">Sold: {sold}</div><div className="rounded border bg-white p-4">Not sold: {notSold}</div></div>
      <div className="grid gap-3 md:grid-cols-3"><div className="rounded border bg-white p-4">Sum Min: {sumMin}</div><div className="rounded border bg-white p-4">Sum Sold: {sumSold}</div><div className="rounded border bg-white p-4">Avg Delta: {avgDelta.toFixed(2)}</div></div>
      <section className="rounded border bg-white p-4"><h2 className="mb-2 font-semibold">Next 7 days auction endings</h2>{next.map((v)=><div key={v.id}><Link href={`/vehicles/${v.id}`}>{v.vehicleTitle}</Link></div>)}</section>
    </div>
  );
}
