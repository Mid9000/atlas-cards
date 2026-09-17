import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Nav } from "@/components/nav";
import { PackOpener } from "@/components/pack-opener";
import { packStatus } from "@/lib/store";
export default async function Packs({ searchParams }: { searchParams: Promise<{ lang?: string; opening?: string }> }) { const session = await getServerSession(authOptions); if (!session) redirect("/login"); const params = await searchParams; const locale = params.lang === "en" ? "en" : "fr"; const status = await packStatus(session.user.id); return <main className="app-shell"><Nav locale={locale} username={session.user.username} /><PackOpener locale={locale} initialRemaining={status.remaining} initialResetsAt={status.resetsAt.toISOString()} openingId={params.opening} /></main>; }
