import { rarityOrder, type CardDefinition, type MutationName, type Rarity } from "./types";

export const MUTATION_CONFIG: Array<{ name: MutationName; weight: number; rarityBoost: number; multiplier: number }> = [
  { name: "Enhanced", weight: 1.5, rarityBoost: 1, multiplier: 1.1 }, { name: "Shiny", weight: 0.8, rarityBoost: 1, multiplier: 1.15 }, { name: "Ancient", weight: 0.4, rarityBoost: 2, multiplier: 1.2 }, { name: "Mythic", weight: 0.2, rarityBoost: 3, multiplier: 1.35 }, { name: "Cosmic", weight: 0.1, rarityBoost: 4, multiplier: 1.5 },
];
export function mutationForRoll(random = Math.random) { let roll = random() * 100; for (const mutation of MUTATION_CONFIG) { roll -= mutation.weight; if (roll <= 0) return mutation; } return undefined; }
export function mutationCard(base: CardDefinition, name: MutationName): CardDefinition {
  const config = MUTATION_CONFIG.find((item) => item.name === name)!; const index = Math.min(rarityOrder.length - 1, rarityOrder.indexOf(base.rarity) + config.rarityBoost); const rarity: Rarity = rarityOrder[index];
  return { ...base, id: `mutation-${base.id}-${name.toLowerCase()}`, rarity, cardType: "mutation", baseCardId: base.baseCardId ?? base.id, mutation: name, attack: Math.round(base.attack * config.multiplier), health: Math.round(base.health * config.multiplier), speed: Math.round(base.speed * config.multiplier), ability: { fr: `${name} · ${base.ability.fr}`, en: `${name} · ${base.ability.en}` } };
}
