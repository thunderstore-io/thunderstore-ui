import { decodeHtmlEntities } from "cyberstorm/utils/HTMLParsing";
import {
  type CSSProperties,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { NewAlert } from "@thunderstore/cyberstorm";

export interface CodeBoxHTMLProps {
  /** Pygments-highlighted HTML as returned by the source API. */
  value?: string;
  maxHeight?: number;
  /** Names the scroll region for assistive technology, e.g. the file name. */
  label?: string;
}

// Row height in px. Also set as a CSS custom property on the surface, so the
// windowing maths and the laid-out height stay in step.
const LINE_HEIGHT = 20;

// Rows rendered above and below the visible range.
const OVERSCAN = 20;

// Assumed viewport height until the container is measured, and during SSR.
const INITIAL_VISIBLE_ROWS = 60;

// Lines rendered per file; beyond this the file is truncated with a notice.
const MAX_LINES = 200_000;

// The token classes Highlight.css styles. Any other class is dropped.
const PYGMENTS_TOKEN_CLASSES = new Set([
  "bp",
  "c",
  "c1",
  "ch",
  "cm",
  "cp",
  "cpf",
  "cs",
  "dl",
  "err",
  "esc",
  "fm",
  "g",
  "gd",
  "ge",
  "ges",
  "gh",
  "gi",
  "go",
  "gp",
  "gr",
  "gs",
  "gt",
  "gu",
  "il",
  "k",
  "kc",
  "kd",
  "kn",
  "kp",
  "kr",
  "kt",
  "l",
  "ld",
  "m",
  "mb",
  "mf",
  "mh",
  "mi",
  "mo",
  "n",
  "na",
  "nb",
  "nc",
  "nd",
  "ne",
  "nf",
  "ni",
  "nl",
  "nn",
  "no",
  "nt",
  "nv",
  "nx",
  "o",
  "ow",
  "p",
  "pm",
  "py",
  "s",
  "s1",
  "s2",
  "sa",
  "sb",
  "sc",
  "sd",
  "se",
  "sh",
  "si",
  "sr",
  "ss",
  "sx",
  "vc",
  "vg",
  "vi",
  "vm",
  "w",
  "x",
]);

// Sticky, so both the parser and the width measurement can test a position in
// place without slicing, and neither can drift from the other's idea of a tag.
const SPAN_OPEN = /<span class="([a-zA-Z0-9]+)">/y;
const SPAN_CLOSE = "</span>";

/** Length of the span tag at `index`, or 0 if there isn't one. */
function spanTagLength(line: string, index: number): number {
  if (line.charCodeAt(index) !== 60 /* < */) return 0;
  SPAN_OPEN.lastIndex = index;
  const open = SPAN_OPEN.exec(line);
  if (open) return open[0].length;
  return line.startsWith(SPAN_CLOSE, index) ? SPAN_CLOSE.length : 0;
}

// Styled runs per line; past this the rest of the line renders as one unstyled
// run, so the text is still complete.
const MAX_TOKENS_PER_LINE = 2_000;

export interface CodeToken {
  text: string;
  /** A Pygments token class, when the span carried one this component styles. */
  className?: string;
}

/**
 * Splits one line of the API's highlighted HTML into text runs and their token
 * classes, for the caller to render as React children.
 *
 * Only `<span class="token">` and `</span>` are recognised, with the class taken
 * from the styled set above. Anything else — a stray `<`, a malformed tag, an
 * unknown class — is kept as literal text.
 */
export function parseHighlightedLine(line: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  let pending = "";
  let className: string | undefined;
  let index = 0;

  const flush = () => {
    if (!pending) return;
    tokens.push(
      className
        ? { text: decodeHtmlEntities(pending), className }
        : { text: decodeHtmlEntities(pending) }
    );
    pending = "";
  };

  let capped = false;

  while (index < line.length) {
    if (!capped && tokens.length >= MAX_TOKENS_PER_LINE) {
      // Close the last styled run; everything remaining becomes one plain one.
      capped = true;
      flush();
      className = undefined;
    }
    const tagLength = spanTagLength(line, index);
    if (tagLength) {
      if (!capped) {
        flush();
        // An unrecognised class, and a closing tag, both render unstyled.
        SPAN_OPEN.lastIndex = index;
        const open = SPAN_OPEN.exec(line);
        className =
          open && PYGMENTS_TOKEN_CLASSES.has(open[1]) ? open[1] : undefined;
      }
      index += tagLength;
      continue;
    }
    pending += line[index];
    index += 1;
  }

  flush();
  return tokens;
}

/**
 * Number of characters a line occupies on screen. Skips exactly the span tags
 * the parser skips, so anything it renders as text is counted as text. Entities
 * count as their source length, which overestimates the width slightly rather
 * than clipping code.
 */
function visibleLength(line: string): number {
  let length = 0;
  let index = 0;
  while (index < line.length) {
    const tagLength = spanTagLength(line, index);
    if (tagLength) {
      index += tagLength;
      continue;
    }
    length++;
    index++;
  }
  return length;
}

/**
 * One rendered row: its line number and the parsed line.
 *
 * Memoised on (row, line) so a scroll only renders the rows entering or leaving
 * the window, rather than re-parsing every row that stayed.
 */
const CodeRow = memo(function CodeRow({
  row,
  line,
}: {
  row: number;
  line: string;
}) {
  return (
    <div className="code-view__row" style={{ top: row * LINE_HEIGHT }}>
      <span className="code-view__gutter" aria-hidden="true">
        {row + 1}
      </span>
      <code className="code-view__code">
        {parseHighlightedLine(line).map((token, tokenIndex) =>
          token.className ? (
            <span key={tokenIndex} className={token.className}>
              {token.text}
            </span>
          ) : (
            token.text
          )
        )}
      </code>
    </div>
  );
});

/**
 * Viewer for the server-highlighted source on a package's Source tab.
 *
 * Renders the highlighting the API already did — no client-side re-highlighting
 * — and mounts DOM only for the rows in view, so file size does not change how
 * much is on the page.
 */
export const CodeBoxHTML = memo(function CodeBoxHTML({
  value = "",
  maxHeight = 600,
  label,
}: CodeBoxHTMLProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(
    INITIAL_VISIBLE_ROWS * LINE_HEIGHT
  );

  const { lines, widestLine, droppedLines } = useMemo(() => {
    if (!value) {
      return { lines: [] as string[], widestLine: 0, droppedLines: 0 };
    }
    // Each row is parsed on its own, so a span left open by the newline split
    // just stops applying at the end of its row.
    const all = value.split("\n");
    const split = all.length > MAX_LINES ? all.slice(0, MAX_LINES) : all;
    let widest = 0;
    for (const line of split) {
      const length = visibleLength(line);
      if (length > widest) widest = length;
    }
    return {
      lines: split,
      widestLine: widest,
      droppedLines: all.length - split.length,
    };
  }, [value]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    setViewportHeight(element.clientHeight);
    // ResizeObserver may be missing in older/edge environments; the measurement
    // above still runs there, only the live updates are skipped.
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      setViewportHeight(element.clientHeight);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const firstRow = Math.max(0, Math.floor(scrollTop / LINE_HEIGHT) - OVERSCAN);
  const lastRow = Math.min(
    lines.length,
    Math.ceil((scrollTop + viewportHeight) / LINE_HEIGHT) + OVERSCAN
  );

  if (!value) {
    return <NewAlert csVariant="info">No source available.</NewAlert>;
  }

  const surfaceStyle = {
    height: lines.length * LINE_HEIGHT,
    // `ch` is exact for a monospace face, so the horizontal scroll range stays
    // put instead of resizing as rows scroll in and out of the window.
    minWidth: `${widestLine}ch`,
    "--code-view-line-height": `${LINE_HEIGHT}px`,
  } as CSSProperties;

  return (
    <div className="code-view">
      {droppedLines > 0 && (
        <NewAlert csVariant="warning">
          Showing the first {MAX_LINES.toLocaleString()} lines;{" "}
          {droppedLines.toLocaleString()} more are not displayed. Download the
          file to read it in full.
        </NewAlert>
      )}
      <div
        ref={scrollRef}
        className="code-view__scroll highlight"
        style={{ maxHeight }}
        onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
        // Nothing inside this region is focusable, so it has to take focus
        // itself to be scrollable by keyboard in browsers that don't focus
        // scrollers on their own. The lint rule allows tabindex only on
        // interactive elements, which is the opposite of what a scrollable
        // region needs.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        role="region"
        aria-label={label ? `Source of ${label}` : "Source code"}
      >
        <div className="code-view__surface" style={surfaceStyle}>
          {lines.slice(firstRow, lastRow).map((line, index) => (
            <CodeRow
              key={firstRow + index}
              row={firstRow + index}
              line={line}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

CodeBoxHTML.displayName = "CodeBoxHTML";
