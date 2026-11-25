function ensureClasses(tag: string, classes: string[], html: string): string {
  return html.replace(
    new RegExp(`<${tag}\\b([^>]*)>`, "gi"),
    (_match, attrs: string) => {
      const found = attrs.match(/\sclass=(["'])([\s\S]*?)\1/i);
      const existing = found ? found[2].split(/\s+/).filter(Boolean) : [];
      const merged = [
        ...classes,
        ...existing.filter((name) => !classes.includes(name)),
      ];
      const withoutClass = found ? attrs.replace(found[0], "") : attrs;
      return `<${tag} class="${merged.join(" ")}"${withoutClass}>`;
    }
  );
}

function labelTable(tableHtml: string): string {
  let next = ensureClasses("table", ["table", "table--flow"], tableHtml);
  next = ensureClasses("th", ["table__header"], next);
  next = ensureClasses("td", ["table__item"], next);
  return next.replace(
    /<th\b([^>]*)>([\s\S]*?)<\/th>/gi,
    (match, attrs: string, inner: string) => {
      if (inner.includes("table__header-text")) return match;
      return `<th${attrs}><span class="table__header-text">${inner}</span></th>`;
    }
  );
}

function labelTables(html: string): string {
  return html.replace(/<table\b[\s\S]*?<\/table>/gi, labelTable);
}

/** Gives markdown tables the Table classes, and header text the sort-button label box. */
export function withMarkdownTableHeaderLabels(html: string): string {
  const pieces: string[] = [];
  let last = 0;

  for (const match of html.matchAll(/<(pre|code)\b[^>]*>[\s\S]*?<\/\1>/gi)) {
    const start = match.index ?? 0;
    pieces.push(labelTables(html.slice(last, start)));
    pieces.push(match[0]);
    last = start + match[0].length;
  }

  pieces.push(labelTables(html.slice(last)));
  return pieces.join("");
}
