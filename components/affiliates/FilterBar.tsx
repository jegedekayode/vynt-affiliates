'use client';

import { Search } from 'lucide-react';
import { AffiliateFilters } from '@/lib/types';

interface FilterBarProps {
  filters: AffiliateFilters;
  onFilterChange: (filters: AffiliateFilters) => void;
}

const periods = [
  { label: 'Today', value: 'today' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'All Time', value: 'all' },
] as const;

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const update = (partial: Partial<AffiliateFilters>) =>
    onFilterChange({ ...filters, ...partial });

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Search + dropdowns */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
          <input
            type="text"
            placeholder="Search by name or code..."
            value={filters.search || ''}
            onChange={(e) => update({ search: e.target.value })}
            className="w-full h-10 pl-10 pr-4 text-sm bg-white border border-border rounded-full outline-none focus:border-vynt focus:ring-1 focus:ring-vynt/20 transition-colors placeholder:text-text-3"
          />
        </div>

        <select
          value={filters.type || 'all'}
          onChange={(e) => update({ type: e.target.value as AffiliateFilters['type'] })}
          className="h-10 px-4 text-sm bg-white border border-border rounded-full outline-none focus:border-vynt cursor-pointer text-text-2"
        >
          <option value="all">All Types</option>
          <option value="vcs">VCS</option>
          <option value="community">Community</option>
          <option value="individual">Individual</option>
        </select>

        <select
          value={filters.status || 'all'}
          onChange={(e) => update({ status: e.target.value as AffiliateFilters['status'] })}
          className="h-10 px-4 text-sm bg-white border border-border rounded-full outline-none focus:border-vynt cursor-pointer text-text-2"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="dormant">Dormant</option>
          <option value="suspended">Suspended</option>
        </select>

        <select
          value={filters.campus || 'all'}
          onChange={(e) => update({ campus: e.target.value })}
          className="h-10 px-4 text-sm bg-white border border-border rounded-full outline-none focus:border-vynt cursor-pointer text-text-2"
        >
          <option value="all">All Campuses</option>
          <option value="UNILAG">UNILAG</option>
          <option value="LASU">LASU</option>
          <option value="Yaba Tech">Yaba Tech</option>
          <option value="Babcock">Babcock</option>
          <option value="Covenant">Covenant</option>
        </select>
      </div>

      {/* Period tabs */}
      <div className="flex items-center gap-1 bg-surface rounded-full p-1 w-fit">
        {periods.map((p) => (
          <button
            key={p.value}
            onClick={() => update({ period: p.value })}
            className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors duration-150 ${
              (filters.period || 'all') === p.value
                ? 'bg-white text-text-1 shadow-sm'
                : 'text-text-3 hover:text-text-2'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
