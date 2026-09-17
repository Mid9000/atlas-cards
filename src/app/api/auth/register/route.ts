import bcrypt from "bcryptjs";
import { z } from "zod";
import { createUser, findUserByEmail, findUserByUsername, StoreError } from "@/lib/store";
import { signedInRedirect } from "@/lib/session";

const input = z.object({ email: z.string().email().max(320), username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_-]+$/), password: z.string().min(8).max(128) });
export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const raw = contentType.includes("application/json") ? await request.json().catch(() => null) : Object.fromEntries((await request.formData()).entries());
  const body = input.safeParse(raw);
  const formRequest = !contentType.includes("application/json");
  if (!body.success) return formRequest ? new Response(null, { status: 303, headers: { Location: "/register?error=validation" } }) : Response.json({ error: "Utilisez un e-mail valide, un pseudo de 3 à 20 caractères (lettres, chiffres, _ ou -) et un mot de passe de 8 caractères." }, { status: 400 });
  const email = body.data.email.toLowerCase();
  const username = body.data.username.toLowerCase();
  try { if (await findUserByEmail(email)) throw new StoreError("Cet e-mail est déjà utilisé.", 409); if (await findUserByUsername(username)) throw new StoreError("Ce pseudo est déjà utilisé.", 409); const user = await createUser(email, username, await bcrypt.hash(body.data.password, 12)); return formRequest ? signedInRedirect(request, user) : Response.json({ ok: true }, { status: 201 }); } catch (error) { const safe = error instanceof StoreError ? error : new StoreError("Impossible de créer le compte. Réessayez.", 500); return formRequest ? new Response(null, { status: 303, headers: { Location: `/register?error=${safe.status === 409 ? "duplicate" : "server"}` } }) : Response.json({ error: safe.message }, { status: safe.status }); }
}
