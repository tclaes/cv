import { NextRequest, NextResponse } from "next/server";
import { createSessionCookie } from "@/lib/firebase/session";
import { SESSION_COOKIE_NAME } from "@/lib/auth-constants";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { idToken } = await request.json();
  if (typeof idToken !== "string") {
    return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
  }

  try {
    const sessionCookie = await createSessionCookie(idToken);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 5 * 24 * 60 * 60,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
