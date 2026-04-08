import { Trophy } from 'lucide-react';
import PortalHeader from '@/components/portal/PortalHeader';
import { leaderboardData } from '@/lib/mock-data/leaderboard';
import { formatNaira } from '@/lib/utils';
import { cn } from '@/lib/utils';

const ME_RANK = 1;
const ME_NAME = 'Tomilayo Adeyemi';

export default function LeaderboardPage() {
  const me = leaderboardData.find((e) => e.name === ME_NAME);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <PortalHeader
        title="Leaderboard"
        subtitle="Top Campus Shoppers across all campuses."
      />

      {/* "You" banner */}
      {me && (
        <div className="bg-vynt-light border border-vynt/20 rounded-xl px-5 py-4 mb-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-vynt flex items-center justify-center shrink-0">
            <Trophy size={18} strokeWidth={2} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-vynt">{me.name}</p>
            <p className="text-xs text-vynt/70">{me.campus} · {me.totalSignups} signups · {me.totalSellers} sellers</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xl font-extrabold" style={{ color: '#D49B00' }}>#{me.rank}</p>
            <p className="text-xs text-text-3">{formatNaira(me.totalEarned)}</p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface/60">
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-3 uppercase tracking-wide w-10">#</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-3 uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-3 uppercase tracking-wide hidden sm:table-cell">Campus</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-text-3 uppercase tracking-wide">Signups</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-text-3 uppercase tracking-wide hidden sm:table-cell">Sellers</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-text-3 uppercase tracking-wide">Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {leaderboardData.map((entry) => {
                const isMe = entry.name === ME_NAME;
                const isFirst = entry.rank === 1;
                return (
                  <tr
                    key={entry.rank}
                    className={cn(
                      'transition-colors',
                      isMe
                        ? 'bg-vynt-light'
                        : isFirst
                        ? 'bg-gold-light'
                        : 'hover:bg-surface/40'
                    )}
                  >
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'text-sm font-bold',
                          isFirst ? 'text-amber' : isMe ? 'text-vynt' : 'text-text-3'
                        )}
                      >
                        {entry.rank}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={cn('font-semibold', isMe ? 'text-vynt' : 'text-text-1')}>
                          {entry.name}
                        </span>
                        {isMe && (
                          <span className="text-[10px] font-bold text-vynt bg-vynt/10 px-1.5 py-0.5 rounded-md">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-2 hidden sm:table-cell">{entry.campus}</td>
                    <td className="px-4 py-3 text-right text-text-2">{entry.totalSignups}</td>
                    <td className="px-4 py-3 text-right text-text-2 hidden sm:table-cell">{entry.totalSellers}</td>
                    <td className="px-4 py-3 text-right font-bold text-vynt">
                      {formatNaira(entry.totalEarned)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
