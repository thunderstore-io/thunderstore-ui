const MAX_LENGTH = 400;

function stripControlCharacters(value: string): string {
  return value.replace(/[\x00-\x1F\x7F]/g, " ");
}

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
