import type { CSSProperties } from "react";
import { LightAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import nightOwl from "react-syntax-highlighter/dist/esm/styles/hljs/night-owl";

export interface CodeBoxHighlighterProps {
  value: string;
  language: string;
  customStyle: CSSProperties;
}

/**
 * The syntax-highlighting half of CodeBox, kept in its own module so
 * react-syntax-highlighter (~37 KiB) is a lazy chunk instead of riding along in
 * the shared cyberstorm bundle that every route loads. CodeBox imports this
 * dynamically after mount; see CodeBox.tsx.
 */
export function CodeBoxHighlighter(props: CodeBoxHighlighterProps) {
  const { value, language, customStyle } = props;

  return (
    <SyntaxHighlighter
      language={language}
      style={nightOwl}
      customStyle={customStyle}
    >
      {value}
    </SyntaxHighlighter>
  );
}

CodeBoxHighlighter.displayName = "CodeBoxHighlighter";
