import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The module holds a lazy singleton, so every test re-imports a fresh copy.
async function loadModule() {
  return import("./rate-limit");
}

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

function requestWithForwardedFor(value?: string): Request {
  return new Request("http://localhost:3000/api/chat", {
    headers: value ? { "x-forwarded-for": value } : {},
  });
}

describe("getRateLimitKey", () => {
  it("passes IPv4 addresses through", async () => {
    const { getRateLimitKey } = await loadModule();
    expect(getRateLimitKey(requestWithForwardedFor("203.0.113.7"))).toBe(
      "ip:203.0.113.7",
    );
  });

  it("takes the first IP when x-forwarded-for lists several", async () => {
    const { getRateLimitKey } = await loadModule();
    expect(
      getRateLimitKey(requestWithForwardedFor("203.0.113.7, 10.0.0.1")),
    ).toBe("ip:203.0.113.7");
  });

  it("falls back to a shared bucket without the header", async () => {
    const { getRateLimitKey } = await loadModule();
    expect(getRateLimitKey(requestWithForwardedFor())).toBe("shared");
  });

  it("maps two IPv6 addresses in the same /64 to the same key", async () => {
    const { getRateLimitKey } = await loadModule();
    const a = getRateLimitKey(requestWithForwardedFor("2001:db8:1:2:aaaa::1"));
    const b = getRateLimitKey(requestWithForwardedFor("2001:db8:1:2:bbbb::2"));
    expect(a).toBe("ip:2001:db8:1:2::/64");
    expect(b).toBe(a);
  });

  it("maps different /64 prefixes to different keys", async () => {
    const { getRateLimitKey } = await loadModule();
    const a = getRateLimitKey(requestWithForwardedFor("2001:db8:1:2::1"));
    const b = getRateLimitKey(requestWithForwardedFor("2001:db8:1:3::1"));
    expect(a).not.toBe(b);
  });

  it("expands '::' before taking the /64 prefix", async () => {
    const { getRateLimitKey } = await loadModule();
    expect(getRateLimitKey(requestWithForwardedFor("2001:db8::1"))).toBe(
      "ip:2001:db8:0:0::/64",
    );
  });

  it("lowercases mixed-case IPv6 addresses", async () => {
    const { getRateLimitKey } = await loadModule();
    expect(getRateLimitKey(requestWithForwardedFor("2001:DB8::1"))).toBe(
      "ip:2001:db8:0:0::/64",
    );
  });

  it("normalizes leading-zero hextets to the same key", async () => {
    const { getRateLimitKey } = await loadModule();
    const padded = getRateLimitKey(requestWithForwardedFor("2001:0db8::1"));
    const bare = getRateLimitKey(requestWithForwardedFor("2001:db8::1"));
    expect(padded).toBe(bare);
  });

  it("does not throw on malformed addresses with too many groups", async () => {
    const { getRateLimitKey } = await loadModule();
    const key = getRateLimitKey(requestWithForwardedFor("1:2:3:4:5:6:7:8::9"));
    expect(typeof key).toBe("string");
    expect(key.startsWith("ip:")).toBe(true);
  });
});

describe("isChatConfigured", () => {
  it("is true when both Upstash vars are set", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-token");
    const { isChatConfigured } = await loadModule();
    expect(isChatConfigured()).toBe(true);
  });

  it("is false when either var is missing", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    const { isChatConfigured } = await loadModule();
    expect(isChatConfigured()).toBe(false);
  });
});

describe("getRateLimiter", () => {
  it("returns null when unconfigured", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    const { getRateLimiter } = await loadModule();
    expect(getRateLimiter()).toBeNull();
  });

  it("returns a limiter when configured", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-token");
    const { getRateLimiter } = await loadModule();
    expect(getRateLimiter()).not.toBeNull();
  });
});
