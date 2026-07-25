/**
 * The plan catalogue — one source of truth for pricing, quotas and storage.
 *
 * Both the pricing page and the server-side upgrade endpoint read from here,
 * so a plan can never be advertised with one scan limit and provisioned with
 * another. The server writes these numbers into `subscriptions`; the database
 * is what actually enforces them.
 */

const MB = 1024 * 1024;
const GB = 1024 * MB;

export const PLANS = {
  free: {
    id: "free",
    name: "Free",
    priceCents: 0,
    priceLabel: "$0",
    cadence: "forever",
    scanLimit: 3,
    /** null = a lifetime allowance that never resets */
    periodDays: null,
    scanLimitLabel: "3 lifetime scans",
    storageBytes: 50 * MB,
    storageLabel: "50 MB",
    tagline: "See what AI reads on your site.",
    features: [
      "All 8 AI-readiness checks",
      "Full scan report with evidence",
      "Prioritised fix list",
      "Scan history",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceCents: 1500,
    priceLabel: "$15",
    cadence: "per month",
    scanLimit: 30,
    periodDays: 7,
    scanLimitLabel: "30 scans per week",
    storageBytes: 2 * GB,
    storageLabel: "2 GB",
    tagline: "Keep every site you own readable.",
    recommended: true,
    features: [
      "Everything in Free",
      "30 scans every week",
      "Track scores over time",
      "Re-scan after each fix",
      "Email support",
    ],
  },
  ultimate: {
    id: "ultimate",
    name: "Ultimate",
    priceCents: 7000,
    priceLabel: "$70",
    cadence: "per month",
    scanLimit: 100,
    periodDays: 7,
    scanLimitLabel: "100 scans per week",
    storageBytes: 10 * GB,
    storageLabel: "10 GB",
    tagline: "For agencies and large portfolios.",
    features: [
      "Everything in Pro",
      "100 scans every week",
      "Bulk portfolio scanning",
      "Full scan history retention",
      "Priority support",
    ],
  },
};

/** Display order, cheapest first. */
export const PLAN_ORDER = ["free", "pro", "ultimate"];

/** Tiers that can be purchased. */
export const PAID_TIERS = ["pro", "ultimate"];

/** The plan a brand-new account starts on. */
export const DEFAULT_TIER = "free";

export function getPlan(tier) {
  return PLANS[tier] || PLANS[DEFAULT_TIER];
}

export function isPaidTier(tier) {
  return PAID_TIERS.includes(tier);
}

/**
 * Human-readable byte size. Uses one decimal below 10 units so a nearly-empty
 * account reads "0.4 MB" rather than the uselessly rounded "0 MB".
 */
export function formatBytes(bytes) {
  const n = Number(bytes) || 0;
  if (n < 1024) return `${n} B`;
  if (n < MB) {
    const kb = n / 1024;
    return `${kb < 10 ? kb.toFixed(1) : Math.round(kb)} KB`;
  }
  if (n < GB) {
    const mb = n / MB;
    return `${mb < 10 ? mb.toFixed(1) : Math.round(mb)} MB`;
  }
  const gb = n / GB;
  return `${gb < 10 ? gb.toFixed(1) : Math.round(gb)} GB`;
}
