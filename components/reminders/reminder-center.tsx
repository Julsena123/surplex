'use client';

import { useEffect } from 'react';
import { formatDate } from '@/lib/date';

export function ReminderCenter({ reminders }: { reminders: any[] }) {
  useEffect(() => {
    const timer = setInterval(() => {
      if (Notification.permission !== 'granted') return;
      reminders.forEach((r) => {
        const due = new Date(r.remindAt).getTime() - Date.now();
        if (!r.done && due < 5 * 60 * 1000 && due > 0) new Notification(`Reminder: ${r.type}`, { body: r.vehicle.vehicleTitle });
      });
    }, 60000);
    return () => clearInterval(timer);
  }, [reminders]);

  const toggle = async (id: string, done: boolean) => {
    await fetch(`/api/reminders/${id}`, { method: 'PUT', body: JSON.stringify({ done: !done }) });
    location.reload();
  };

  const now = new Date();
  const week = new Date(Date.now() + 7 * 86400000);
  const group = (kind: 'today' | 'week' | 'overdue') => reminders.filter((r) => {
    const d = new Date(r.remindAt);
    if (kind === 'today') return d.toDateString() === now.toDateString();
    if (kind === 'week') return d > now && d <= week;
    return d < now && !r.done;
  });

  return (
    <div className="space-y-4">
      <button className="rounded border px-3 py-2" onClick={() => Notification.requestPermission()}>Enable browser notifications</button>
      {(['today', 'week', 'overdue'] as const).map((k) => (
        <section key={k}>
          <h2 className="mb-2 text-lg font-semibold capitalize">{k}</h2>
          <div className="space-y-2">
            {group(k).map((r) => (
              <div className="flex items-center justify-between rounded border bg-white p-3" key={r.id}>
                <div>{r.vehicle.vehicleTitle} • {r.type} • {formatDate(r.remindAt)}</div>
                <div className="flex gap-2">
                  <button className="rounded border px-2" onClick={() => toggle(r.id, r.done)}>{r.done ? 'Undone' : 'Done'}</button>
                  <a className="rounded border px-2" href={`/api/reminders/${r.id}/ics`}>ICS</a>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
