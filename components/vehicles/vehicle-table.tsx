'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/date';

export function VehicleTable({ vehicles }: { vehicles: any[] }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [sort, setSort] = useState('arrivalDate');

  const filtered = useMemo(() => {
    const list = vehicles.filter((v) =>
      `${v.vehicleTitle} ${v.vin}`.toLowerCase().includes(search.toLowerCase()) && (status === 'ALL' || v.status === status)
    );
    return list.sort((a, b) => {
      const av = a[sort] ?? 0;
      const bv = b[sort] ?? 0;
      return av > bv ? 1 : -1;
    });
  }, [vehicles, search, status, sort]);

  const onImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('sheet', 'Sheet1');
    await fetch('/api/import/excel', { method: 'POST', body: fd });
    location.reload();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Input placeholder="Search VIN or title" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        {['ALL', 'PENDING', 'SOLD', 'NOT_SOLD'].map((s) => (
          <Button key={s} className={status === s ? '' : 'bg-slate-500'} onClick={() => setStatus(s)}>{s}</Button>
        ))}
        <select className="rounded border px-2" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="arrivalDate">Arrival</option><option value="minPrice">Min price</option><option value="auctionEndDate">Auction end</option><option value="soldPrice">Sold price</option>
        </select>
        <a className="rounded border px-3 py-2 text-sm" href="/api/export/csv">Export CSV</a>
        <label className="rounded border px-3 py-2 text-sm">Import Excel<input type="file" className="hidden" accept=".xlsx" onChange={onImport} /></label>
      </div>
      <div className="overflow-auto rounded border bg-white">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-slate-100">
            <tr>{['Thumbnail','Vehicle','VIN','Arrival Date','Auction #','Min Price','Auction Start','Auction End','Action Start','Action End','Status','Sold Date','Sold Price','Actions'].map((h)=><th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map((v) => {
              const overdue = v.auctionEndDate && new Date(v.auctionEndDate) < new Date() && v.status !== 'SOLD';
              return (
                <tr key={v.id} className="border-t">
                  <td className="px-2 py-2">{v.images[0] ? <img src={v.images[0].url} className="h-10 w-14 rounded object-cover" /> : '-'}</td>
                  <td className="px-2 py-2">{v.year} {v.vehicleTitle}</td>
                  <td className="px-2 py-2">{v.vin}</td>
                  <td className="px-2 py-2">{formatDate(v.arrivalDate)}</td>
                  <td className="px-2 py-2">{v.auctionNo ?? '-'}</td>
                  <td className="px-2 py-2">{v.minPrice ?? '-'}</td>
                  <td className="px-2 py-2">{formatDate(v.auctionStartDate)}</td>
                  <td className="px-2 py-2">{formatDate(v.auctionEndDate)} {v.auctionEndDate && !overdue && <Badge>Ends in {formatDistanceToNowStrict(new Date(v.auctionEndDate))}</Badge>} {overdue && <Badge className="bg-red-200">Overdue</Badge>}</td>
                  <td className="px-2 py-2">{formatDate(v.actionStartDate)}</td>
                  <td className="px-2 py-2">{formatDate(v.actionEndDate)}</td>
                  <td className="px-2 py-2"><Badge className={v.status === 'SOLD' ? 'bg-green-200' : ''}>{v.status}</Badge></td>
                  <td className="px-2 py-2">{formatDate(v.soldDate)}</td>
                  <td className="px-2 py-2">{v.soldPrice ?? '-'}</td>
                  <td className="px-2 py-2"><Link href={`/vehicles/${v.id}`}>View</Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!filtered.length && <div className="p-8 text-center">No vehicles. Import Excel or add vehicle.</div>}
      </div>
    </div>
  );
}
