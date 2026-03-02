import { LightAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import nightOwl from "react-syntax-highlighter/dist/esm/styles/hljs/night-owl";

import { CopyButton } from "../CopyButton/CopyButton";
import "./CodeBox.css";

export interface CodeBoxProps {
  value?: string;
  inline?: boolean;
  language?: string;
  allowCopy?: boolean;
}

/**
 * Cyberstorm CodeBox component
 */
export function CodeBox(props: CodeBoxProps) {
  const {
    value = "",
    inline = false,
    language = "text",
    allowCopy = true,
  } = props;

  return (
    <div
      className={`codebox-wrapper ${inline ? "codebox-wrapper--inline" : ""}`}
    >
      <SyntaxHighlighter
        language={language}
        style={nightOwl}
        customStyle={{
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
          lineHeight: inline
            ? "var(--line-height-xs)"
            : "var(--line-height-md)",
          fontSize: inline
            ? "var(--font-size-body-lg)"
            : "var(--font-size-body-md)",
          fontStyle: "normal",
          fontFamily: "var(--font-family-monospace)",
          fontWeight: "var(--font-weight-regular)",
          backgroundColor: "var(--color-surface-1)",
        }}
      >
        {value}
      </SyntaxHighlighter>
      {allowCopy && !inline && value && (
        <div className="codebox-copy-button">
          <CopyButton text={value} />
        </div>
      )}
    </div>
  );
}

CodeBox.displayName = "CodeBox";
