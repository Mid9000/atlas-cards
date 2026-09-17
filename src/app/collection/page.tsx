import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Nav } from "@/components/nav";
import { authOptions } from "@/lib/auth";
import { CollectionGrid } from "@/components/collection-grid";
import { catalogCards, collectionForUser } from "@/lib/store";
export default async function Collection({ searchParams }: { searchParams: Promise<{ lang?: string }> }) { const session = await getServerSession(authOptions); if (!session) redirect("/login"); const locale = (await searchParams).lang === "en" ? "en" : "fr"; const [owned, catalog] = await Promise.all([collectionForUser(session.user.id), catalogCards()]); const quantities = Object.fromEntries(owned.map((row) => [row.cardId, row.quantity])); const total = owned.reduce((sum, row) => sum + row.quantity, 0); return <main className="app-shell"><Nav locale={locale} username={session.user.username} /><section className="collection-page"><p className="eyebrow">{locale === "fr" ? "ARCHIVE PERSONNELLE" : "PERSONAL ARCHIVE"}</p><h1>Collection</h1><p className="collection-summary">{total} {locale === "fr" ? "cartes obtenues" : "cards collected"} · {owned.length}/{catalog.length} {locale === "fr" ? "uniques" : "unique"}</p><CollectionGrid cards={catalog} quantities={quantities} locale={locale} /></section></main>; }
