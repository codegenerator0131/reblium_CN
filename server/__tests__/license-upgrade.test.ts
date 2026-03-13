import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createCaller } from "../routers";
import * as db from "../db";

describe("License Upgrade Feature", () => {
  let testUserId: number;
  let testStoreItemId: number;
  let testUserItemId: number;

  beforeAll(async () => {
    // Create test user
    const user = await db.createUser({
      email: "test-upgrade@example.com",
      name: "Test User",
      openId: "test-upgrade-user",
      role: "user",
      creditBalance: 0,
    });
    testUserId = user.id;

    // Create test store item with pricing
    const storeItem = await db.createStoreItem({
      name: "Test Asset",
      description: "Test asset for upgrade",
      category: "clothing",
      personalPriceUSD: 5,
      commercialPriceUSD: 25,
      personalPriceCNY: 36,
      commercialPriceCNY: 180,
      thumbnailUrl: "https://example.com/test.jpg",
      polyCount: 10000,
      textureTypes: JSON.stringify(["albedo", "normal"]),
      fileFormat: "FBX",
      fileSize: 1024000,
    });
    testStoreItemId = storeItem.id;

    // Create user item with personal license
    const userItem = await db.createUserItem({
      userId: testUserId,
      storeItemId: testStoreItemId,
      licenseType: "personal",
      purchasedAt: new Date(),
    });
    testUserItemId = userItem.id;
  });

  it("should retrieve user item by ID", async () => {
    const userItem = await db.getUserItemById(testUserItemId);
    expect(userItem).toBeDefined();
    expect(userItem?.id).toBe(testUserItemId);
    expect(userItem?.licenseType).toBe("personal");
  });

  it("should update user item license type", async () => {
    await db.updateUserItemLicense(testUserItemId, "commercial");
    const userItem = await db.getUserItemById(testUserItemId);
    expect(userItem?.licenseType).toBe("commercial");
  });

  it("should reject upgrade if already commercial", async () => {
    const caller = createCaller({
      user: { id: testUserId, role: "user" },
      session: {},
    });

    try {
      await caller.collection.upgradeLicense({
        userItemId: testUserItemId,
        newLicenseType: "commercial",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Already has commercial license");
    }
  });

  it("should reject upgrade if item not found", async () => {
    const caller = createCaller({
      user: { id: testUserId, role: "user" },
      session: {},
    });

    try {
      await caller.collection.upgradeLicense({
        userItemId: 99999,
        newLicenseType: "commercial",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("not found");
    }
  });

  it("should reject upgrade if unauthorized user", async () => {
    // Create another user
    const otherUser = await db.createUser({
      email: "other-user@example.com",
      name: "Other User",
      openId: "other-user",
      role: "user",
      creditBalance: 0,
    });

    const caller = createCaller({
      user: { id: otherUser.id, role: "user" },
      session: {},
    });

    try {
      await caller.collection.upgradeLicense({
        userItemId: testUserItemId,
        newLicenseType: "commercial",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("unauthorized");
    }
  });

  afterAll(async () => {
    // Cleanup is handled by test database
  });
});
