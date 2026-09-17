import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) { return <main className="auth-page"><section><p className="eyebrow">ATLAS CARDS</p><h1>Bienvenue.</h1><AuthForm mode="login" error={(await searchParams).error} /><p>Nouveau joueur ? <Link href="/register">Créer un compte</Link></p></section></main>; }
