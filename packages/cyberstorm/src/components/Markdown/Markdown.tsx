"use client";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import styles from "./Markdown.module.css";

interface MarkdownProps {
  input: string;
}

/**
 * Wrapper for rendering markdown strings as proper markup.
 */
export function Markdown(props: MarkdownProps) {
  const { input } = props;

  return (
    <ReactMarkdown
      className={styles.root}
      remarkPlugins={[gfm]}
      rehypePlugins={[rehypeRaw]}
    >
      {input}
    </ReactMarkdown>
  );
}

Markdown.displayName = "Markdown";
