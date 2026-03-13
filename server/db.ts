import { eq, desc, and, asc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  avatarProjects,
  InsertAvatarProject,
  templateAvatars,
  InsertTemplateAvatar,
  storeItems,
  InsertStoreItem,
  creditPacks,
  InsertCreditPack,
  creditTransactions,
  InsertCreditTransaction,
  creditPurchases,
  InsertCreditPurchase,
  assetDownloads,
  InsertAssetDownload,
  userItems,
  InsertUserItem,
  licenses,
  InsertLicense,
  softwareVersions,
  InsertSoftwareVersion,
  sdks,
  InsertSDK,
  polls,
  InsertPoll,
  pollOptions,
  InsertPollOption,
  pollVotes,
  InsertPollVote,
  cartItems,
  InsertCartItem,
  featureRequests,
  InsertFeatureRequest,
  featureRequestVotes,
  InsertFeatureRequestVote,
  contentSubmissions,
  InsertContentSubmission,
  contentReviews,
  InsertContentReview,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ User Management ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserCredits(userId: number, newBalance: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(users).set({ creditBalance: newBalance }).where(eq(users.id, userId));
}

export async function updateUser(userId: number, updates: { name?: string; email?: string; bio?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: any = {};
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.email !== undefined) updateData.email = updates.email;
  if (updates.bio !== undefined) updateData.bio = updates.bio;

  if (Object.keys(updateData).length > 0) {
    await db.update(users).set(updateData).where(eq(users.id, userId));
  }
}

// ============ Avatar Projects ============

export async function createAvatarProject(project: InsertAvatarProject) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(avatarProjects).values(project);
  return result;
}

export async function getUserAvatarProjects(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(avatarProjects).where(eq(avatarProjects.userId, userId)).orderBy(desc(avatarProjects.updatedAt));
}

export async function getAvatarProjectById(projectId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(avatarProjects).where(eq(avatarProjects.id, projectId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateAvatarProject(projectId: number, updates: Partial<InsertAvatarProject>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(avatarProjects).set(updates).where(eq(avatarProjects.id, projectId));
}

export async function deleteAvatarProject(projectId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(avatarProjects).where(eq(avatarProjects.id, projectId));
}

// ============ Template Avatars ============

export async function getAllTemplateAvatars() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(templateAvatars).orderBy(desc(templateAvatars.createdAt));
}

export async function createTemplateAvatar(template: InsertTemplateAvatar) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(templateAvatars).values(template);
  return result;
}

// ============ Store Items ============

export async function getAllStoreItems() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(storeItems).orderBy(desc(storeItems.createdAt));
}

export async function getStoreItemsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(storeItems).where(eq(storeItems.category, category as any)).orderBy(desc(storeItems.createdAt));
}

