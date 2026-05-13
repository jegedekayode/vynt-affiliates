'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, Banknote } from 'lucide-react';
import { getAffiliateById, processPayout } from '@/lib/api';
import { formatNaira, formatDate, getInitials } from '@/lib/utils';
import { COMMISSION } from '@/lib/constants';
import StatusBadge from '@/components/affiliates/StatusBadge';
import PaymentConfirmModal from '@/components/affiliates/PaymentConfirmModal';
import Toast from '@/components/ui/Toast';
import { Affiliate } from '@/lib/types';

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


export default function AffiliateDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [loading, setLoading] = useState(true);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    getAffiliateById(id).then((aff) => {
      setAffiliate(aff ?? null);
      setLoading(false);
    }).catch(() => setLoading(false));
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

  async function handlePayConfirm() {
    const amount = a.pendingBalance;
    setPaying(true);
    try {
      await processPayout(a.id, a.userId, amount);
      setAffiliate({ ...a, totalPaid: a.totalPaid + amount, pendingBalance: 0 });
      setToastMessage(`${formatNaira(amount)} payment to ${a.name} marked as paid`);
    } catch {
      setToastMessage('Payment failed. Please try again.');
    } finally {
      setPaying(false);
      setPayModalOpen(false);
    }
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
              {a.dateJoined && (
                <span className="flex items-center gap-1">
                  <Calendar size={13} />
                  Joined {formatDate(a.dateJoined)}
                </span>
              )}
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
            Referrals
          </h2>
        </div>
        <div className="p-8 text-center">
          <p className="text-sm text-text-3 max-w-xs mx-auto">
            Individual referral tracking is being rolled out. Totals are live \u2014 detailed per-user data coming soon.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-5">
        <h2 className="text-sm font-semibold text-text-1 font-[var(--font-display)] mb-4">
          Activity Timeline
        </h2>
        <p className="text-sm text-text-3">
          Event-level activity tracking coming soon.
        </p>
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
        loading={paying}
      />

      <Toast
        message={toastMessage}
        visible={!!toastMessage}
        onDone={() => setToastMessage('')}
      />
    </>
  );
}
