export interface Affiliate {
  id: string;
  userId: string;
  name: string;
  code: string;
  type: 'vcs' | 'community' | 'individual';
  campus: string | null;
  location: string | null;
  status: 'active' | 'dormant' | 'suspended';
  dateJoined: string;
  totalSignups: number;
  totalOrders: number;
  totalGmv: number;
  totalSellers: number;
  totalEarned: number;
  totalPaid: number;
  pendingBalance: number;
  lastActiveDate: string;
  conversionRate: number;
  notes: string | null;
}

export interface Referral {
  id: string;
  affiliateId: string;
  userId: string;
  userName: string;
  dateReferred: string;
  status: 'signed_up' | 'purchased' | 'seller';
  orderAmount: number | null;
  orderDate: string | null;
  isSeller: boolean;
  listingCount: number;
}

export interface ReferralEvent {
  id: string;
  affiliateId: string;
  referredUserId: string;
  referredUserName: string;
  eventType: 'signup' | 'purchase' | 'seller_store';
  amount: number;
  orderAmount: number | null;
  createdAt: string;
}

export interface DashboardSummary {
  totalAffiliates: number;
  totalActive: number;
  totalSignups: number;
  totalOrders: number;
  totalGmv: number;
  totalSellers: number;
  totalEarned: number;
  totalPaid: number;
  avgConversionRate: number;
  avgEarningsPerAffiliate: number;
  signupsByWeek: { week: string; count: number }[];
  gmvByWeek: { week: string; amount: number }[];
  commissionsByWeek: { week: string; amount: number }[];
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  campus: string;
  totalSignups: number;
  totalSellers: number;
  totalEarned: number;
}

export type AffiliateType = Affiliate['type'];
export type AffiliateStatus = Affiliate['status'];

export interface AffiliateFilters {
  search?: string;
  type?: AffiliateType | 'all';
  status?: AffiliateStatus | 'all';
  campus?: string | 'all';
  period?: 'today' | 'week' | 'month' | 'all';
}

export interface DateRange {
  start: string;
  end: string;
}

export interface LeaderboardFilters {
  campus?: string | 'all';
  period?: 'week' | 'month' | 'all';
}
