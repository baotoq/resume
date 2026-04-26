export function formatDateRange(start: string, end: string | null): string {
  const formatMonth = (d: string) => {
    const [year, month] = d.split("-");
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };
  return `${formatMonth(start)} – ${end ? formatMonth(end) : "Present"}`;
}
