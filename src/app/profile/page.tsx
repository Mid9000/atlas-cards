import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Nav } from "@/components/nav";

export default async function Profile({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const session = await getServerSession(authOptions); if (!session) redirect("/login");
  const locale = (await searchParams).lang === "en" ? "en" : "fr";
  return <main className="app-shell"><Nav locale={locale} username={session.user.username} /><section className="profile-page"><Link className="back-link" href={`/play?lang=${locale}`}>← {locale === "fr" ? "Retour à l’accueil" : "Back home"}</Link><p className="eyebrow">{locale === "fr" ? "PROFIL JOUEUR" : "PLAYER PROFILE"}</p><h1>@{session.user.username}</h1><p className="collection-summary">{session.user.email}</p><div className="profile-card"><strong>{locale === "fr" ? "Pseudo" : "Username"}</strong><span>@{session.user.username}</span><small>{locale === "fr" ? "Le changement de pseudo sera disponible dans une prochaine mise à jour." : "Username changes will be available in a future update."}</small></div></section></main>;
}
