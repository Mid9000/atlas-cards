export async function POST(request: Request) {
  const secure = request.headers.get("x-forwarded-proto") === "https";
  const expired = "Path=/; HttpOnly; SameSite=Lax; Max-Age=0" + (secure ? "; Secure" : "");
  const headers = new Headers({ Location: "/login" });
  headers.append("Set-Cookie", `next-auth.session-token=; ${expired}`);
  headers.append("Set-Cookie", `__Secure-next-auth.session-token=; ${expired}`);

  return new Response(null, {
    status: 303,
    headers,
  });
}
