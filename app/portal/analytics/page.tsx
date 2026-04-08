import { BarChart3 } from 'lucide-react';
import PortalHeader from '@/components/portal/PortalHeader';

const previewCards = [
  { label: 'Top Category', value: 'Vintage Tops', sub: 'Most referred category' },
  { label: 'Active Sellers', value: '—', sub: 'Sellers active this month' },
  { label: 'Repeat Purchase Rate', value: '—', sub: 'Referrals who bought twice' },
];

export default function AnalyticsPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <PortalHeader
        title="Analytics"
        subtitle="Detailed performance insights for your referrals."
      />

      {/* Coming soon card */}
      <div className="bg-white rounded-xl border border-border px-8 py-12 flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center mb-4">
          <BarChart3 size={28} strokeWidth={1.5} className="text-text-3" />
        </div>
        <p className="text-lg font-bold text-text-1 mb-2">Analytics is Coming Soon</p>
        <p className="text-sm text-text-3 max-w-sm leading-relaxed mb-4">
          Deep-dive insights are on the way — including top categories, conversion funnels,
          seller activity, and repeat purchase rates for your referral network.
        </p>
        <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-gold/15 text-amber">
          Coming in V2
        </span>
      </div>

      {/* Preview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 opacity-45 pointer-events-none select-none">
        {previewCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-border px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-3 mb-2">
              {card.label}
            </p>
            <p className="text-xl font-extrabold text-text-1 mb-0.5">{card.value}</p>
            <p className="text-xs text-text-3">{card.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
