import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";

export const config = {
  matcher: ["/admin/nps-9fourgym/:path*", "/api/admin/:path*"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicAdminRoute =
    pathname.startsWith("/admin/nps-9fourgym/login") || pathname === "/api/admin/login";

  if (isPublicAdminRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ ok: false, message: "Não autorizado." }, { status: 401 });
    }
    const loginUrl = new URL("/admin/nps-9fourgym/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
