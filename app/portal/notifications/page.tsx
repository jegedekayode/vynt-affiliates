'use client';

import { useState } from 'react';
import {
  UserPlus,
  ShoppingBag,
  Store,
  Banknote,
  Bell,
  Trophy,
} from 'lucide-react';
import PortalHeader from '@/components/portal/PortalHeader';
import NotificationItem from '@/components/portal/NotificationItem';

const notifications = [
  // Unread (first 3)
  {
    id: 'n1',
    icon: Banknote,
    iconBg: 'bg-gold/15',
    iconColor: 'text-amber',
    text: (
      <>
        <span className="font-semibold">₦25,000</span> has been paid to your Zenith Bank account.
        Your March payout is complete.
      </>
    ),
    time: '2 hours ago',
    amount: 'Paid',
    amountColor: 'text-amber',
    unread: true,
  },
  {
    id: 'n2',
    icon: Store,
    iconBg: 'bg-vynt-light',
    iconColor: 'text-vynt',
    text: (
      <>
        <span className="font-semibold">Tochi Ekwueme</span> opened a seller store with 12 listings.
        Seller commission earned.
      </>
    ),
    time: '1 day ago',
    amount: '+₦1,000',
    amountColor: 'text-green',
    unread: true,
  },
  {
    id: 'n3',
    icon: Trophy,
    iconBg: 'bg-gold/15',
    iconColor: 'text-amber',
    text: (
      <>
        You hit <span className="font-semibold">50 signups</span>! You&apos;re officially a top
        performer on the UNILAG campus.
      </>
    ),
    time: '3 days ago',
    amount: undefined,
    amountColor: undefined,
    unread: true,
  },
  // Read
  {
    id: 'n4',
    icon: ShoppingBag,
    iconBg: 'bg-green/10',
    iconColor: 'text-green',
    text: (
      <>
        <span className="font-semibold">Yetunde Olowu</span> made a purchase of ₦38,000 using your
        referral link.
      </>
    ),
    time: '5 days ago',
    amount: '+₦2,000',
    amountColor: 'text-green',
    unread: false,
  },
  {
    id: 'n5',
    icon: UserPlus,
    iconBg: 'bg-blue/10',
    iconColor: 'text-blue',
    text: (
      <>
        <span className="font-semibold">Rashidat Aminu</span> signed up using your referral code{' '}
        <span className="font-semibold">TOMI_UNILAG</span>.
      </>
    ),
    time: '6 days ago',
    amount: '+₦500',
    amountColor: 'text-green',
    unread: false,
  },
  {
    id: 'n6',
    icon: ShoppingBag,
    iconBg: 'bg-green/10',
    iconColor: 'text-green',
    text: (
      <>
        <span className="font-semibold">Emeka Ugwu</span> made a purchase of ₦22,500 using your
        referral link.
      </>
    ),
    time: '1 week ago',
    amount: '+₦2,000',
    amountColor: 'text-green',
    unread: false,
  },
  {
    id: 'n7',
    icon: Bell,
    iconBg: 'bg-surface',
    iconColor: 'text-text-3',
    text: (
      <>
        Programme update: Purchase commission rate remains at{' '}
        <span className="font-semibold">₦2,000</span> per qualifying order through Q2 2026.
      </>
    ),
    time: '2 weeks ago',
    amount: undefined,
    amountColor: undefined,
    unread: false,
  },
  {
    id: 'n8',
    icon: UserPlus,
    iconBg: 'bg-blue/10',
    iconColor: 'text-blue',
    text: (
      <>
        <span className="font-semibold">Boluwatife Ige</span> and{' '}
        <span className="font-semibold">2 others</span> signed up using your code this week.
      </>
    ),
    time: '2 weeks ago',
    amount: '+₦1,500',
    amountColor: 'text-green',
    unread: false,
  },
];

export default function NotificationsPage() {
  const [items] = useState(notifications);
  const unreadCount = items.filter((n) => n.unread).length;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <PortalHeader
        title="Notifications"
        subtitle={
          unreadCount > 0
            ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
            : 'All caught up.'
        }
      />

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {items.map((item) => (
          <NotificationItem
            key={item.id}
            icon={item.icon}
            iconBg={item.iconBg}
            iconColor={item.iconColor}
            text={item.text}
            time={item.time}
            amount={item.amount}
            amountColor={item.amountColor}
            unread={item.unread}
          />
        ))}
      </div>
    </div>
  );
}