export async function getStoreItemById(itemId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(storeItems).where(eq(storeItems.id, itemId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createStoreItem(item: InsertStoreItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(storeItems).values(item);
  return result;
}

// ============ Credit Packs ============

export async function getActiveCreditPacks() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(creditPacks).where(eq(creditPacks.isActive, true)).orderBy(creditPacks.credits);
}

export async function getCreditPackById(packId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(creditPacks).where(eq(creditPacks.id, packId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCreditPack(pack: InsertCreditPack) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(creditPacks).values(pack);
  return result;
}

// ============ Credit Transactions ============

export async function createCreditTransaction(transaction: InsertCreditTransaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(creditTransactions).values(transaction);
  return result;
}

export async function getUserCreditTransactions(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(creditTransactions).where(eq(creditTransactions.userId, userId)).orderBy(desc(creditTransactions.createdAt));
}

// ============ Credit Purchases ============

export async function createCreditPurchase(purchase: InsertCreditPurchase) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(creditPurchases).values(purchase);
  return result;
}

export async function getUserCreditPurchases(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(creditPurchases).where(eq(creditPurchases.userId, userId)).orderBy(desc(creditPurchases.createdAt));
}

export async function updateCreditPurchaseStatus(purchaseId: number, status: string, transactionId?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updates: any = { paymentStatus: status };
  if (transactionId) {
    updates.transactionId = transactionId;
  }

  await db.update(creditPurchases).set(updates).where(eq(creditPurchases.id, purchaseId));
}

// ============ Asset Downloads ============

export async function createAssetDownload(download: InsertAssetDownload) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(assetDownloads).values(download);
  return result;
}

export async function getUserAssetDownloads(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(assetDownloads).where(eq(assetDownloads.userId, userId)).orderBy(desc(assetDownloads.createdAt));
}

// ============ User Items ============

export async function createUserItem(userItem: InsertUserItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(userItems).values(userItem);
  return result;
}

export async function getUserItems(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(userItems).where(eq(userItems.userId, userId)).orderBy(desc(userItems.purchasedAt));
}

export async function getUserPurchasesWithDetails(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const purchases = await db
    .select({
      id: userItems.id,
      storeItemId: userItems.storeItemId,
      licenseType: userItems.licenseType,
      purchasedAt: userItems.purchasedAt,
      item: {
        id: storeItems.id,
        name: storeItems.name,
        nameCn: storeItems.nameCn,
        descriptionCn: storeItems.descriptionCn,
        category: storeItems.category,
        thumbnailUrl: storeItems.thumbnailUrl,
        description: storeItems.description,
        polyCount: storeItems.polyCount,
        textureTypes: storeItems.textureTypes,
        fileFormat: storeItems.fileFormat,
        fileSize: storeItems.fileSize,
      }
    })
    .from(userItems)
    .leftJoin(storeItems, eq(userItems.storeItemId, storeItems.id))
    .where(eq(userItems.userId, userId))
    .orderBy(desc(userItems.purchasedAt));

  return purchases;
}

export async function getUserItemById(userItemId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(userItems)
    .where(eq(userItems.id, userItemId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserItemLicense(userItemId: number, licenseType: "personal" | "commercial") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(userItems)
    .set({ licenseType })
    .where(eq(userItems.id, userItemId));
}

export async function hasUserPurchasedItem(userId: number, storeItemId: number) {
  const db = await getDb();
  if (!db) return false;

  const result = await db
    .select()
    .from(userItems)
    .where(and(eq(userItems.userId, userId), eq(userItems.storeItemId, storeItemId)))
    .limit(1);

  return result.length > 0;
}

// ============ Licenses ============

export async function createLicense(license: InsertLicense) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(licenses).values(license);
  return result;
}

export async function getUserLicenses(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(licenses).where(eq(licenses.userId, userId)).orderBy(desc(licenses.createdAt));
}

export async function getLicenseByKey(licenseKey: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(licenses).where(eq(licenses.licenseKey, licenseKey)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateLicenseStatus(licenseId: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(licenses).set({ status: status as any }).where(eq(licenses.id, licenseId));
}


// ============ Software Versions ============

export async function getAllSoftwareVersions() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(softwareVersions).orderBy(desc(softwareVersions.releaseDate));
}

export async function getLatestSoftwareVersion() {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(softwareVersions).where(eq(softwareVersions.isLatest, true)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createSoftwareVersion(version: InsertSoftwareVersion) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(softwareVersions).values(version);
}

export async function getSoftwareVersionByVersion(version: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(softwareVersions).where(eq(softwareVersions.version, version)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}


// ============ SDKs ============

export async function getAllSDKs() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(sdks).orderBy(asc(sdks.sortOrder));
}

export async function getSDKsByEngine(engine: string) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(sdks).where(eq(sdks.engine, engine)).orderBy(asc(sdks.sortOrder));
}

export async function createSDK(sdk: InsertSDK) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(sdks).values(sdk);
}

export async function getSDKById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(sdks).where(eq(sdks.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}


// ============ Polls ============

export async function getActivePoll() {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(polls)
    .where(eq(polls.isActive, true))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getPollWithOptions(pollId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const poll = await db.select().from(polls).where(eq(polls.id, pollId)).limit(1);
  if (poll.length === 0) return undefined;

  const options = await db.select().from(pollOptions).where(eq(pollOptions.pollId, pollId));
  
  return {
    ...poll[0],
    options,
  };
}

export async function createPoll(poll: InsertPoll) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(polls).values(poll);
}

export async function createPollOption(option: InsertPollOption) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(pollOptions).values(option);
}

export async function hasUserVoted(pollId: number, voterIdentifier: string) {
  const db = await getDb();
  if (!db) return false;

  const result = await db
    .select()
    .from(pollVotes)
    .where(and(eq(pollVotes.pollId, pollId), eq(pollVotes.voterIdentifier, voterIdentifier)))
    .limit(1);

  return result.length > 0;
}

export async function createPollVote(vote: InsertPollVote) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Increment vote count for the option
  await db
    .update(pollOptions)
    .set({ voteCount: sql`${pollOptions.voteCount} + 1` })
    .where(eq(pollOptions.id, vote.optionId));

  return await db.insert(pollVotes).values(vote);
}

export async function getPollResults(pollId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(pollOptions)
    .where(eq(pollOptions.pollId, pollId))
    .orderBy(desc(pollOptions.voteCount));
}


// ============ Shopping Cart ============

export async function getCartItems(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({
      id: cartItems.id,
      userId: cartItems.userId,
      storeItemId: cartItems.storeItemId,
      licenseType: cartItems.licenseType,
      quantity: cartItems.quantity,
      item: storeItems,
      createdAt: cartItems.createdAt,
    })
    .from(cartItems)
    .leftJoin(storeItems, eq(cartItems.storeItemId, storeItems.id))
    .where(eq(cartItems.userId, userId));
}

export async function addToCart(userId: number, storeItemId: number, licenseType: "personal" | "commercial", quantity: number = 1) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if item already in cart
  const existing = await db
    .select()
    .from(cartItems)
    .where(
      and(
        eq(cartItems.userId, userId),
        eq(cartItems.storeItemId, storeItemId),
        eq(cartItems.licenseType, licenseType)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    // Update quantity
    return await db
      .update(cartItems)
      .set({ quantity: existing[0].quantity + quantity })
      .where(eq(cartItems.id, existing[0].id));
  }

  // Add new item
  return await db.insert(cartItems).values({
    userId,
    storeItemId,
    licenseType,
    quantity,
  });
}

export async function removeFromCart(cartItemId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
}

export async function updateCartItemQuantity(cartItemId: number, quantity: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  if (quantity <= 0) {
    return await removeFromCart(cartItemId);
  }

  return await db
    .update(cartItems)
    .set({ quantity })
    .where(eq(cartItems.id, cartItemId));
}

export async function clearCart(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.delete(cartItems).where(eq(cartItems.userId, userId));
}


// Feature Requests

export async function getAllFeatureRequests() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(featureRequests)
    .orderBy(desc(featureRequests.upvotes));
}

export async function createFeatureRequest(request: InsertFeatureRequest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(featureRequests).values(request);
}

export async function getFeatureRequestById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(featureRequests)
    .where(eq(featureRequests.id, id))
    .limit(1);
}

