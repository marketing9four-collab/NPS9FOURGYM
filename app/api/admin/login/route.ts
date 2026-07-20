import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validation/admin";
import { verifyAdminCredentials } from "@/lib/auth/password";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Requisição inválida." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Usuário ou senha incorretos." },
      { status: 400 }
    );
  }

  const valid = await verifyAdminCredentials(parsed.data.username, parsed.data.password);
  if (!valid) {
    return NextResponse.json(
      { ok: false, message: "Usuário ou senha incorretos." },
      { status: 401 }
    );
  }

  const token = await createSessionToken(parsed.data.username);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return response;
}
