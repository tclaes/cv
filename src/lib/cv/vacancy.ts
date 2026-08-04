import "server-only";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const MAX_CHARS = 8000;
const MAX_RESPONSE_BYTES = 2_000_000;
const FETCH_TIMEOUT_MS = 10_000;
const MAX_REDIRECTS = 5;

function isPrivateOrReservedIp(ip: string): boolean {
  const family = isIP(ip);
  if (family === 4) {
    const parts = ip.split(".").map(Number);
    const [a, b] = parts;
    return (
      a === 10 ||
      a === 127 ||
      a === 0 ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 169 && b === 254) // link-local, includes the 169.254.169.254 cloud metadata endpoint
    );
  }
  if (family === 6) {
    const lower = ip.toLowerCase();
    return lower === "::1" || lower.startsWith("fe80:") || lower.startsWith("fc") || lower.startsWith("fd");
  }
  return true; // unparseable — treat as unsafe
}

async function assertSafeUrl(url: URL): Promise<void> {
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Alleen http(s) vacature-URLs zijn toegestaan.");
  }
  const addresses = await lookup(url.hostname, { all: true }).catch(() => []);
  if (addresses.length === 0 || addresses.some((a) => isPrivateOrReservedIp(a.address))) {
    throw new Error("Deze vacature-URL wijst naar een niet-toegestaan adres.");
  }
}

/** Fetches a vacancy page and strips it down to plain, prompt-sized text. */
export async function fetchVacancyText(rawUrl: string): Promise<string> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("Ongeldige vacature-URL.");
  }
  let res: Response;
  for (let hop = 0; ; hop++) {
    await assertSafeUrl(url);
    res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; cv-app/1.0)" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      redirect: "manual",
    });
    if (res.status < 300 || res.status >= 400) break;
    if (hop >= MAX_REDIRECTS) {
      throw new Error("Te veel doorverwijzingen bij het ophalen van de vacaturepagina.");
    }
    const location = res.headers.get("location");
    if (!location) {
      throw new Error("Ongeldige doorverwijzing bij het ophalen van de vacaturepagina.");
    }
    try {
      url = new URL(location, url);
    } catch {
      throw new Error("Ongeldige doorverwijzing bij het ophalen van de vacaturepagina.");
    }
  }
  if (!res.ok) {
    throw new Error(`Kon vacaturepagina niet ophalen (HTTP ${res.status}).`);
  }

  const reader = res.body?.getReader();
  if (!reader) {
    throw new Error("Kon vacaturepagina niet lezen.");
  }
  const chunks: Uint8Array[] = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > MAX_RESPONSE_BYTES) {
      await reader.cancel();
      throw new Error("Vacaturepagina is te groot om te verwerken.");
    }
    chunks.push(value);
  }
  const html = Buffer.concat(chunks).toString("utf-8");

  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
  return text.slice(0, MAX_CHARS);
}
