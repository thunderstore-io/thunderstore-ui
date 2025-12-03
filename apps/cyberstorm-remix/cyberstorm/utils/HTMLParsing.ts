// Named HTML entities map for fast lookup
const NAMED_ENTITIES: Record<string, string> = {
  lt: "<",
  gt: ">",
  quot: '"',
  "#39": "'",
  apos: "'",
  nbsp: " ",
  amp: "&",
};

/**
 * Strips HTML tags from a string and decodes HTML entities to extract plain text content.
 * Uses a loop to handle potentially nested or malformed tags.
 * This is safe for our use case because:
 * 1. Input is already server-sanitized syntax highlighting HTML
 * 2. The result is only used as text content, not rendered as HTML
 */
export function stripHtmlTags(html: string = ""): string {
  if (!html) return "";

  // Strip HTML tags - loop handles nested/malformed tags like <scr<script>ipt>
  const tagPattern = /<[^>]*>/g;
  let result = html;
  let previous;
  do {
    previous = result;
    result = result.replace(tagPattern, "");
  } while (result !== previous);

  return decodeHtmlEntities(result);
}

/**
 * Decodes HTML entities with a single regex pass for performance.
 * Handles named entities (except &amp;), numeric (&#123;), and hex (&#x1F;) entities,
 * Then handles &amp; (in a second pass) to avoid interfering with other entities.
 */
function decodeHtmlEntities(text: string): string {
  const result = text.replace(
    /&(?:#(\d+)|#x([0-9a-fA-F]+)|([a-z0-9]+));/gi,
    (match, dec, hex, named) => {
      if (dec) {
        return String.fromCharCode(Number(dec));
      }
      if (hex) {
        return String.fromCharCode(parseInt(hex, 16));
      }
      if (named) {
        const lower = named.toLowerCase();
        if (lower === "amp") {
          return match; // Skip &amp; for now, handle in second pass
        }
        return NAMED_ENTITIES[lower] || match;
      }
      return match;
    }
  );
  // Handle &amp; last to avoid interfering with other entity replacements
  return result.replace(/&amp;/gi, "&");
}
