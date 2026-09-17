import bcrypt from "bcryptjs";
import { findUserByEmail } from "@/lib/store";
import { signedInRedirect } from "@/lib/session";

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get("email") ?? "").toLowerCase();
  const password = String(form.get("password") ?? "");
  const user = await findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return new Response(null, { status: 303, headers: { Location: "/login?error=credentials" } });
  return signedInRedirect(request, user);
}
