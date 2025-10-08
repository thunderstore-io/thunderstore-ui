import { LightAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import nightOwl from "react-syntax-highlighter/dist/esm/styles/hljs/night-owl";

export interface CodeBoxProps {
  value?: string;
  inline?: boolean;
  language?: string;
}

/**
 * Cyberstorm CodeBox component
 */
export function CodeBox(props: CodeBoxProps) {
  const { value = "", inline = false, language = "text" } = props;

  return (
    <SyntaxHighlighter
      language={language}
      style={nightOwl}
      customStyle={{
        alignSelf: "stretch",
        width: inline ? "auto" : "100%",
        display: inline ? "inline-flex" : "block",
        overflow: inline ? "auto" : "inherit",
        padding: inline ? "var(--space-4)" : "var(--space-16)",
        borderRadius: "var(--radius-md)",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "var(--color-surface-8)",
        whiteSpace: "pre",
        lineHeight: inline ? "var(--line-height-xs)" : "var(--line-height-md)",
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
  );
}

CodeBox.displayName = "CodeBox";
