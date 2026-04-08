import { UserPlus, ShoppingBag, Store, TrendingUp } from 'lucide-react';
import { formatNaira } from '@/lib/utils';

interface KPICardsProps {
  signups: number;
  purchases: number;
  sellers: number;
  gmv: number;
}

export default function KPICards({ signups, purchases, sellers, gmv }: KPICardsProps) {
  const cards = [
    {
      label: 'Signups',
      value: signups.toString(),
      note: 'referred users',
      icon: UserPlus,
      iconBg: 'bg-blue/10',
      iconColor: 'text-blue',
    },
    {
      label: 'Purchases',
      value: purchases.toString(),
      note: 'orders placed',
      icon: ShoppingBag,
      iconBg: 'bg-green/10',
      iconColor: 'text-green',
    },
    {
      label: 'Sellers Recruited',
      value: sellers.toString(),
      note: '10+ listings each',
      icon: Store,
      iconBg: 'bg-vynt-light',
      iconColor: 'text-vynt',
    },
    {
      label: 'GMV Driven',
      value: formatNaira(gmv),
      note: 'total order value',
      icon: TrendingUp,
      iconBg: 'bg-gold/10',
      iconColor: 'text-amber',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-border px-4 py-4"
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold text-text-3 uppercase tracking-wide">
                {card.label}
              </p>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${card.iconBg}`}>
                <Icon size={14} strokeWidth={1.5} className={card.iconColor} />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-text-1">{card.value}</p>
            <p className="text-xs text-text-3 mt-0.5">{card.note}</p>
          </div>
        );
      })}
    </div>
  );
}
