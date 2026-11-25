import { type Components, MarkdownHooks } from "react-markdown";
import raw from "rehype-raw";
import gfm from "remark-gfm";

import { MarkdownErrorBoundary } from "./MarkdownErrorBoundary";
import { nimbusSanitize } from "./Sanitize";
import { withMarkdownTableHeaderLabels } from "./withMarkdownTableHeaderLabels";

function flowClass(className: string | undefined, ...names: string[]) {
  return [className, ...names].filter(Boolean).join(" ");
}

const markdownComponents: Components = {
  table: ({ children, className, node: _node, ...props }) => (
    <table {...props} className={flowClass(className, "table", "table--flow")}>
      {children}
    </table>
  ),
  th: ({ children, className, node: _node, ...props }) => (
    <th {...props} className={flowClass(className, "table__header")}>
      <span className="table__header-text">{children}</span>
    </th>
  ),
  td: ({ children, className, node: _node, ...props }) => (
    <td {...props} className={flowClass(className, "table__item")}>
      {children}
    </td>
  ),
};

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
          dangerouslySetInnerHTML={{
            __html: withMarkdownTableHeaderLabels(source),
          }}
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
            components={markdownComponents}
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
