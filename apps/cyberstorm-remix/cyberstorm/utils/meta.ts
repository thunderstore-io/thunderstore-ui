import type { MetaDescriptor, UIMatch } from "react-router";

export type SeoReturn = {
  prefix?: string;
  descriptors: MetaDescriptor[];
};

/**
 * What a route puts in its loader's `seo` field.
 *
 * A route whose tags describe deferred data hands over the promise instead of
 * awaiting it, so a navigation is never held up for the sake of a title and the
 * route keeps its pending state: the descriptors join the head when the promise
 * settles. Resolving to undefined means the data never arrived — the route's
 * own error handling owns that, and the tags are left as they are.
 */
export type SeoValue = SeoReturn | Promise<SeoReturn | undefined>;

/** One matched route's seo, keyed by route id so a settled promise can be
 *  remembered while the route stays matched. */
export type MatchSeo = {
  id: string;
  value: SeoValue;
};

export const createSeo = (seo: SeoReturn) => {
  return seo;
};

function isMetaDescriptor(descriptor: unknown): descriptor is MetaDescriptor {
  if (
    typeof descriptor !== "object" ||
    descriptor === null ||
    Array.isArray(descriptor)
  ) {
    return false;
  }

  const d = descriptor as Record<string, unknown>;

  if ("charSet" in d) return d.charSet === "utf-8";
  if ("title" in d) return typeof d.title === "string";
  if ("name" in d)
    return typeof d.name === "string" && typeof d.content === "string";
  if ("property" in d)
    return typeof d.property === "string" && typeof d.content === "string";
  if ("httpEquiv" in d)
    return typeof d.httpEquiv === "string" && typeof d.content === "string";
  if ("script:ld+json" in d)
    return (
      typeof d["script:ld+json"] === "object" && d["script:ld+json"] !== null
    );
  if ("tagName" in d) return d.tagName === "meta" || d.tagName === "link";

  return false;
}

/**
 * Whether a value is usable seo. Also applied to what a promised seo resolves
 * to, so a malformed value is ignored rather than rendered. One bad descriptor
 * rejects the whole object: a half-applied set of tags is worse than none.
 */
export function isSeoReturn(value: unknown): value is SeoReturn {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const seo = value as Record<string, unknown>;

  if (!("descriptors" in seo) || !Array.isArray(seo.descriptors)) {
    return false;
  }

  for (const descriptor of seo.descriptors) {
    if (!isMetaDescriptor(descriptor)) {
      return false;
    }
  }

  if (
    "prefix" in seo &&
    seo.prefix !== undefined &&
    typeof seo.prefix !== "string"
  ) {
    return false;
  }

  return true;
}

function isSeoPromise(value: unknown): value is Promise<SeoReturn | undefined> {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { then?: unknown }).then === "function"
  );
}

/**
 * The seo of every matched route that has any, in match order so parents come
 * before the children that override them. Promises are returned unresolved —
 * the caller decides what to do while they are in flight.
 */
export function collectMatchSeo(
  matches: UIMatch<unknown, unknown>[]
): MatchSeo[] {
  const collected: MatchSeo[] = [];

  for (const match of matches) {
    const data = match.data;
    if (typeof data !== "object" || data === null || !("seo" in data)) {
      continue;
    }
    const value = (data as { seo: unknown }).seo;
    if (isSeoReturn(value) || isSeoPromise(value)) {
      collected.push({ id: match.id, value });
    }
  }

  return collected;
}

/**
 * The merged seo of the matched routes, each overriding the descriptors of the
 * one above it. `settled` supplies the descriptors of routes that handed over a
 * promise, keyed by route id; a route whose promise has not settled contributes
 * nothing yet.
 */
export function findMatchWithSeoInMatches(
  matches: UIMatch<unknown, unknown>[],
  settled: Readonly<Record<string, SeoReturn>> = {}
): SeoReturn | undefined {
  let finalSeo: SeoReturn | undefined = undefined;

  for (const { id, value } of collectMatchSeo(matches)) {
    const seo = isSeoReturn(value) ? value : settled[id];
    if (!seo) {
      continue;
    }
    finalSeo = finalSeo ? mergeSeo(finalSeo, seo) : seo;
  }

  return finalSeo;
}

function mergeSeo(base: SeoReturn, next: SeoReturn): SeoReturn {
  return {
    prefix: next.prefix ?? base.prefix,
    descriptors: mergeDescriptors(base.descriptors, next.descriptors),
  };
}

function mergeDescriptors(
  base: MetaDescriptor[],
  next: MetaDescriptor[]
): MetaDescriptor[] {
  const merged = [...base];

  function upsertDescriptor(
    predicate: (d: MetaDescriptor) => boolean,
    descriptor: MetaDescriptor
  ) {
    const index = merged.findIndex(predicate);
    if (index !== -1) {
      merged[index] = descriptor;
    } else {
      merged.push(descriptor);
    }
  }

  for (const descriptor of next) {
    const context = descriptor as Record<string, unknown>;

    if ("title" in context) {
      upsertDescriptor((d) => "title" in d, descriptor);
    } else if ("name" in context) {
      upsertDescriptor(
        (d) => "name" in d && d.name === context.name,
        descriptor
      );
    } else if ("property" in context) {
      upsertDescriptor(
        (d) => "property" in d && d.property === context.property,
        descriptor
      );
    } else if ("httpEquiv" in context) {
      upsertDescriptor(
        (d) => "httpEquiv" in d && d.httpEquiv === context.httpEquiv,
        descriptor
      );
    } else if ("charSet" in context) {
      upsertDescriptor((d) => "charSet" in d, descriptor);
    } else {
      merged.push(descriptor);
    }
  }

  return merged;
}
