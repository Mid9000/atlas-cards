import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { openPack, StoreError } from "@/lib/store";
import { allow } from "@/lib/rate-limit";
export const runtime = "nodejs";
export async function POST() { const session = await getServerSession(authOptions); if (!session?.user?.id) return Response.json({ error: "Connexion requise.", }, { status: 401 }); if (!allow(`pack:${session.user.id}`, 12, 60_000)) return Response.json({ error: "Trop de tentatives. Réessayez dans une minute." }, { status: 429 }); try { return Response.json(await openPack(session.user.id)); } catch (error) { const safe = error instanceof StoreError ? error : new StoreError("Impossible d’ouvrir le pack. Réessayez.", 500); return Response.json({ error: safe.message }, { status: safe.status }); } }
