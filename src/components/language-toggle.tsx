"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
export function LanguageToggle() { const router = useRouter(); const pathname = usePathname(); const search = useSearchParams(); const locale = search?.get("lang") === "en" ? "en" : "fr"; return <button className="ghost-button" onClick={() => { const q = new URLSearchParams(search?.toString()); q.set("lang", locale === "fr" ? "en" : "fr"); router.push(`${pathname}?${q}`); }}>{locale === "fr" ? "EN" : "FR"}</button>; }
