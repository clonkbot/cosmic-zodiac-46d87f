export const CONTRACT_ADDRESS = "0x374531294780aB871568Ebc8a3606c80D62cdc5e" as const;

// ABI for the Astrology contract based on typical functions
export const CONTRACT_ABI = [
  {
    inputs: [],
    name: "createProfile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getDailyFortune",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "partner", type: "address" }],
    name: "matchWith",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getProfile",
    outputs: [
      { internalType: "uint8", name: "element", type: "uint8" },
      { internalType: "uint256", name: "level", type: "uint256" },
      { internalType: "uint256", name: "xp", type: "uint256" },
      { internalType: "uint256", name: "energy", type: "uint256" },
      { internalType: "uint256", name: "luckyNumber", type: "uint256" },
      { internalType: "uint256", name: "winStreak", type: "uint256" },
      { internalType: "uint256", name: "lastFortuneTime", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "hasProfile",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "user1", type: "address" },
      { internalType: "address", name: "user2", type: "address" },
    ],
    name: "getCompatibility",
    outputs: [
      { internalType: "uint256", name: "score", type: "uint256" },
      { internalType: "string", name: "matchType", type: "string" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "canGetFortune",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint8", name: "element", type: "uint8" },
      { indexed: false, internalType: "uint256", name: "luckyNumber", type: "uint256" },
    ],
    name: "ProfileCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "xpGained", type: "uint256" },
      { indexed: false, internalType: "int256", name: "energyChange", type: "int256" },
    ],
    name: "FortuneReceived",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user1", type: "address" },
      { indexed: true, internalType: "address", name: "user2", type: "address" },
      { indexed: false, internalType: "uint256", name: "compatibility", type: "uint256" },
    ],
    name: "MatchMade",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "newLevel", type: "uint256" },
    ],
    name: "LevelUp",
    type: "event",
  },
] as const;

export const ELEMENTS = ["Fire", "Water", "Air", "Earth"] as const;

export function getElementName(elementId: number): string {
  return ELEMENTS[elementId] || "Unknown";
}

export function getElementColor(element: string): {
  primary: string;
  secondary: string;
  glow: string;
} {
  switch (element.toLowerCase()) {
    case "fire":
      return { primary: "#ff7b00", secondary: "#ffa726", glow: "rgba(255, 123, 0, 0.4)" };
    case "water":
      return { primary: "#00d4ff", secondary: "#26c6da", glow: "rgba(0, 212, 255, 0.4)" };
    case "air":
      return { primary: "#b388ff", secondary: "#e1bee7", glow: "rgba(179, 136, 255, 0.4)" };
    case "earth":
      return { primary: "#4caf50", secondary: "#8bc34a", glow: "rgba(76, 175, 80, 0.4)" };
    default:
      return { primary: "#ffd700", secondary: "#ffc107", glow: "rgba(255, 215, 0, 0.4)" };
  }
}

export function getElementEmoji(element: string): string {
  switch (element.toLowerCase()) {
    case "fire":
      return "🔥";
    case "water":
      return "💧";
    case "air":
      return "🌬️";
    case "earth":
      return "🌍";
    default:
      return "✨";
  }
}
