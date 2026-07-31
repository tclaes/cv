import "server-only";
import { cert, getApps, getApp, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

function readServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    // Support a base64-encoded value too, for env stores that dislike raw JSON.
    return JSON.parse(Buffer.from(raw, "base64").toString("utf-8"));
  }
}

export const isFirebaseAdminConfigured = Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

let app: App | null = null;

function getAdminApp(): App {
  if (getApps().length) return getApp();
  const serviceAccount = readServiceAccount();
  if (!serviceAccount) {
    throw new Error(
      "Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_KEY (see .env.example)."
    );
  }
  app = initializeApp({ credential: cert(serviceAccount) });
  return app;
}

export function getAdminDb(): Firestore {
  return getFirestore(getAdminApp());
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "tom.claes82@gmail.com";
