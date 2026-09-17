import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db/index";
import { collections, packOpenings, packWindows } from "@/db/schema";
import { generatePack } from "./generator";
import { PACK_CONFIG } from "./rarity";

export class GameError extends Error { constructor(message: string, readonly status = 400) { super(message); } }
export async function openPackForUser(userId: string) {
  const database = db(); const now = new Date(); const expiry = new Date(now.getTime() - PACK_CONFIG.windowHours * 3_600_000);
  return database.transaction(async (tx) => {
    // Serializes simultaneous requests for this player until the receipt is committed.
    await tx.execute(sql`select id from users where id = ${userId} for update`);
    const window = await tx.query.packWindows.findFirst({ where: eq(packWindows.userId, userId) });
    let used = window?.used ?? 0;
    if (!window || window.startedAt < expiry) { used = 0; await tx.insert(packWindows).values({ userId, startedAt: now, used: 0 }).onConflictDoUpdate({ target: packWindows.userId, set: { startedAt: now, used: 0 } }); }
    if (used >= PACK_CONFIG.freePacksPerWindow) throw new GameError("Daily pack limit reached", 429);
    const drawn = generatePack();
    for (const card of drawn) await tx.insert(collections).values({ userId, cardId: card.id, quantity: 1, updatedAt: now }).onConflictDoUpdate({ target: [collections.userId, collections.cardId], set: { quantity: sql`${collections.quantity} + 1`, updatedAt: now } });
    const [opening] = await tx.insert(packOpenings).values({ userId, cards: drawn.map((card) => card.id) }).returning();
    await tx.update(packWindows).set({ used: used + 1 }).where(eq(packWindows.userId, userId));
    return { openingId: opening.id, cards: drawn, remaining: PACK_CONFIG.freePacksPerWindow - used - 1 };
  });
}
export async function openingForUser(userId: string, openingId: string) { return db().query.packOpenings.findFirst({ where: and(eq(packOpenings.id, openingId), eq(packOpenings.userId, userId)) }); }