export async function addFeatureRequestVote(vote: InsertFeatureRequestVote) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if user already voted
  const existingVote = await db
    .select()
    .from(featureRequestVotes)
    .where(
      and(
        eq(featureRequestVotes.requestId, vote.requestId),
        eq(featureRequestVotes.userIdentifier, vote.userIdentifier)
      )
    )
    .limit(1);

  if (existingVote.length > 0) {
    // User already voted, update their vote
    const oldVote = existingVote[0];
    
    // Adjust counts
    if (oldVote.voteType === "upvote" && vote.voteType === "downvote") {
      await db
        .update(featureRequests)
        .set({
          upvotes: sql`${featureRequests.upvotes} - 1`,
          downvotes: sql`${featureRequests.downvotes} + 1`,
        })
        .where(eq(featureRequests.id, vote.requestId));
    } else if (oldVote.voteType === "downvote" && vote.voteType === "upvote") {
      await db
        .update(featureRequests)
        .set({
          upvotes: sql`${featureRequests.upvotes} + 1`,
          downvotes: sql`${featureRequests.downvotes} - 1`,
        })
        .where(eq(featureRequests.id, vote.requestId));
    }

    return await db
      .update(featureRequestVotes)
      .set({ voteType: vote.voteType })
      .where(eq(featureRequestVotes.id, oldVote.id));
  }

  // New vote
  if (vote.voteType === "upvote") {
    await db
      .update(featureRequests)
      .set({ upvotes: sql`${featureRequests.upvotes} + 1` })
      .where(eq(featureRequests.id, vote.requestId));
  } else {
    await db
      .update(featureRequests)
      .set({ downvotes: sql`${featureRequests.downvotes} + 1` })
      .where(eq(featureRequests.id, vote.requestId));
  }

  return await db.insert(featureRequestVotes).values(vote);
}

export async function getUserVoteOnRequest(requestId: number, userIdentifier: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(featureRequestVotes)
    .where(
      and(
        eq(featureRequestVotes.requestId, requestId),
        eq(featureRequestVotes.userIdentifier, userIdentifier)
      )
    )
    .limit(1);
}

export async function updateFeatureRequest(id: number, updates: Partial<InsertFeatureRequest>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .update(featureRequests)
    .set(updates)
    .where(eq(featureRequests.id, id));
}

export async function deleteFeatureRequest(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Delete associated votes first
  await db
    .delete(featureRequestVotes)
    .where(eq(featureRequestVotes.requestId, id));

  // Then delete the request
  return await db
    .delete(featureRequests)
    .where(eq(featureRequests.id, id));
}


// ============ Content Submissions ============

export async function createContentSubmission(submission: InsertContentSubmission) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(contentSubmissions).values(submission);
  return result;
}

export async function getContentSubmissionById(submissionId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(contentSubmissions).where(eq(contentSubmissions.id, submissionId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPendingContentSubmissions() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(contentSubmissions).where(eq(contentSubmissions.status, "pending")).orderBy(desc(contentSubmissions.submittedAt));
}

export async function getAllContentSubmissions() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(contentSubmissions).orderBy(desc(contentSubmissions.submittedAt));
}

export async function getContentSubmissionsByArtist(artistId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(contentSubmissions).where(eq(contentSubmissions.artistId, artistId)).orderBy(desc(contentSubmissions.submittedAt));
}

export async function updateContentSubmissionStatus(submissionId: number, status: "pending" | "approved" | "revision_required" | "rejected") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(contentSubmissions).set({ status }).where(eq(contentSubmissions.id, submissionId));
}

// ============ Content Reviews ============

export async function createContentReview(review: InsertContentReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(contentReviews).values(review);
  return result;
}

export async function getContentReviewBySubmissionId(submissionId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(contentReviews).where(eq(contentReviews.submissionId, submissionId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getContentReviewsByReviewerId(reviewerId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(contentReviews).where(eq(contentReviews.reviewerId, reviewerId)).orderBy(desc(contentReviews.reviewedAt));
}
