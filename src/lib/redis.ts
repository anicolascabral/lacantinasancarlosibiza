// Upstash Redis client, shared by the reservations and closures stores.
//
// Returns null when no database is configured, so callers fall back to the
// local JSON file (fine for `npm run dev`, useless on Vercel).
//
// Vercel's marketplace integration has injected these credentials under two
// different naming schemes over time (UPSTASH_* for the Upstash integration,
// KV_REST_API_* for the older Vercel KV one), so accept either rather than
// depending on which one the dashboard happens to create.

import { Redis } from "@upstash/redis";

export function redisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

/** Name of the active backend, for scripts that report where they're writing. */
export function storeBackendName(): string {
  return redisClient() ? "Upstash Redis" : "archivo local .data";
}
