import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { allow } from "@/lib/rate-limit";
import { createCardAndBonus, StoreError } from "@/lib/store";
import { wikipediaDetails } from "@/lib/wikimedia";
export const runtime = "nodejs";
const bodySchema = z.object({ pageId: z.number().int().positive(), lang: z.enum(["fr", "en"]), profile: z.enum(["balanced", "attack", "health", "speed"]) });
export async function POST(request: Request) { const session = await getServerSession(authOptions); if (!session?.user?.id) return Response.json({ error: "Connexion requise." }, { status: 401 }); if (!allow(`card-create:${session.user.id}`, 4, 60_000)) return Response.json({ error: "Trop de tentatives. Réessayez dans une minute." }, { status: 429 }); const body = bodySchema.safeParse(await request.json().catch(() => null)); if (!body.success) return Response.json({ error: "Demande de création invalide." }, { status: 400 }); try { const details = await wikipediaDetails(body.data.lang, body.data.pageId); return Response.json(await createCardAndBonus(session.user.id, details.source, body.data.profile, details), { status: 201 }); } catch (error) { const safe = error instanceof StoreError ? error : new StoreError("La source Wikipédia ne peut pas être utilisée.", 422); return Response.json({ error: safe.message }, { status: safe.status }); } }
