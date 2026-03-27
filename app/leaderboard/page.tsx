'use client';

import { useState, useEffect } from 'react';
import { getLeaderboard, getAllCampuses } from '@/lib/api';
import { LeaderboardEntry } from '@/lib/types';
import { formatNaira, getInitials } from '@/lib/utils';
import { Trophy, Users, UserPlus, Store, Coins, Crown, Medal, Award, ArrowRight } from 'lucide-react';

const periods = [
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'All Time', value: 'all' },
] as const;

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [campus, setCampus] = useState<string>('all');
  const [period, setPeriod] = useState<string>('all');
  const campuses = getAllCampuses();

  useEffect(() => {
    getLeaderboard({ campus, period: period as 'week' | 'month' | 'all' }).then(setEntries);
  }, [campus, period]);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  const summaryStats = {
    activeVcs: entries.length,
    totalSignups: entries.reduce((s, e) => s + e.totalSignups, 0),
    totalSellers: entries.reduce((s, e) => s + e.totalSellers, 0),
    totalEarned: entries.reduce((s, e) => s + e.totalEarned, 0),
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-vynt flex items-center justify-center">
                <span className="text-white font-bold text-lg font-[var(--font-display)]">V</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-1 font-[var(--font-display)]">
                  VYNT Campus Shoppers
                </h1>
                <p className="text-xs text-text-3">Leaderboard Rankings</p>
              </div>
            </div>
            <Trophy size={28} className="text-gold" />
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Summary bar */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { icon: Users, label: 'Active VCS', value: summaryStats.activeVcs.toString() },
            { icon: UserPlus, label: 'Total Signups', value: summaryStats.totalSignups.toString() },
            { icon: Store, label: 'Sellers Recruited', value: summaryStats.totalSellers.toString() },
            { icon: Coins, label: 'Total Earned', value: formatNaira(summaryStats.totalEarned) },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-xl border border-border p-4 text-center">
                <Icon size={18} className="text-text-3 mx-auto mb-2" />
                <p className="text-lg font-bold text-text-1 font-[var(--font-display)]">{stat.value}</p>
                <p className="text-xs text-text-3">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1 bg-surface rounded-full p-1">
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors duration-150 ${
                  period === p.value
                    ? 'bg-white text-text-1 shadow-sm'
                    : 'text-text-3 hover:text-text-2'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <select
            value={campus}
            onChange={(e) => setCampus(e.target.value)}
            className="h-9 px-4 text-xs bg-white border border-border rounded-full outline-none focus:border-vynt cursor-pointer text-text-2"
          >
            <option value="all">All Campuses</option>
            {campuses.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Podium — Top 3 */}
        {top3.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[top3[1], top3[0], top3[2]].map((entry, i) => {
              const position = [2, 1, 3][i];
              const isFirst = position === 1;
              const RankIcon = position === 1 ? Crown : position === 2 ? Medal : Award;
              return (
                <div
                  key={entry.name}
                  className={`rounded-xl border p-6 text-center transition-shadow hover:shadow-md ${
                    isFirst
                      ? 'bg-gold-light border-gold/30 ring-1 ring-gold/20'
                      : 'bg-white border-border'
                  } ${isFirst ? 'scale-105 -mt-2' : ''}`}
                >
                  <RankIcon
                    size={24}
                    className={`mx-auto mb-3 ${
                      isFirst ? 'text-gold' : position === 2 ? 'text-text-3' : 'text-orange'
                    }`}
                  />
                  <div className="w-12 h-12 rounded-full bg-vynt-light flex items-center justify-center mx-auto mb-3">
                    <span className="text-sm font-bold text-vynt">{getInitials(entry.name)}</span>
                  </div>
                  <p className="text-sm font-bold text-text-1 font-[var(--font-display)]">{entry.name}</p>
                  <p className="text-xs text-text-3 mb-3">{entry.campus}</p>
                  <div className="flex items-center justify-center gap-4 text-xs">
                    <div>
                      <p className="font-bold text-text-1">{entry.totalSignups}</p>
                      <p className="text-text-3">Signups</p>
                    </div>
                    <div>
                      <p className="font-bold text-text-1">{entry.totalSellers}</p>
                      <p className="text-text-3">Sellers</p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-vynt font-[var(--font-display)] mt-3">
                    {formatNaira(entry.totalEarned)}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Rankings table */}
        {rest.length > 0 && (
          <div className="bg-white rounded-xl border border-border overflow-hidden mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Rank', 'Name', 'Campus', 'Signups', 'Sellers', 'Earned'].map((h) => (
                    <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wider text-text-3 py-3 px-5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {rest.map((entry) => (
                  <tr key={entry.rank} className="hover:bg-surface/30 transition-colors">
                    <td className="py-3.5 px-5 text-sm font-mono text-text-3">{entry.rank}</td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-vynt-light flex items-center justify-center">
                          <span className="text-xs font-semibold text-vynt">{getInitials(entry.name)}</span>
                        </div>
                        <span className="text-sm font-medium text-text-1">{entry.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-sm text-text-2">{entry.campus}</td>
                    <td className="py-3.5 px-5 text-sm font-mono tabular-nums text-text-1">{entry.totalSignups}</td>
                    <td className="py-3.5 px-5 text-sm font-mono tabular-nums text-text-1">{entry.totalSellers}</td>
                    <td className="py-3.5 px-5 text-sm font-semibold font-mono tabular-nums text-vynt">
                      {formatNaira(entry.totalEarned)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* CTA */}
        <div className="bg-vynt rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-white font-[var(--font-display)] mb-2">
            Become a Campus Shopper
          </h2>
          <p className="text-sm text-white/70 mb-5 max-w-md mx-auto">
            Join VYNT as a campus shopper and earn commissions by referring students to buy and sell preloved fashion.
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-white text-vynt font-semibold text-sm rounded-full hover:bg-gold-light transition-colors">
            Get Started
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Fashion strip */}
        <div className="mt-8 overflow-hidden">
          <div className="flex gap-4 animate-scroll whitespace-nowrap">
            {['Vintage Denim', 'Y2K Tops', 'Ankara Mix', 'Thrift Finds', 'Designer Bags', 'Sneaker Heat', 'Boho Chic', 'Streetwear', 'Campus Drip', 'Retro Vibes', 'Lagos Style', 'Preloved Luxury'].map((tag) => (
              <span
                key={tag}
                className="inline-block px-4 py-2 bg-vynt-light text-vynt text-xs font-medium rounded-full border border-vynt/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
