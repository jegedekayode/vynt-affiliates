'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import { Affiliate, AffiliateType, AffiliateStatus } from '@/lib/types';
import { formatNaira, formatPercent, getInitials, cn } from '@/lib/utils';
import { COMMISSION } from '@/lib/constants';
import StatusBadge from './StatusBadge';

interface AffiliateRowProps {
  affiliate: Affiliate;
  rank: number;
  onUpdate?: (id: string, updates: Partial<Affiliate>) => void;
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

function conversionColor(rate: number): string {
  if (rate >= 0.2) return 'text-green';
  if (rate >= 0.15) return 'text-amber';
  return 'text-red';
}

export default function AffiliateRow({ affiliate, rank, onUpdate }: AffiliateRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [editingType, setEditingType] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [editingNote, setEditingNote] = useState(false);
  const [noteValue, setNoteValue] = useState(affiliate.notes || '');
  const a = affiliate;

  const signupEarnings = a.totalSignups * COMMISSION.SIGNUP;
  const purchaseEarnings = a.totalOrders * COMMISSION.PURCHASE;
  const sellerEarnings = a.totalSellers * COMMISSION.SELLER_STORE;

  function handleTypeChange(newType: AffiliateType) {
    onUpdate?.(a.id, { type: newType });
    setEditingType(false);
  }

  function handleStatusChange(newStatus: AffiliateStatus) {
    onUpdate?.(a.id, { status: newStatus });
    setEditingStatus(false);
  }

  function handleNoteSave() {
    onUpdate?.(a.id, { notes: noteValue.trim() || null });
    setEditingNote(false);
  }

  return (
    <>
      <tr
        onClick={() => setExpanded(!expanded)}
        className="group cursor-pointer hover:bg-surface/50 transition-colors duration-150"
      >
        <td className="py-3.5 pl-4 pr-2 text-xs font-mono text-text-3">{rank}</td>
        <td className="py-3.5 px-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-vynt-light flex items-center justify-center shrink-0">
              <span className="text-xs font-semibold text-vynt">{getInitials(a.name)}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-text-1">{a.name}</p>
              <p className="text-xs text-text-3 font-mono">
                {a.code}
                {a.campus && <span className="ml-1.5 text-text-3">&middot; {a.campus}</span>}
              </p>
            </div>
          </div>
        </td>
        <td className="py-3.5 px-3">
          <span className={`text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full ${typeBadgeStyles[a.type]}`}>
            {typeLabels[a.type]}
          </span>
        </td>
        <td className="py-3.5 px-3">
          <StatusBadge status={a.status} />
        </td>
        <td className="py-3.5 px-3 text-sm font-mono tabular-nums text-text-1">{a.totalSignups}</td>
        <td className="py-3.5 px-3 text-sm font-mono tabular-nums text-text-1">{a.totalOrders}</td>
        <td className="py-3.5 px-3 text-sm font-mono tabular-nums text-text-1">{formatNaira(a.totalGmv)}</td>
        <td className="py-3.5 px-3 text-sm font-mono tabular-nums text-text-1">{a.totalSellers}</td>
        <td className="py-3.5 px-3 text-sm font-semibold font-mono tabular-nums text-vynt">{formatNaira(a.totalEarned)}</td>
        <td className={cn('py-3.5 px-3 text-sm font-mono tabular-nums', conversionColor(a.conversionRate))}>
          {formatPercent(a.conversionRate)}
        </td>
        <td className="py-3.5 pr-4 pl-2">
          {expanded ? (
            <ChevronUp size={16} className="text-text-3" />
          ) : (
            <ChevronDown size={16} className="text-text-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan={11} className="bg-surface/30 border-t border-b border-border">
            <div className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-3 mb-3">
                Earnings Breakdown
              </p>
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-white rounded-lg border border-border p-4">
                  <p className="text-xs text-text-3 mb-1">Signup Commissions</p>
                  <p className="text-lg font-bold text-text-1 font-[var(--font-display)]">
                    {formatNaira(signupEarnings)}
                  </p>
                  <p className="text-xs text-text-3 mt-1">{a.totalSignups} signups x {formatNaira(COMMISSION.SIGNUP)}</p>
                </div>
                <div className="bg-white rounded-lg border border-border p-4">
                  <p className="text-xs text-text-3 mb-1">Purchase Commissions</p>
                  <p className="text-lg font-bold text-text-1 font-[var(--font-display)]">
                    {formatNaira(purchaseEarnings)}
                  </p>
                  <p className="text-xs text-text-3 mt-1">{a.totalOrders} orders x {formatNaira(COMMISSION.PURCHASE)}</p>
                </div>
                <div className="bg-white rounded-lg border border-border p-4">
                  <p className="text-xs text-text-3 mb-1">Seller Commissions</p>
                  <p className="text-lg font-bold text-text-1 font-[var(--font-display)]">
                    {formatNaira(sellerEarnings)}
                  </p>
                  <p className="text-xs text-text-3 mt-1">{a.totalSellers} sellers x {formatNaira(COMMISSION.SELLER_STORE)}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-text-3">Paid: </span>
                  <span className="font-mono font-medium text-text-1">{formatNaira(a.totalPaid)}</span>
                </div>
                <div>
                  <span className="text-text-3">Pending: </span>
                  <span className="font-mono font-medium text-gold">{formatNaira(a.pendingBalance)}</span>
                </div>
                <div>
                  <span className="text-text-3">Joined: </span>
                  <span className="font-medium text-text-1">
                    {new Date(a.dateJoined).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                {a.notes && !editingNote && (
                  <div className="flex-1 text-text-3 italic truncate">
                    Note: {a.notes}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                <Link
                  href={`/affiliates/${a.id}`}
                  className="px-4 py-2 text-xs font-medium bg-vynt text-white rounded-lg hover:bg-vynt-mid transition-colors"
                >
                  View Full Profile
                </Link>

                {/* Edit Type */}
                {editingType ? (
                  <div className="flex items-center gap-1">
                    <select
                      defaultValue={a.type}
                      onChange={(e) => handleTypeChange(e.target.value as AffiliateType)}
                      className="h-8 px-2 text-xs bg-white border border-vynt rounded-lg outline-none cursor-pointer"
                      autoFocus
                    >
                      <option value="vcs">VCS</option>
                      <option value="community">Community</option>
                      <option value="individual">Individual</option>
                    </select>
                    <button
                      onClick={() => setEditingType(false)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-surface"
                    >
                      <X size={14} className="text-text-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingType(true)}
                    className="px-4 py-2 text-xs font-medium border border-border rounded-lg text-text-2 hover:bg-surface transition-colors"
                  >
                    Edit Type
                  </button>
                )}

                {/* Change Status */}
                {editingStatus ? (
                  <div className="flex items-center gap-1">
                    <select
                      defaultValue={a.status}
                      onChange={(e) => handleStatusChange(e.target.value as AffiliateStatus)}
                      className="h-8 px-2 text-xs bg-white border border-vynt rounded-lg outline-none cursor-pointer"
                      autoFocus
                    >
                      <option value="active">Active</option>
                      <option value="dormant">Dormant</option>
                      <option value="suspended">Suspended</option>
                    </select>
                    <button
                      onClick={() => setEditingStatus(false)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-surface"
                    >
                      <X size={14} className="text-text-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingStatus(true)}
                    className="px-4 py-2 text-xs font-medium border border-border rounded-lg text-text-2 hover:bg-surface transition-colors"
                  >
                    Change Status
                  </button>
                )}

                {/* Add/Edit Note */}
                {editingNote ? (
                  <div className="flex items-center gap-1 flex-1">
                    <input
                      type="text"
                      value={noteValue}
                      onChange={(e) => setNoteValue(e.target.value)}
                      maxLength={300}
                      placeholder="Add a note..."
                      className="flex-1 h-8 px-3 text-xs bg-white border border-vynt rounded-lg outline-none placeholder:text-text-3"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleNoteSave();
                        if (e.key === 'Escape') setEditingNote(false);
                      }}
                    />
                    <button
                      onClick={handleNoteSave}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-green/10"
                    >
                      <Check size={14} className="text-green" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingNote(false);
                        setNoteValue(a.notes || '');
                      }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-surface"
                    >
                      <X size={14} className="text-text-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingNote(true)}
                    className="px-4 py-2 text-xs font-medium border border-border rounded-lg text-text-2 hover:bg-surface transition-colors"
                  >
                    {a.notes ? 'Edit Note' : 'Add Note'}
                  </button>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
