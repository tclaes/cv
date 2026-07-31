import "server-only";

const MAX_CHARS = 8000;

/** Fetches a vacancy page and strips it down to plain, prompt-sized text. */
export async function fetchVacancyText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; cv-app/1.0)" },
  });
  if (!res.ok) {
    throw new Error(`Kon vacaturepagina niet ophalen (HTTP ${res.status}).`);
  }
  const html = await res.text();
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
