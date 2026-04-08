'use client';

import { useState } from 'react';
import PortalHeader from '@/components/portal/PortalHeader';
import DateFilter, { DatePeriod } from '@/components/portal/DateFilter';
import EarningsHero from '@/components/portal/EarningsHero';
import KPICards from '@/components/portal/KPICards';
import PerformanceBars from '@/components/portal/PerformanceBars';
import EarningsChart from '@/components/portal/EarningsChart';
import ActivityFeed from '@/components/portal/ActivityFeed';
import { affiliates } from '@/lib/mock-data/affiliates';
import { referralEvents } from '@/lib/mock-data/referrals';

// Hardcoded logged-in affiliate
const TOMI = affiliates.find((a) => a.id === 'aff_001')!;
const TOMI_EVENTS = referralEvents.filter((e) => e.affiliateId === 'aff_001');

// Tomi's weekly earnings (12 weeks, total = ₦82,000)
const weeklyEarnings = [
  { week: 'Jan 6', amount: 3500 },
  { week: 'Jan 13', amount: 4500 },
  { week: 'Jan 20', amount: 5500 },
  { week: 'Jan 27', amount: 4000 },
  { week: 'Feb 3', amount: 7000 },
  { week: 'Feb 10', amount: 6500 },
  { week: 'Feb 17', amount: 8000 },
  { week: 'Feb 24', amount: 9500 },
  { week: 'Mar 3', amount: 8500 },
  { week: 'Mar 10', amount: 10000 },
  { week: 'Mar 17', amount: 9000 },
  { week: 'Mar 24', amount: 6000 },
];

const VCS_TOTAL = affiliates.filter((a) => a.type === 'vcs').length;

export default function DashboardPage() {
  const [period, setPeriod] = useState<DatePeriod>('30d');

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PortalHeader
        title={`Welcome back, ${TOMI.name.split(' ')[0]}`}
        subtitle="Here's how your referrals are performing."
        actions={<DateFilter value={period} onChange={setPeriod} />}
      />

      <EarningsHero
        totalEarned={TOMI.totalEarned}
        periodChange={TOMI.pendingBalance}
        paidOut={TOMI.totalPaid}
        pending={TOMI.pendingBalance}
        rank={1}
        totalVcsAffiliates={VCS_TOTAL}
      />

      <KPICards
        signups={TOMI.totalSignups}
        purchases={TOMI.totalOrders}
        sellers={TOMI.totalSellers}
        gmv={TOMI.totalGmv}
      />

      <div className="mb-6">
        <PerformanceBars
          signups={TOMI.totalSignups}
          purchases={TOMI.totalOrders}
          sellers={TOMI.totalSellers}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <EarningsChart data={weeklyEarnings} />
        <ActivityFeed events={TOMI_EVENTS} />
      </div>
    </div>
  );
}
