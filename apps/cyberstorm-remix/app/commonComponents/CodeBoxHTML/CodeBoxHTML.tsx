import { CodeBox } from "@thunderstore/cyberstorm";
import { stripHtmlTags } from "cyberstorm/utils/HTMLParsing";
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
export function CodeBoxHTML({
  value = "",
  maxHeight = 600,
  language = "text",
}: CodeBoxHTMLProps) {
  // Strip HTML tags from the value to get plain text
  const plainText = stripHtmlTags(value || "");

  return (
    <div
      className="code-box-html"
      style={{
        maxHeight,
        width: "100%",
        overflow: "auto",
      }}
    >
      <CodeBox value={plainText} language={language} />
    </div>
  );
}

CodeBoxHTML.displayName = "CodeBoxHTML";
