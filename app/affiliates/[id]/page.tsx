'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, Banknote } from 'lucide-react';
import { getAffiliateById, getAffiliateReferrals, getAffiliateEvents, updateAffiliate } from '@/lib/api';
import { formatNaira, formatDate, formatRelativeTime, getInitials } from '@/lib/utils';
import { COMMISSION } from '@/lib/constants';
import StatusBadge from '@/components/affiliates/StatusBadge';
import PaymentConfirmModal from '@/components/affiliates/PaymentConfirmModal';
import Toast from '@/components/ui/Toast';
import { Affiliate, Referral, ReferralEvent } from '@/lib/types';

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

const refStatusStyles: Record<string, string> = {
  signed_up: 'bg-blue/10 text-blue',
  purchased: 'bg-green/10 text-green',
  seller: 'bg-gold-light text-amber',
};

const refStatusLabels: Record<string, string> = {
  signed_up: 'Signed Up',
  purchased: 'Purchased',
  seller: 'Seller',
};

export default function AffiliateDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [events, setEvents] = useState<ReferralEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    Promise.all([
      getAffiliateById(id),
      getAffiliateReferrals(id),
      getAffiliateEvents(id),
    ]).then(([aff, refs, evts]) => {
      setAffiliate(aff ?? null);
      setReferrals(refs);
      setEvents(evts);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="inline-block w-6 h-6 border-2 border-vynt/20 border-t-vynt rounded-full animate-spin" />
      </div>
    );
  }

  if (!affiliate) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-text-3">Affiliate not found.</p>
        <Link href="/affiliates" className="text-sm text-vynt hover:underline mt-2 inline-block">
          Back to Affiliates
        </Link>
      </div>
    );
  }

  const a = affiliate;
  const signupEarnings = a.totalSignups * COMMISSION.SIGNUP;
  const purchaseEarnings = a.totalOrders * COMMISSION.PURCHASE;
  const sellerEarnings = a.totalSellers * COMMISSION.SELLER_STORE;

  function handlePayConfirm() {
    const amount = a.pendingBalance;
    const updates = {
      totalPaid: a.totalPaid + amount,
      pendingBalance: 0,
      lastPaidDate: new Date().toISOString().split('T')[0],
    };
    updateAffiliate(a.id, updates);
    setAffiliate({ ...a, ...updates });
    setPayModalOpen(false);
    setToastMessage(`${formatNaira(amount)} payment to ${a.name} marked as paid`);
  }

  return (
    <>
      <Link
        href="/affiliates"
        className="inline-flex items-center gap-1.5 text-sm text-text-3 hover:text-text-1 transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to Affiliates
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-vynt-light flex items-center justify-center">
            <span className="text-lg font-bold text-vynt">{getInitials(a.name)}</span>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-text-1 font-[var(--font-display)]">{a.name}</h1>
              <span className={`text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full ${typeBadgeStyles[a.type]}`}>
                {typeLabels[a.type]}
              </span>
              <StatusBadge status={a.status} />
            </div>
            <div className="flex items-center gap-4 text-sm text-text-3">
              <span className="font-mono">{a.code}</span>
              {a.campus && (
                <span className="flex items-center gap-1">
                  <MapPin size={13} />
                  {a.campus}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar size={13} />
                Joined {formatDate(a.dateJoined)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
        {[
          { label: 'Signups', value: a.totalSignups.toString() },
          { label: 'Orders', value: a.totalOrders.toString() },
          { label: 'GMV', value: formatNaira(a.totalGmv) },
          { label: 'Sellers', value: a.totalSellers.toString() },
          { label: 'Earned', value: formatNaira(a.totalEarned), highlight: true },
          { label: 'Paid', value: formatNaira(a.totalPaid) },
          { label: 'Pending', value: formatNaira(a.pendingBalance), gold: true },
        ].map((card) => (
          <div
            key={card.label}
            className={`rounded-xl border p-4 ${
              card.highlight ? 'bg-vynt border-vynt-mid' : 'bg-white border-border'
            }`}
          >
            <p className={`text-xs mb-1 ${card.highlight ? 'text-white/70' : 'text-text-3'}`}>
              {card.label}
            </p>
            <p
              className={`text-xl font-bold font-[var(--font-display)] ${
                card.highlight ? 'text-white' : card.gold ? 'text-gold' : 'text-text-1'
              }`}
            >
              {card.value}
            </p>
            {card.label === 'Paid' && a.lastPaidDate && (
              <p className="text-[10px] text-text-3 mt-1">{formatDate(a.lastPaidDate)}</p>
            )}
            {card.label === 'Pending' && a.pendingBalance > 0 && (
              <button
                onClick={() => setPayModalOpen(true)}
                className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 text-[11px] font-medium border border-green/30 text-green rounded-lg hover:bg-green/5 transition-colors"
              >
                <Banknote size={12} />
                Pay
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-2">
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-xs text-text-3 mb-1">Signup Commissions</p>
          <p className="text-xl font-bold text-text-1 font-[var(--font-display)]">{formatNaira(signupEarnings)}</p>
          <p className="text-xs text-text-3 mt-1">{a.totalSignups} signups x {formatNaira(COMMISSION.SIGNUP)}</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-xs text-text-3 mb-1">Purchase Commissions</p>
          <p className="text-xl font-bold text-text-1 font-[var(--font-display)]">{formatNaira(purchaseEarnings)}</p>
          <p className="text-xs text-text-3 mt-1">
            {a.totalOrders} orders x {formatNaira(COMMISSION.PURCHASE)} (min {formatNaira(COMMISSION.PURCHASE_MIN_ORDER)} order)
          </p>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-xs text-text-3 mb-1">Seller Commissions</p>
          <p className="text-xl font-bold text-text-1 font-[var(--font-display)]">{formatNaira(sellerEarnings)}</p>
          <p className="text-xs text-text-3 mt-1">
            {a.totalSellers} sellers x {formatNaira(COMMISSION.SELLER_STORE)} ({COMMISSION.SELLER_MIN_LISTINGS}+ listings)
          </p>
        </div>
      </div>
      <p className="text-[11px] text-text-3 mb-8">
        Purchase commission requires minimum {formatNaira(COMMISSION.PURCHASE_MIN_ORDER)} order. Seller commission requires {COMMISSION.SELLER_MIN_LISTINGS}+ listings.
      </p>

      <div className="bg-white rounded-xl border border-border overflow-hidden mb-8">
        <div className="p-5 border-b border-border">
          <h2 className="text-sm font-semibold text-text-1 font-[var(--font-display)]">
            Referrals ({referrals.length})
          </h2>
        </div>
        {referrals.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-text-3">No referrals yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Name', 'Date Referred', 'Status', 'Order Amount', 'Order Date', 'Seller', 'Listings'].map((h) => (
                    <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wider text-text-3 py-3 px-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {referrals.map((ref) => (
                  <tr key={ref.id} className="hover:bg-surface/30 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-text-1">{ref.userName}</td>
                    <td className="py-3 px-4 text-sm text-text-2">{formatDate(ref.dateReferred)}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${refStatusStyles[ref.status]}`}>
                        {refStatusLabels[ref.status]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-mono tabular-nums text-text-1">
                      {ref.orderAmount ? formatNaira(ref.orderAmount) : '\u2014'}
                    </td>
                    <td className="py-3 px-4 text-sm text-text-2">
                      {ref.orderDate ? formatDate(ref.orderDate) : '\u2014'}
                    </td>
                    <td className="py-3 px-4 text-sm text-text-2">{ref.isSeller ? 'Yes' : 'No'}</td>
                    <td className="py-3 px-4 text-sm font-mono text-text-2">{ref.listingCount || '\u2014'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-border p-5">
        <h2 className="text-sm font-semibold text-text-1 font-[var(--font-display)] mb-4">
          Activity Timeline
        </h2>
        {events.length === 0 ? (
          <p className="text-sm text-text-3">No activity yet.</p>
        ) : (
          <div className="space-y-4">
            {events.slice(0, 20).map((evt) => (
              <div key={evt.id} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-vynt mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm text-text-1">
                    <span className="font-medium">{evt.referredUserName}</span>{' '}
                    <span className="text-text-3">
                      {evt.eventType === 'signup' && 'signed up'}
                      {evt.eventType === 'purchase' && `made a purchase${evt.orderAmount ? ` (${formatNaira(evt.orderAmount)})` : ''}`}
                      {evt.eventType === 'seller_store' && 'opened a seller store'}
                    </span>
                    {' '}
                    <span className="text-xs text-vynt font-mono">+{formatNaira(evt.amount)}</span>
                  </p>
                  <p className="text-xs text-text-3 mt-0.5">{formatRelativeTime(evt.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {a.notes && (
        <div className="bg-gold-light rounded-xl border border-gold/20 p-5 mt-6">
          <p className="text-xs font-semibold text-amber mb-1">Admin Note</p>
          <p className="text-sm text-text-2">{a.notes}</p>
        </div>
      )}

      <PaymentConfirmModal
        open={payModalOpen}
        affiliateName={a.name}
        amount={a.pendingBalance}
        onConfirm={handlePayConfirm}
        onClose={() => setPayModalOpen(false)}
      />

      <Toast
        message={toastMessage}
        visible={!!toastMessage}
        onDone={() => setToastMessage('')}
      />
    </>
  );
}
