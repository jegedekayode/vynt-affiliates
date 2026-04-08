import {
  MessageCircle,
  Image,
  FileText,
  HelpCircle,
  Target,
  Calculator,
} from 'lucide-react';
import PortalHeader from '@/components/portal/PortalHeader';
import ResourceCard from '@/components/portal/ResourceCard';

const resources = [
  {
    icon: MessageCircle,
    title: 'WhatsApp Messages',
    description: 'Ready-to-send messages for WhatsApp groups and DMs to drive signups and purchases.',
  },
  {
    icon: Image,
    title: 'Shareable Graphics',
    description: 'Branded promo images and stories optimised for Instagram, WhatsApp status, and Twitter.',
  },
  {
    icon: FileText,
    title: 'Affiliate Guide',
    description: 'Everything you need to know — commission rates, payout schedule, and best practices.',
  },
  {
    icon: HelpCircle,
    title: 'FAQ',
    description: 'Answers to common questions about how the programme works and what your referrals get.',
  },
  {
    icon: Target,
    title: 'Conversion Tips',
    description: 'Proven tactics for turning signups into purchases and buyers into active sellers.',
  },
  {
    icon: Calculator,
    title: 'Earnings Calculator',
    description: 'Estimate your monthly earnings based on your signup, purchase, and seller targets.',
  },
];

export default function ResourcesPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <PortalHeader
        title="Resources"
        subtitle="Templates, guides, and tools to grow your referrals."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {resources.map((r) => (
          <ResourceCard
            key={r.title}
            icon={r.icon}
            title={r.title}
            description={r.description}
          />
        ))}
      </div>
    </div>
  );
}
