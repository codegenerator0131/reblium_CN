// Static mock data for all tRPC endpoints
// This replaces the server database with in-memory data

const now = new Date();
const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

// ============ Mock User ============
export const mockUser = {
  id: 1,
  openId: "demo-user-001",
  name: "Demo User",
  email: "demo@reblium.com",
  loginMethod: "email",
  bio: "Avatar creator and 3D enthusiast",
  role: "user" as const,
  creditBalance: 500,
  createdAt: twoMonthsAgo,
  updatedAt: now,
  lastSignedIn: now,
};

// ============ Store Items ============
// Matches the actual server database items — uses local images
const IMG = "/assets/images";
const storeItemBase = { thumbnailKey: null as string | null, description: "", descriptionCn: "", commercialPriceUSD: "0", commercialPriceCNY: "0", polyCount: 0, textureTypes: '["Diffuse","Normal"]', fileFormat: "FBX", fileSize: 30, artistName: "Andre Ferwerda", image2Url: null as string | null, image2Key: null as string | null, image3Url: null as string | null, image3Key: null as string | null, image4Url: null as string | null, image4Key: null as string | null, createdAt: oneMonthAgo };

export const mockStoreItems = [
  // Clothing (9 items)
  { ...storeItemBase, id: 1, name: "Female Fantasy Outfit 1", nameCn: "女性奇幻装1", category: "clothing", thumbnailUrl: `${IMG}/F_Fant1_front.jpg`, image2Url: `${IMG}/F_Fant1_quarter.jpg`, image3Url: `${IMG}/F_Fant1_back.jpg`, personalPriceUSD: "5.00", personalPriceCNY: "36.00", commercialPriceUSD: "25.00", commercialPriceCNY: "180.00" },
  { ...storeItemBase, id: 2, name: "Dark Lady Outfit", nameCn: "暗黑女士装", category: "clothing", thumbnailUrl: `${IMG}/darklady_front.jpg`, image2Url: `${IMG}/darklady_quarter.jpg`, image3Url: `${IMG}/darklady_back.jpg`, personalPriceUSD: "5.00", personalPriceCNY: "36.00", commercialPriceUSD: "25.00", commercialPriceCNY: "180.00" },
  { ...storeItemBase, id: 3, name: "Female Knight Armor", nameCn: "女骑士铠甲", category: "clothing", thumbnailUrl: `${IMG}/femaleknight_front.jpg`, image2Url: `${IMG}/femaleknight_quarter.jpg`, image3Url: `${IMG}/femaleknight_back.jpg`, personalPriceUSD: "8.00", personalPriceCNY: "58.00", commercialPriceUSD: "40.00", commercialPriceCNY: "288.00" },
  { ...storeItemBase, id: 4, name: "Catwoman Suit", nameCn: "猫女装", category: "clothing", thumbnailUrl: `${IMG}/catwoman_front.jpg`, image2Url: `${IMG}/catwoman_quarter.jpg`, image3Url: `${IMG}/catwoman_back.jpg`, personalPriceUSD: "6.00", personalPriceCNY: "43.00", commercialPriceUSD: "30.00", commercialPriceCNY: "216.00" },
  { ...storeItemBase, id: 5, name: "Warrior Armor", nameCn: "战士铠甲", category: "clothing", thumbnailUrl: `${IMG}/waarior_front.jpg`, image2Url: `${IMG}/waarior_quarter.jpg`, image3Url: `${IMG}/waarior_back.jpg`, personalPriceUSD: "8.00", personalPriceCNY: "58.00", commercialPriceUSD: "40.00", commercialPriceCNY: "288.00" },
  { ...storeItemBase, id: 6, name: "Ninja Girl Outfit", nameCn: "忍者少女装", category: "clothing", thumbnailUrl: `${IMG}/ninjagirl_front.jpg`, image2Url: `${IMG}/ninjagirl_quarter.jpg`, image3Url: `${IMG}/ninjagirl_back.jpg`, personalPriceUSD: "5.00", personalPriceCNY: "36.00", commercialPriceUSD: "25.00", commercialPriceCNY: "180.00" },
  { ...storeItemBase, id: 7, name: "Casual Girl Outfit", nameCn: "休闲女孩装", category: "clothing", thumbnailUrl: `${IMG}/girl_front.jpg`, image2Url: `${IMG}/girl_quarter.jpg`, image3Url: `${IMG}/girl_back.jpg`, personalPriceUSD: "4.00", personalPriceCNY: "29.00", commercialPriceUSD: "20.00", commercialPriceCNY: "144.00" },
  { ...storeItemBase, id: 8, name: "Dark Knight Armor", nameCn: "暗黑骑士铠甲", category: "clothing", thumbnailUrl: `${IMG}/darkknight_front.jpg`, image2Url: `${IMG}/darkknight_quarter.jpg`, image3Url: `${IMG}/darkknight_back.jpg`, personalPriceUSD: "9.00", personalPriceCNY: "65.00", commercialPriceUSD: "45.00", commercialPriceCNY: "324.00" },
  { ...storeItemBase, id: 9, name: "Male Fantasy Outfit 1", nameCn: "男性奇幻装1", category: "clothing", thumbnailUrl: `${IMG}/M_Fant1_front.jpg`, image2Url: `${IMG}/M_Fant1_quarter.jpg`, image3Url: `${IMG}/M_Fant1_back.jpg`, personalPriceUSD: "5.00", personalPriceCNY: "36.00", commercialPriceUSD: "25.00", commercialPriceCNY: "180.00" },

  // Fantasy (4 items)
  { ...storeItemBase, id: 10, name: "Demon Character", nameCn: "恶魔角色", category: "fantasy", thumbnailUrl: `${IMG}/demon_front.jpg`, image2Url: `${IMG}/demon_quarter.jpg`, image3Url: `${IMG}/demon_back.jpg`, personalPriceUSD: "10.00", personalPriceCNY: "72.00", commercialPriceUSD: "50.00", commercialPriceCNY: "360.00" },
  { ...storeItemBase, id: 11, name: "Swamp Monster", nameCn: "沼泽怪物", category: "fantasy", thumbnailUrl: `${IMG}/swampmonster_front.jpg`, image2Url: `${IMG}/swampmonster_quarter.jpg`, image3Url: `${IMG}/swampmonster_back.jpg`, personalPriceUSD: "10.00", personalPriceCNY: "72.00", commercialPriceUSD: "50.00", commercialPriceCNY: "360.00" },
  { ...storeItemBase, id: 12, name: "Crab Creature", nameCn: "螃蟹怪物", category: "fantasy", thumbnailUrl: `${IMG}/crab_front.jpg`, image2Url: `${IMG}/crab_quarter.jpg`, image3Url: `${IMG}/crab_back.jpg`, personalPriceUSD: "9.00", personalPriceCNY: "65.00", commercialPriceUSD: "45.00", commercialPriceCNY: "324.00" },
  { ...storeItemBase, id: 13, name: "Dracula Character", nameCn: "吸血鬼角色", category: "fantasy", thumbnailUrl: `${IMG}/dracula_front.jpg`, image2Url: `${IMG}/dracula_quarter.jpg`, image3Url: `${IMG}/dracula_back.jpg`, personalPriceUSD: "8.00", personalPriceCNY: "58.00", commercialPriceUSD: "40.00", commercialPriceCNY: "288.00" },

  // Sci-Fi (4 items)
  { ...storeItemBase, id: 14, name: "Female Sci-Fi Suit 1", nameCn: "女性科幻战甲1", category: "sci-fi", thumbnailUrl: `${IMG}/F_SciFi_1_front.jpg`, image2Url: `${IMG}/F_SciFi_1_quarter.jpg`, image3Url: `${IMG}/F_SciFi_1_back.jpg`, personalPriceUSD: "7.00", personalPriceCNY: "50.00", commercialPriceUSD: "35.00", commercialPriceCNY: "252.00" },
  { ...storeItemBase, id: 15, name: "Female Sci-Fi Suit 2", nameCn: "女性科幻战甲2", category: "sci-fi", thumbnailUrl: `${IMG}/F_SciFi_2_front.jpg`, image2Url: `${IMG}/F_SciFi_2_quarter.jpg`, image3Url: `${IMG}/F_SciFi_2_back.jpg`, personalPriceUSD: "7.00", personalPriceCNY: "50.00", commercialPriceUSD: "35.00", commercialPriceCNY: "252.00" },
  { ...storeItemBase, id: 16, name: "Male Sci-Fi Suit 1", nameCn: "男性科幻战甲1", category: "sci-fi", thumbnailUrl: `${IMG}/M_SciFi_1_front.jpg`, image2Url: `${IMG}/M_SciFi_1_quarter.jpg`, image3Url: `${IMG}/M_SciFi_1_back.jpg`, personalPriceUSD: "7.00", personalPriceCNY: "50.00", commercialPriceUSD: "35.00", commercialPriceCNY: "252.00" },
  { ...storeItemBase, id: 17, name: "Mech Suit", nameCn: "机甲", category: "sci-fi", thumbnailUrl: `${IMG}/Mech_front.jpg`, image2Url: `${IMG}/Mech_quarter.jpg`, image3Url: `${IMG}/Mech_back.jpg`, personalPriceUSD: "15.00", personalPriceCNY: "108.00", commercialPriceUSD: "75.00", commercialPriceCNY: "540.00" },
];

