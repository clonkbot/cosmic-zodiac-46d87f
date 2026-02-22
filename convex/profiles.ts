import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query("walletProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return profile;
  },
});

export const getProfileByWallet = query({
  args: { walletAddress: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("walletProfiles")
      .withIndex("by_wallet", (q) => q.eq("walletAddress", args.walletAddress.toLowerCase()))
      .first();
  },
});

export const saveProfile = mutation({
  args: {
    walletAddress: v.string(),
    hasProfile: v.boolean(),
    element: v.optional(v.string()),
    level: v.optional(v.number()),
    xp: v.optional(v.number()),
    energy: v.optional(v.number()),
    luckyNumber: v.optional(v.number()),
    winStreak: v.optional(v.number()),
    lastFortuneTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("walletProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        walletAddress: args.walletAddress.toLowerCase(),
        updatedAt: Date.now(),
      });
      return existing._id;
    } else {
      return await ctx.db.insert("walletProfiles", {
        userId,
        ...args,
        walletAddress: args.walletAddress.toLowerCase(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});

export const getMatchHistory = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("matchHistory")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(10);
  },
});

export const saveMatch = mutation({
  args: {
    walletAddress: v.string(),
    partnerAddress: v.string(),
    compatibilityScore: v.number(),
    matchType: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("matchHistory", {
      userId,
      walletAddress: args.walletAddress.toLowerCase(),
      partnerAddress: args.partnerAddress.toLowerCase(),
      compatibilityScore: args.compatibilityScore,
      matchType: args.matchType,
      timestamp: Date.now(),
    });
  },
});

export const getFortuneHistory = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("fortuneHistory")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(10);
  },
});

export const saveFortune = mutation({
  args: {
    walletAddress: v.string(),
    fortuneMessage: v.string(),
    xpGained: v.number(),
    energyChange: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("fortuneHistory", {
      userId,
      walletAddress: args.walletAddress.toLowerCase(),
      fortuneMessage: args.fortuneMessage,
      xpGained: args.xpGained,
      energyChange: args.energyChange,
      timestamp: Date.now(),
    });
  },
});
