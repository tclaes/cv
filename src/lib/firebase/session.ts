import "server-only";
import { cookies } from "next/headers";
import { ADMIN_EMAIL, getAdminAuth, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { SESSION_COOKIE_NAME } from "@/lib/auth-constants";

export { SESSION_COOKIE_NAME };
const SESSION_EXPIRES_IN_MS = 5 * 24 * 60 * 60 * 1000; // 5 days

export async function createSessionCookie(idToken: string): Promise<string> {
  const auth = getAdminAuth();
  // Reject anything not from the allowlisted admin before minting a session cookie.
  const decoded = await auth.verifyIdToken(idToken);
  if (decoded.email !== ADMIN_EMAIL) {
    throw new Error("Not authorized");
  }
  return auth.createSessionCookie(idToken, { expiresIn: SESSION_EXPIRES_IN_MS });
}

export async function getAdminSession() {
  if (!isFirebaseAdminConfigured) return null;
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await getAdminAuth().verifySessionCookie(sessionCookie, true);
    if (decoded.email !== ADMIN_EMAIL) return null;
    return decoded;
  } catch {
    return null;
  }
}
