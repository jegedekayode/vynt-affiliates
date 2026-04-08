'use client';

import { cn } from '@/lib/utils';

export type DatePeriod = '7d' | '14d' | '30d' | '60d' | '90d';

const periods: { label: string; value: DatePeriod }[] = [
  { label: '7d', value: '7d' },
  { label: '14d', value: '14d' },
  { label: '30d', value: '30d' },
  { label: '60d', value: '60d' },
  { label: '90d', value: '90d' },
];

interface DateFilterProps {
  value: DatePeriod;
  onChange: (period: DatePeriod) => void;
}

export default function DateFilter({ value, onChange }: DateFilterProps) {
  return (
    <div className="flex items-center gap-1 bg-surface rounded-lg p-0.5">
      {periods.map((p) => (
        <button
          key={p.value}
          type="button"
          onClick={() => onChange(p.value)}
          className={cn(
            'px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-100',
            value === p.value
              ? 'bg-white text-text-1 shadow-sm'
              : 'text-text-3 hover:text-text-2'
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
