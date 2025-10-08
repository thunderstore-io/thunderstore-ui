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
        borderColor: "#333370",
        whiteSpace: "pre",
        lineHeight: inline ? "1" : "1.5",
        fontSize: inline ? "1em" : "0.875em",
        fontStyle: "normal",
        fontFamily: "var(--font-family-monospace)",
        fontWeight: "var(--font-weight-regular)",
        backgroundColor: "#0f0f1f",
      }}
    >
      {value}
    </SyntaxHighlighter>
  );
}

CodeBox.displayName = "CodeBox";
