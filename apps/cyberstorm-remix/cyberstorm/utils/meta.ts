import type { MetaDescriptor, UIMatch } from "react-router";

export type SeoReturn = {
  prefix?: string;
  descriptors: MetaDescriptor[];
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

function isLoaderDataWithSeo(data: unknown): data is { seo: SeoReturn } {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const d = data as Record<string, unknown>;

  if (!("seo" in d) || typeof d.seo !== "object" || d.seo === null) {
    return false;
  }

  const seo = d.seo as Record<string, unknown>;

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

export function findMatchWithSeoInMatches(
  matches: UIMatch<unknown, unknown>[]
): SeoReturn | undefined {
  let finalSeo: SeoReturn | undefined = undefined;

  for (const match of matches) {
    if (isLoaderDataWithSeo(match.data)) {
      if (!finalSeo) {
        finalSeo = match.data.seo;
      } else {
        finalSeo = mergeSeo(finalSeo, match.data.seo);
      }
    }
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
