import { describe, expect, it } from "vitest";
import { nextRarity, rarityIndex } from "./rarity";
import { rarityOrder } from "./types";
import { generatePack } from "./generator";
import { mutationCard } from "./mutations";
import { CARD_CATALOG } from "./catalog";
import { rollCreationRarity } from "./creation-config";

describe("progressive rarity", () => {
  it("never decreases rarity", () => { for (const rarity of rarityOrder) for (let i = 0; i < 100; i += 1) expect(rarityIndex(nextRarity(rarity))).toBeGreaterThanOrEqual(rarityIndex(rarity)); });
  it("keeps Ultimate at its ceiling", () => expect(nextRarity("Ultimate", () => 0.99)).toBe("Ultimate"));
  it("never repeats a card inside a pack", () => {
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const pack = generatePack();
      expect(new Set(pack.map((card) => card.id)).size).toBe(pack.length);
    }
  });
  it("creates a distinct stronger mutation variant", () => {
    const variant = mutationCard(CARD_CATALOG[0], "Cosmic");
    expect(variant.id).not.toBe(CARD_CATALOG[0].id);
    expect(variant.mutation).toBe("Cosmic");
    expect(rarityIndex(variant.rarity)).toBeGreaterThan(rarityIndex(CARD_CATALOG[0].rarity));
  });
  it("only returns configured creation rarities", () => {
    for (let roll = 0; roll <= 1; roll += 0.01) expect(rarityOrder).toContain(rollCreationRarity(() => roll));
  });
});
