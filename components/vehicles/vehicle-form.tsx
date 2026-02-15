'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type Vehicle = Record<string, any>;

const fields = [
  'vehicleTitle','year','vin','arrivalDate','auctionNo','minPrice','actionStartDate','actionEndDate','auctionStartDate','auctionEndDate','soldDate','soldPrice','notes'
];

export function VehicleForm({ vehicle }: { vehicle?: Vehicle }) {
  const [form, setForm] = useState<any>(vehicle ?? {});
  const [error, setError] = useState('');
  const router = useRouter();

  const save = async () => {
    const method = vehicle ? 'PUT' : 'POST';
    const url = vehicle ? `/api/vehicles/${vehicle.id}` : '/api/vehicles';
    const res = await fetch(url, { method, body: JSON.stringify(form) });
    const json = await res.json();
    if (!res.ok) return setError(json.fields?.[0]?.message || json.error || 'Save failed');
    router.push('/');
    router.refresh();
  };

  return (
    <div className="space-y-3">
      {fields.map((field) => (
        <div key={field}>
          <label className="mb-1 block text-xs font-semibold uppercase">{field}</label>
          {field === 'notes' ? (
            <Textarea value={form[field] ?? ''} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
          ) : (
            <Input value={form[field] ?? ''} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
          )}
        </div>
      ))}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button onClick={save}>Save vehicle</Button>
    </div>
  );
}
