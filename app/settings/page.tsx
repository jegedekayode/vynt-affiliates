import PageHeader from '@/components/layout/PageHeader';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Configure your affiliate program"
      />
      <div className="bg-white rounded-xl border border-border p-16 text-center">
        <div className="w-14 h-14 rounded-full bg-surface flex items-center justify-center mx-auto mb-4">
          <Settings size={24} className="text-text-3" />
        </div>
        <h2 className="text-lg font-bold text-text-1 font-[var(--font-display)] mb-2">
          Settings Coming Soon
        </h2>
        <p className="text-sm text-text-3 max-w-sm mx-auto">
          Commission rates, payout schedules, and program configuration will be available here.
        </p>
      </div>
    </>
  );
}
