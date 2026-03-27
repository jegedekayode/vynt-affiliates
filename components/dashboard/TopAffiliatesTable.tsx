'use client';

import { Affiliate } from '@/lib/types';
import { formatNaira, getInitials } from '@/lib/utils';

interface TopAffiliatesTableProps {
  affiliates: Affiliate[];
}

const typeBadgeStyles: Record<string, string> = {
  vcs: 'bg-blue/10 text-blue',
  community: 'bg-orange/10 text-orange',
  individual: 'bg-surface text-text-3',
};

const typeLabels: Record<string, string> = {
  vcs: 'VCS',
  community: 'Community',
  individual: 'Individual',
};

export default function TopAffiliatesTable({ affiliates }: TopAffiliatesTableProps) {
  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <h3 className="text-sm font-semibold text-text-1 font-[var(--font-display)] mb-1">
        Top Affiliates
      </h3>
      <p className="text-xs text-text-3 mb-5">Ranked by total earnings</p>
      <div className="space-y-3">
        {affiliates.map((aff, i) => (
          <div
            key={aff.id}
            className="flex items-center gap-3 py-2 group"
          >
            <span className="text-xs font-mono text-text-3 w-5 text-right">{i + 1}</span>
            <div className="w-8 h-8 rounded-full bg-vynt-light flex items-center justify-center shrink-0">
              <span className="text-xs font-semibold text-vynt">
                {getInitials(aff.name)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-1 truncate">{aff.name}</p>
              <p className="text-xs text-text-3 font-mono">{aff.code}</p>
            </div>
            <span
              className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                typeBadgeStyles[aff.type]
              }`}
            >
              {typeLabels[aff.type]}
            </span>
            <span className="text-sm font-semibold text-vynt font-mono tabular-nums">
              {formatNaira(aff.totalEarned)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
