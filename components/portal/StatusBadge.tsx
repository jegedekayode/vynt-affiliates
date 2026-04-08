import { cn } from '@/lib/utils';

type ReferralStatus = 'signed_up' | 'purchased' | 'seller';

interface StatusBadgeProps {
  status: ReferralStatus;
}

const config: Record<ReferralStatus, { label: string; className: string }> = {
  signed_up: {
    label: 'Signed Up',
    className: 'bg-blue/10 text-blue',
  },
  purchased: {
    label: 'Purchased',
    className: 'bg-green/10 text-green',
  },
  seller: {
    label: 'Seller',
    className: 'bg-vynt-light text-vynt',
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { label, className } = config[status];
  return (
    <span
      className={cn(
        'inline-flex items-center text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full',
        className
      )}
    >
      {label}
    </span>
  );
}
