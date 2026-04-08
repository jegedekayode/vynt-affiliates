'use client';

import { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';

export default function PortalLoginPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);

    // TODO: Connect to POST /api/v2/auth/magic-link
    await new Promise((r) => setTimeout(r, 800)); // UI stub delay

    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div
      className="portal-root min-h-screen flex items-center justify-center px-4"
      style={{ background: '#F8F8F6' }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-11 h-11 rounded-xl bg-vynt flex items-center justify-center mb-3">
            <span className="text-white font-extrabold text-lg">V</span>
          </div>
          <p className="text-lg font-bold text-text-1">VYNT</p>
          <p className="text-sm text-text-3 mt-0.5">Affiliate Dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-border px-7 py-8 shadow-sm">
          {!submitted ? (
            <>
              <h1 className="text-base font-bold text-text-1 mb-1">Sign in</h1>
              <p className="text-sm text-text-3 mb-6">
                We&apos;ll send a magic link to your email.
              </p>

              <form onSubmit={handleSubmit} noValidate>
                <label htmlFor="email" className="block text-xs font-semibold text-text-2 mb-1.5">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-3.5 py-2.5 text-sm border border-border rounded-lg outline-none focus:border-vynt focus:ring-2 focus:ring-vynt/15 transition-colors placeholder:text-text-3/60 mb-4"
                />
                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-vynt text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-vynt-mid transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Magic Link
                      <ArrowRight size={15} strokeWidth={2} />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center text-center py-2">
              <div className="w-12 h-12 rounded-full bg-vynt-light flex items-center justify-center mb-4">
                <Mail size={22} strokeWidth={1.5} className="text-vynt" />
              </div>
              <p className="text-base font-bold text-text-1 mb-2">Check your email</p>
              <p className="text-sm text-text-3 leading-relaxed">
                We sent a sign-in link to{' '}
                <span className="font-medium text-text-2">{email}</span>.
                Click the link to access your dashboard.
              </p>
              <button
                type="button"
                onClick={() => { setSubmitted(false); setEmail(''); }}
                className="mt-5 text-xs font-medium text-text-3 hover:text-text-2 transition-colors"
              >
                Use a different email
              </button>
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-text-3 mt-5 leading-relaxed">
          Only registered VYNT affiliates can access this dashboard.
        </p>
      </div>
    </div>
  );
}
