import { prisma } from '@/lib/prisma';
import { ReminderCenter } from '@/components/reminders/reminder-center';

export default async function RemindersPage() {
  const reminders = await prisma.reminder.findMany({ include: { vehicle: true }, orderBy: { remindAt: 'asc' } });
  return <ReminderCenter reminders={reminders} />;
}
