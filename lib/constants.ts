// Commission rates — single source of truth
export const COMMISSION = {
  SIGNUP: 500,           // ₦500 per referred signup
  PURCHASE: 2_000,       // ₦2,000 per first purchase
  SELLER_STORE: 1_000,   // ₦1,000 per seller store (5+ listings)
  BUYER_DISCOUNT: 1_000, // ₦1,000 discount coupon for referred buyer
} as const;

export const CAMPUSES = [
  'UNILAG',
  'LASU',
  'Yaba Tech',
  'Babcock',
  'Covenant',
  'Other',
] as const;

export type Campus = (typeof CAMPUSES)[number];

export const ITEMS_PER_PAGE = 10;
