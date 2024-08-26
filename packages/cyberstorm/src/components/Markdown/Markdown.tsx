import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

import styles from "./Markdown.module.css";

interface MarkdownProps {
  input?: string;
  dangerous?: boolean;
  placeholder?: string;
}

/**
 * Wrapper for rendering markdown strings as proper markup.
 */
export function Markdown(props: MarkdownProps) {
  const { input, dangerous, placeholder } = props;

  if (dangerous) {
    return (
      <div
        dangerouslySetInnerHTML={{
          __html:
            input && input !== "" ? input : placeholder ? placeholder : "",
        }}
        className={styles.root}
      />
    );
  }
  return (
    <ReactMarkdown className={styles.root} remarkPlugins={[gfm]}>
      {input && input !== "" ? input : placeholder ? placeholder : ""}
    </ReactMarkdown>
  );
}

Markdown.displayName = "Markdown";
