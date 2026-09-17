import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { findUserByEmail } from "@/lib/store";
import { sessionSecret } from "@/lib/session";

export const authOptions: NextAuthOptions = {
  // A stable development secret makes local sessions survive hot reloads. Production must set NEXTAUTH_SECRET.
  secret: sessionSecret || undefined,
  session: { strategy: "jwt" }, pages: { signIn: "/login" },
  providers: [CredentialsProvider({ name: "Email", credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } }, async authorize(credentials) {
    if (!credentials?.email || !credentials.password) return null;
    const user = await findUserByEmail(credentials.email.toLowerCase());
    if (!user || !(await bcrypt.compare(credentials.password, user.passwordHash))) return null;
    return { id: user.id, email: user.email, username: user.username };
  } })],
  callbacks: { jwt: ({ token, user }) => { if (user) { token.sub = user.id; token.username = user.username; } return token; }, session: ({ session, token }) => { if (session.user) { session.user.id = token.sub!; session.user.username = String(token.username ?? ""); } return session; } },
};
