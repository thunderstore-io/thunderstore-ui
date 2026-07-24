import { MarkdownHooks } from "react-markdown";
import raw from "rehype-raw";
import gfm from "remark-gfm";

import { MarkdownErrorBoundary } from "./MarkdownErrorBoundary";
import { nimbusSanitize } from "./Sanitize";

interface MarkdownProps {
  input?: string;
  dangerous?: boolean;
  placeholder?: string;
}

export function Markdown(props: MarkdownProps) {
  const { input, dangerous, placeholder } = props;
  const source = input && input !== "" ? input : placeholder ? placeholder : "";

  if (dangerous) {
    return (
      <div className="markdown-wrapper">
        <div
          className="markdown"
          dangerouslySetInnerHTML={{ __html: source }}
        />
      </div>
    );
  }
  return (
    <div className="markdown-wrapper">
      <div className="markdown">
        {/* The conversion recurses over the document, so deeply nested input
            can overflow the stack — and this input is author-controlled. The
            boundary degrades that to plain text instead of losing the page;
            see MarkdownErrorBoundary. */}
        <MarkdownErrorBoundary input={source}>
          <MarkdownHooks
            remarkPlugins={[gfm]}
            // `raw` parses embedded HTML (e.g. <details>/<summary> collapsibles)
            // into real nodes; without it react-markdown drops raw HTML and the
            // collapsibles the old site rendered vanished. It MUST run before
            // nimbusSanitize, which is a strict allowlist (details/summary/open
            // are permitted, <script> etc. stripped) — so raw HTML is parsed then
            // sanitized, never trusted.
            rehypePlugins={[raw, nimbusSanitize]}
            fallback={"Loading markdown..."}
          >
            {source}
          </MarkdownHooks>
        </MarkdownErrorBoundary>
      </div>
    </div>
  );
}

Markdown.displayName = "Markdown";
