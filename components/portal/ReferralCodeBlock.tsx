'use client';

import { useState } from 'react';
import { Copy, Send, Check } from 'lucide-react';

interface ReferralCodeBlockProps {
  code: string;
  referralLink: string;
}

export default function ReferralCodeBlock({ code, referralLink }: ReferralCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for environments without clipboard API
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Shop vintage & second-hand fashion on VYNT! Use my link to sign up and get ₦1,000 off your first order: ${referralLink}`
  );

  return (
    <div className="mx-3 mb-4 rounded-xl bg-vynt p-3.5">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60 mb-1">
        Your Code
      </p>
      <p className="font-mono text-base font-bold text-white tracking-wider mb-1">{code}</p>
      <p className="text-[11px] text-white/50 truncate mb-3">
        vynt.ng/ref/{code.toLowerCase()}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-medium py-2 rounded-lg transition-colors duration-150"
        >
          {copied ? (
            <>
              <Check size={13} strokeWidth={2.5} />
              Copied!
            </>
          ) : (
            <>
              <Copy size={13} strokeWidth={2} />
              Copy
            </>
          )}
        </button>
        <a
          href={`https://wa.me/?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 bg-[#25D366]/90 hover:bg-[#25D366] text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors duration-150"
        >
          <Send size={13} strokeWidth={2} />
          Share
        </a>
      </div>
    </div>
  );
}
