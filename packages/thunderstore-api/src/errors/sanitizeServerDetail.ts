const MAX_LENGTH = 400;

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

function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function sanitizeServerDetail(value: string): string {
  if (!value) return "";

  const cleaned = collapseWhitespace(stripControlCharacters(value));
  if (!cleaned) return "";

  if (cleaned.length <= MAX_LENGTH) {
    return cleaned;
  }

  return `${cleaned.slice(0, MAX_LENGTH).trim()}…`;
}
