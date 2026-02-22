import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  // Store user wallet associations and cached profile data
  walletProfiles: defineTable({
    userId: v.id("users"),
    walletAddress: v.string(),
    hasProfile: v.boolean(),
    element: v.optional(v.string()),
    level: v.optional(v.number()),
    xp: v.optional(v.number()),
    energy: v.optional(v.number()),
    luckyNumber: v.optional(v.number()),
    winStreak: v.optional(v.number()),
    lastFortuneTime: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_wallet", ["walletAddress"]),

  // Store match history
  matchHistory: defineTable({
    userId: v.id("users"),
    walletAddress: v.string(),
    partnerAddress: v.string(),
    compatibilityScore: v.number(),
    matchType: v.string(),
    timestamp: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_wallet", ["walletAddress"]),

  // Store fortune history
  fortuneHistory: defineTable({
    userId: v.id("users"),
    walletAddress: v.string(),
    fortuneMessage: v.string(),
    xpGained: v.number(),
    energyChange: v.number(),
    timestamp: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_wallet", ["walletAddress"]),
});
