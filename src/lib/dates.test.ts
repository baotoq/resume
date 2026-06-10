import { describe, expect, it } from "vitest";
import { computeDuration, formatDateRange, formatMonth } from "./dates";

describe("formatMonth", () => {
  it('formats "2024-01" as "Jan 2024"', () => {
    expect(formatMonth("2024-01")).toBe("Jan 2024");
  });

  it('formats "2025-12" as "Dec 2025"', () => {
    expect(formatMonth("2025-12")).toBe("Dec 2025");
  });
});

describe("formatDateRange", () => {
  it("formats a closed range", () => {
    expect(formatDateRange("2024-01", "2025-06")).toBe("Jan 2024 – Jun 2025");
  });

  it("formats an open range as Present", () => {
    expect(formatDateRange("2024-01", null)).toBe("Jan 2024 – Present");
  });
});

describe("computeDuration", () => {
  it("same month returns 1 mos", () => {
    const now = new Date("2026-05-01");
    expect(computeDuration("2024-01", "2024-01", now)).toBe("1 mos");
  });

  it("Jan to Dec same year returns 1 yrs", () => {
    const now = new Date("2026-05-01");
    expect(computeDuration("2024-01", "2024-12", now)).toBe("1 yrs");
  });

  it("Jan to Jan next year returns 1 yrs 1 mos", () => {
    const now = new Date("2026-05-01");
    expect(computeDuration("2024-01", "2025-01", now)).toBe("1 yrs 1 mos");
  });

  it("null endDate (Present) returns non-empty string", () => {
    const now = new Date("2026-05-01");
    const result = computeDuration("2024-01", null, now);
    expect(result.length).toBeGreaterThan(0);
  });
});
