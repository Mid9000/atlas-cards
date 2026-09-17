import { rarityOrder, type CardDefinition, type Rarity } from "./types";

const subjects = [
  ["Boussole", "Compass", "object"], ["Croissant", "Croissant", "food"], ["Chat astronaute", "Astronaut Cat", "animal"], ["Tour Eiffel", "Eiffel Tower", "place"], ["Canard pixel", "Pixel Duck", "meme"],
  ["Vinyle", "Vinyl", "culture"], ["Raquette solaire", "Solar Racket", "sport"], ["Bonsaï", "Bonsai", "nature"], ["Robot livreur", "Delivery Robot", "tech"], ["Panda rouge", "Red Panda", "animal"],
  ["Phare d'Islande", "Iceland Lighthouse", "place"], ["Manette rétro", "Retro Controller", "culture"], ["Thé matcha", "Matcha Tea", "food"], ["Skateur nuage", "Cloud Skater", "meme"], ["Appareil photo", "Camera", "object"],
  ["Guitare", "Guitar", "culture"], ["Lynx boréal", "Northern Lynx", "animal"], ["Vélo pliant", "Folding Bike", "object"], ["Ramen cosmique", "Cosmic Ramen", "food"], ["Volcan bleu", "Blue Volcano", "nature"],
] as const;
const modifiers = [["Nomade", "Nomad"], ["Néon", "Neon"], ["Secret", "Secret"], ["Royal", "Royal"], ["Quantique", "Quantum"]] as const;
function rarityFor(index: number): Rarity { return index < 45 ? "Common" : index < 70 ? "Uncommon" : index < 85 ? "Rare" : index < 94 ? "Epic" : index < 99 ? "Legendary" : "Ultimate"; }
export const CARD_CATALOG: CardDefinition[] = Array.from({ length: 100 }, (_, index) => {
  const [fr, en, tag] = subjects[index % subjects.length]; const [modFr, modEn] = modifiers[Math.floor(index / subjects.length)]; const rarity = rarityFor(index); const power = rarityOrder.indexOf(rarity) + 1;
  const id = `atlas-${String(index + 1).padStart(3, "0")}`;
  return { id, rarity, name: { fr: `${fr} ${modFr}`, en: `${modEn} ${en}` }, description: { fr: `Une carte ${tag} à collectionner.`, en: `A collectible ${tag} card.` }, imageUrl: `https://picsum.photos/seed/${id}/700/460`, sourceUrl: "https://picsum.photos", sourceCredit: "Lorem Picsum (temporary curated visual)", tags: [tag], attack: 8 + power * 7 + (index % 6), health: 18 + power * 12 + (index % 9), speed: 3 + power * 2 + (index % 5), ability: { fr: `Éclat ${power}`, en: `Spark ${power}` } };
});
