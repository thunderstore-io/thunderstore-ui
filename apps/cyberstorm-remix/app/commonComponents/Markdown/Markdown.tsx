import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

import { nimbusSanitize } from "./Sanitize";

interface MarkdownProps {
  input?: string;
  dangerous?: boolean;
  placeholder?: string;
}

export function Markdown(props: MarkdownProps) {
  const { input, dangerous, placeholder } = props;

  if (dangerous) {
    return (
      <div className="markdown-wrapper">
        <div
          className="markdown"
          dangerouslySetInnerHTML={{
            __html:
              input && input !== "" ? input : placeholder ? placeholder : "",
          }}
        />
      </div>
    );
  }
  return (
    <div className="markdown-wrapper">
      <div className="markdown">
        <ReactMarkdown remarkPlugins={[gfm]} rehypePlugins={[nimbusSanitize]}>
          {input && input !== "" ? input : placeholder ? placeholder : ""}
        </ReactMarkdown>
      </div>
    </div>
  );
}

Markdown.displayName = "Markdown";
