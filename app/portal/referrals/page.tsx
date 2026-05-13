'use client';

import { useState, useEffect, useCallback } from 'react';
import PortalHeader from '@/components/portal/PortalHeader';
import DateFilter, { DatePeriod } from '@/components/portal/DateFilter';
import { getAffiliates } from '@/lib/api';
import { Affiliate } from '@/lib/types';
import { cn } from '@/lib/utils';

type StatusFilter = 'all' | 'signed_up' | 'purchased' | 'seller';

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-surface rounded-lg ${className}`} />;
}

export default function ReferralsPage() {
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<DatePeriod>('30d');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [refreshKey, setRefreshKey] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const affiliates = await getAffiliates();
      setAffiliate(affiliates[0] ?? null);
    } catch {
      setError('Unable to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-4">
        <Skeleton className="h-8 w-40" />
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-8 w-20" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error || !affiliate) {
    return (
      <div className="p-6 max-w-5xl mx-auto flex flex-col items-center justify-center py-20">
        <p className="text-sm text-text-2 mb-4">{error ?? 'Unable to load data.'}</p>
        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          className="px-4 py-2 text-sm font-medium bg-vynt text-white rounded-lg hover:bg-vynt-mid transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const a = affiliate;

  const counts = {
    all: a.totalSignups + a.totalOrders + a.totalSellers,
    signed_up: a.totalSignups,
    purchased: a.totalOrders,
    seller: a.totalSellers,
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

      {/* Empty state — per-user referral data not yet available from API */}
      <div className="bg-white rounded-xl border border-border p-10 text-center">
        <p className="text-sm font-medium text-text-2 mb-2">Individual referral tracking coming soon</p>
        <p className="text-xs text-text-3 max-w-sm mx-auto leading-relaxed">
          Your referral totals are live — check your dashboard for current stats.
          Detailed per-user data will appear here once referral tracking is fully rolled out.
        </p>
      </div>
    </div>
  );
}
