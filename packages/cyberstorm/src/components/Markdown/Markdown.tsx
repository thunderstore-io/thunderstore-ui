"use client";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import styles from "./Markdown.module.css";
import PLACEHOLDER from "./MarkdownPlaceholder";
import { useEffect, useState, SetStateAction } from "react";

interface MarkdownProps {
  input: string;
  setStatus: React.Dispatch<
    SetStateAction<"waiting" | "validating" | "success" | "failure">
  >;
}

interface HTMLResponse {
  html: string;
}

export const isRecord = (obj: unknown): obj is Record<string, unknown> =>
  obj instanceof Object;

function isHTMLResponse(response: unknown): response is HTMLResponse {
  return isRecord(response) && typeof response.html === "string";
}

/**
 * Wrapper for rendering markdown strings as proper markup.
 */
export function Markdown(props: MarkdownProps) {
  const { input, setStatus } = props;
  const placeholder = PLACEHOLDER();

  const [html, setHTML] = useState<null | string>(null);
  useEffect(() => {
    async function getHTML() {
      setStatus("validating");
      const response = await fetch(
        "http://thunderstore.temp/api/experimental/frontend/render-markdown/",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ markdown: input }),
        }
      );
      const data = await response.json();
      if (isHTMLResponse(data)) {
        setHTML(data.html);
        setStatus("success");
      } else {
        setStatus("failure");
      }
    }
    if (input) {
      getHTML();
    } else {
      setHTML(null);
    }
  }, [input]);

  return (
    <ReactMarkdown
      className={styles.root}
      remarkPlugins={[gfm]}
      rehypePlugins={[rehypeRaw]}
    >
      {html ? html : placeholder}
    </ReactMarkdown>
  );
}

Markdown.displayName = "Markdown";
