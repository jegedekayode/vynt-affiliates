import { TrendingUp } from 'lucide-react';
import { formatNaira } from '@/lib/utils';

interface EarningsHeroProps {
  totalEarned: number;
  periodChange: number;
  paidOut: number;
  pending: number;
  rank: number;
  totalVcsAffiliates: number;
}

export default function EarningsHero({
  totalEarned,
  periodChange,
  paidOut,
  pending,
  rank,
  totalVcsAffiliates,
}: EarningsHeroProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-px bg-border rounded-xl overflow-hidden border border-border mb-6">
      {/* Left — earnings */}
      <div className="bg-white px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-3 mb-2">
          Total Earned
        </p>
        <p className="text-[40px] font-extrabold text-vynt leading-none tracking-tight">
          {formatNaira(totalEarned)}
        </p>
        <div className="flex items-center gap-1.5 mt-2 mb-5">
          <TrendingUp size={14} strokeWidth={2} className="text-green" />
          <span className="text-sm font-medium text-green">
            +{formatNaira(periodChange)} this period
          </span>
        </div>
        <div className="border-t border-border pt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-text-3 mb-0.5">Paid Out</p>
            <p className="text-base font-bold text-text-1">{formatNaira(paidOut)}</p>
          </div>
          <div>
            <p className="text-xs text-text-3 mb-0.5">Pending</p>
            <p className="text-base font-bold text-amber">{formatNaira(pending)}</p>
          </div>
        </div>
      </div>

      {/* Right — rank */}
      <div className="bg-white px-6 py-5 flex flex-col items-center justify-center min-w-[160px] border-l border-border">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-3 mb-2">
          Campus Rank
        </p>
        <p className="text-[40px] font-extrabold leading-none" style={{ color: '#D49B00' }}>
          #{rank}
        </p>
        <p className="text-xs text-text-3 mt-2 text-center">
          of {totalVcsAffiliates} Campus Shoppers
        </p>
      </div>
    </div>
  );
}
