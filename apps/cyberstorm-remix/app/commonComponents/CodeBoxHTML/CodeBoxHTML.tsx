import { stripHtmlTags } from "cyberstorm/utils/HTMLParsing";
import { memo, useMemo } from "react";

import { CodeBox, NewAlert } from "@thunderstore/cyberstorm";

import "./CodeBoxHTML.css";

export interface CodeBoxHTMLProps {
  value?: string;
  maxHeight?: number;
  language?: string;
}

/**
 * CodeBox component which renders HTML content by stripping HTML tags
 * and passing the plain text to the CodeBox component for syntax highlighting
 */
export const CodeBoxHTML = memo(function CodeBoxHTML({
  value = "",
  maxHeight = 600,
  language = "text",
}: CodeBoxHTMLProps) {
  const result = useMemo(() => {
    try {
      const text = stripHtmlTags(value);
      return { text, error: null };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to process HTML content";
      return { text: "", error: errorMessage };
    }
  }, [value]);

  if (result.error) {
    return <NewAlert csVariant="danger">{result.error}</NewAlert>;
  }

  return (
    <div
      className="code-box-html"
      style={{
        maxHeight,
        width: "100%",
        overflow: "auto",
      }}
    >
      <CodeBox value={result.text} language={language} />
    </div>
  );
});

CodeBoxHTML.displayName = "CodeBoxHTML";
