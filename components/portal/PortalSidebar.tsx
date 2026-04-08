'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Wallet,
  BarChart3,
  BookOpen,
  Trophy,
  Bell,
  Settings,
  X,
} from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';
import ReferralCodeBlock from './ReferralCodeBlock';

// Hardcoded logged-in affiliate — Tomi Adeyemi
const AFFILIATE = {
  name: 'Tomilayo Adeyemi',
  code: 'TOMI_UNILAG',
  type: 'VCS',
  campus: 'UNILAG',
  unreadNotifications: 3,
};

const REFERRAL_LINK = `https://vynt.ng/ref/${AFFILIATE.code.toLowerCase()}`;

const mainNav = [
  { label: 'Dashboard', href: '/portal/dashboard', icon: LayoutDashboard },
  { label: 'Referrals', href: '/portal/referrals', icon: Users },
  { label: 'Payments', href: '/portal/payments', icon: Wallet },
  { label: 'Analytics', href: '/portal/analytics', icon: BarChart3, badge: 'V2' },
  { label: 'Resources', href: '/portal/resources', icon: BookOpen },
  { label: 'Leaderboard', href: '/portal/leaderboard', icon: Trophy },
];

const bottomNav = [
  { label: 'Notifications', href: '/portal/notifications', icon: Bell, badgeCount: AFFILIATE.unreadNotifications },
  { label: 'Settings', href: '/portal/settings', icon: Settings },
];

interface PortalSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function PortalSidebar({ open, onClose }: PortalSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'w-[250px] h-full bg-white border-r border-border flex flex-col overflow-y-auto shrink-0',
        'fixed lg:relative inset-y-0 left-0 z-30',
        'transition-transform duration-200',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      {/* Logo + close */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-border shrink-0">
        <Link href="/portal/dashboard" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-vynt flex items-center justify-center shrink-0">
            <span className="text-white font-extrabold text-xs">V</span>
          </div>
          <div>
            <p className="text-sm font-bold text-text-1 leading-none">VYNT</p>
            <p className="text-[10px] text-text-3 leading-none mt-0.5">Affiliate Dashboard</p>
          </div>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-md text-text-3 hover:bg-surface transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Referral code block */}
      <div className="pt-4">
        <ReferralCodeBlock code={AFFILIATE.code} referralLink={REFERRAL_LINK} />
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 pb-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-text-3 px-3 mb-2">
          Main
        </p>
        <div className="space-y-0.5">
          {mainNav.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-100',
                  isActive
                    ? 'bg-vynt-light text-vynt'
                    : 'text-text-2 hover:bg-surface hover:text-text-1'
                )}
              >
                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} className="shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-gold/15 text-amber">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-border space-y-0.5">
          {bottomNav.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-100',
                  isActive
                    ? 'bg-vynt-light text-vynt'
                    : 'text-text-2 hover:bg-surface hover:text-text-1'
                )}
              >
                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} className="shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badgeCount ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red text-white min-w-[18px] text-center">
                    {item.badgeCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User profile */}
      <div className="border-t border-border px-4 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-vynt flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">{getInitials(AFFILIATE.name)}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-1 truncate">{AFFILIATE.name}</p>
            <p className="text-[11px] text-text-3 truncate">
              {AFFILIATE.type} · {AFFILIATE.campus}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
