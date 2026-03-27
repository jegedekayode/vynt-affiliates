'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Trophy,
  UserCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    section: 'Overview',
    items: [
      { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    ],
  },
  {
    section: 'Management',
    items: [
      { label: 'Affiliates', href: '/affiliates', icon: Users },
      { label: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    ],
  },
  {
    section: 'Account',
    items: [
      { label: 'My Dashboard', href: '/my-dashboard', icon: UserCircle },
      { label: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-white border-r border-border flex flex-col transition-all duration-200',
        collapsed ? 'w-[72px]' : 'w-[240px]'
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-5 border-b border-border shrink-0">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-vynt flex items-center justify-center">
            <span className="text-white font-bold text-sm font-[var(--font-display)]">V</span>
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-text-1 font-[var(--font-display)]">
              VYNT
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navItems.map((section) => (
          <div key={section.section} className="mb-6">
            {!collapsed && (
              <p className="text-[11px] font-semibold uppercase tracking-wider text-text-3 px-3 mb-2">
                {section.section}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
                      isActive
                        ? 'bg-vynt-light text-vynt'
                        : 'text-text-2 hover:bg-surface hover:text-text-1',
                      collapsed && 'justify-center px-0'
                    )}
                  >
                    <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-border p-3 shrink-0">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-text-3 hover:bg-surface hover:text-text-2 transition-colors duration-150"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
