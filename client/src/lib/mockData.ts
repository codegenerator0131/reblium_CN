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
const storeItemBase = {
  thumbnailKey: null as string | null,
  image2Key: null as string | null,
  image3Key: null as string | null,
  image4Url: null as string | null,
  image4Key: null as string | null,
  artistName: "Andre Ferwerda",
  createdAt: oneMonthAgo,
};

export const mockStoreItems = [
  // Clothing (9 items)
  { ...storeItemBase, id: 1, name: "Female Fantasy Outfit 1", nameCn: "女性奇幻装1", category: "clothing", description: "Enchanted elven-inspired outfit with ornate detailing and flowing fabric. Includes body armor and decorative shoulder pads.", descriptionCn: "魔法精灵风格服装，精美细节和流动面料。包含身体铠甲和装饰肩垫。", thumbnailUrl: `${IMG}/F_Fant1_front.jpg`, image2Url: `${IMG}/F_Fant1_quarter.jpg`, image3Url: `${IMG}/F_Fant1_back.jpg`, personalPriceUSD: "5.00", personalPriceCNY: "36.00", commercialPriceUSD: "25.00", commercialPriceCNY: "180.00", polyCount: 18500, textureTypes: '["Albedo","Normal","Roughness","Metallic"]', fileFormat: "FBX", fileSize: 8 },
  { ...storeItemBase, id: 2, name: "Dark Lady Outfit", nameCn: "暗黑女士装", category: "clothing", description: "Gothic dark sorceress outfit with layered cape and intricate dark metal accents. Full body coverage with hood.", descriptionCn: "哥特暗黑女巫服装，层叠斗篷和精致暗金属装饰。全身覆盖带兜帽。", thumbnailUrl: `${IMG}/darklady_front.jpg`, image2Url: `${IMG}/darklady_quarter.jpg`, image3Url: `${IMG}/darklady_back.jpg`, personalPriceUSD: "5.00", personalPriceCNY: "36.00", commercialPriceUSD: "25.00", commercialPriceCNY: "180.00", polyCount: 20200, textureTypes: '["Albedo","Normal","Roughness","Metallic","Ao"]', fileFormat: "FBX", fileSize: 9 },
  { ...storeItemBase, id: 3, name: "Female Knight Armor", nameCn: "女骑士铠甲", category: "clothing", description: "Full plate knight armor designed for female characters. High-detail medieval steel with gold trim and chainmail underlay.", descriptionCn: "为女性角色设计的全板骑士铠甲。高细节中世纪钢甲配金色镶边和锁子甲内衬。", thumbnailUrl: `${IMG}/femaleknight_front.jpg`, image2Url: `${IMG}/femaleknight_quarter.jpg`, image3Url: `${IMG}/femaleknight_back.jpg`, personalPriceUSD: "8.00", personalPriceCNY: "58.00", commercialPriceUSD: "40.00", commercialPriceCNY: "288.00", polyCount: 28000, textureTypes: '["Albedo","Normal","Roughness","Metallic","Ao"]', fileFormat: "FBX", fileSize: 12 },
  { ...storeItemBase, id: 4, name: "Catwoman Suit", nameCn: "猫女装", category: "clothing", description: "Sleek black bodysuit with cat-ear headpiece and tactical belt. Glossy leather material with stitching details.", descriptionCn: "光滑黑色紧身衣配猫耳头饰和战术腰带。光泽皮革材质带缝线细节。", thumbnailUrl: `${IMG}/catwoman_front.jpg`, image2Url: `${IMG}/catwoman_quarter.jpg`, image3Url: `${IMG}/catwoman_back.jpg`, personalPriceUSD: "6.00", personalPriceCNY: "43.00", commercialPriceUSD: "30.00", commercialPriceCNY: "216.00", polyCount: 15000, textureTypes: '["Albedo","Normal","Roughness","Metallic"]', fileFormat: "FBX", fileSize: 6 },
  { ...storeItemBase, id: 5, name: "Warrior Armor", nameCn: "战士铠甲", category: "clothing", description: "Battle-worn heavy warrior armor with fur-lined pauldrons and layered plate construction. Includes battle scars and weathering.", descriptionCn: "经过战斗洗礼的重型战士铠甲，毛皮衬里肩甲和分层板甲结构。包含战斗伤痕和风化效果。", thumbnailUrl: `${IMG}/waarior_front.jpg`, image2Url: `${IMG}/waarior_quarter.jpg`, image3Url: `${IMG}/waarior_back.jpg`, personalPriceUSD: "8.00", personalPriceCNY: "58.00", commercialPriceUSD: "40.00", commercialPriceCNY: "288.00", polyCount: 30000, textureTypes: '["Albedo","Normal","Roughness","Metallic","Ao"]', fileFormat: "FBX", fileSize: 14 },
  { ...storeItemBase, id: 6, name: "Ninja Girl Outfit", nameCn: "忍者少女装", category: "clothing", description: "Lightweight ninja outfit with wrapped bandages, utility pouches, and split-toe boots. Designed for agile characters.", descriptionCn: "轻便忍者服装，包裹绷带、工具袋和分趾靴。专为敏捷角色设计。", thumbnailUrl: `${IMG}/ninjagirl_front.jpg`, image2Url: `${IMG}/ninjagirl_quarter.jpg`, image3Url: `${IMG}/ninjagirl_back.jpg`, personalPriceUSD: "5.00", personalPriceCNY: "36.00", commercialPriceUSD: "25.00", commercialPriceCNY: "180.00", polyCount: 16000, textureTypes: '["Albedo","Normal","Roughness","Metallic"]', fileFormat: "FBX", fileSize: 7 },
  { ...storeItemBase, id: 7, name: "Casual Girl Outfit", nameCn: "休闲女孩装", category: "clothing", description: "Modern casual outfit with crop top, high-waist jeans, and sneakers. Clean topology for easy animation.", descriptionCn: "现代休闲装，短上衣、高腰牛仔裤和运动鞋。干净拓扑便于动画制作。", thumbnailUrl: `${IMG}/girl_front.jpg`, image2Url: `${IMG}/girl_quarter.jpg`, image3Url: `${IMG}/girl_back.jpg`, personalPriceUSD: "4.00", personalPriceCNY: "29.00", commercialPriceUSD: "20.00", commercialPriceCNY: "144.00", polyCount: 12000, textureTypes: '["Albedo","Normal","Roughness"]', fileFormat: "FBX", fileSize: 5 },
  { ...storeItemBase, id: 8, name: "Dark Knight Armor", nameCn: "暗黑骑士铠甲", category: "clothing", description: "Imposing dark plate armor with spiked pauldrons, horned helm, and tattered cape. Full coverage heavy armor set.", descriptionCn: "气势恢宏的暗黑板甲，尖刺肩甲、角盔和破碎斗篷。全覆盖重型铠甲套装。", thumbnailUrl: `${IMG}/darkknight_front.jpg`, image2Url: `${IMG}/darkknight_quarter.jpg`, image3Url: `${IMG}/darkknight_back.jpg`, personalPriceUSD: "9.00", personalPriceCNY: "65.00", commercialPriceUSD: "45.00", commercialPriceCNY: "324.00", polyCount: 32000, textureTypes: '["Albedo","Normal","Roughness","Metallic","Emissive","Ao"]', fileFormat: "FBX", fileSize: 15 },
  { ...storeItemBase, id: 9, name: "Male Fantasy Outfit 1", nameCn: "男性奇幻装1", category: "clothing", description: "Adventurer-style fantasy outfit with leather vest, arm wraps, and rugged boots. Versatile design for RPG characters.", descriptionCn: "冒险者风格奇幻服装，皮革背心、手臂缠绕和粗犷靴子。适用于RPG角色的多功能设计。", thumbnailUrl: `${IMG}/M_Fant1_front.jpg`, image2Url: `${IMG}/M_Fant1_quarter.jpg`, image3Url: `${IMG}/M_Fant1_back.jpg`, personalPriceUSD: "5.00", personalPriceCNY: "36.00", commercialPriceUSD: "25.00", commercialPriceCNY: "180.00", polyCount: 19000, textureTypes: '["Albedo","Normal","Roughness","Metallic"]', fileFormat: "FBX", fileSize: 8 },

  // Fantasy (4 items)
  { ...storeItemBase, id: 10, name: "Demon Character", nameCn: "恶魔角色", category: "fantasy", description: "Full demon character with horns, wings, and clawed hands. Detailed skin texture with vein patterns and glowing accents.", descriptionCn: "完整恶魔角色，带犄角、翅膀和爪手。详细皮肤纹理带脉络图案和发光装饰。", thumbnailUrl: `${IMG}/demon_front.jpg`, image2Url: `${IMG}/demon_quarter.jpg`, image3Url: `${IMG}/demon_back.jpg`, personalPriceUSD: "10.00", personalPriceCNY: "72.00", commercialPriceUSD: "50.00", commercialPriceCNY: "360.00", polyCount: 42000, textureTypes: '["Albedo","Normal","Roughness","Metallic","Emissive","Ao","SubsurfaceScattering"]', fileFormat: "FBX", fileSize: 18 },
  { ...storeItemBase, id: 11, name: "Swamp Monster", nameCn: "沼泽怪物", category: "fantasy", description: "Organic swamp creature with moss, vine growths, and translucent membrane details. Highly detailed sculpt.", descriptionCn: "有机沼泽生物，带苔藓、藤蔓生长和半透明膜细节。高度精细雕刻。", thumbnailUrl: `${IMG}/swampmonster_front.jpg`, image2Url: `${IMG}/swampmonster_quarter.jpg`, image3Url: `${IMG}/swampmonster_back.jpg`, personalPriceUSD: "10.00", personalPriceCNY: "72.00", commercialPriceUSD: "50.00", commercialPriceCNY: "360.00", polyCount: 45000, textureTypes: '["Albedo","Normal","Roughness","Metallic","Emissive","Ao","SubsurfaceScattering"]', fileFormat: "FBX", fileSize: 20 },
  { ...storeItemBase, id: 12, name: "Crab Creature", nameCn: "螃蟹怪物", category: "fantasy", description: "Armored crab creature with massive claws and chitinous shell plating. Includes articulated leg joints.", descriptionCn: "装甲螃蟹生物，巨大钳子和几丁质甲壳。包含关节腿部。", thumbnailUrl: `${IMG}/crab_front.jpg`, image2Url: `${IMG}/crab_quarter.jpg`, image3Url: `${IMG}/crab_back.jpg`, personalPriceUSD: "9.00", personalPriceCNY: "65.00", commercialPriceUSD: "45.00", commercialPriceCNY: "324.00", polyCount: 38000, textureTypes: '["Albedo","Normal","Roughness","Metallic","Ao"]', fileFormat: "FBX", fileSize: 16 },
  { ...storeItemBase, id: 13, name: "Dracula Character", nameCn: "吸血鬼角色", category: "fantasy", description: "Classic vampire lord with flowing cape, aristocratic attire, and pale skin details. Includes fangs and red eye accents.", descriptionCn: "经典吸血鬼领主，流动斗篷、贵族服饰和苍白皮肤细节。包含獠牙和红色眼睛装饰。", thumbnailUrl: `${IMG}/dracula_front.jpg`, image2Url: `${IMG}/dracula_quarter.jpg`, image3Url: `${IMG}/dracula_back.jpg`, personalPriceUSD: "8.00", personalPriceCNY: "58.00", commercialPriceUSD: "40.00", commercialPriceCNY: "288.00", polyCount: 25000, textureTypes: '["Albedo","Normal","Roughness","Metallic","Emissive","Ao"]', fileFormat: "FBX", fileSize: 11 },

  // Sci-Fi (4 items)
  { ...storeItemBase, id: 14, name: "Female Sci-Fi Suit 1", nameCn: "女性科幻战甲1", category: "sci-fi", description: "Full mechanical exosuit with articulated joints and hydraulic details. High-poly mech design.", descriptionCn: "全机械外骨骼战甲，铰接关节和液压细节。高多边形机甲设计。", thumbnailUrl: `${IMG}/F_SciFi_1_front.jpg`, image2Url: `${IMG}/F_SciFi_1_quarter.jpg`, image3Url: `${IMG}/F_SciFi_1_back.jpg`, personalPriceUSD: "7.00", personalPriceCNY: "50.00", commercialPriceUSD: "35.00", commercialPriceCNY: "252.00", polyCount: 35000, textureTypes: '["Albedo","Normal","Roughness","Metallic","Emissive","Ao"]', fileFormat: "FBX", fileSize: 12 },
  { ...storeItemBase, id: 15, name: "Female Sci-Fi Suit 2", nameCn: "女性科幻战甲2", category: "sci-fi", description: "Sleek lightweight sci-fi bodysuit with holographic panel accents and flexible joint segments.", descriptionCn: "轻盈流线型科幻紧身衣，全息面板装饰和柔性关节段。", thumbnailUrl: `${IMG}/F_SciFi_2_front.jpg`, image2Url: `${IMG}/F_SciFi_2_quarter.jpg`, image3Url: `${IMG}/F_SciFi_2_back.jpg`, personalPriceUSD: "7.00", personalPriceCNY: "50.00", commercialPriceUSD: "35.00", commercialPriceCNY: "252.00", polyCount: 28000, textureTypes: '["Albedo","Normal","Roughness","Metallic","Emissive","Ao"]', fileFormat: "FBX", fileSize: 10 },
  { ...storeItemBase, id: 16, name: "Male Sci-Fi Suit 1", nameCn: "男性科幻战甲1", category: "sci-fi", description: "Heavy-duty male power armor with energy conduits and reinforced plating. Combat-ready design.", descriptionCn: "重型男性动力铠甲，能量导管和加固板甲。战斗就绪设计。", thumbnailUrl: `${IMG}/M_SciFi_1_front.jpg`, image2Url: `${IMG}/M_SciFi_1_quarter.jpg`, image3Url: `${IMG}/M_SciFi_1_back.jpg`, personalPriceUSD: "7.00", personalPriceCNY: "50.00", commercialPriceUSD: "35.00", commercialPriceCNY: "252.00", polyCount: 33000, textureTypes: '["Albedo","Normal","Roughness","Metallic","Emissive","Ao"]', fileFormat: "FBX", fileSize: 13 },
  { ...storeItemBase, id: 17, name: "Mech Suit", nameCn: "机甲", category: "sci-fi", description: "Massive full-body mech suit with integrated weapon systems, jet thrusters, and modular armor plates. Premium high-poly asset.", descriptionCn: "大型全身机甲，集成武器系统、喷射推进器和模块化装甲板。高端高多边形资产。", thumbnailUrl: `${IMG}/Mech_front.jpg`, image2Url: `${IMG}/Mech_quarter.jpg`, image3Url: `${IMG}/Mech_back.jpg`, personalPriceUSD: "15.00", personalPriceCNY: "108.00", commercialPriceUSD: "75.00", commercialPriceCNY: "540.00", polyCount: 55000, textureTypes: '["Albedo","Normal","Roughness","Metallic","Emissive","Ao"]', fileFormat: "FBX", fileSize: 25 },
];

// Helper to get store items grouped by category (matches server store.listItems return)
export function getStoreItemsByCategory() {
  const categories = ["clothing", "hair", "face", "accessories", "animations", "packs", "fantasy", "sci-fi"];
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
