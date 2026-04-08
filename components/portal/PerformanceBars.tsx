interface PerformanceBarsProps {
  signups: number;
  purchases: number;
  sellers: number;
}

interface BarRowProps {
  label: string;
  count: number;
  maxCount: number;
  barColor: string;
}

function BarRow({ label, count, maxCount, barColor }: BarRowProps) {
  const pct = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <p className="w-28 shrink-0 text-sm font-medium text-text-2">{label}</p>
      <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="w-8 shrink-0 text-right text-sm font-bold text-text-1">{count}</p>
    </div>
  );
}

export default function PerformanceBars({ signups, purchases, sellers }: PerformanceBarsProps) {
  const max = Math.max(signups, purchases, sellers, 1);

  return (
    <div className="bg-white rounded-xl border border-border px-5 py-5">
      <p className="text-sm font-bold text-text-1 mb-4">Performance This Period</p>
      <div className="space-y-4">
        <BarRow label="Signups" count={signups} maxCount={max} barColor="bg-vynt" />
        <BarRow label="Purchases" count={purchases} maxCount={max} barColor="bg-green" />
        <BarRow label="Sellers" count={sellers} maxCount={max} barColor="bg-gold" />
      </div>
    </div>
  );
}
