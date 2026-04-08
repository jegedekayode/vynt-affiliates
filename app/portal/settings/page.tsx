'use client';

import { useState } from 'react';
import PortalHeader from '@/components/portal/PortalHeader';
import ToggleSwitch from '@/components/portal/ToggleSwitch';
import { AlertTriangle } from 'lucide-react';

const notificationDefaults = {
  signups: true,
  purchases: true,
  sellers: true,
  payouts: true,
  weeklySummary: false,
};

export default function SettingsPage() {
  const [notifs, setNotifs] = useState(notificationDefaults);

  function toggle(key: keyof typeof notificationDefaults) {
    setNotifs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <PortalHeader title="Settings" subtitle="Manage your account and notification preferences." />

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-border overflow-hidden mb-5">
        <div className="px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-text-1">Notifications</p>
        </div>
        <div className="divide-y divide-border/50">
          {[
            {
              key: 'signups' as const,
              label: 'Signup alerts',
              description: 'Get notified when someone signs up using your referral code.',
            },
            {
              key: 'purchases' as const,
              label: 'Purchase alerts',
              description: 'Get notified when a referred user makes a qualifying purchase.',
            },
            {
              key: 'sellers' as const,
              label: 'Seller alerts',
              description: 'Get notified when a referred user opens a seller store.',
            },
            {
              key: 'payouts' as const,
              label: 'Payout alerts',
              description: 'Get notified when a payment is made to your bank account.',
            },
            {
              key: 'weeklySummary' as const,
              label: 'Weekly summary email',
              description: 'Receive a weekly digest of your referral activity every Monday.',
            },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between px-5 py-4 gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-1">{item.label}</p>
                <p className="text-xs text-text-3 mt-0.5 leading-relaxed">{item.description}</p>
              </div>
              <ToggleSwitch
                checked={notifs[item.key]}
                onChange={() => toggle(item.key)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Account */}
      <div className="bg-white rounded-xl border border-border overflow-hidden mb-5">
        <div className="px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-text-1">Account</p>
        </div>
        <div className="divide-y divide-border/50">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-text-1">Email</p>
              <p className="text-xs text-text-3 mt-0.5">tomi.adeyemi@unilag.edu.ng</p>
            </div>
            <button
              type="button"
              className="text-xs font-medium text-vynt hover:text-vynt-mid transition-colors"
            >
              Change
            </button>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-text-1">Password</p>
              <p className="text-xs text-text-3 mt-0.5">Last changed Feb 14, 2026</p>
            </div>
            <button
              type="button"
              className="text-xs font-medium text-vynt hover:text-vynt-mid transition-colors"
            >
              Update
            </button>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-xl border border-red/30 overflow-hidden">
        <div className="px-5 py-4 border-b border-red/20 bg-red/5">
          <p className="text-sm font-bold text-red">Danger Zone</p>
        </div>
        <div className="px-5 py-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-1">Leave affiliate programme</p>
            <p className="text-xs text-text-3 mt-1 leading-relaxed">
              Deactivates your code and removes you from the programme. Pending earnings will
              still be paid out on the next scheduled payment date.
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg border border-red/40 bg-red/5 text-red text-sm font-medium hover:bg-red/10 transition-colors"
          >
            <AlertTriangle size={14} strokeWidth={2} />
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}
