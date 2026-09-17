import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { allow } from "@/lib/rate-limit";
import { wikipediaDetails } from "@/lib/wikimedia";
export const runtime = "nodejs";
export async function GET(request: Request) { const session = await getServerSession(authOptions); if (!session?.user?.id) return Response.json({ error: "Connexion requise." }, { status: 401 }); const url = new URL(request.url); const pageId = z.coerce.number().int().positive().safeParse(url.searchParams.get("pageId")); if (!pageId.success) return Response.json({ error: "Page Wikipédia invalide." }, { status: 400 }); if (!allow(`wiki-page:${session.user.id}`, 20, 60_000)) return Response.json({ error: "Trop de demandes. Réessayez dans une minute." }, { status: 429 }); try { return Response.json(await wikipediaDetails(url.searchParams.get("lang"), pageId.data)); } catch (error) { const message = error instanceof Error && error.message === "No usable Wikimedia image" ? "Cette page ne possède pas d’image Wikimedia utilisable." : "Cette page ou sa licence ne peut pas être utilisée."; return Response.json({ error: message }, { status: 422 }); } }
