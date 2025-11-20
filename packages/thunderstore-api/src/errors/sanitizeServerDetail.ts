const MAX_LENGTH = 400;
/**
 * Replaces ASCII control characters with spaces to avoid invisible glyphs.
 */
function stripControlCharacters(value: string): string {
  let result = "";
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    const code = char.charCodeAt(0);
    if (code < 32 || code === 127) {
      result += " ";
      continue;
    }
    result += char;
  }
  return result;
}

/**
 * Collapses repeated whitespace and trims the ends for presentation safety.
 */
function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

/**
 * Normalises server-sourced detail messages into a safe, bounded string for UI use.
 */
export function sanitizeServerDetail(value: string): string {
  if (!value) return "";

  const cleaned = collapseWhitespace(stripControlCharacters(value));
  if (!cleaned) return "";

  if (cleaned.length <= MAX_LENGTH) {
    return cleaned;
  }

  return `${cleaned.slice(0, MAX_LENGTH).trim()}…`;
}
