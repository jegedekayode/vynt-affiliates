'use client';

import { Pencil } from 'lucide-react';
import PortalHeader from '@/components/portal/PortalHeader';
import { affiliates } from '@/lib/mock-data/affiliates';
import { formatNaira, formatDate } from '@/lib/utils';
import { COMMISSION } from '@/lib/constants';

const TOMI = affiliates.find((a) => a.id === 'aff_001')!;

// Mock payment history — total paid: ₦65,000
const paymentHistory = [
  { id: 'pay_004', date: '2026-03-10', amount: 25000, reference: 'VYNT-PAY-00124' },
  { id: 'pay_003', date: '2026-02-28', amount: 15000, reference: 'VYNT-PAY-00098' },
  { id: 'pay_002', date: '2026-02-15', amount: 15000, reference: 'VYNT-PAY-00072' },
  { id: 'pay_001', date: '2026-01-25', amount: 10000, reference: 'VYNT-PAY-00041' },
];

export default function PaymentsPage() {
  const signupCommission = TOMI.totalSignups * COMMISSION.SIGNUP;
  const purchaseCommission = TOMI.totalOrders * COMMISSION.PURCHASE;
  const sellerCommission = TOMI.totalSellers * COMMISSION.SELLER_STORE;

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
          <p className="text-2xl font-extrabold text-vynt">{formatNaira(TOMI.totalEarned)}</p>
        </div>
        <div className="bg-white rounded-xl border border-border px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-3 mb-1">Paid Out</p>
          <p className="text-2xl font-extrabold text-green">{formatNaira(TOMI.totalPaid)}</p>
        </div>
        <div className="bg-white rounded-xl border border-border px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-3 mb-1">Pending</p>
          <p className="text-2xl font-extrabold text-amber">{formatNaira(TOMI.pendingBalance)}</p>
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
              {TOMI.totalSignups} × {formatNaira(COMMISSION.SIGNUP)}
            </p>
          </div>
          <div className="bg-surface/60 rounded-lg px-4 py-3">
            <p className="text-xs text-text-3 mb-0.5">Purchase Commissions</p>
            <p className="text-lg font-bold text-text-1">{formatNaira(purchaseCommission)}</p>
            <p className="text-xs text-text-3 mt-1">
              {TOMI.totalOrders} × {formatNaira(COMMISSION.PURCHASE)}
            </p>
          </div>
          <div className="bg-surface/60 rounded-lg px-4 py-3">
            <p className="text-xs text-text-3 mb-0.5">Seller Commissions</p>
            <p className="text-lg font-bold text-text-1">{formatNaira(sellerCommission)}</p>
            <p className="text-xs text-text-3 mt-1">
              {TOMI.totalSellers} × {formatNaira(COMMISSION.SELLER_STORE)}
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
            <span className="font-medium text-text-1">Zenith Bank</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-3">Account Number</span>
            <span className="font-mono font-medium text-text-1">012 ••• ••89</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-3">Account Name</span>
            <span className="font-medium text-text-1">Tomilayo Adeyemi</span>
          </div>
        </div>
      </div>

      {/* Payment history */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-text-1">Payment History</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface/60">
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-3 uppercase tracking-wide">Date</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-text-3 uppercase tracking-wide">Amount</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-text-3 uppercase tracking-wide">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-text-3 uppercase tracking-wide">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {paymentHistory.map((p) => (
                <tr key={p.id} className="hover:bg-surface/40 transition-colors">
                  <td className="px-4 py-3 text-text-2">{formatDate(p.date)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-text-1">
                    {formatNaira(p.amount)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-green/10 text-green">
                      Paid
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-text-3">
                    {p.reference}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
