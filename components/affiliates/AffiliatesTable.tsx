'use client';

import { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Affiliate } from '@/lib/types';
import AffiliateRow from './AffiliateRow';

interface AffiliatesTableProps {
  affiliates: Affiliate[];
  onUpdate?: (id: string, updates: Partial<Affiliate>) => void;
  onRequestPay?: (affiliate: Affiliate) => void;
}

type SortKey = 'totalSignups' | 'totalOrders' | 'totalGmv' | 'totalSellers' | 'totalEarned' | 'conversionRate';

const columns: { label: string; className: string; sortKey?: SortKey }[] = [
  { label: '#', className: 'pl-4 pr-2 w-10' },
  { label: 'Affiliate', className: 'px-3' },
  { label: 'Type', className: 'px-3 w-[100px]' },
  { label: 'Status', className: 'px-3 w-[110px]' },
  { label: 'Signups', className: 'px-3 w-[80px]', sortKey: 'totalSignups' },
  { label: 'Orders', className: 'px-3 w-[80px]', sortKey: 'totalOrders' },
  { label: 'GMV', className: 'px-3 w-[100px]', sortKey: 'totalGmv' },
  { label: 'Sellers', className: 'px-3 w-[70px]', sortKey: 'totalSellers' },
  { label: 'Earned', className: 'px-3 w-[100px]', sortKey: 'totalEarned' },
  { label: 'Conv.', className: 'px-3 w-[70px]', sortKey: 'conversionRate' },
  { label: '', className: 'pr-4 pl-2 w-10' },
];

export default function AffiliatesTable({ affiliates, onUpdate, onRequestPay }: AffiliatesTableProps) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const sorted = sortKey
    ? [...affiliates].sort((a, b) => {
        const diff = a[sortKey] - b[sortKey];
        return sortDir === 'desc' ? -diff : diff;
      })
    : affiliates;

  if (affiliates.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border p-12 text-center">
        <p className="text-sm text-text-3">No affiliates match your filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.label || 'expand'}
                  className={`text-left text-[11px] font-semibold uppercase tracking-wider text-text-3 py-3 ${col.className} ${col.sortKey ? 'cursor-pointer select-none hover:text-text-1' : ''}`}
                  onClick={col.sortKey ? () => handleSort(col.sortKey!) : undefined}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortKey && (
                      <ArrowUpDown
                        size={12}
                        className={sortKey === col.sortKey ? 'text-vynt' : 'text-text-3/40'}
                      />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {sorted.map((affiliate, i) => (
              <AffiliateRow
                key={affiliate.id}
                affiliate={affiliate}
                rank={i + 1}
                onUpdate={onUpdate}
                onRequestPay={onRequestPay}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
