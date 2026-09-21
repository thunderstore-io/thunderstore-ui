/**
 * Storybook-only: scope cyberstorm-theme rules to html[data-cs-theme="on"].
 *
 * Toggling a <style disabled> sheet (or relying on Vite `?inline`) is unreliable
 * in Chromatic — package-export `?inline` is often dropped, so the theme is
 * always injected, and Chrome ignores `disabled` until the sheet is in the
 * document. Gating on one html attribute is what Chromatic actually captures
 * when modes flip the decorator.
 *
 * Fonts stay global (@font-face layers are skipped). @keyframes selectors
 * (`from` / `to`) are left untouched. Nested rules (`&:hover`, `> .child`)
 * inherit the prefixed parent — prefixing them again would produce
 * impossible descendant-of-html selectors.
 */
const THEME_ATTR = 'html[data-cs-theme="on"]';

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
  if (trimmed === ":root" || trimmed === "html") {
    return THEME_ATTR;
  }
  if (trimmed.startsWith(":root")) {
    return `${THEME_ATTR}${trimmed.slice(":root".length)}`;
  }
  if (/^html(?![\w-])/.test(trimmed)) {
    return trimmed.replace(/^html/, THEME_ATTR);
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
        if (atRule.params.trim() !== "cyberstorm-theme") {
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
