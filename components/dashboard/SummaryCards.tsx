'use client';

import { Users, UserPlus, ShoppingBag, TrendingUp, Coins } from 'lucide-react';
import { formatNaira } from '@/lib/utils';
import { DashboardSummary } from '@/lib/types';

interface SummaryCardsProps {
  summary: DashboardSummary;
}

const cards = [
  {
    key: 'totalAffiliates' as const,
    label: 'Total Affiliates',
    icon: Users,
    format: (v: number) => v.toString(),
    change: '+3 this month',
    changePositive: true,
  },
  {
    key: 'totalSignups' as const,
    label: 'Signups Driven',
    icon: UserPlus,
    format: (v: number) => v.toString(),
    change: '+74 this week',
    changePositive: true,
  },
  {
    key: 'totalOrders' as const,
    label: 'Total Orders',
    icon: ShoppingBag,
    format: (v: number) => v.toString(),
    change: '+18 this week',
    changePositive: true,
  },
  {
    key: 'totalGmv' as const,
    label: 'Total GMV',
    icon: TrendingUp,
    format: (v: number) => formatNaira(v),
    change: '+12.4%',
    changePositive: true,
  },
  {
    key: 'totalEarned' as const,
    label: 'Commissions Earned',
    icon: Coins,
    format: (v: number) => formatNaira(v),
    change: '+8.2%',
    changePositive: true,
    highlight: true,
  },
];

export default function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = summary[card.key];
        return (
          <div
            key={card.key}
            className={`rounded-xl border p-5 transition-shadow duration-150 hover:shadow-sm ${
              card.highlight
                ? 'bg-vynt border-vynt-mid'
                : 'bg-white border-border'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  card.highlight
                    ? 'bg-white/15'
                    : 'bg-surface'
                }`}
              >
                <Icon
                  size={16}
                  className={card.highlight ? 'text-white/80' : 'text-text-3'}
                />
              </div>
              <span
                className={`text-xs font-medium ${
                  card.highlight ? 'text-white/70' : 'text-text-3'
                }`}
              >
                {card.label}
              </span>
            </div>
            <div
              className={`text-2xl font-bold font-[var(--font-display)] ${
                card.highlight ? 'text-white' : 'text-text-1'
              }`}
            >
              {card.format(value)}
            </div>
            <div className="mt-2">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  card.highlight
                    ? 'bg-white/15 text-white/80'
                    : card.changePositive
                    ? 'bg-green/10 text-green'
                    : 'bg-red/10 text-red'
                }`}
              >
                {card.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
