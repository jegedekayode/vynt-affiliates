'use client';

import { useState, useEffect, useCallback } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import FilterBar from '@/components/affiliates/FilterBar';
import AffiliatesTable from '@/components/affiliates/AffiliatesTable';
import AddAffiliateModal from '@/components/affiliates/AddAffiliateModal';
import { Affiliate, AffiliateFilters } from '@/lib/types';
import { getAffiliates } from '@/lib/api';
import { formatNaira, formatPercent } from '@/lib/utils';
import { Download, Plus } from 'lucide-react';
import { ITEMS_PER_PAGE } from '@/lib/constants';

function exportCsv(affiliates: Affiliate[]) {
  const headers = ['Name', 'Code', 'Type', 'Campus', 'Status', 'Signups', 'Orders', 'GMV', 'Sellers', 'Earned', 'Paid', 'Pending', 'Conversion Rate', 'Date Joined'];
  const rows = affiliates.map((a) => [
    a.name,
    a.code,
    a.type,
    a.campus || '',
    a.status,
    a.totalSignups,
    a.totalOrders,
    a.totalGmv,
    a.totalSellers,
    a.totalEarned,
    a.totalPaid,
    a.pendingBalance,
    formatPercent(a.conversionRate),
    a.dateJoined,
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row.map((cell) => {
        let str = String(cell);
        // Prevent CSV injection — escape cells starting with formula chars
        if (/^[=+\-@\t\r]/.test(str)) {
          str = `'${str}`;
        }
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      }).join(',')
    )
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `vynt-affiliates-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function AffiliatesPage() {
  const [allAffiliates, setAllAffiliates] = useState<Affiliate[]>([]);
  const [filters, setFilters] = useState<AffiliateFilters>({
    search: '',
    type: 'all',
    status: 'all',
    campus: 'all',
    period: 'all',
  });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    setCurrentPage(1);
    getAffiliates(filters).then((data) => {
      setAllAffiliates(data);
      setLoading(false);
    });
  }, [filters]);

  const totalPages = Math.max(1, Math.ceil(allAffiliates.length / ITEMS_PER_PAGE));
  const paginatedAffiliates = allAffiliates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAddAffiliate = useCallback((newAffiliate: Affiliate) => {
    setAllAffiliates((prev) => [newAffiliate, ...prev]);
  }, []);

  const handleUpdateAffiliate = useCallback((id: string, updates: Partial<Affiliate>) => {
    setAllAffiliates((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  }, []);

  return (
    <>
      <PageHeader
        title="Affiliates"
        description={`${allAffiliates.length} affiliates found`}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportCsv(allAffiliates)}
              className="flex items-center gap-2 h-9 px-4 text-xs font-medium border border-border rounded-lg text-text-2 hover:bg-surface transition-colors"
            >
              <Download size={14} />
              Export CSV
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 h-9 px-4 text-xs font-medium bg-vynt text-white rounded-lg hover:bg-vynt-mid transition-colors"
            >
              <Plus size={14} />
              Add Affiliate
            </button>
          </div>
        }
      />

      <FilterBar filters={filters} onFilterChange={setFilters} />

      {loading ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <div className="inline-block w-6 h-6 border-2 border-vynt/20 border-t-vynt rounded-full animate-spin mb-3" />
          <p className="text-sm text-text-3">Loading affiliates...</p>
        </div>
      ) : (
        <AffiliatesTable
          affiliates={paginatedAffiliates}
          onUpdate={handleUpdateAffiliate}
        />
      )}

      {/* Pagination */}
      {!loading && allAffiliates.length > 0 && (
        <div className="flex items-center justify-between mt-4 text-sm text-text-3">
          <p>
            Showing{' '}
            <span className="font-medium text-text-1">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, allAffiliates.length)}
            </span>{' '}
            of <span className="font-medium text-text-1">{allAffiliates.length}</span> affiliates
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium bg-white hover:bg-surface transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  page === currentPage
                    ? 'border-vynt bg-vynt-light text-vynt'
                    : 'border-border bg-white hover:bg-surface'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium bg-white hover:bg-surface transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <AddAffiliateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddAffiliate}
      />
    </>
  );
}
