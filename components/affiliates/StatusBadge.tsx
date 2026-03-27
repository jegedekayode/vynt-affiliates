import { AffiliateStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

const statusStyles: Record<AffiliateStatus, string> = {
  active: 'bg-green/10 text-green',
  dormant: 'bg-amber/10 text-amber',
  suspended: 'bg-red/10 text-red',
};

const statusLabels: Record<AffiliateStatus, string> = {
  active: 'Active',
  dormant: 'Dormant',
  suspended: 'Suspended',
};

interface StatusBadgeProps {
  status: AffiliateStatus;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full',
        statusStyles[status],
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {statusLabels[status]}
    </span>
  );
}
