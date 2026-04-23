/**
 * Computes a human-readable duration between two "YYYY-MM" date strings.
 * endDate === null means the role is ongoing; `now` is used as the end point.
 *
 * Format rules (D-07):
 *   >= 1 year with months remainder: "X yrs Y mos"  (e.g. "4 yrs 3 mos")
 *   >= 1 year, no remainder:         "X yrs"         (e.g. "2 yrs")
 *   < 1 year:                        "Y mos"         (e.g. "8 mos")
 *   < 1 month (incl. negative):      "< 1 mo"
 */
export function computeDuration(
  startDate: string,
  endDate: string | null,
  now: Date,
): string {
  const [sy, sm] = startDate.split("-").map(Number);
  const ey = endDate ? Number(endDate.split("-")[0]) : now.getFullYear();
  const em = endDate ? Number(endDate.split("-")[1]) : now.getMonth() + 1;

  const totalMonths = (ey - sy) * 12 + (em - sm);
  if (totalMonths < 1) return "< 1 mo";

  const yrs = Math.floor(totalMonths / 12);
  const mos = totalMonths % 12;

  if (yrs >= 1 && mos > 0) return `${yrs} yrs ${mos} mos`;
  if (yrs >= 1) return `${yrs} yrs`;
  return `${mos} mos`;
}
