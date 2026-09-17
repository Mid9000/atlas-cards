import { rarityOrder, type Rarity } from "./types";

export const CREATION_CONFIG = {
  windowHours: 24,
  rarityWeights: [{ rarity: "Common", weight: 65 }, { rarity: "Uncommon", weight: 22 }, { rarity: "Rare", weight: 8 }, { rarity: "Epic", weight: 3.5 }, { rarity: "Legendary", weight: 1.2 }, { rarity: "Ultimate", weight: 0.3 }] as const,
  profiles: {
    balanced: { fr: "Équilibrée", en: "Balanced", attack: 1, health: 1, speed: 1 },
    attack: { fr: "Assaut", en: "Assault", attack: 1.28, health: 0.88, speed: 0.96 },
    health: { fr: "Garde", en: "Guard", attack: 0.88, health: 1.28, speed: 0.96 },
    speed: { fr: "Éclair", en: "Swift", attack: 0.96, health: 0.88, speed: 1.35 },
  },
  acceptedLicenses: [/public domain/i, /cc0/i, /cc[- ]by/i, /creative commons attribution/i],
} as const;

export type CombatProfile = keyof typeof CREATION_CONFIG.profiles;
export function rollCreationRarity(random = Math.random): Rarity {
  let roll = random() * CREATION_CONFIG.rarityWeights.reduce((sum, item) => sum + item.weight, 0);
  for (const item of CREATION_CONFIG.rarityWeights) { roll -= item.weight; if (roll <= 0) return item.rarity; }
  return rarityOrder[0];
}
export function statsForCreation(rarity: Rarity, profile: CombatProfile) {
  const power = rarityOrder.indexOf(rarity) + 1; const multiplier = CREATION_CONFIG.profiles[profile];
  return { attack: Math.round((9 + power * 8) * multiplier.attack), health: Math.round((20 + power * 13) * multiplier.health), speed: Math.round((3 + power * 2) * multiplier.speed) };
}
