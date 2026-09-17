export const rarityOrder = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Ultimate"] as const;
export type Rarity = (typeof rarityOrder)[number];
export type Locale = "fr" | "en";
export type CardDefinition = {
  id: string; rarity: Rarity; name: Record<Locale, string>; description: Record<Locale, string>;
  imageUrl: string; sourceUrl: string; sourceCredit: string; tags: string[];
  attack: number; health: number; speed: number; ability: Record<Locale, string>;
  cardType?: "catalog" | "created" | "mutation";
  baseCardId?: string;
  mutation?: MutationName;
  creatorId?: string;
  wikipedia?: WikimediaSource;
};
export type MutationName = "Enhanced" | "Shiny" | "Ancient" | "Mythic" | "Cosmic";
export type WikimediaSource = { pageId: number; language: Locale; title: string; wikipediaUrl: string; fileTitle: string; imageUrl: string; author: string; license: string; licenseUrl: string };
