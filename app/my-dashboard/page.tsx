import PageHeader from '@/components/layout/PageHeader';
import { Lock } from 'lucide-react';

export default function MyDashboardPage() {
  return (
    <>
      <PageHeader
        title="My Dashboard"
        description="Your personal affiliate dashboard"
      />
      <div className="bg-white rounded-xl border border-border p-16 text-center">
        <div className="w-14 h-14 rounded-full bg-surface flex items-center justify-center mx-auto mb-4">
          <Lock size={24} className="text-text-3" />
        </div>
        <h2 className="text-lg font-bold text-text-1 font-[var(--font-display)] mb-2">
          Authentication Required
        </h2>
        <p className="text-sm text-text-3 max-w-sm mx-auto mb-6">
          This dashboard is for authenticated affiliates. Sign in with your VYNT account to view your referral stats, earnings, and payouts.
        </p>
        <button className="px-6 py-2.5 bg-vynt text-white text-sm font-medium rounded-full hover:bg-vynt-mid transition-colors">
          Sign In
        </button>
      </div>
    </>
  );
}
