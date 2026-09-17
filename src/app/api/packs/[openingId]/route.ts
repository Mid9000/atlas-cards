import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { openingForUser } from "@/lib/store";
export async function GET(_: Request, { params }: { params: Promise<{ openingId: string }> }) { const session = await getServerSession(authOptions); if (!session?.user?.id) return Response.json({ error: "Connexion requise." }, { status: 401 }); const opening = await openingForUser(session.user.id, (await params).openingId); if (!opening) return Response.json({ error: "Ouverture introuvable." }, { status: 404 }); return Response.json(opening); }
