// ── Template User IDs ──
export const TEMPLATE_USER_IDS = [912, 913];

// ── Order Status Constants ──
export const ORDER_SUCCESS_STATUSES = [
  "complete",
  "processing",
  "paid",
] as const;

export const ORDER_PENDING_STATUSES = [
  "pending",
  "pending_payment",
  "new",
] as const;

export const ORDER_FAILED_STATUSES = [
  "canceled",
  "cancelled",
  "closed",
  "failed",
] as const;

export const isOrderSuccess = (status: string) =>
  ORDER_SUCCESS_STATUSES.includes(status.toLowerCase() as any);

export const isOrderFailed = (status: string) =>
  ORDER_FAILED_STATUSES.includes(status.toLowerCase() as any);

export const isOrderPending = (status: string) =>
  ORDER_PENDING_STATUSES.includes(status.toLowerCase() as any);

// ── Polling & Timer Constants ──
export const ORDER_POLLING_INTERVAL_MS = 3000;
export const SMS_COUNTDOWN_SECONDS = 60;

// ── License SKU Suffixes ──
export const PERSONAL_LICENSE_SUFFIX = "-personal";
export const COMMERCIAL_LICENSE_SUFFIX = "-commercial";

export type LicenseType = "personal" | "commercial" | "unknown";

export const parseLicenseSku = (
  sku: string,
): { baseSku: string; licenseType: LicenseType } => {
  const lowerSku = sku.toLowerCase();
  if (lowerSku.endsWith(PERSONAL_LICENSE_SUFFIX)) {
    return {
      baseSku: sku.slice(0, -PERSONAL_LICENSE_SUFFIX.length),
      licenseType: "personal",
    };
  } else if (lowerSku.endsWith(COMMERCIAL_LICENSE_SUFFIX)) {
    return {
      baseSku: sku.slice(0, -COMMERCIAL_LICENSE_SUFFIX.length),
      licenseType: "commercial",
    };
  }
  return { baseSku: sku, licenseType: "unknown" };
};

// ── Pagination ──
export const STORE_PAGE_SIZE = 20;
export const ORDERS_PER_PAGE = 10;
export const RECENT_PROJECTS_COUNT = 6;

// ── Image Encoding ──
export const IMAGE_BASE64_PREFIX = "data:image/jpeg;base64,";

// ── Tutorial Videos ──
export const TUTORIAL_VIDEOS = [
  { title: "Tutorial 1", url: "https://youtu.be/l1EWoGhW5OM", embedId: "l1EWoGhW5OM" },
  { title: "Tutorial 2", url: "https://www.youtube.com/watch?v=qnXMG_Bth08", embedId: "qnXMG_Bth08" },
  { title: "Tutorial 3", url: "https://youtu.be/fmIBBj_WbIA", embedId: "fmIBBj_WbIA" },
  { title: "Tutorial 4", url: "https://youtu.be/dNEkHeq8lLY", embedId: "dNEkHeq8lLY" },
  { title: "Tutorial 5", url: "https://youtu.be/HNk1e8DXXBQ", embedId: "HNk1e8DXXBQ" },
  { title: "Tutorial 6", url: "https://www.youtube.com/watch?v=tH2vzZwLksw", embedId: "tH2vzZwLksw" },
];

export const SHOWCASE_VIDEOS = [
  { title: "Showcase", url: "https://www.youtube.com/watch?v=3is2LjVvd4Y", embedId: "3is2LjVvd4Y" },
];

// ── Credit Packs ──
export const CREDIT_PACKS = [
  { id: 1, credits: 10, priceUSD: 990, amount: 10, price: 9.9, discountPercent: 0, stripeId: "5kQ7sL7PZ8J13t82V9es000" },
  { id: 2, credits: 50, priceUSD: 4490, amount: 50, price: 44.9, discountPercent: 0, stripeId: "fZuaEXeencZhd3IbrFes001" },
  { id: 3, credits: 100, priceUSD: 7990, amount: 100, price: 79.9, discountPercent: 10, stripeId: "cNi4gz9Y7aR90gWgLZes002" },
  { id: 4, credits: 500, priceUSD: 34990, amount: 500, price: 349.9, discountPercent: 15, stripeId: "6oUaEX4DNgbt3t8dzNes003" },
  { id: 5, credits: 1000, priceUSD: 59990, amount: 1000, price: 599.9, discountPercent: 20, stripeId: "fZu4gz0nxe3l9Rw3Zdes004" },
];

export const getStripePaymentLink = (stripeId: string, userId: string | number) =>
  `https://buy.stripe.com/${stripeId}?client_reference_id=${userId}`;
