import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Nav } from "@/components/nav";
import { leaderboardForUser } from "@/lib/store";

export default async function Ranking({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const session = await getServerSession(authOptions); if (!session) redirect("/login");
  const locale = (await searchParams).lang === "en" ? "en" : "fr";
  const { rows, self } = await leaderboardForUser(session.user.id);
  const heading = locale === "fr" ? "Classement" : "Collection ranking";
  return <main className="app-shell"><Nav locale={locale} username={session.user.username} /><section className="ranking-page"><Link className="back-link" href={`/play?lang=${locale}`}>← {locale === "fr" ? "Retour à l’accueil" : "Back home"}</Link><p className="eyebrow">{locale === "fr" ? "COLLECTION MONDIALE" : "GLOBAL COLLECTION"}</p><h1>{heading}</h1><p className="collection-summary">{locale === "fr" ? "Les doublons ne comptent pas : seules les cartes uniques font progresser votre rang." : "Duplicates do not count: only unique cards improve your rank."}</p><div className="ranking-list">{rows.map((row) => <div className={`ranking-row ${row.username === session.user.username ? "is-self" : ""}`} key={row.username}><strong>#{row.rank}</strong><span>@{row.username}</span><b>{row.uniqueCards} {locale === "fr" ? "cartes uniques" : "unique cards"}</b></div>)}</div>{self && !rows.some((row) => row.rank === self.rank) && <><p className="ranking-separator">…</p><div className="ranking-row is-self"><strong>#{self.rank}</strong><span>@{self.username}</span><b>{self.uniqueCards} {locale === "fr" ? "cartes uniques" : "unique cards"}</b></div></>}</section></main>;
}
