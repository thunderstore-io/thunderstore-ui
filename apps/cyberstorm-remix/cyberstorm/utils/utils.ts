// '\\' '\\u005C'
// '\'' '\\u0027'
// '"' '\\u0022'
// '>' '\\u003E'
// '<' '\\u003C'
// '&' '\\u0026'
// '=' '\\u003D'
// '-' '\\u002D'
// ';' '\\u003B'
// '`' '\\u0060'
// '\u2028' '\\u2028'
// '\u2029' '\\u2029'

export function replaceDjangoUnicode(unicodeString: string) {
  return unicodeString
    .replaceAll(/\\u005C/g, "\\\\")
    .replaceAll(/\\u0027/g, `\\`)
    .replaceAll(/\\u0022/g, `"`)
    .replaceAll(/\\u003E/g, ">")
    .replaceAll(/\\u003C/g, "<")
    .replaceAll(/\\u0026/g, "&")
    .replaceAll(/\\u003D/g, "=")
    .replaceAll(/\\u002D/g, "-")
    .replaceAll(/\\u003B/g, ";")
    .replaceAll(/\\u0060/g, "`")
    .replaceAll(/\\u2028/g, ")")
    .replaceAll(/\\u2029/g, "(");
}
