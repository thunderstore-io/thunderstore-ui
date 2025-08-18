import { MarkdownHooks } from "react-markdown";
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
        <MarkdownHooks
          remarkPlugins={[gfm]}
          rehypePlugins={[nimbusSanitize]}
          fallback={"Loading markdown..."}
        >
          {input && input !== "" ? input : placeholder ? placeholder : ""}
        </MarkdownHooks>
      </div>
    </div>
  );
}

Markdown.displayName = "Markdown";
