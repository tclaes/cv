const MONTHS_NL = [
  "jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec",
];

/** Formats an ISO "YYYY-MM" string as "mrt 2023"; passes through free-text values unchanged. */
export function formatPeriod(value: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return value;
  const [, year, month] = match;
  const label = MONTHS_NL[Number(month) - 1];
  return label ? `${label} ${year}` : value;
}

/** Whole years between an ISO "YYYY-MM" start date and now. */
export function computeYearsSince(start: string): number {
  const match = /^(\d{4})-(\d{2})$/.exec(start);
  if (!match) return 0;
  const [, year, month] = match;
  const startDate = new Date(Number(year), Number(month) - 1);
  const now = new Date();
  let years = now.getFullYear() - startDate.getFullYear();
  if (now.getMonth() < startDate.getMonth()) years -= 1;
  return Math.max(0, years);
}

export function formatRange(start: string, end: string): string {
  const startLabel = formatPeriod(start);
  const endLabel = end === "heden" ? "heden" : formatPeriod(end);
  if (!startLabel && !endLabel) return "";
  if (!endLabel) return startLabel;
  return `${startLabel}–${endLabel}`;
}
