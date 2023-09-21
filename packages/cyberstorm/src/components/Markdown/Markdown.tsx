"use client";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

import styles from "./Markdown.module.css";

interface MarkdownProps {
  children: string;
}

/**
 * Wrapper for rendering markdown strings as proper markup.
 */
export function Markdown(props: MarkdownProps) {
  const { children } = props;

  return (
    <ReactMarkdown className={styles.root} remarkPlugins={[gfm]}>
      {children}
    </ReactMarkdown>
  );
}

Markdown.displayName = "Markdown";
