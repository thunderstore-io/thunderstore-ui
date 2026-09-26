/**
 * Storybook-only: scope cyberstorm-theme rules to [data-cs-theme="on"].
 *
 * The attribute sits on a wrapper, not on `html`, so one document can show the
 * themed and barebones renders side by side. `:root`, `html`, and `body` are
 * rewritten onto that wrapper itself — a descendant `body` selector would not
 * paint a div. Barebones tokens stay on `:root` in the unprefixed cyberstorm
 * layer, so the other column does not inherit the theme background.
 *
 * The button/input reset (`cyberstorm.theme-reset`) is prefixed the same
 * way, so the barebones column keeps browser styles. Fonts stay
 * global (@font-face layers are skipped). @keyframes selectors
 * (`from` / `to`) are left untouched. Nested rules (`&:hover`, `> .child`)
 * inherit the prefixed parent — prefixing them again would produce
 * impossible selectors.
 */
const THEME_ATTR = '[data-cs-theme="on"]';

function shouldSkipPrefix(node: { parent?: unknown }): boolean {
  let current: { type?: string; name?: string; parent?: unknown } | undefined =
    node.parent as
      | { type?: string; name?: string; parent?: unknown }
      | undefined;
  while (current) {
    if (current.type === "rule") {
      return true;
    }
    if (
      current.type === "atrule" &&
      (current.name === "keyframes" || current.name === "-webkit-keyframes")
    ) {
      return true;
    }
    current = current.parent as typeof current;
  }
  return false;
}

export function prefixThemeSelector(selector: string): string {
  const trimmed = selector.trim();
  if (!trimmed || trimmed.includes("[data-cs-theme")) {
    return trimmed;
  }
  if (trimmed === ":root" || trimmed === "html" || trimmed === "body") {
    return THEME_ATTR;
  }
  if (trimmed.startsWith(":root")) {
    return `${THEME_ATTR}${trimmed.slice(":root".length)}`;
  }
  if (/^html(?![\w-])/.test(trimmed)) {
    return trimmed.replace(/^html/, THEME_ATTR);
  }
  if (/^body(?![\w-])/.test(trimmed)) {
    return trimmed.replace(/^body/, THEME_ATTR);
  }
  return `${THEME_ATTR} ${trimmed}`;
}

type PostcssRoot = {
  walkAtRules: (
    name: string,
    callback: (atRule: {
      params: string;
      walkAtRules: (name: string, callback: () => void) => void;
      walkRules: (
        callback: (rule: { selectors: string[]; parent?: unknown }) => void
      ) => void;
    }) => void
  ) => void;
};

export function prefixCyberstormThemePostcss() {
  return {
    postcssPlugin: "prefix-cyberstorm-theme",
    Once(root: PostcssRoot) {
      root.walkAtRules("layer", (atRule) => {
        const layer = atRule.params.trim();
        if (
          layer !== "cyberstorm-theme" &&
          layer !== "cyberstorm.theme-reset"
        ) {
          return;
        }
        let hasFontFace = false;
        let hasStyleRule = false;
        atRule.walkAtRules("font-face", () => {
          hasFontFace = true;
        });
        atRule.walkRules(() => {
          hasStyleRule = true;
        });
        if (hasFontFace && !hasStyleRule) {
          return;
        }
        atRule.walkRules((rule) => {
          if (shouldSkipPrefix(rule)) {
            return;
          }
          rule.selectors = rule.selectors.map(prefixThemeSelector);
        });
      });
    },
  };
}
prefixCyberstormThemePostcss.postcss = true;
