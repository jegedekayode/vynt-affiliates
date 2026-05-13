import { CAMPUSES } from './constants';
import {
  Affiliate,
  AffiliateFilters,
  DashboardSummary,
  LeaderboardEntry,
  LeaderboardFilters,
  Referral,
  ReferralEvent,
} from './types';

const BASE_URL = process.env.NEXT_PUBLIC_VYNT_API_URL;
const TOKEN = process.env.NEXT_PUBLIC_VYNT_API_TOKEN;

async function fetchAPI(endpoint: string, options?: RequestInit) {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
      ...options?.headers,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  if (!json.status) {
    throw new Error(json.message || 'API request failed');
  }

  return json;
}

function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapAffiliateFromAPI(item: any): Affiliate {
  const totalSignups = item.total_signups ?? 0;
  const orders = item.orders ?? 0;

  return {
    id: item.id,
    userId: item.user.id,
    name:
      [capitalize(item.user.bio?.firstname), capitalize(item.user.bio?.lastname)]
        .filter(Boolean)
        .join(' ') || item.user.username,
    email: item.user.email,
    username: item.user.username,
    code: item.user.referral_code || item.user.username,
    profileImg: item.user.bio?.profileImg || null,
    phone: item.user.bio?.phone || null,
    type: 'vcs' as const,
    campus: null,
    location: item.user.address?.city || null,
    status: 'active' as const,
    dateJoined: '',
    totalSignups,
    totalOrders: orders,
    totalGmv: 0,
    totalSellers: item.total_sellers ?? 0,
    totalEarned: item.total_earnings ?? 0,
    totalPaid: item.total_paid ?? 0,
    pendingBalance: item.pending ?? 0,
    lastActiveDate: item.user.last_login || '',
    lastPaidDate: null,
    conversionRate: totalSignups > 0 ? orders / totalSignups : 0,
    notes: null,
    bankName: item.user.bank?.name || '—',
    accountNumber: item.user.bank?.account_number || '—',
    accountName: item.user.bank?.account_name || '—',
    hasStore: item.user.store?.exists || false,
    isVerified: item.user.is_verified || false,
    city: item.user.address?.city || '—',
    state: item.user.address?.state || '—',
  };
}

async function fetchAllAffiliates(page = 0, size = 100) {
  const json = await fetchAPI(`/commission?page=${page}&size=${size}`);
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    affiliates: (json.data as any[]).map(mapAffiliateFromAPI),
    pagination: json.pagination,
  };
}

export async function getAffiliates(filters?: AffiliateFilters): Promise<Affiliate[]> {
  const { affiliates } = await fetchAllAffiliates();
  let result = [...affiliates];

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (a) => a.name.toLowerCase().includes(q) || a.code.toLowerCase().includes(q)
    );
  }

  return result.sort((a, b) => b.totalEarned - a.totalEarned);
}

export async function getAffiliateSummary(): Promise<DashboardSummary> {
  const { affiliates } = await fetchAllAffiliates();
  return {
    totalAffiliates: affiliates.length,
    totalActive: affiliates.length,
    totalSignups: affiliates.reduce((s, a) => s + a.totalSignups, 0),
    totalOrders: affiliates.reduce((s, a) => s + a.totalOrders, 0),
    totalGmv: 0,
    totalSellers: affiliates.reduce((s, a) => s + a.totalSellers, 0),
    totalEarned: affiliates.reduce((s, a) => s + a.totalEarned, 0),
    totalPaid: affiliates.reduce((s, a) => s + a.totalPaid, 0),
    avgConversionRate:
      affiliates.length > 0
        ? affiliates.reduce((s, a) => s + a.conversionRate, 0) / affiliates.length
        : 0,
    avgEarningsPerAffiliate:
      affiliates.length > 0
        ? affiliates.reduce((s, a) => s + a.totalEarned, 0) / affiliates.length
        : 0,
    signupsByWeek: [],
    gmvByWeek: [],
    commissionsByWeek: [],
  };
}

export async function getAffiliateById(id: string): Promise<Affiliate | undefined> {
  try {
    const json = await fetchAPI(`/commission/${id}`);
    return mapAffiliateFromAPI(json.data);
  } catch {
    return undefined;
  }
}

// Not available from API — returns empty arrays so existing empty-state UI renders
export async function getAffiliateReferrals(_affiliateId: string): Promise<Referral[]> {
  return [];
}

export async function getAffiliateEvents(_affiliateId: string): Promise<ReferralEvent[]> {
  return [];
}

export async function getRecentEvents(_limit = 10): Promise<ReferralEvent[]> {
  return [];
}

export async function getTopAffiliates(limit = 5): Promise<Affiliate[]> {
  const { affiliates } = await fetchAllAffiliates();
  return [...affiliates].sort((a, b) => b.totalEarned - a.totalEarned).slice(0, limit);
}

export async function getLeaderboard(filters?: LeaderboardFilters): Promise<LeaderboardEntry[]> {
  const { affiliates } = await fetchAllAffiliates();
  const sorted = [...affiliates].sort((a, b) => b.totalEarned - a.totalEarned);

  let entries: LeaderboardEntry[] = sorted.map((a, index) => ({
    rank: index + 1,
    id: a.id,
    name: a.name,
    campus: a.location || '—',
    totalSignups: a.totalSignups,
    totalSellers: a.totalSellers,
    totalEarned: a.totalEarned,
  }));

  // Campus filter has no effect since campus data isn't in the API —
  // kept for interface compatibility
  if (filters?.campus && filters.campus !== 'all') {
    entries = entries.map((e, i) => ({ ...e, rank: i + 1 }));
  }

  return entries;
}

export function getAllCampuses(): string[] {
  return [...CAMPUSES];
}

// Stub — adding affiliates requires a separate onboarding API not yet available
export async function addAffiliate(affiliate: Affiliate): Promise<Affiliate> {
  return affiliate;
}

// Local-state helper only — call this after a successful processPayout to
// update component state without a full refetch
export async function updateAffiliate(
  _id: string,
  _updates: Partial<Affiliate>
): Promise<Affiliate | undefined> {
  return undefined;
}

export async function processPayout(
  commissionId: string,
  userId: string,
  amount: number
): Promise<unknown> {
  const json = await fetchAPI('/commission', {
    method: 'POST',
    body: JSON.stringify({
      id: commissionId,
      accountId: userId,
      amountPaid: amount,
    }),
  });
  return json;
}
