import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
export default async function Register({ searchParams }: { searchParams: Promise<{ error?: string }> }) { return <main className="auth-page"><section><p className="eyebrow">ATLAS CARDS</p><h1>Commencez votre collection.</h1><AuthForm mode="register" error={(await searchParams).error} /><p>Déjà un compte ? <Link href="/login">Se connecter</Link></p></section></main>; }
