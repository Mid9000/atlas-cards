import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { allow } from "@/lib/rate-limit";
import { searchWikipedia } from "@/lib/wikimedia";
export const runtime = "nodejs";
const querySchema = z.string().trim().min(2).max(80);
export async function GET(request: Request) { const session = await getServerSession(authOptions); if (!session?.user?.id) return Response.json({ error: "Connexion requise." }, { status: 401 }); const url = new URL(request.url); const result = querySchema.safeParse(url.searchParams.get("q")); if (!result.success) return Response.json({ error: "Saisissez au moins 2 caractères." }, { status: 400 }); if (!allow(`wiki-search:${session.user.id}`, 30, 60_000)) return Response.json({ error: "Trop de recherches. Réessayez dans une minute." }, { status: 429 }); try { return Response.json({ results: await searchWikipedia(result.data, url.searchParams.get("lang")) }); } catch { return Response.json({ error: "Recherche Wikipédia indisponible." }, { status: 502 }); } }
