'use client';

import { useState, useEffect, useCallback } from 'react';
import { Pencil } from 'lucide-react';
import PortalHeader from '@/components/portal/PortalHeader';
import { getAffiliates } from '@/lib/api';
import { formatNaira } from '@/lib/utils';
import { COMMISSION } from '@/lib/constants';
import { Affiliate } from '@/lib/types';

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-surface rounded-lg ${className}`} />;
}

function LoadingState() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <Skeleton className="h-8 w-40" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24" />)}
      </div>
      <Skeleton className="h-40" />
      <Skeleton className="h-32" />
    </div>
  );
}

function maskAccount(accountNumber: string): string {
  if (!accountNumber || accountNumber === '—') return '—';
  const last4 = accountNumber.slice(-4);
  return `•••• •• ${last4}`;
}

export default function PaymentsPage() {
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const affiliates = await getAffiliates();
      if (affiliates.length === 0) {
        setError('No affiliate data found.');
        return;
      }
      setAffiliate(affiliates[0]);
    } catch {
      setError('Unable to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  if (loading) return <LoadingState />;

  if (error || !affiliate) {
    return (
      <div className="p-6 max-w-3xl mx-auto flex flex-col items-center justify-center py-20">
        <p className="text-sm text-text-2 mb-4">{error ?? 'Unable to load data.'}</p>
        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          className="px-4 py-2 text-sm font-medium bg-vynt text-white rounded-lg hover:bg-vynt-mid transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const a = affiliate;
  const signupCommission = a.totalSignups * COMMISSION.SIGNUP;
  const purchaseCommission = a.totalOrders * COMMISSION.PURCHASE;
  const sellerCommission = a.totalSellers * COMMISSION.SELLER_STORE;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <PortalHeader
        title="Payments"
        subtitle="Your earnings summary and payment history."
      />

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border-2 border-vynt/30 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-3 mb-1">Total Earned</p>
          <p className="text-2xl font-extrabold text-vynt">{formatNaira(a.totalEarned)}</p>
        </div>
        <div className="bg-white rounded-xl border border-border px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-3 mb-1">Paid Out</p>
          <p className="text-2xl font-extrabold text-green">{formatNaira(a.totalPaid)}</p>
        </div>
        <div className="bg-white rounded-xl border border-border px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-3 mb-1">Pending</p>
          <p className="text-2xl font-extrabold text-amber">{formatNaira(a.pendingBalance)}</p>
          <p className="text-xs text-text-3 mt-0.5">Paid monthly</p>
        </div>
      </div>

      {/* Earnings breakdown */}
      <div className="bg-white rounded-xl border border-border p-5 mb-6">
        <p className="text-sm font-bold text-text-1 mb-4">Earnings Breakdown</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-surface/60 rounded-lg px-4 py-3">
            <p className="text-xs text-text-3 mb-0.5">Signup Commissions</p>
            <p className="text-lg font-bold text-text-1">{formatNaira(signupCommission)}</p>
            <p className="text-xs text-text-3 mt-1">
              {a.totalSignups} × {formatNaira(COMMISSION.SIGNUP)}
            </p>
          </div>
          <div className="bg-surface/60 rounded-lg px-4 py-3">
            <p className="text-xs text-text-3 mb-0.5">Purchase Commissions</p>
            <p className="text-lg font-bold text-text-1">{formatNaira(purchaseCommission)}</p>
            <p className="text-xs text-text-3 mt-1">
              {a.totalOrders} × {formatNaira(COMMISSION.PURCHASE)}
            </p>
          </div>
          <div className="bg-surface/60 rounded-lg px-4 py-3">
            <p className="text-xs text-text-3 mb-0.5">Seller Commissions</p>
            <p className="text-lg font-bold text-text-1">{formatNaira(sellerCommission)}</p>
            <p className="text-xs text-text-3 mt-1">
              {a.totalSellers} × {formatNaira(COMMISSION.SELLER_STORE)}
            </p>
          </div>
        </div>
      </div>

      {/* Bank details */}
      <div className="bg-white rounded-xl border border-border p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-text-1">Bank Details</p>
          <button
            type="button"
            className="flex items-center gap-1.5 text-xs font-medium text-vynt hover:text-vynt-mid transition-colors"
          >
            <Pencil size={12} strokeWidth={2} />
            Edit
          </button>
        </div>
        <div className="space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-text-3">Bank</span>
            <span className="font-medium text-text-1">{a.bankName || '—'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-3">Account Number</span>
            <span className="font-mono font-medium text-text-1">
              {maskAccount(a.accountNumber || '—')}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-3">Account Name</span>
            <span className="font-medium text-text-1">{a.accountName || '—'}</span>
          </div>
        </div>
      </div>

      {/* Payment history */}
      <div className="bg-white rounded-xl border border-border p-5">
        <p className="text-sm font-bold text-text-1 mb-3">Payment History</p>
        <p className="text-xs text-text-3 leading-relaxed">
          Payment history will appear after your first payout is processed.
        </p>
      </div>
    </div>
  );
}
