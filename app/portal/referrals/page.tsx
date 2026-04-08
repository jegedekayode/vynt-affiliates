'use client';

import { useState } from 'react';
import PortalHeader from '@/components/portal/PortalHeader';
import DateFilter, { DatePeriod } from '@/components/portal/DateFilter';
import StatusBadge from '@/components/portal/StatusBadge';
import { referrals } from '@/lib/mock-data/referrals';
import { formatDate, formatNaira } from '@/lib/utils';
import { Referral } from '@/lib/types';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type StatusFilter = 'all' | 'signed_up' | 'purchased' | 'seller';
type SortField = 'dateReferred' | 'orderAmount' | 'listingCount';
type SortDir = 'asc' | 'desc';

const TOMI_REFERRALS = referrals.filter((r) => r.affiliateId === 'aff_001');

export default function ReferralsPage() {
  const [period, setPeriod] = useState<DatePeriod>('30d');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortField, setSortField] = useState<SortField>('dateReferred');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const filtered = TOMI_REFERRALS.filter((r) =>
    statusFilter === 'all' ? true : r.status === statusFilter
  );

  const sorted = [...filtered].sort((a, b) => {
    let diff = 0;
    if (sortField === 'dateReferred') {
      diff = new Date(a.dateReferred).getTime() - new Date(b.dateReferred).getTime();
    } else if (sortField === 'orderAmount') {
      diff = (a.orderAmount ?? 0) - (b.orderAmount ?? 0);
    } else if (sortField === 'listingCount') {
      diff = a.listingCount - b.listingCount;
    }
    return sortDir === 'asc' ? diff : -diff;
  });

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ChevronUp size={12} className="opacity-25" />;
    return sortDir === 'asc' ? (
      <ChevronUp size={12} className="text-vynt" />
    ) : (
      <ChevronDown size={12} className="text-vynt" />
    );
  }

  const counts = {
    all: TOMI_REFERRALS.length,
    signed_up: TOMI_REFERRALS.filter((r) => r.status === 'signed_up').length,
    purchased: TOMI_REFERRALS.filter((r) => r.status === 'purchased').length,
    seller: TOMI_REFERRALS.filter((r) => r.status === 'seller').length,
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PortalHeader
        title="Referrals"
        subtitle="Everyone you've referred to VYNT."
        actions={<DateFilter value={period} onChange={setPeriod} />}
      />

      {/* Summary pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(
          [
            { key: 'all', label: 'All' },
            { key: 'signed_up', label: 'Signed Up' },
            { key: 'purchased', label: 'Purchased' },
            { key: 'seller', label: 'Seller' },
          ] as { key: StatusFilter; label: string }[]
        ).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setStatusFilter(key)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors duration-100',
              statusFilter === key
                ? 'bg-vynt text-white border-vynt'
                : 'bg-white text-text-2 border-border hover:bg-surface'
            )}
          >
            {label}
            <span
              className={cn(
                'text-[10px] px-1.5 py-0.5 rounded-full font-bold',
                statusFilter === key ? 'bg-white/20 text-white' : 'bg-surface text-text-3'
              )}
            >
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface/60">
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-3 uppercase tracking-wide">
                  Name
                </th>
                <th
                  className="text-left px-4 py-3 text-xs font-semibold text-text-3 uppercase tracking-wide cursor-pointer hover:text-text-1 transition-colors"
                  onClick={() => toggleSort('dateReferred')}
                >
                  <span className="flex items-center gap-1">
                    Date <SortIcon field="dateReferred" />
                  </span>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-3 uppercase tracking-wide">
                  Status
                </th>
                <th
                  className="text-right px-4 py-3 text-xs font-semibold text-text-3 uppercase tracking-wide cursor-pointer hover:text-text-1 transition-colors"
                  onClick={() => toggleSort('orderAmount')}
                >
                  <span className="flex items-center justify-end gap-1">
                    Order Amt <SortIcon field="orderAmount" />
                  </span>
                </th>
                <th
                  className="text-right px-4 py-3 text-xs font-semibold text-text-3 uppercase tracking-wide cursor-pointer hover:text-text-1 transition-colors"
                  onClick={() => toggleSort('listingCount')}
                >
                  <span className="flex items-center justify-end gap-1">
                    Listings <SortIcon field="listingCount" />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {sorted.map((ref: Referral) => (
                <tr key={ref.id} className="hover:bg-surface/40 transition-colors">
                  <td className="px-4 py-3 font-medium text-text-1">{ref.userName}</td>
                  <td className="px-4 py-3 text-text-3">{formatDate(ref.dateReferred)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={ref.status} />
                  </td>
                  <td className="px-4 py-3 text-right text-text-2">
                    {ref.orderAmount ? formatNaira(ref.orderAmount) : '—'}
                  </td>
                  <td className="px-4 py-3 text-right text-text-2">
                    {ref.listingCount > 0 ? ref.listingCount : '—'}
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-text-3">
                    No referrals match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
