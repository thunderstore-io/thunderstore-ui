// Named HTML entities map for fast lookup
const NAMED_ENTITIES: Record<string, string> = {
  lt: "<",
  gt: ">",
  quot: '"',
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
 * Handles named entities, numeric (&#123;), and hex (&#x1F;) entities.
 * All entities including &amp; are handled in one pass to correctly decode
 * double-encoded entities like &amp;lt;.
 */
function decodeHtmlEntities(text: string): string {
  return text.replace(
    /&(?:#(\d+)|#x([0-9a-fA-F]+)|([a-z0-9]+));/gi,
    (match, dec, hex, named) => {
      if (named) {
        const lower = named.toLowerCase();
        return NAMED_ENTITIES[lower] || match;
      }
      if (dec || hex) {
        try {
          const codePoint = dec ? Number(dec) : parseInt(hex, 16);
          return String.fromCodePoint(codePoint);
        } catch {
          return match; // Invalid code point, return unchanged
        }
      }
      return match;
    }
  );
}
