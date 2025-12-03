import { useEffect, useMemo, useRef, useState } from "react";

import "./CodeBoxHTML.css";
import "./Highlight.css";

export interface CodeBoxHTMLProps {
  value?: string;
  maxHeight?: number;
}

/**
 * CodeBox component which renders HTML and
 * uses virtual scrolling to render the content
 * in parts to improve performance
 */
export function CodeBoxHTML({ value = "", maxHeight = 600 }: CodeBoxHTMLProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(maxHeight);
  const [containerWidth, setContainerWidth] = useState<number | undefined>(
    undefined
  );
  const [lineHeight, setLineHeight] = useState(21); // We'll measure this based on the actual styles later
  const containerRef = useRef<HTMLDivElement>(null);

  // Extra lines to render above/below viewport, so that there's content
  // to render immediately when scrolling, making it smoother
  const BUFFER_LINES = 25;
  const lines = useMemo(() => value.split("\n"), [value]);

  useEffect(() => {
    const { width, lineHeight: measuredLineHeight } =
      calculateDimensions(lines);
    setContainerWidth(width);
    setLineHeight(measuredLineHeight);
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
    Math.floor(scrollTop / lineHeight) - BUFFER_LINES
  );

  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / lineHeight) + BUFFER_LINES * 2,
    lines.length
  );

  const totalHeight = lines.length * lineHeight;

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
      <pre
        className="code-box-html__content"
        style={{
          height: totalHeight,
          width: containerWidth ? `${containerWidth}px` : "auto",
          minWidth: "100%",
        }}
      >
        {lines.slice(visibleStart, visibleEnd).map((line, index) => (
          <code
            key={visibleStart + index}
            className="code-box-html__line highlight"
            style={{
              top: (visibleStart + index) * lineHeight,
              height: lineHeight,
            }}
            dangerouslySetInnerHTML={{ __html: line }}
          />
        ))}
      </pre>
    </div>
  );
}

/*
 * Measure the longest line width and line height using the same styles as the component
 */
const calculateDimensions = (lines: string[]) => {
  if (lines.length === 0 || (lines.length === 1 && lines[0] === ""))
    return { width: 0, lineHeight: 21 };
  const longestLine = lines.reduce((longest, current) =>
    current.length > longest.length ? current : longest
  );
  const measureElement = document.createElement("div");
  measureElement.className = "code-box-html__line";
  measureElement.style.width = "auto";
  measureElement.style.padding = "0";
  measureElement.style.border = "none";
  document.body.appendChild(measureElement);
  try {
    measureElement.innerHTML = longestLine;
    const width = measureElement.offsetWidth;
    const measuredLineHeight = measureElement.offsetHeight;
    return { width, lineHeight: measuredLineHeight };
  } finally {
    document.body.removeChild(measureElement);
  }
};

CodeBoxHTML.displayName = "CodeBoxHTML";
