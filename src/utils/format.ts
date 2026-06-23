// ============================================================
// Format Utilities
// ============================================================

/**
 * Format a date string to a locale-aware format
 */
export function formatDate(
  date: string | Date,
  locale: string = "ar-SA",
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  });
}

/**
 * Format a date string to show time
 */
export function formatTime(
  date: string | Date,
  locale: string = "ar-SA"
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format a date string to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date, locale: string = "ar"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (diffDay > 0) return rtf.format(-diffDay, "day");
  if (diffHr > 0) return rtf.format(-diffHr, "hour");
  if (diffMin > 0) return rtf.format(-diffMin, "minute");
  return rtf.format(-diffSec, "second");
}

/**
 * Format a number as a percentage
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a number with locale-aware separators
 */
export function formatNumber(
  value: number,
  locale: string = "ar-SA"
): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
