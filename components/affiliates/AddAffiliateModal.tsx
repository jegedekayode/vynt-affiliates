'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Search, UserPlus } from 'lucide-react';
import { Affiliate, AffiliateType } from '@/lib/types';
import { CAMPUSES, COMMISSION } from '@/lib/constants';
import { formatNaira, getInitials } from '@/lib/utils';

// Mock VYNT users to search from (not yet affiliates)
const mockVyntUsers = [
  { id: 'usr_301', name: 'Adewale Ogundimu', email: 'adewale@gmail.com' },
  { id: 'usr_302', name: 'Chinenye Okoli', email: 'chinenye@gmail.com' },
  { id: 'usr_303', name: 'Yusuf Abdulrahman', email: 'yusuf.a@gmail.com' },
  { id: 'usr_304', name: 'Oluwabunmi Akindele', email: 'bunmi.ak@gmail.com' },
  { id: 'usr_305', name: 'Kemi Adeoye', email: 'kemi.adeoye@gmail.com' },
  { id: 'usr_306', name: 'Nonso Eze', email: 'nonso.eze@gmail.com' },
  { id: 'usr_307', name: 'Abiodun Salami', email: 'abiodun.s@gmail.com' },
  { id: 'usr_308', name: 'Halima Bello', email: 'halima.b@gmail.com' },
  { id: 'usr_309', name: 'Temitope Oladipo', email: 'temitope@gmail.com' },
  { id: 'usr_310', name: 'Ifeanyi Chukwuma', email: 'ifeanyi.c@gmail.com' },
];

interface AddAffiliateModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (affiliate: Affiliate) => void;
}

function generateCode(name: string, type: AffiliateType, campus: string | null): string {
  const firstName = name.split(' ')[0].toUpperCase();
  if (type === 'vcs' && campus && campus !== 'Other') {
    return `${firstName}_${campus.replace(/\s+/g, '').toUpperCase()}`;
  }
  return `${firstName}_REF`;
}

export default function AddAffiliateModal({ open, onClose, onSave }: AddAffiliateModalProps) {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<(typeof mockVyntUsers)[0] | null>(null);
  const [type, setType] = useState<AffiliateType>('vcs');
  const [campus, setCampus] = useState<string>('UNILAG');
  const [notes, setNotes] = useState('');
  const [showResults, setShowResults] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const filteredUsers = search.length >= 2
    ? mockVyntUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const generatedCode = selectedUser
    ? generateCode(selectedUser.name, type, type === 'vcs' ? campus : null)
    : '';

  useEffect(() => {
    if (!open) {
      setSearch('');
      setSelectedUser(null);
      setType('vcs');
      setCampus('UNILAG');
      setNotes('');
      setShowResults(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  function handleSave() {
    if (!selectedUser) return;

    const newAffiliate: Affiliate = {
      id: `aff_${Date.now()}`,
      userId: selectedUser.id,
      name: selectedUser.name,
      code: generatedCode,
      type,
      campus: type === 'vcs' ? campus : null,
      location: 'Lagos',
      status: 'active',
      dateJoined: new Date().toISOString().split('T')[0],
      totalSignups: 0,
      totalOrders: 0,
      totalGmv: 0,
      totalSellers: 0,
      totalEarned: 0,
      totalPaid: 0,
      pendingBalance: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
      conversionRate: 0,
      notes: notes.trim() || null,
    };

    onSave(newAffiliate);
    onClose();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 animate-[fadeIn_150ms_ease]" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl border border-border shadow-xl w-full max-w-lg mx-4 animate-[slideUp_200ms_ease]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <UserPlus size={18} className="text-vynt" />
            <h2 className="text-base font-bold text-text-1 font-[var(--font-display)]">
              Add Affiliate
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface transition-colors"
          >
            <X size={18} className="text-text-3" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* User search */}
          <div>
            <label className="block text-xs font-semibold text-text-2 mb-1.5">
              Search VYNT User
            </label>
            {selectedUser ? (
              <div className="flex items-center gap-3 p-3 bg-vynt-light rounded-lg border border-vynt/10">
                <div className="w-8 h-8 rounded-full bg-vynt flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{getInitials(selectedUser.name)}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-1">{selectedUser.name}</p>
                  <p className="text-xs text-text-3">{selectedUser.email}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setSearch('');
                  }}
                  className="text-xs text-vynt hover:text-vynt-mid font-medium"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setShowResults(true);
                  }}
                  onFocus={() => setShowResults(true)}
                  placeholder="Type a name or email..."
                  className="w-full h-10 pl-10 pr-4 text-sm bg-white border border-border rounded-lg outline-none focus:border-vynt focus:ring-1 focus:ring-vynt/20 transition-colors placeholder:text-text-3"
                />
                {showResults && filteredUsers.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {filteredUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          setSelectedUser(user);
                          setShowResults(false);
                          setSearch('');
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-surface transition-colors"
                      >
                        <div className="w-7 h-7 rounded-full bg-vynt-light flex items-center justify-center">
                          <span className="text-[10px] font-semibold text-vynt">{getInitials(user.name)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-1">{user.name}</p>
                          <p className="text-xs text-text-3">{user.email}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {showResults && search.length >= 2 && filteredUsers.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-10 p-4 text-center">
                    <p className="text-sm text-text-3">No users found</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Auto-generated code */}
          {selectedUser && (
            <div>
              <label className="block text-xs font-semibold text-text-2 mb-1.5">
                Referral Code
              </label>
              <div className="h-10 px-4 flex items-center text-sm font-mono bg-surface border border-border rounded-lg text-text-1">
                {generatedCode}
              </div>
            </div>
          )}

          {/* Type */}
          <div>
            <label className="block text-xs font-semibold text-text-2 mb-1.5">
              Affiliate Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as AffiliateType)}
              className="w-full h-10 px-4 text-sm bg-white border border-border rounded-lg outline-none focus:border-vynt cursor-pointer text-text-2"
            >
              <option value="vcs">VCS (Campus Shopper)</option>
              <option value="community">Community Partner</option>
              <option value="individual">Individual</option>
            </select>
          </div>

          {/* Campus (visible for VCS) */}
          {type === 'vcs' && (
            <div>
              <label className="block text-xs font-semibold text-text-2 mb-1.5">
                Campus
              </label>
              <select
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
                className="w-full h-10 px-4 text-sm bg-white border border-border rounded-lg outline-none focus:border-vynt cursor-pointer text-text-2"
              >
                {CAMPUSES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="N/A">N/A</option>
              </select>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-text-2 mb-1.5">
              Notes <span className="text-text-3 font-normal">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any relevant context about this affiliate..."
              rows={3}
              maxLength={500}
              className="w-full px-4 py-2.5 text-sm bg-white border border-border rounded-lg outline-none focus:border-vynt focus:ring-1 focus:ring-vynt/20 transition-colors placeholder:text-text-3 resize-none"
            />
          </div>

          {/* Coupon note */}
          <div className="flex items-start gap-2 p-3 bg-gold-light rounded-lg border border-gold/20">
            <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[10px] font-bold text-amber">i</span>
            </div>
            <p className="text-xs text-text-2 leading-relaxed">
              A <span className="font-semibold">{formatNaira(COMMISSION.BUYER_DISCOUNT)} discount coupon</span> will
              be auto-created using this affiliate&apos;s referral code for referred buyers.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium border border-border rounded-lg text-text-2 hover:bg-surface transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedUser}
            className="px-5 py-2 text-sm font-medium bg-vynt text-white rounded-lg hover:bg-vynt-mid transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save Affiliate
          </button>
        </div>
      </div>
    </div>
  );
}
