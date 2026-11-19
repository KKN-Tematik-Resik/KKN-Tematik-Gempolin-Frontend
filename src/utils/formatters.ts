/**
 * Display formatters adhering to Indonesian locale and WIB timezone.
 */

/**
 * Formats weight in kg with Indonesian thousand separators.
 * Returns "Data tidak tersedia" if value is null (BR-07).
 */
export function formatWeightKg(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "Data tidak tersedia";
  }
  return `${new Intl.NumberFormat("id-ID").format(value)} kg`;
}

/**
 * Formats integer/decimal numbers with Indonesian thousand separators.
 */
export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "Data tidak tersedia";
  }
  return new Intl.NumberFormat("id-ID").format(value);
}

/**
 * Formats ISO date string "YYYY-MM-DD" to Indonesian date format in WIB ("18 Nov 2026").
 * Uses Asia/Jakarta timezone (BR-04).
 */
export function formatWibDate(isoDate: string): string {
  if (!isoDate) return "—";
  const parts = isoDate.split("-").map(Number);
  if (parts.length < 3 || parts.some(Number.isNaN)) {
    return isoDate;
  }
  const [year, month, day] = parts;
  // Use UTC noon to prevent date drifting regardless of local system timezone
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

/**
 * Formats percentage delta with sign (e.g. "+20%", "-5%", "0%", or "—" if null).
 */
export function formatPercentageDelta(percentage: number | null | undefined): string {
  if (percentage === null || percentage === undefined) {
    return "—";
  }
  if (percentage > 0) {
    return `+${percentage}%`;
  }
  return `${percentage}%`;
}

/**
 * Formats period "YYYY-MM" to "Bulan YYYY" (e.g. "2026-11" -> "November 2026").
 */
export function formatPeriodeLabel(periode: string): string {
  if (!periode) return "—";
  const [year, month] = periode.split("-").map(Number);
  if (!year || !month || Number.isNaN(year) || Number.isNaN(month)) {
    return periode;
  }
  const date = new Date(Date.UTC(year, month - 1, 1, 12, 0, 0));
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);
}
