import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { RATE_LIMIT_REQUESTS, RATE_LIMIT_WINDOW } from "./config";

export function isChatConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

let limiter: Ratelimit | null = null;

export function getRateLimiter(): Ratelimit | null {
  if (!isChatConfigured()) return null;
  if (!limiter) {
    limiter = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.fixedWindow(RATE_LIMIT_REQUESTS, RATE_LIMIT_WINDOW),
      analytics: false,
      prefix: "ratelimit:chat",
    });
  }
  return limiter;
}

// Expands an IPv6 address to its 8 hextets (handles '::' anywhere; embedded
// IPv4 forms are not handled — Vercel forwards plain addresses).
function expandIpv6(address: string): string[] {
  const [head = "", tail = ""] = address.toLowerCase().split("::");
  const headGroups = head ? head.split(":") : [];
  if (!address.includes("::")) return headGroups;
  const tailGroups = tail ? tail.split(":") : [];
  const missing = Math.max(0, 8 - headGroups.length - tailGroups.length);
  return [...headGroups, ...Array(missing).fill("0"), ...tailGroups];
}

// Hextets are normalized ("0db8" -> "db8") so textual variants of the same
// address always land in the same bucket.
function normalizeHextet(hextet: string): string {
  return Number.parseInt(hextet || "0", 16).toString(16);
}

export function getRateLimitKey(request: Request): string {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!ip) return "shared";
  if (!ip.includes(":")) return `ip:${ip}`;
  const prefix = expandIpv6(ip).slice(0, 4).map(normalizeHextet).join(":");
  return `ip:${prefix}::/64`;
}
