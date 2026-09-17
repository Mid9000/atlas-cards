import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { CardCreator } from "@/components/card-creator";
import { Nav } from "@/components/nav";
import { authOptions } from "@/lib/auth";

export default async function CreateCard({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const locale = (await searchParams).lang === "en" ? "en" : "fr";
  return <main className="app-shell"><Nav locale={locale} username={session.user.username} /><CardCreator locale={locale} /></main>;
}