// Helper to get store items grouped by category (matches server store.listItems return)
export function getStoreItemsByCategory() {
  const categories = ["clothing", "fantasy", "sci-fi"];
  return categories.map(cat => ({
    name: cat,
    items: mockStoreItems.filter(item => item.category === cat),
  }));
}

// ============ Avatar Projects ============
export const mockAvatarProjects: Array<{
  id: number;
  userId: number;
  name: string;
  thumbnailUrl: string | null;
  thumbnailKey: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}> = [
  { id: 1, userId: 1, name: "My First Avatar", thumbnailUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar1", thumbnailKey: "projects/avatar1", isPublished: false, createdAt: oneMonthAgo, updatedAt: now },
  { id: 2, userId: 1, name: "Business Avatar", thumbnailUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar2", thumbnailKey: "projects/avatar2", isPublished: true, createdAt: twoMonthsAgo, updatedAt: oneMonthAgo },
  { id: 3, userId: 1, name: "Gaming Character", thumbnailUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar3", thumbnailKey: "projects/avatar3", isPublished: false, createdAt: oneMonthAgo, updatedAt: oneMonthAgo },
];

// ============ Templates ============
export const mockTemplates = [
  { id: 1, name: "Professional Female", thumbnailUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=female1", thumbnailKey: "templates/female1.svg", description: "Professional female avatar template", createdAt: twoMonthsAgo },
  { id: 2, name: "Professional Male", thumbnailUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=male1", thumbnailKey: "templates/male1.svg", description: "Professional male avatar template", createdAt: twoMonthsAgo },
  { id: 3, name: "Casual Female", thumbnailUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=female2", thumbnailKey: "templates/female2.svg", description: "Casual female avatar template", createdAt: twoMonthsAgo },
  { id: 4, name: "Casual Male", thumbnailUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=male2", thumbnailKey: "templates/male2.svg", description: "Casual male avatar template", createdAt: twoMonthsAgo },
  { id: 5, name: "Business Female", thumbnailUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=female3", thumbnailKey: "templates/female3.svg", description: "Business female avatar template", createdAt: twoMonthsAgo },
  { id: 6, name: "Business Male", thumbnailUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=male3", thumbnailKey: "templates/male3.svg", description: "Business male avatar template", createdAt: twoMonthsAgo },
  { id: 7, name: "Creative Female", thumbnailUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=female4", thumbnailKey: "templates/female4.svg", description: "Creative female avatar template", createdAt: twoMonthsAgo },
  { id: 8, name: "Creative Male", thumbnailUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=male4", thumbnailKey: "templates/male4.svg", description: "Creative male avatar template", createdAt: twoMonthsAgo },
  { id: 9, name: "Athletic Female", thumbnailUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=female5", thumbnailKey: "templates/female5.svg", description: "Athletic female avatar template", createdAt: twoMonthsAgo },
  { id: 10, name: "Athletic Male", thumbnailUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=male5", thumbnailKey: "templates/male5.svg", description: "Athletic male avatar template", createdAt: twoMonthsAgo },
  { id: 11, name: "Elegant Female", thumbnailUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=female6", thumbnailKey: "templates/female6.svg", description: "Elegant female avatar template", createdAt: twoMonthsAgo },
  { id: 12, name: "Elegant Male", thumbnailUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=male6", thumbnailKey: "templates/male6.svg", description: "Elegant male avatar template", createdAt: twoMonthsAgo },
];

// ============ Credit Packs ============
export const mockCreditPacks = [
  { id: 1, credits: 10, priceUSD: 990, discountPercent: 0, isActive: true, createdAt: twoMonthsAgo },
  { id: 2, credits: 50, priceUSD: 4490, discountPercent: 10, isActive: true, createdAt: twoMonthsAgo },
  { id: 3, credits: 100, priceUSD: 7990, discountPercent: 20, isActive: true, createdAt: twoMonthsAgo },
  { id: 4, credits: 500, priceUSD: 34990, discountPercent: 30, isActive: true, createdAt: twoMonthsAgo },
  { id: 5, credits: 1000, priceUSD: 59990, discountPercent: 40, isActive: true, createdAt: twoMonthsAgo },
];

// ============ Credit Transactions ============
export const mockCreditTransactions = [
  { id: 1, userId: 1, type: "purchase" as const, amount: 100, balanceAfter: 500, description: "Purchased 100 credits", relatedId: null, createdAt: oneMonthAgo },
  { id: 2, userId: 1, type: "usage" as const, amount: -15, balanceAfter: 485, description: "Exported avatar as FBX", relatedId: 1, createdAt: oneMonthAgo },
  { id: 3, userId: 1, type: "purchase" as const, amount: 50, balanceAfter: 535, description: "Purchased 50 credits", relatedId: null, createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000) },
];

// ============ Credit Purchases ============
export const mockCreditPurchases = [
  { id: 1, userId: 1, creditPackId: 3, credits: 100, amountUSD: 7990, paymentMethod: "alipay", paymentStatus: "completed" as const, transactionId: "TXN-001-DEMO", createdAt: oneMonthAgo },
  { id: 2, userId: 1, creditPackId: 2, credits: 50, amountUSD: 4490, paymentMethod: "wechat", paymentStatus: "completed" as const, transactionId: "TXN-002-DEMO", createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000) },
];

// ============ Licenses ============
export const mockLicenses = [
  { id: 1, userId: 1, licenseKey: "RB-DEMO-001-PERSONAL", licenseType: "Personal License", status: "active" as const, expiresAt: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000), createdAt: oneMonthAgo },
  { id: 2, userId: 1, licenseKey: "RB-DEMO-002-COMMERCIAL", licenseType: "Commercial License", status: "active" as const, expiresAt: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000), createdAt: twoMonthsAgo },
];

// ============ Software Versions ============
export const mockSoftwareVersions = [
  { id: 1, version: "2025.3.0", displayName: "Genji Studio 2025.3", description: "Latest release with new features", releaseNotes: "- New avatar customization options\n- Performance improvements\n- Bug fixes", downloadUrl: "#", fileSize: 250, isLatest: true, releaseDate: oneMonthAgo, createdAt: oneMonthAgo },
  { id: 2, version: "2025.2.0", displayName: "Genji Studio 2025.2", description: "Feature update", releaseNotes: "- Added fantasy pack support\n- Improved animation system\n- UI enhancements", downloadUrl: "#", fileSize: 240, isLatest: false, releaseDate: twoMonthsAgo, createdAt: twoMonthsAgo },
  { id: 3, version: "2025.1.0", displayName: "Genji Studio 2025.1", description: "Initial 2025 release", releaseNotes: "- New store interface\n- Credit system\n- Multi-language support", downloadUrl: "#", fileSize: 230, isLatest: false, releaseDate: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000), createdAt: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) },
];

// ============ SDKs ============
export const mockSDKs = [
  { id: 1, name: "Genji SDK for Unity", engine: "Unity", version: "1.2.0", description: "Full avatar integration for Unity projects", downloadUrl: "#", documentationUrl: "#", logoUrl: null, fileSize: 45, sortOrder: 1, releaseDate: oneMonthAgo, createdAt: oneMonthAgo, updatedAt: oneMonthAgo },
  { id: 2, name: "Genji SDK for Unreal", engine: "Unreal", version: "1.1.0", description: "Full avatar integration for Unreal Engine", downloadUrl: "#", documentationUrl: "#", logoUrl: null, fileSize: 60, sortOrder: 2, releaseDate: oneMonthAgo, createdAt: oneMonthAgo, updatedAt: oneMonthAgo },
  { id: 3, name: "Genji Web SDK", engine: "Web", version: "2.0.0", description: "JavaScript/TypeScript SDK for web applications", downloadUrl: "#", documentationUrl: "#", logoUrl: null, fileSize: 5, sortOrder: 3, releaseDate: oneMonthAgo, createdAt: oneMonthAgo, updatedAt: oneMonthAgo },
];

// ============ Poll ============
export const mockPoll = {
  id: 1,
  question: "What avatar pack would you like to see next?",
  description: "Help us decide what to build next!",
  isActive: true,
  createdAt: oneMonthAgo,
  updatedAt: oneMonthAgo,
  options: [
    { id: 1, pollId: 1, option: "Medieval Fantasy Pack", voteCount: 42, createdAt: oneMonthAgo },
    { id: 2, pollId: 1, option: "Cyberpunk Pack", voteCount: 38, createdAt: oneMonthAgo },
    { id: 3, pollId: 1, option: "Anime Style Pack", voteCount: 55, createdAt: oneMonthAgo },
    { id: 4, pollId: 1, option: "Historical Characters Pack", voteCount: 21, createdAt: oneMonthAgo },
  ],
};

// ============ Cart Items ============
export const mockCartItems: Array<{
  id: number;
  userId: number;
  storeItemId: number;
  licenseType: "personal" | "commercial";
  quantity: number;
  item: typeof mockStoreItems[0] | null;
  createdAt: Date;
}> = [];

// ============ Feature Requests ============
export const mockFeatureRequests = [
  { id: 1, userId: 1, userName: "Demo User", title: "Add VR support", category: "Feature", description: "It would be great to preview avatars in VR before exporting", upvotes: 15, downvotes: 2, status: "open" as const, createdAt: oneMonthAgo, updatedAt: oneMonthAgo },
  { id: 2, userId: 2, userName: "Jane Smith", title: "Batch export", category: "Enhancement", description: "Allow exporting multiple avatars at once", upvotes: 23, downvotes: 1, status: "in-progress" as const, createdAt: twoMonthsAgo, updatedAt: oneMonthAgo },
  { id: 3, userId: 3, userName: "Alex Chen", title: "More anime hairstyles", category: "Content", description: "Please add more anime-style hairstyles to the store", upvotes: 45, downvotes: 3, status: "open" as const, createdAt: oneMonthAgo, updatedAt: oneMonthAgo },
];

// ============ Downloads ============
export const mockDownloads = [
  { id: 1, userId: 1, avatarProjectId: 1, assetUrl: "#", assetKey: "exports/avatar1.fbx", creditCost: 15, format: "FBX", createdAt: oneMonthAgo },
  { id: 2, userId: 1, avatarProjectId: 2, assetUrl: "#", assetKey: "exports/avatar2.glb", creditCost: 15, format: "GLB", createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000) },
];

// ============ Collection (User Purchased Items) ============
export const mockCollectionPurchases = [
  {
    id: 1,
    storeItemId: 1,
    licenseType: "personal" as const,
    purchasedAt: oneMonthAgo,
    item: mockStoreItems.find(i => i.id === 1) || null,
  },
  {
    id: 2,
    storeItemId: 10,
    licenseType: "commercial" as const,
    purchasedAt: twoMonthsAgo,
    item: mockStoreItems.find(i => i.id === 10) || null,
  },
];

// ============ Invoices (same as credit purchases) ============
export const mockInvoices = mockCreditPurchases;
