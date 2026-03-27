import { Referral, ReferralEvent } from '../types';
import { COMMISSION } from '../constants';

const names = [
  'Adeola Komolafe', 'Blessing Okafor', 'Chidera Nnaji', 'Doyin Alade',
  'Emeka Ugwu', 'Funmilayo Balogun', 'Grace Nwachukwu', 'Hassan Garba',
  'Ifeoma Chukwu', 'Jumoke Adebiyi', 'Kelechi Obi', 'Lateefah Mustapha',
  'Maryam Ibrahim', 'Nkem Onyeka', 'Olayinka Salami', 'Patience Effiong',
  'Queen Omoruyi', 'Rashidat Aminu', 'Sade Owolabi', 'Tochi Ekwueme',
  'Uche Okadigbo', 'Victoria Edoho', 'Wuraola Idowu', 'Xander Bassey',
  'Yetunde Olowu', 'Zainab Suleiman', 'Adebayo Olufemi', 'Boluwatife Ige',
  'Chisom Anyanwu', 'Dayo Ajayi', 'Esther Udoh', 'Farouq Abubakar',
  'Gbemisola Oni', 'Halima Dikko', 'Ify Ezeobi', 'Jude Akpan',
  'Khadijat Lawal', 'Lola Coker', 'Musa Danjuma', 'Nneka Agu',
  'Olamide Fashanu', 'Priscilla Eneh', 'Rilwan Balogun', 'Stella Uko',
  'Tobi Adeleke', 'Uchechi Nwogu', 'Vivian Okoh', 'Wasiu Alabi',
  'Yusuf Jimoh', 'Zikora Madu', 'Amara Osei', 'Bankole Adeniyi',
  'Cynthia Ebere', 'Deborah Akinsola', 'Emmanuel Obasi', 'Folasade Aina',
  'Gloria Etim', 'Hadiza Kano', 'Ibrahim Sagir', 'Janet Okorie',
];

const affiliateIds = [
  'aff_001', 'aff_002', 'aff_003', 'aff_004', 'aff_005',
  'aff_006', 'aff_007', 'aff_008', 'aff_009', 'aff_010',
  'aff_011', 'aff_012', 'aff_013', 'aff_014', 'aff_015',
  'aff_016', 'aff_017', 'aff_018', 'aff_019', 'aff_020',
  'aff_021', 'aff_022', 'aff_023', 'aff_024',
];

const weights = [12, 10, 9, 8, 7, 6, 4, 5, 3, 4, 14, 11, 8, 6, 5, 3, 4, 2, 11, 8, 6, 4, 2, 1];

// Seeded PRNG for deterministic mock data (avoids hydration mismatch)
function createSeededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

const seeded = createSeededRandom(42);

function seededDate(start: string, end: string): string {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  return new Date(s + seeded() * (e - s)).toISOString();
}

function generateReferrals(): Referral[] {
  const result: Referral[] = [];
  let id = 1;
  let nameIdx = 0;

  for (let i = 0; i < affiliateIds.length; i++) {
    const count = weights[i];
    for (let j = 0; j < count; j++) {
      const name = names[nameIdx % names.length];
      nameIdx++;
      const rand = seeded();
      const status: Referral['status'] = rand < 0.15 ? 'seller' : rand < 0.40 ? 'purchased' : 'signed_up';
      const hasPurchased = status === 'purchased' || status === 'seller';
      const orderAmount = hasPurchased ? Math.round((8000 + seeded() * 45000) / 500) * 500 : null;
      const dateReferred = seededDate('2025-12-20', '2026-03-25');
      const orderDate = hasPurchased ? seededDate(dateReferred, '2026-03-26') : null;

      result.push({
        id: `ref_${String(id).padStart(3, '0')}`,
        affiliateId: affiliateIds[i],
        userId: `usr_${200 + id}`,
        userName: name,
        dateReferred,
        status,
        orderAmount,
        orderDate,
        isSeller: status === 'seller',
        listingCount: status === 'seller' ? Math.floor(seeded() * 15) + 5 : 0,
      });
      id++;
    }
  }

  return result.sort((a, b) => new Date(b.dateReferred).getTime() - new Date(a.dateReferred).getTime());
}

export const referrals: Referral[] = generateReferrals();

function generateEvents(): ReferralEvent[] {
  const events: ReferralEvent[] = [];
  let id = 1;

  for (const ref of referrals) {
    events.push({
      id: `evt_${String(id).padStart(3, '0')}`,
      affiliateId: ref.affiliateId,
      referredUserId: ref.userId,
      referredUserName: ref.userName,
      eventType: 'signup',
      amount: COMMISSION.SIGNUP,
      orderAmount: null,
      createdAt: ref.dateReferred,
    });
    id++;

    if (ref.status === 'purchased' || ref.status === 'seller') {
      events.push({
        id: `evt_${String(id).padStart(3, '0')}`,
        affiliateId: ref.affiliateId,
        referredUserId: ref.userId,
        referredUserName: ref.userName,
        eventType: 'purchase',
        amount: COMMISSION.PURCHASE,
        orderAmount: ref.orderAmount,
        createdAt: ref.orderDate!,
      });
      id++;
    }

    if (ref.status === 'seller') {
      events.push({
        id: `evt_${String(id).padStart(3, '0')}`,
        affiliateId: ref.affiliateId,
        referredUserId: ref.userId,
        referredUserName: ref.userName,
        eventType: 'seller_store',
        amount: COMMISSION.SELLER_STORE,
        orderAmount: null,
        createdAt: seededDate(ref.orderDate || ref.dateReferred, '2026-03-26'),
      });
      id++;
    }
  }

  return events.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export const referralEvents: ReferralEvent[] = generateEvents();
