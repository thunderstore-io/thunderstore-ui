import type { DapperTs } from "@thunderstore/dapper-ts";
import type { Communities } from "@thunderstore/dapper/types";

const CACHE_TTL_MS = 5 * 60 * 1000;

interface CacheEntry {
  fetchedAt: number;
  promise: Promise<Communities>;
}

const cache = new Map<string, CacheEntry>();

function cacheKey(ordering?: string, search?: string, page?: number): string {
  return `${ordering ?? ""}|${search ?? ""}|${page ?? ""}`;
}

/**
 * Client-side cache over `dapper.getCommunities` so the home page and the
 * communities page don't refetch each other's lists. clientLoaders only.
 */
export function getCachedCommunityList(
  dapper: DapperTs,
  ordering?: string,
  search?: string,
  page?: number
): Promise<Communities> {
  const key = cacheKey(ordering, search, page);
  const entry = cache.get(key);
  if (entry && Date.now() - entry.fetchedAt < CACHE_TTL_MS) {
    return entry.promise;
  }
  const promise = dapper.getCommunities(page, ordering, search);
  cache.set(key, { fetchedAt: Date.now(), promise });
  // Failed fetches must not be served from the cache for the next TTL window.
  promise.catch(() => cache.delete(key));
  return promise;
}

/**
 * Primes the cache with a list an SSR loader already fetched, so the first
 * client-side navigation after a document load doesn't refetch it. Existing
 * entries are kept: they are either the same data or fresher.
 */
export function seedCommunityListCache(
  list: Communities | Promise<Communities>,
  ordering?: string,
  search?: string,
  page?: number
): void {
  const key = cacheKey(ordering, search, page);
  if (cache.has(key)) return;
  const promise = Promise.resolve(list);
  cache.set(key, { fetchedAt: Date.now(), promise });
  promise.catch(() => cache.delete(key));
}
