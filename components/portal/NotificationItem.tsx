import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  text: React.ReactNode;
  time: string;
  amount?: string;
  amountColor?: string;
  unread?: boolean;
}

export default function NotificationItem({
  icon: Icon,
  iconBg,
  iconColor,
  text,
  time,
  amount,
  amountColor = 'text-green',
  unread = false,
}: NotificationItemProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 px-4 py-3.5 border-b border-border/50 last:border-0 transition-colors',
        unread ? 'bg-[#FEFDFB]' : 'bg-white'
      )}
    >
      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5', iconBg)}>
        <Icon size={15} strokeWidth={2} className={iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-1 leading-snug">{text}</p>
        <p className="text-xs text-text-3 mt-0.5">{time}</p>
      </div>
      {amount && (
        <span className={cn('text-sm font-semibold shrink-0 ml-2', amountColor)}>{amount}</span>
      )}
      {unread && (
        <span className="w-2 h-2 rounded-full bg-vynt shrink-0 mt-1.5" />
      )}
    </div>
  );
}
