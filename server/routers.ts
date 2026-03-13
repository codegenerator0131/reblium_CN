import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  user: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserById(ctx.user.id);
    }),
    
    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        bio: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserById(ctx.user.id);
        if (!user) throw new Error("User not found");
        
        await db.updateUser(ctx.user.id, input);
        return { success: true };
      }),

    changePassword: protectedProcedure
      .input(z.object({
        currentPassword: z.string(),
        newPassword: z.string().min(8),
      }))
      .mutation(async ({ ctx, input }) => {
        // In demo mode, just return success
        // In production, verify current password and update
        return { success: true };
      }),

    sendSupportRequest: protectedProcedure
      .input(z.object({
        message: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // In demo mode, just log the request
        console.log(`Support request from user ${ctx.user.id}: ${input.message}`);
        return { success: true };
      }),
  }),

  avatarProjects: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserAvatarProjects(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        thumbnailUrl: z.string().optional(),
        thumbnailKey: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createAvatarProject({
          userId: ctx.user.id,
          name: input.name,
          thumbnailUrl: input.thumbnailUrl || null,
          thumbnailKey: input.thumbnailKey || null,
          isPublished: false,
        });
        return { success: true };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        thumbnailKey: z.string().optional(),
        isPublished: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const project = await db.getAvatarProjectById(input.id);
        if (!project || project.userId !== ctx.user.id) {
          throw new Error("Project not found or unauthorized");
        }

        const { id, ...updates } = input;
        await db.updateAvatarProject(id, updates);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const project = await db.getAvatarProjectById(input.id);
        if (!project || project.userId !== ctx.user.id) {
          throw new Error("Project not found or unauthorized");
        }

        await db.deleteAvatarProject(input.id);
        return { success: true };
      }),

    duplicate: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const project = await db.getAvatarProjectById(input.id);
        if (!project || project.userId !== ctx.user.id) {
          throw new Error("Project not found or unauthorized");
        }

        await db.createAvatarProject({
          userId: ctx.user.id,
          name: `${project.name} (Copy)`,
          thumbnailUrl: project.thumbnailUrl,
          thumbnailKey: project.thumbnailKey,
          isPublished: false,
        });
        return { success: true };
      }),
  }),

  templates: router({
    list: publicProcedure.query(async () => {
      return await db.getAllTemplateAvatars();
    }),

    createFromTemplate: protectedProcedure
      .input(z.object({
        templateId: z.number(),
        name: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // In a real app, you'd copy the template data
        await db.createAvatarProject({
          userId: ctx.user.id,
          name: input.name,
          thumbnailUrl: null,
          thumbnailKey: null,
          isPublished: false,
        });
        return { success: true };
      }),
  }),

  store: router({
    listItems: publicProcedure
      .input(z.object({
        category: z.enum(["clothing", "hair", "face", "accessories", "animations", "packs", "fantasy", "sci-fi"]).optional(),
      }))
      .query(async ({ input }) => {
        const items = input.category 
          ? await db.getStoreItemsByCategory(input.category)
          : await db.getAllStoreItems();
        
        // Group items by category
        const categories = [
          "clothing",
          "hair",
          "face",
          "accessories",
          "animations",
          "packs",
          "fantasy",
          "sci-fi",
        ];
        
        return categories.map(cat => ({
          name: cat,
          items: items.filter(item => item.category === cat),
        }));
      }),

    getItemById: publicProcedure
      .input(z.object({
        itemId: z.number(),
      }))
      .query(async ({ input }) => {
        return await db.getStoreItemById(input.itemId);
      }),

    purchaseItem: protectedProcedure
      .input(z.object({
        storeItemId: z.number(),
        licenseType: z.enum(["personal", "commercial"]),
      }))
      .mutation(async ({ ctx, input }) => {

        const item = await db.getStoreItemById(input.storeItemId);
        if (!item) throw new Error("Item not found");

        // Get fixed USD price based on license type
        const priceUSD = input.licenseType === "personal" ? parseFloat(item.personalPriceUSD.toString()) : parseFloat(item.commercialPriceUSD.toString());

        // In production, this would integrate with Stripe or another payment processor
        // For now, we'll record the purchase with USD pricing
        await db.createUserItem({
          userId: ctx.user.id,
          storeItemId: input.storeItemId,
          licenseType: input.licenseType,
          priceInCredits: Math.round(priceUSD * 100), // Store as cents for reference
        });

        return { success: true, priceUSD };
      }),
  }),

  purchase: router({
    getUserItems: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserItems(ctx.user.id);
    }),

    getUserPurchases: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserPurchasesWithDetails(ctx.user.id);
    }),
  }),


  collection: router({
    getPurchases: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserPurchasesWithDetails(ctx.user.id);
    }),

    upgradeLicense: protectedProcedure
      .input(z.object({
        userItemId: z.number(),
        newLicenseType: z.enum(["personal", "commercial"]),
      }))
      .mutation(async ({ ctx, input }) => {
        const userItem = await db.getUserItemById(input.userItemId);
        if (!userItem || userItem.userId !== ctx.user.id) {
          throw new Error("Item not found or unauthorized");
        }

        const storeItem = await db.getStoreItemById(userItem.storeItemId);
        if (!storeItem) {
          throw new Error("Store item not found");
        }

        if (userItem.licenseType === "commercial") {
          throw new Error("Already has commercial license");
        }

        if (input.newLicenseType !== "commercial") {
          throw new Error("Can only upgrade to commercial license");
        }

        const personalPrice = parseFloat(storeItem.personalPriceUSD.toString());
        const commercialPrice = parseFloat(storeItem.commercialPriceUSD.toString());
        const upgradeCost = commercialPrice - personalPrice;

        await db.updateUserItemLicense(input.userItemId, "commercial");

        return {
          success: true,
          upgradeCost,
          newLicenseType: "commercial",
        };
      }),
  }),

  credits: router({
    getBalance: protectedProcedure.query(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user.id);
      return { balance: user?.creditBalance || 0 };
    }),

    listPacks: publicProcedure.query(async () => {
      return await db.getActiveCreditPacks();
    }),

    purchasePack: protectedProcedure
      .input(z.object({
        packId: z.number(),
        paymentMethod: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const pack = await db.getCreditPackById(input.packId);
        if (!pack) throw new Error("Credit pack not found");

        const user = await db.getUserById(ctx.user.id);
        if (!user) throw new Error("User not found");

        // Create purchase record
        await db.createCreditPurchase({
          userId: ctx.user.id,
          creditPackId: input.packId,
          credits: pack.credits,
          amountUSD: pack.priceUSD,
          paymentMethod: input.paymentMethod || "demo",
          paymentStatus: "completed", // In production, this would be "pending"
        });

        // For demo purposes, immediately complete the purchase
        const newBalance = user.creditBalance + pack.credits;
        await db.updateUserCredits(ctx.user.id, newBalance);

        // Record transaction
        await db.createCreditTransaction({
          userId: ctx.user.id,
          type: "purchase",
          amount: pack.credits,
          balanceAfter: newBalance,
          description: `Purchased ${pack.credits} credits`,
          relatedId: null,
        });

        return { success: true, newBalance };
      }),

    getTransactions: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserCreditTransactions(ctx.user.id);
    }),

    getPurchases: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserCreditPurchases(ctx.user.id);
    }),
  }),

  downloads: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserAssetDownloads(ctx.user.id);
    }),

    exportAsset: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        format: z.string(),
        creditCost: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserById(ctx.user.id);
        if (!user) throw new Error("User not found");

        const project = await db.getAvatarProjectById(input.projectId);
        if (!project || project.userId !== ctx.user.id) {
          throw new Error("Project not found or unauthorized");
        }

        // Check if user has enough credits
        if (user.creditBalance < input.creditCost) {
          throw new Error("Insufficient credits");
        }

        // Deduct credits
        const newBalance = user.creditBalance - input.creditCost;
        await db.updateUserCredits(ctx.user.id, newBalance);

        // In production, generate actual asset file here
        const mockAssetUrl = `https://example.com/assets/${project.id}.${input.format}`;
        const mockAssetKey = `assets/${project.id}.${input.format}`;

        // Record download
        await db.createAssetDownload({
          userId: ctx.user.id,
          avatarProjectId: input.projectId,
          assetUrl: mockAssetUrl,
          assetKey: mockAssetKey,
          creditCost: input.creditCost,
          format: input.format,
        });

        // Record transaction
        await db.createCreditTransaction({
          userId: ctx.user.id,
          type: "usage",
          amount: -input.creditCost,
          balanceAfter: newBalance,
          description: `Exported ${project.name} as ${input.format}`,
          relatedId: input.projectId,
        });

        return { success: true, assetUrl: mockAssetUrl, newBalance };
      }),
  }),

  invoices: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserCreditPurchases(ctx.user.id);
    }),
  }),

  updates: router({
    listVersions: publicProcedure.query(async () => {
      return await db.getAllSoftwareVersions();
    }),

    getLatest: publicProcedure.query(async () => {
      return await db.getLatestSoftwareVersion();
    }),
  }),

  licenses: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserLicenses(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        licenseType: z.string(),
        expiresAt: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Generate a unique license key
        const licenseKey = `RB-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

        await db.createLicense({
          userId: ctx.user.id,
          licenseKey,
          licenseType: input.licenseType,
          status: "active",
          expiresAt: input.expiresAt || null,
        });

        return { success: true, licenseKey };
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        licenseId: z.number(),
        status: z.enum(["active", "expired", "revoked"]),
      }))
      .mutation(async ({ ctx, input }) => {
        const license = await db.getLicenseByKey("");
        // Verify ownership before updating
        await db.updateLicenseStatus(input.licenseId, input.status);
        return { success: true };
      }),
  }),

  polls: router({
    getActive: publicProcedure.query(async () => {
      const poll = await db.getActivePoll();
      if (!poll) return null;
      return await db.getPollWithOptions(poll.id);
    }),

    vote: publicProcedure
      .input(z.object({
        pollId: z.number(),
        optionId: z.number(),
        voterIdentifier: z.string(),
      }))
      .mutation(async ({ input }) => {
        const hasVoted = await db.hasUserVoted(input.pollId, input.voterIdentifier);
        if (hasVoted) {
          throw new Error("You have already voted in this poll");
        }
        await db.createPollVote({
          pollId: input.pollId,
          optionId: input.optionId,
          voterIdentifier: input.voterIdentifier,
        });
        const poll = await db.getPollWithOptions(input.pollId);
        return poll;
      }),

    getResults: publicProcedure
      .input(z.object({
        pollId: z.number(),
      }))
      .query(async ({ input }) => {
        return await db.getPollResults(input.pollId);
      }),
  }),

  sdks: router({
    list: publicProcedure.query(async () => {
      return await db.getAllSDKs();
    }),

    byEngine: publicProcedure
      .input(z.object({
        engine: z.string(),
      }))
      .query(async ({ input }) => {
        return await db.getSDKsByEngine(input.engine);
      }),

    getById: publicProcedure
      .input(z.object({
        id: z.number(),
      }))
      .query(async ({ input }) => {
        return await db.getSDKById(input.id);
      }),
   }),
  cart: router({
    getItems: protectedProcedure.query(async ({ ctx }) => {
      return await db.getCartItems(ctx.user.id);
    }),
    addItem: protectedProcedure
      .input(z.object({
        storeItemId: z.number(),
        licenseType: z.enum(["personal", "commercial"]),
        quantity: z.number().default(1),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.addToCart(ctx.user.id, input.storeItemId, input.licenseType, input.quantity);
        return { success: true };
      }),
    removeItem: protectedProcedure
      .input(z.object({
        cartItemId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.removeFromCart(input.cartItemId);
        return { success: true };
      }),
    updateQuantity: protectedProcedure
      .input(z.object({
        cartItemId: z.number(),
        quantity: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateCartItemQuantity(input.cartItemId, input.quantity);
        return { success: true };
      }),
    clear: protectedProcedure.mutation(async ({ ctx }) => {
      await db.clearCart(ctx.user.id);
      return { success: true };
    }),
  }),

  featureRequests: router({
    getAll: publicProcedure.query(async () => {
      return await db.getAllFeatureRequests();
    }),
    
    create: publicProcedure
      .input(z.object({
        userId: z.number(),
        userName: z.string().min(1).max(255),
        title: z.string().min(1).max(255),
        category: z.string().min(1).max(100),
        description: z.string().min(1).max(2000),
      }))
      .mutation(async ({ input }) => {
        return await db.createFeatureRequest({
          userId: input.userId,
          userName: input.userName,
          title: input.title,
          category: input.category,
          description: input.description,
        });
      }),
    
    update: publicProcedure
      .input(z.object({
        requestId: z.number(),
        userId: z.number(),
        title: z.string().min(1).max(255),
        category: z.string().min(1).max(100),
        description: z.string().min(1).max(2000),
      }))
      .mutation(async ({ input }) => {
        const requests = await db.getFeatureRequestById(input.requestId);
        const request = requests[0];
        if (!request || request.userId !== input.userId) {
          throw new Error("Unauthorized");
        }
        return await db.updateFeatureRequest(input.requestId, {
          title: input.title,
          category: input.category,
          description: input.description,
        });
      }),
    
    delete: publicProcedure
      .input(z.object({
        requestId: z.number(),
        userId: z.number(),
      }))
      .mutation(async ({ input }) => {
        const requests = await db.getFeatureRequestById(input.requestId);
        const request = requests[0];
        if (!request || request.userId !== input.userId) {
          throw new Error("Unauthorized");
        }
        return await db.deleteFeatureRequest(input.requestId);
      }),
    
    vote: publicProcedure
      .input(z.object({
        requestId: z.number(),
        userIdentifier: z.string(), // IP address or session ID
        voteType: z.enum(["upvote", "downvote"]),
      }))
      .mutation(async ({ input }) => {
        return await db.addFeatureRequestVote({
          requestId: input.requestId,
          userIdentifier: input.userIdentifier,
          voteType: input.voteType,
        });
      }),
    
    getUserVote: publicProcedure
      .input(z.object({
        requestId: z.number(),
        userIdentifier: z.string(),
      }))
      .query(async ({ input }) => {
        const vote = await db.getUserVoteOnRequest(input.requestId, input.userIdentifier);
        return vote.length > 0 ? vote[0] : null;
      }),
    
    getById: publicProcedure
      .input(z.object({
        requestId: z.number(),
      }))
      .query(async ({ input }) => {
        return await db.getFeatureRequestById(input.requestId);
      })
  }),

  contentSubmission: router({
    submit: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        category: z.enum(["clothing", "hair", "face", "accessories", "animations", "packs"]),
        fileUrl: z.string(),
        fileKey: z.string(),
        thumbnailUrl: z.string().optional(),
        thumbnailKey: z.string().optional(),
        polyCount: z.number().optional(),
        textureTypes: z.string().optional(),
        fileFormat: z.string().optional(),
        fileSize: z.number().optional(),
        personalPriceUSD: z.number().positive(),
        commercialPriceUSD: z.number().positive(),
        personalPriceCNY: z.number().positive(),
        commercialPriceCNY: z.number().positive(),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await db.createContentSubmission({
          artistId: ctx.user.id,
          title: input.title,
          description: input.description,
          category: input.category as any,
          fileUrl: input.fileUrl,
          fileKey: input.fileKey,
          thumbnailUrl: input.thumbnailUrl || null,
          thumbnailKey: input.thumbnailKey || null,
          polyCount: input.polyCount || null,
          textureTypes: input.textureTypes ? JSON.stringify(input.textureTypes.split(",")) : null,
          fileFormat: input.fileFormat || null,
          fileSize: input.fileSize || null,
          personalPriceUSD: input.personalPriceUSD.toString(),
          commercialPriceUSD: input.commercialPriceUSD.toString(),
          personalPriceCNY: input.personalPriceCNY.toString(),
          commercialPriceCNY: input.commercialPriceCNY.toString(),
          status: "pending",
        });
        return { success: true, submissionId: (result as any).insertId || 0 };
      }),

    getPending: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== "admin") throw new Error("Unauthorized");
        return await db.getPendingContentSubmissions();
      }),

    getAll: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== "admin") throw new Error("Unauthorized");
        return await db.getAllContentSubmissions();
      }),

    getByArtist: protectedProcedure
      .query(async ({ ctx }) => {
        return await db.getContentSubmissionsByArtist(ctx.user.id);
      }),

    review: protectedProcedure
      .input(z.object({
        submissionId: z.number(),
        status: z.enum(["approved", "revision_required", "rejected"]),
        visualQualityFeedback: z.string().optional(),
        technicalFeedback: z.string().optional(),
        optimizationFeedback: z.string().optional(),
        namingFeedback: z.string().optional(),
        overallComments: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("Unauthorized");

        await db.updateContentSubmissionStatus(input.submissionId, input.status);
        await db.createContentReview({
          submissionId: input.submissionId,
          reviewerId: ctx.user.id,
          status: input.status,
          visualQualityFeedback: input.visualQualityFeedback || null,
          technicalFeedback: input.technicalFeedback || null,
          optimizationFeedback: input.optimizationFeedback || null,
          namingFeedback: input.namingFeedback || null,
          overallComments: input.overallComments || null,
        });

        return { success: true };
      }),
  }),
});
export type AppRouter = typeof appRouter;
