import { encode } from "next-auth/jwt";
import type { User } from "@/lib/store";

const localSecret = "atlas-cards-local-development-secret";
export const sessionSecret = process.env["NEXTAUTH_SECRET"] ?? (process.env["NODE_ENV"] === "production" ? "" : localSecret);

export async function signedInRedirect(request: Request, user: User) {
  if (!sessionSecret) return new Response(null, { status: 303, headers: { Location: "/login?error=configuration" } });
  const secure = request.headers.get("x-forwarded-proto") === "https";
  const cookieName = `${secure ? "__Secure-" : ""}next-auth.session-token`;
  const token = await encode({ secret: sessionSecret, token: { sub: user.id, email: user.email, username: user.username } });
  return new Response(null, { status: 303, headers: { Location: "/play", "Set-Cookie": `${cookieName}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${secure ? "; Secure" : ""}` } });
}
