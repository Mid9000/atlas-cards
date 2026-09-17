import { db } from "./index";
import { cards } from "./schema";
import { CARD_CATALOG } from "@/lib/game/catalog";

async function seed() { await db().insert(cards).values(CARD_CATALOG).onConflictDoUpdate({ target: cards.id, set: { rarity: cards.rarity, name: cards.name, description: cards.description, imageUrl: cards.imageUrl, sourceUrl: cards.sourceUrl, sourceCredit: cards.sourceCredit, tags: cards.tags, attack: cards.attack, health: cards.health, speed: cards.speed, ability: cards.ability } }); }
seed().then(() => process.exit(0)).catch((error) => { console.error(error); process.exit(1); });
