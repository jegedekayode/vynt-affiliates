'use client';

import { useState, useEffect, useCallback } from 'react';
import PortalHeader from '@/components/portal/PortalHeader';
import DateFilter, { DatePeriod } from '@/components/portal/DateFilter';
import EarningsHero from '@/components/portal/EarningsHero';
import KPICards from '@/components/portal/KPICards';
import PerformanceBars from '@/components/portal/PerformanceBars';
import ReferralCodeBlock from '@/components/portal/ReferralCodeBlock';
import { getAffiliates, getLeaderboard } from '@/lib/api';
import { Affiliate } from '@/lib/types';

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-surface rounded-lg ${className}`} />;
}

function LoadingState() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
      </div>
      <Skeleton className="h-32" />
      <Skeleton className="h-20" />
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="p-6 max-w-5xl mx-auto flex flex-col items-center justify-center py-20">
      <p className="text-sm text-text-2 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 text-sm font-medium bg-vynt text-white rounded-lg hover:bg-vynt-mid transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}

export default function DashboardPage() {
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [rank, setRank] = useState(1);
  const [totalAffiliates, setTotalAffiliates] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<DatePeriod>('30d');
  const [refreshKey, setRefreshKey] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [affiliates, leaderboard] = await Promise.all([
        getAffiliates(),
        getLeaderboard(),
      ]);
      if (affiliates.length === 0) {
        setError('No affiliate data found.');
        return;
      }
      const me = affiliates[0];
      const myRankEntry = leaderboard.findIndex((e) => e.id === me.id);
      setAffiliate(me);
      setRank(myRankEntry >= 0 ? myRankEntry + 1 : leaderboard.length);
      setTotalAffiliates(affiliates.length);
    } catch {
      setError('Unable to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  if (loading) return <LoadingState />;
  if (error || !affiliate) {
    return (
      <ErrorState
        message={error ?? 'Unable to load data. Please try again.'}
        onRetry={() => setRefreshKey((k) => k + 1)}
      />
    );
  }

  const a = affiliate;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PortalHeader
        title={`Welcome back, ${a.name.split(' ')[0]}`}
        subtitle="Here's how your referrals are performing."
        actions={<DateFilter value={period} onChange={setPeriod} />}
      />

      <EarningsHero
        totalEarned={a.totalEarned}
        periodChange={a.pendingBalance}
        paidOut={a.totalPaid}
        pending={a.pendingBalance}
        rank={rank}
        totalVcsAffiliates={totalAffiliates}
      />

      <KPICards
        signups={a.totalSignups}
        purchases={a.totalOrders}
        sellers={a.totalSellers}
        gmv={0}
      />

      <div className="mb-6">
        <PerformanceBars
          signups={a.totalSignups}
          purchases={a.totalOrders}
          sellers={a.totalSellers}
        />
      </div>

      {a.code && (
        <div className="mb-6">
          <ReferralCodeBlock
            code={a.code}
            referralLink={`https://vynt.ng/ref/${a.code.toLowerCase()}`}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Earnings chart — time-series data not yet available from API */}
        <div className="bg-white rounded-xl border border-border p-6 flex flex-col items-center justify-center min-h-[200px]">
          <p className="text-sm font-semibold text-text-2 mb-1">Earnings History</p>
          <p className="text-xs text-text-3 text-center max-w-xs">
            Live earnings chart coming soon. Check your totals above for current earnings.
          </p>
        </div>

        {/* Activity feed — event-level data not yet available from API */}
        <div className="bg-white rounded-xl border border-border p-6">
          <p className="text-sm font-bold text-text-1 mb-3">Recent Activity</p>
          <p className="text-xs text-text-3 leading-relaxed">
            Activity feed will show your referral events in real-time once tracking is fully live.
            Check your stats above for current totals.
          </p>
        </div>
      </div>
    </div>
  );
}
