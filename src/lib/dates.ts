/**
 * Resume date helpers. Resume dates are month-resolution "YYYY-MM" strings;
 * endDate === null means the role is ongoing ("Present"). This module is the
 * only place that knows the representation.
 */

/** Formats a "YYYY-MM" string as e.g. "Jan 2024". */
export function formatMonth(d: string): string {
  const [year, month] = d.split("-");
  return new Date(Number(year), Number(month) - 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

/** Formats a range as e.g. "Jan 2024 – Jun 2025" or "Jan 2024 – Present". */
export function formatDateRange(start: string, end: string | null): string {
  return `${formatMonth(start)} – ${end ? formatMonth(end) : "Present"}`;
}

/**
 * Computes a human-readable duration between two "YYYY-MM" date strings.
 * endDate === null means the role is ongoing; `now` is used as the end point.
 *
 * Endpoints are inclusive (LinkedIn convention): same-month range returns "1 mos",
 * Jan-Dec same year returns "1 yrs", Jan-Jan next year returns "1 yrs 1 mos".
 *
 * Format rules (D-07):
 *   >= 1 year with months remainder: "X yrs Y mos"  (e.g. "4 yrs 3 mos")
 *   >= 1 year, no remainder:         "X yrs"         (e.g. "2 yrs")
 *   < 1 year:                        "Y mos"         (e.g. "8 mos")
 *   < 1 month (negative range only): "< 1 mo"
 */
export function computeDuration(
  startDate: string,
  endDate: string | null,
  now: Date,
): string {
  const [sy, sm] = startDate.split("-").map(Number);
  const ey = endDate ? Number(endDate.split("-")[0]) : now.getFullYear();
  const em = endDate ? Number(endDate.split("-")[1]) : now.getMonth() + 1;

  const totalMonths = (ey - sy) * 12 + (em - sm) + 1;
  if (totalMonths < 1) return "< 1 mo";

  const yrs = Math.floor(totalMonths / 12);
  const mos = totalMonths % 12;

  if (yrs >= 1 && mos > 0) return `${yrs} yrs ${mos} mos`;
  if (yrs >= 1) return `${yrs} yrs`;
  return `${mos} mos`;
}
