import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  bio: text("bio"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  creditBalance: int("creditBalance").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Avatar projects created by users
 */
export const avatarProjects = mysqlTable("avatarProjects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  thumbnailUrl: text("thumbnailUrl"),
  thumbnailKey: text("thumbnailKey"),
  isPublished: boolean("isPublished").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AvatarProject = typeof avatarProjects.$inferSelect;
export type InsertAvatarProject = typeof avatarProjects.$inferInsert;

/**
 * Template avatars available for all users
 */
export const templateAvatars = mysqlTable("templateAvatars", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  thumbnailUrl: text("thumbnailUrl").notNull(),
  thumbnailKey: text("thumbnailKey").notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TemplateAvatar = typeof templateAvatars.$inferSelect;
export type InsertTemplateAvatar = typeof templateAvatars.$inferInsert;

/**
 * Store items for avatar customization
 */
export const storeItems = mysqlTable("storeItems", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: mysqlEnum("category", ["artists", "clothing", "hair", "face", "face_fantasy", "face_human", "accessories", "animations", "packs", "fantasy", "sci-fi"]).notNull(),
  thumbnailUrl: text("thumbnailUrl").notNull(),
  thumbnailKey: text("thumbnailKey").notNull(),
  description: text("description"),
  personalPriceUSD: decimal("personalPriceUSD", { precision: 10, scale: 2 }).default("5.00").notNull(),
  commercialPriceUSD: decimal("commercialPriceUSD", { precision: 10, scale: 2 }).default("25.00").notNull(),
  personalPriceCNY: decimal("personalPriceCNY", { precision: 10, scale: 2 }).default("36.00").notNull(),
  commercialPriceCNY: decimal("commercialPriceCNY", { precision: 10, scale: 2 }).default("180.00").notNull(),
  polyCount: int("polyCount").default(0),
  textureTypes: text("textureTypes"),
  fileFormat: varchar("fileFormat", { length: 50 }).default("FBX"),
  fileSize: int("fileSize").default(0),
  image2Url: text("image2Url"),
  image2Key: text("image2Key"),
  image3Url: text("image3Url"),
  image3Key: text("image3Key"),
  image4Url: text("image4Url"),
  image4Key: text("image4Key"),
  artistName: varchar("artistName", { length: 255 }).default("Andre Ferwerda"),
  nameCn: varchar("nameCn", { length: 255 }),
  descriptionCn: text("descriptionCn"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StoreItem = typeof storeItems.$inferSelect;
export type InsertStoreItem = typeof storeItems.$inferInsert;

/**
 * Credit packs available for purchase
 */
export const creditPacks = mysqlTable("creditPacks", {
  id: int("id").autoincrement().primaryKey(),
  credits: int("credits").notNull(),
  priceUSD: int("priceUSD").notNull(), // Price in cents
  discountPercent: int("discountPercent").default(0).notNull(), // Discount percentage (0-100)
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CreditPack = typeof creditPacks.$inferSelect;
export type InsertCreditPack = typeof creditPacks.$inferInsert;

/**
 * Credit transactions (purchases and usage)
 */
export const creditTransactions = mysqlTable("creditTransactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["purchase", "usage", "refund"]).notNull(),
  amount: int("amount").notNull(), // Positive for purchase/refund, negative for usage
  balanceAfter: int("balanceAfter").notNull(),
  description: text("description"),
  relatedId: int("relatedId"), // Reference to purchase, download, etc.
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type InsertCreditTransaction = typeof creditTransactions.$inferInsert;

/**
 * Credit pack purchases
 */
export const creditPurchases = mysqlTable("creditPurchases", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  creditPackId: int("creditPackId").notNull(),
  credits: int("credits").notNull(),
  amountUSD: int("amountUSD").notNull(), // Amount in cents
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  transactionId: varchar("transactionId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CreditPurchase = typeof creditPurchases.$inferSelect;
export type InsertCreditPurchase = typeof creditPurchases.$inferInsert;

/**
 * Asset downloads/exports
 */
export const assetDownloads = mysqlTable("assetDownloads", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  avatarProjectId: int("avatarProjectId").notNull(),
  assetUrl: text("assetUrl").notNull(),
  assetKey: text("assetKey").notNull(),
  creditCost: int("creditCost").notNull(),
  format: varchar("format", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AssetDownload = typeof assetDownloads.$inferSelect;
export type InsertAssetDownload = typeof assetDownloads.$inferInsert;

/**
 * User purchased items with license type
 */
export const userItems = mysqlTable("userItems", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  storeItemId: int("storeItemId").notNull(),
  licenseType: mysqlEnum("licenseType", ["personal", "commercial"]).notNull(),
  priceInCredits: int("priceInCredits").notNull(), // Price paid in credits
  purchasedAt: timestamp("purchasedAt").defaultNow().notNull(),
});

export type UserItem = typeof userItems.$inferSelect;
export type InsertUserItem = typeof userItems.$inferInsert;

/**
 * Licenses for users
 */
export const licenses = mysqlTable("licenses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  licenseKey: varchar("licenseKey", { length: 255 }).notNull().unique(),
  licenseType: varchar("licenseType", { length: 100 }).notNull(),
  status: mysqlEnum("status", ["active", "expired", "revoked"]).default("active").notNull(),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type License = typeof licenses.$inferSelect;
export type InsertLicense = typeof licenses.$inferInsert;


/**
 * Software versions for updates
 */
export const softwareVersions = mysqlTable("softwareVersions", {
  id: int("id").autoincrement().primaryKey(),
  version: varchar("version", { length: 50 }).notNull().unique(),
  displayName: varchar("displayName", { length: 255 }).notNull(),
  description: text("description"),
  releaseNotes: text("releaseNotes"),
  downloadUrl: text("downloadUrl").notNull(),
  fileSize: int("fileSize"),
  isLatest: boolean("isLatest").default(false).notNull(),
  releaseDate: timestamp("releaseDate").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SoftwareVersion = typeof softwareVersions.$inferSelect;
export type InsertSoftwareVersion = typeof softwareVersions.$inferInsert;

/**
 * SDKs for game engines and development
 */
export const sdks = mysqlTable("sdks", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  engine: varchar("engine", { length: 100 }).notNull(), // Unity, Unreal, etc.
  version: varchar("version", { length: 50 }).notNull(),
  description: text("description"),
  downloadUrl: text("downloadUrl").notNull(),
  documentationUrl: text("documentationUrl"),
  logoUrl: text("logoUrl"), // SDK logo image URL
  fileSize: int("fileSize"), // in MB
  sortOrder: int("sortOrder").default(0).notNull(), // for ordering SDKs
  releaseDate: timestamp("releaseDate").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SDK = typeof sdks.$inferSelect;
export type InsertSDK = typeof sdks.$inferInsert;

/**
 * Polls for community voting on future packs
 */
export const polls = mysqlTable("polls", {
  id: int("id").autoincrement().primaryKey(),
  question: varchar("question", { length: 255 }).notNull(),
  description: text("description"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Poll = typeof polls.$inferSelect;
export type InsertPoll = typeof polls.$inferInsert;

/**
 * Poll options for voting
 */
export const pollOptions = mysqlTable("pollOptions", {
  id: int("id").autoincrement().primaryKey(),
  pollId: int("pollId").notNull().references(() => polls.id, { onDelete: "cascade" }),
  option: varchar("option", { length: 255 }).notNull(),
  voteCount: int("voteCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PollOption = typeof pollOptions.$inferSelect;
export type InsertPollOption = typeof pollOptions.$inferInsert;

/**
 * Poll votes tracking (anonymous by IP/session)
 */
export const pollVotes = mysqlTable("pollVotes", {
  id: int("id").autoincrement().primaryKey(),
  pollId: int("pollId").notNull().references(() => polls.id, { onDelete: "cascade" }),
  optionId: int("optionId").notNull().references(() => pollOptions.id, { onDelete: "cascade" }),
  voterIdentifier: varchar("voterIdentifier", { length: 255 }).notNull(), // IP or session ID
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PollVote = typeof pollVotes.$inferSelect;
export type InsertPollVote = typeof pollVotes.$inferInsert;


/**
 * Shopping cart items for users
 */
export const cartItems = mysqlTable("cartItems", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  storeItemId: int("storeItemId").notNull(),
  licenseType: mysqlEnum("licenseType", ["personal", "commercial"]).notNull(),
  quantity: int("quantity").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;


/**
 * Feature requests submitted by users
 */
export const featureRequests = mysqlTable("featureRequests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  userName: varchar("userName", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description").notNull(),
  upvotes: int("upvotes").default(0).notNull(),
  downvotes: int("downvotes").default(0).notNull(),
  status: mysqlEnum("status", ["open", "in-progress", "completed", "rejected"]).default("open").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FeatureRequest = typeof featureRequests.$inferSelect;
export type InsertFeatureRequest = typeof featureRequests.$inferInsert;

/**
 * Votes on feature requests (tracks by IP/session for anonymous users)
 */
export const featureRequestVotes = mysqlTable("featureRequestVotes", {
  id: int("id").autoincrement().primaryKey(),
  requestId: int("requestId").notNull(),
  userIdentifier: varchar("userIdentifier", { length: 255 }).notNull(), // IP address or session ID
  voteType: mysqlEnum("voteType", ["upvote", "downvote"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FeatureRequestVote = typeof featureRequestVotes.$inferSelect;
export type InsertFeatureRequestVote = typeof featureRequestVotes.$inferInsert;


/**
 * Content submissions for review and curation
 */
export const contentSubmissions = mysqlTable("contentSubmissions", {
  id: int("id").autoincrement().primaryKey(),
  artistId: int("artistId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", ["clothing", "hair", "face", "accessories", "animations", "packs"]).notNull(),
  fileUrl: text("fileUrl").notNull(),
  fileKey: text("fileKey").notNull(),
  thumbnailUrl: text("thumbnailUrl"),
  thumbnailKey: text("thumbnailKey"),
  polyCount: int("polyCount"),
  textureTypes: text("textureTypes"), // JSON array
  fileFormat: varchar("fileFormat", { length: 50 }),
  fileSize: int("fileSize"),
  personalPriceUSD: decimal("personalPriceUSD", { precision: 10, scale: 2 }).notNull(),
  commercialPriceUSD: decimal("commercialPriceUSD", { precision: 10, scale: 2 }).notNull(),
  personalPriceCNY: decimal("personalPriceCNY", { precision: 10, scale: 2 }).notNull(),
  commercialPriceCNY: decimal("commercialPriceCNY", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "approved", "revision_required", "rejected"]).default("pending").notNull(),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContentSubmission = typeof contentSubmissions.$inferSelect;
export type InsertContentSubmission = typeof contentSubmissions.$inferInsert;

/**
 * Content reviews and feedback from admin/curation team
 */
export const contentReviews = mysqlTable("contentReviews", {
  id: int("id").autoincrement().primaryKey(),
  submissionId: int("submissionId").notNull(),
  reviewerId: int("reviewerId").notNull(),
  status: mysqlEnum("status", ["approved", "revision_required", "rejected"]).notNull(),
  visualQualityFeedback: text("visualQualityFeedback"),
  technicalFeedback: text("technicalFeedback"),
  optimizationFeedback: text("optimizationFeedback"),
  namingFeedback: text("namingFeedback"),
  overallComments: text("overallComments"),
  reviewedAt: timestamp("reviewedAt").defaultNow().notNull(),
});

export type ContentReview = typeof contentReviews.$inferSelect;
export type InsertContentReview = typeof contentReviews.$inferInsert;
