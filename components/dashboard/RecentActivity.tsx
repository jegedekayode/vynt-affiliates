'use client';

import { ReferralEvent } from '@/lib/types';
import { formatNaira, formatRelativeTime } from '@/lib/utils';
import { UserPlus, ShoppingBag, Store } from 'lucide-react';
import { affiliates } from '@/lib/mock-data/affiliates';

interface RecentActivityProps {
  events: ReferralEvent[];
}

const eventConfig = {
  signup: {
    icon: UserPlus,
    color: 'text-blue',
    bgColor: 'bg-blue/10',
    verb: 'signed up via',
  },
  purchase: {
    icon: ShoppingBag,
    color: 'text-green',
    bgColor: 'bg-green/10',
    verb: 'made first purchase via',
  },
  seller_store: {
    icon: Store,
    color: 'text-gold',
    bgColor: 'bg-gold-light',
    verb: 'opened seller store via',
  },
};

function getAffiliateCode(affiliateId: string): string {
  return affiliates.find((a) => a.id === affiliateId)?.code || 'UNKNOWN';
}

export default function RecentActivity({ events }: RecentActivityProps) {
  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <h3 className="text-sm font-semibold text-text-1 font-[var(--font-display)] mb-1">
        Recent Activity
      </h3>
      <p className="text-xs text-text-3 mb-5">Latest referral events</p>
      <div className="space-y-4">
        {events.map((event) => {
          const config = eventConfig[event.eventType];
          const Icon = config.icon;
          const code = getAffiliateCode(event.affiliateId);
          return (
            <div key={event.id} className="flex items-start gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${config.bgColor}`}
              >
                <Icon size={14} className={config.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-1 leading-snug">
                  <span className="font-medium">{event.referredUserName}</span>{' '}
                  <span className="text-text-3">{config.verb}</span>{' '}
                  <span className="font-mono text-xs font-medium text-vynt">{code}</span>
                  {event.eventType === 'purchase' && event.orderAmount && (
                    <span className="text-text-3">
                      {' '}({formatNaira(event.orderAmount)})
                    </span>
                  )}
                </p>
                <p className="text-xs text-text-3 mt-0.5">
                  {formatRelativeTime(event.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
