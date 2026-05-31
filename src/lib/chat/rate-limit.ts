import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { ipAddress } from "@vercel/functions";
import { RATE_LIMIT_REQUESTS, RATE_LIMIT_WINDOW } from "./config";

// Lazy rate-limiter singleton.
//
// `Redis.fromEnv()` THROWS SYNCHRONOUSLY when UPSTASH_REDIS_REST_URL /
// UPSTASH_REDIS_REST_TOKEN are absent. It must therefore never run at module
// scope (that would crash `next build` / SSG in CI, which has no Upstash
// secrets). The route builds it lazily at request time and maps any failure to
// a 503 — so we let construction errors propagate to the caller.

let limiter: Ratelimit | undefined;

export function getRateLimiter(): Ratelimit {
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

// Fail-CLOSED shared bucket key used when no client IP can be derived. All such
// requests share one (more restrictive) counter rather than each getting a free
// per-IP budget.
const NO_IP_KEY = "ratelimit:chat:no-ip";

// Expand an IPv6 address to its 8 hextet groups, resolving "::" compression,
// then return the /64 prefix (first 4 groups). Keying IPv6 on /64 rather than
// the full address prevents one allocation from yielding thousands of free
// buckets.
function ipv6Prefix64(addr: string): string {
  const [head, tail] = addr.split("::");
  const headGroups = head ? head.split(":") : [];
  const tailGroups = tail ? tail.split(":") : [];
  let groups: string[];
  if (addr.includes("::")) {
    const missing = 8 - headGroups.length - tailGroups.length;
    groups = [
      ...headGroups,
      ...Array(Math.max(0, missing)).fill("0"),
      ...tailGroups,
    ];
  } else {
    groups = addr.split(":");
  }
  // Normalize each hextet (drop leading zeros, lowercase) so equivalent forms
  // collapse to the same key.
  const normalized = groups
    .slice(0, 4)
    .map((g) => (g === "" ? "0" : Number.parseInt(g, 16).toString(16)));
  return `${normalized.join(":")}::/64`;
}

// IPv4-mapped IPv6 form `::ffff:a.b.c.d` (case-insensitive) — really an IPv4
// client. Capture the embedded dotted-quad so it keys as a full IPv4 rather
// than collapsing every such client into one shared /64 bucket.
const IPV4_MAPPED = /^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/i;

export function getClientIp(request: Request): string {
  const ip =
    ipAddress(request) ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  if (!ip) {
    return NO_IP_KEY;
  }

  const mapped = ip.match(IPV4_MAPPED);
  if (mapped) {
    return mapped[1];
  }

  // IPv6 addresses contain ":"; IPv4 never does.
  return ip.includes(":") ? ipv6Prefix64(ip) : ip;
}
