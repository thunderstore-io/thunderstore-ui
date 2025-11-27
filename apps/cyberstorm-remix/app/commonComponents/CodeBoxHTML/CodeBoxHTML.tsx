import { useState, useMemo, useRef, useEffect } from "react";
import "./CodeBoxHTML.css";
import "./Highlight.css";

export interface CodeBoxHTMLProps {
  value?: string;
  maxHeight?: number;
}

// Fixed line height for consistent rendering
// This value must match --code-line-height in CodeBoxHTML.css
const LINE_HEIGHT = 21;

/**
 * Strips HTML tags from a string to extract plain text content.
 * Uses a loop to handle potentially nested or malformed tags.
 * This is safe for our use case because:
 * 1. Input is already server-sanitized syntax highlighting HTML
 * 2. The result is only used as text content, not rendered as HTML
 * 3. HTML entities are preserved as-is which is acceptable for code display
 */
function stripHtmlTags(html: string): string {
  const tagPattern = /<[^>]*>/g;
  let result = html;
  let previous;
  // Repeatedly strip tags until no more are found
  // This handles cases like <scr<script>ipt>
  do {
    previous = result;
    result = result.replace(tagPattern, "");
  } while (result !== previous);
  return result;
}

/**
 * CodeBox component which renders HTML syntax-highlighted code.
 * Uses virtual scrolling for visual performance while maintaining
 * a hidden selectable layer for copy/paste functionality.
 */
export function CodeBoxHTML({ value = "", maxHeight = 600 }: CodeBoxHTMLProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(maxHeight);
  const [containerWidth, setContainerWidth] = useState<number | undefined>(
    undefined
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Extra lines to render above/below viewport for smooth scrolling
  const BUFFER_LINES = 25;

  // Split into lines and compute plain text for the selectable layer
  const { lines, plainText } = useMemo(() => {
    const htmlLines = value.split("\n");
    const textContent = htmlLines.map(stripHtmlTags).join("\n");
    return { lines: htmlLines, plainText: textContent };
  }, [value]);

  useEffect(() => {
    const width = calculateWidth(lines);
    setContainerWidth(width);
  }, [lines]);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const visibleStart = Math.max(
    0,
    Math.floor(scrollTop / LINE_HEIGHT) - BUFFER_LINES
  );

  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / LINE_HEIGHT) + BUFFER_LINES * 2,
    lines.length
  );

  const totalHeight = lines.length * LINE_HEIGHT;
  const contentWidth = containerWidth ? `${containerWidth}px` : "auto";

  return (
    <div
      ref={containerRef}
      className="code-box-html"
      style={{
        height: maxHeight,
        width: "100%",
        overflow: "auto",
      }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      {/* Selectable layer: contains all text for copy/paste functionality */}
      <pre
        className="code-box-html__selectable"
        style={{
          height: totalHeight,
          width: contentWidth,
          minWidth: "100%",
        }}
      >
        {plainText}
      </pre>

      {/* Visual layer: shows syntax-highlighted code with virtual scrolling */}
      <pre
        className="code-box-html__visual"
        aria-hidden="true"
        style={{
          height: totalHeight,
          width: contentWidth,
          minWidth: "100%",
        }}
      >
        {lines.slice(visibleStart, visibleEnd).map((line, index) => (
          <code
            key={visibleStart + index}
            className="code-box-html__line highlight"
            style={{
              top: (visibleStart + index) * LINE_HEIGHT,
            }}
            dangerouslySetInnerHTML={{ __html: line }}
          />
        ))}
      </pre>
    </div>
  );
}

/**
 * Measure the width needed for the longest line using the same styles as the component
 */
function calculateWidth(lines: string[]): number {
  if (lines.length === 0 || (lines.length === 1 && lines[0] === "")) {
    return 0;
  }
  const longestLine = lines.reduce((longest, current) =>
    current.length > longest.length ? current : longest
  );
  const measureElement = document.createElement("div");
  measureElement.className = "code-box-html__line";
  measureElement.style.width = "auto";
  measureElement.style.padding = "0";
  measureElement.style.border = "none";
  measureElement.style.position = "absolute";
  measureElement.style.visibility = "hidden";
  document.body.appendChild(measureElement);
  try {
    measureElement.innerHTML = longestLine;
    return measureElement.offsetWidth;
  } finally {
    document.body.removeChild(measureElement);
  }
}

CodeBoxHTML.displayName = "CodeBoxHTML";
