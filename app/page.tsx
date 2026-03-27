import PageHeader from '@/components/layout/PageHeader';
import SummaryCards from '@/components/dashboard/SummaryCards';
import SignupsChart from '@/components/dashboard/SignupsChart';
import RevenueChart from '@/components/dashboard/RevenueChart';
import TopAffiliatesTable from '@/components/dashboard/TopAffiliatesTable';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { getAffiliateSummary, getTopAffiliates, getRecentEvents } from '@/lib/api';

export default async function DashboardPage() {
  const [summary, topAffiliates, recentEvents] = await Promise.all([
    getAffiliateSummary(),
    getTopAffiliates(5),
    getRecentEvents(8),
  ]);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of your affiliate program performance"
      />

      <SummaryCards summary={summary} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <SignupsChart data={summary.signupsByWeek} />
        <RevenueChart
          gmvData={summary.gmvByWeek}
          commissionsData={summary.commissionsByWeek}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <TopAffiliatesTable affiliates={topAffiliates} />
        <RecentActivity events={recentEvents} />
      </div>
    </>
  );
}
