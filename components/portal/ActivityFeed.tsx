import { formatNaira, formatRelativeTime } from '@/lib/utils';
import { ReferralEvent } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ActivityFeedProps {
  events: ReferralEvent[];
}

const eventConfig = {
  signup: { label: 'signed up', dotColor: 'bg-blue', amountColor: 'text-green' },
  purchase: { label: 'made a purchase', dotColor: 'bg-green', amountColor: 'text-green' },
  seller_store: { label: 'opened a seller store', dotColor: 'bg-vynt', amountColor: 'text-green' },
};

export default function ActivityFeed({ events }: ActivityFeedProps) {
  return (
    <div className="bg-white rounded-xl border border-border px-5 py-5 h-full">
      <p className="text-sm font-bold text-text-1 mb-4">Recent Activity</p>
      <div className="space-y-3">
        {events.slice(0, 5).map((event) => {
          const cfg = eventConfig[event.eventType];
          return (
            <div key={event.id} className="flex items-start gap-3">
              <div className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', cfg.dotColor)} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-1 leading-snug">
                  <span className="font-semibold">{event.referredUserName}</span>{' '}
                  {cfg.label}
                  {event.eventType === 'purchase' && event.orderAmount && (
                    <span className="text-text-3"> (₦{event.orderAmount.toLocaleString('en-NG')})</span>
                  )}
                </p>
                <p className="text-xs text-text-3 mt-0.5">{formatRelativeTime(event.createdAt)}</p>
              </div>
              <span className={cn('text-sm font-semibold shrink-0', cfg.amountColor)}>
                +{formatNaira(event.amount)}
              </span>
            </div>
          );
        })}
        {events.length === 0 && (
          <p className="text-sm text-text-3 text-center py-6">No activity yet</p>
        )}
      </div>
    </div>
  );
}
