import { rarityOrder, type Rarity } from "./types";

/** Only tune pack odds here. Weights are normalized after impossible jumps are removed. */
export const PACK_CONFIG = {
  cardsPerPack: 5, freePacksPerWindow: 10, windowHours: 24,
  firstCardRarity: "Common" as Rarity,
  // stay, +1, +2, +3, +4, +5; Ultimate remains exceptional.
  progressionWeights: [84, 13, 2.4, 0.48, 0.1, 0.02],
} as const;
export const rarityIndex = (rarity: Rarity) => rarityOrder.indexOf(rarity);
export function nextRarity(current: Rarity, random = Math.random): Rarity {
  const options: Array<{ weight: number; rarity: Rarity }> = PACK_CONFIG.progressionWeights.flatMap((weight, jump) => { const rarity = rarityOrder[rarityIndex(current) + jump]; return rarity ? [{ weight, rarity }] : []; });
  let roll = random() * options.reduce((sum, item) => sum + item.weight, 0);
  for (const item of options) { roll -= item.weight; if (roll <= 0) return item.rarity; }
  return options.at(-1)!.rarity;
}
