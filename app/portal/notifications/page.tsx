import { Bell } from 'lucide-react';
import PortalHeader from '@/components/portal/PortalHeader';

export default function NotificationsPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <PortalHeader
        title="Notifications"
        subtitle="All caught up."
      />

      <div className="bg-white rounded-xl border border-border p-10 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center mb-4">
          <Bell size={22} className="text-text-3" />
        </div>
        <p className="text-sm font-semibold text-text-2 mb-2">Notifications coming soon</p>
        <p className="text-xs text-text-3 max-w-xs leading-relaxed">
          You&apos;ll see alerts here for new signups, purchases, and payouts once real-time
          notification tracking goes live. Check your dashboard for current stats.
        </p>
      </div>
    </div>
  );
}
