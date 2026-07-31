import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth-constants";

/**
 * Cheap, Edge-safe first pass: redirects requests with no session cookie at all.
 * The real check (signature + email allowlist, via Firebase Admin) happens in
 * src/app/admin/layout.tsx, which only runs in the Node.js runtime.
 */
export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);
  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
