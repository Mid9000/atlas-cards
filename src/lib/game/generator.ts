import { randomInt } from "crypto";
import { CARD_CATALOG } from "./catalog";
import { PACK_CONFIG, nextRarity } from "./rarity";
import { rarityOrder, type CardDefinition, type Rarity } from "./types";

function choicesFor(catalog: CardDefinition[], rarity: Rarity, usedIds: Set<string>): CardDefinition[] {
  return catalog.filter((card) => card.rarity === rarity && !usedIds.has(card.id));
}

function pickCard(catalog: CardDefinition[], rarity: Rarity, usedIds: Set<string>): CardDefinition {
  const choices = choicesFor(catalog, rarity, usedIds);
  if (!choices.length) throw new Error(`No cards configured for ${rarity}`);
  return choices[randomInt(choices.length)];
}

/**
 * A pack cannot repeat a card. If a very scarce higher rarity (notably
 * Ultimate) would leave too few unique cards for the rest of this pack, stay
 * at the highest safe rarity instead. This preserves the non-decreasing rule.
 */
function safeRarity(catalog: CardDefinition[], current: Rarity, desired: Rarity, usedIds: Set<string>, cardsRemaining: number): Rarity {
  const currentIndex = rarityOrder.indexOf(current);
  for (let index = rarityOrder.indexOf(desired); index >= currentIndex; index -= 1) {
    const candidate = rarityOrder[index];
    const availableHere = choicesFor(catalog, candidate, usedIds);
    const availableFromHere = catalog.filter((card) => rarityOrder.indexOf(card.rarity) >= index && !usedIds.has(card.id));
    if (availableHere.length > 0 && availableFromHere.length >= cardsRemaining) return candidate;
  }
  throw new Error("Not enough unique cards configured to generate this pack");
}

export function generatePack(catalog: CardDefinition[] = CARD_CATALOG): CardDefinition[] {
  const result: CardDefinition[] = []; const usedIds = new Set<string>(); let rarity = PACK_CONFIG.firstCardRarity;
  for (let i = 0; i < PACK_CONFIG.cardsPerPack; i += 1) {
    const desired = i === 0 ? rarity : nextRarity(rarity, () => randomInt(1_000_000) / 1_000_000);
    rarity = safeRarity(catalog, rarity, desired, usedIds, PACK_CONFIG.cardsPerPack - i);
    const card = pickCard(catalog, rarity, usedIds);
    usedIds.add(card.id);
    result.push(card);
  }
  return result;
}
