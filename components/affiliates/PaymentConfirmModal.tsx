'use client';

import { X, Banknote } from 'lucide-react';
import { formatNaira } from '@/lib/utils';
import { useEffect } from 'react';

interface PaymentConfirmModalProps {
  open: boolean;
  affiliateName: string;
  amount: number;
  onConfirm: () => void;
  onClose: () => void;
}

export default function PaymentConfirmModal({
  open,
  affiliateName,
  amount,
  onConfirm,
  onClose,
}: PaymentConfirmModalProps) {
  useEffect(() => {
    if (!open) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/40 animate-[fadeIn_150ms_ease]" />
      <div className="relative bg-white rounded-2xl border border-border shadow-xl w-full max-w-sm mx-4 animate-[slideUp_200ms_ease]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Banknote size={18} className="text-green" />
            <h2 className="text-base font-bold text-text-1 font-[var(--font-display)]">
              Confirm Payment
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface transition-colors"
          >
            <X size={18} className="text-text-3" />
          </button>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm text-text-1 mb-2">
            Mark payment of{' '}
            <span className="font-bold font-mono text-green">{formatNaira(amount)}</span>{' '}
            to <span className="font-semibold">{affiliateName}</span>?
          </p>
          <p className="text-xs text-text-3">
            This will move the pending balance to paid.
          </p>
        </div>
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium border border-border rounded-lg text-text-2 hover:bg-surface transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 text-sm font-medium bg-green text-white rounded-lg hover:bg-green/90 transition-colors"
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
}
