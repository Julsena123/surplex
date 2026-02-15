import { cn } from '@/lib/utils';

export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return <span className={cn('rounded-full bg-slate-200 px-2 py-1 text-xs', className)}>{children}</span>;
}
