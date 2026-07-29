import {
  type CSSProperties,
  type ComponentType,
  useEffect,
  useState,
} from "react";

import { CopyButton } from "../CopyButton/CopyButton";
import "./CodeBox.css";
import type { CodeBoxHighlighterProps } from "./CodeBoxHighlighter";

export interface CodeBoxProps {
  value?: string;
  inline?: boolean;
  language?: string;
  allowCopy?: boolean;
}

/**
 * Cyberstorm CodeBox component
 *
 * Renders the code immediately as plain <pre>, then swaps in the highlighted
 * version once react-syntax-highlighter has loaded. CodeBox is re-exported from
 * the package barrel but only actually used on the package Source tab, so a
 * static import dragged the highlighter (~37 KiB) into the shared chunk that
 * every route downloads. Loading it after mount keeps it out of that chunk.
 *
 * The fallback reuses the same inline style as the highlighter, so the box
 * geometry is identical before and after the swap — only the token colours
 * change, and no layout shifts.
 */
export function CodeBox(props: CodeBoxProps) {
  const {
    value = "",
    inline = false,
    language = "text",
    allowCopy = true,
  } = props;

  const [Highlighter, setHighlighter] =
    useState<ComponentType<CodeBoxHighlighterProps> | null>(null);

  useEffect(() => {
    let cancelled = false;
    import("./CodeBoxHighlighter")
      .then((module) => {
        // Store via updater form: React would otherwise call the component as
        // a lazy initialiser.
        if (!cancelled) setHighlighter(() => module.CodeBoxHighlighter);
      })
      .catch(() => {
        // Chunk failed to load (offline, deploy mid-session). The plain <pre>
        // below stays, which is still fully readable code.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const customStyle: CSSProperties = {
    alignSelf: "stretch",
    width: inline ? "auto" : "100%",
    display: inline ? "inline-flex" : "block",
    maxWidth: "100%",
    overflowX: "auto",
    overflowY: inline ? "auto" : "inherit",
    padding: inline ? "var(--space-4)" : "var(--space-16)",
    paddingRight: allowCopy && !inline ? "var(--space-48)" : undefined,
    borderRadius: "var(--radius-md)",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "var(--color-surface-8)",
    whiteSpace: "pre",
    lineHeight: inline ? "var(--line-height-xs)" : "var(--line-height-md)",
    fontSize: inline ? "var(--font-size-body-lg)" : "var(--font-size-body-md)",
    fontStyle: "normal",
    fontFamily: "var(--font-family-monospace)",
    fontWeight: "var(--font-weight-regular)",
    backgroundColor: "var(--color-surface-1)",
  };

  return (
    <div
      className={`codebox-wrapper ${inline ? "codebox-wrapper--inline" : ""}`}
    >
      {Highlighter ? (
        <Highlighter
          value={value}
          language={language}
          customStyle={customStyle}
        />
      ) : (
        <pre style={customStyle}>{value}</pre>
      )}
      {allowCopy && !inline && value && (
        <div className="codebox-copy-button">
          <CopyButton text={value} />
        </div>
      )}
    </div>
  );
}

CodeBox.displayName = "CodeBox";
