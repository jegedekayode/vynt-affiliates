import { affiliates as initialAffiliates } from './mock-data/affiliates';
import { referrals, referralEvents } from './mock-data/referrals';
import { dashboardSummary } from './mock-data/summary';
import { leaderboardData } from './mock-data/leaderboard';
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

// Mutable copy for in-session adds/updates
let affiliates = [...initialAffiliates];

const delay = (ms = 50) => new Promise((r) => setTimeout(r, ms));

export async function getAffiliates(filters?: AffiliateFilters): Promise<Affiliate[]> {
  await delay();
  let result = [...affiliates];

  if (filters) {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.code.toLowerCase().includes(q)
      );
    }
    if (filters.type && filters.type !== 'all') {
      result = result.filter((a) => a.type === filters.type);
    }
    if (filters.status && filters.status !== 'all') {
      result = result.filter((a) => a.status === filters.status);
    }
    if (filters.campus && filters.campus !== 'all') {
      result = result.filter((a) => a.campus === filters.campus);
    }
  }

  return result.sort((a, b) => b.totalEarned - a.totalEarned);
}

export async function getAffiliateSummary(): Promise<DashboardSummary> {
  await delay();
  return dashboardSummary;
}

export async function getAffiliateById(id: string): Promise<Affiliate | undefined> {
  await delay();
  return affiliates.find((a) => a.id === id);
}

export async function getAffiliateReferrals(affiliateId: string): Promise<Referral[]> {
  await delay();
  return referrals.filter((r) => r.affiliateId === affiliateId);
}

export async function getAffiliateEvents(affiliateId: string): Promise<ReferralEvent[]> {
  await delay();
  return referralEvents.filter((e) => e.affiliateId === affiliateId);
}

export async function getRecentEvents(limit = 10): Promise<ReferralEvent[]> {
  await delay();
  return referralEvents.slice(0, limit);
}

export async function getTopAffiliates(limit = 5): Promise<Affiliate[]> {
  await delay();
  return [...affiliates]
    .filter((a) => a.status === 'active')
    .sort((a, b) => b.totalEarned - a.totalEarned)
    .slice(0, limit);
}

export async function getLeaderboard(filters?: LeaderboardFilters): Promise<LeaderboardEntry[]> {
  await delay();
  let result = [...leaderboardData];

  if (filters?.campus && filters.campus !== 'all') {
    result = result.filter((e) => e.campus === filters.campus);
    result = result.map((e, i) => ({ ...e, rank: i + 1 }));
  }

  return result;
}

export function getAllCampuses(): string[] {
  return [...CAMPUSES];
}

export async function addAffiliate(affiliate: Affiliate): Promise<Affiliate> {
  await delay();
  affiliates = [affiliate, ...affiliates];
  return affiliate;
}

export async function updateAffiliate(id: string, updates: Partial<Affiliate>): Promise<Affiliate | undefined> {
  await delay();
  const idx = affiliates.findIndex((a) => a.id === id);
  if (idx === -1) return undefined;
  affiliates[idx] = { ...affiliates[idx], ...updates };
  return affiliates[idx];
}
