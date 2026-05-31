import { describe, expect, it } from "vitest";
import { getClientIp } from "./rate-limit";

// `ipAddress()` reads the `x-real-ip` header (set by the Vercel proxy), which a
// plain `Request` lacks, so it returns undefined and getClientIp falls back to
// `x-forwarded-for`. We exercise that fallback path directly.
function reqWithForwardedFor(value: string | null): Request {
  const headers = new Headers();
  if (value !== null) {
    headers.set("x-forwarded-for", value);
  }
  return new Request("https://example.com/api/chat", {
    method: "POST",
    headers,
  });
}

describe("getClientIp", () => {
  it("returns an IPv4 address unchanged", () => {
    expect(getClientIp(reqWithForwardedFor("203.0.113.7"))).toBe("203.0.113.7");
  });

  it("takes the first hop from a comma-separated x-forwarded-for", () => {
    expect(getClientIp(reqWithForwardedFor("203.0.113.7, 70.41.3.18"))).toBe(
      "203.0.113.7",
    );
  });

  it("maps two distinct IPv6 addresses in one /64 to the same key", () => {
    const a = getClientIp(reqWithForwardedFor("2001:db8:abcd:1234::1"));
    const b = getClientIp(
      reqWithForwardedFor("2001:db8:abcd:1234:ffff:ffff:ffff:ffff"),
    );
    expect(a).toBe(b);
    expect(a).toContain("/64");
  });

  it("maps addresses in different /64 blocks to different keys", () => {
    const a = getClientIp(reqWithForwardedFor("2001:db8:abcd:1234::1"));
    const b = getClientIp(reqWithForwardedFor("2001:db8:abcd:5678::1"));
    expect(a).not.toBe(b);
  });

  it("collapses :: compression consistently for the same /64", () => {
    const compressed = getClientIp(reqWithForwardedFor("2001:db8::1"));
    const expanded = getClientIp(reqWithForwardedFor("2001:db8:0:0:abcd::9"));
    expect(compressed).toBe(expanded);
  });

  it("keys an IPv4-mapped IPv6 address on its embedded IPv4", () => {
    const mapped = getClientIp(reqWithForwardedFor("::ffff:203.0.113.7"));
    const plain = getClientIp(reqWithForwardedFor("203.0.113.7"));
    expect(mapped).toBe(plain);
    expect(mapped).toBe("203.0.113.7");
  });

  it("matches the IPv4-mapped prefix case-insensitively", () => {
    expect(getClientIp(reqWithForwardedFor("::FFFF:203.0.113.7"))).toBe(
      "203.0.113.7",
    );
  });

  it("gives different IPv4-mapped addresses different keys", () => {
    const a = getClientIp(reqWithForwardedFor("::ffff:203.0.113.7"));
    const b = getClientIp(reqWithForwardedFor("::ffff:198.51.100.9"));
    expect(a).not.toBe(b);
  });

  it("falls back to a single shared bucket when no IP is present", () => {
    const a = getClientIp(reqWithForwardedFor(null));
    const b = getClientIp(reqWithForwardedFor(""));
    expect(a).toBe(b);
    expect(a).not.toMatch(/^\d/);
  });
});
