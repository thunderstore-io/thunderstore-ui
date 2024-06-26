"use client";
import styles from "./Preview.module.css";
import {
  CodeInput,
  Markdown,
  SettingItem,
  isRecord,
} from "@thunderstore/cyberstorm";
import { useState, useEffect } from "react";

interface HTMLResponse {
  html: string;
}

function isHTMLResponse(response: unknown): response is HTMLResponse {
  return isRecord(response) && typeof response.html === "string";
}

interface IMarkdownValidationResult {
  markdownPreviewInput: string;
  setHTML: React.Dispatch<React.SetStateAction<string>>;
}

async function MarkdownValidationResult(
  props: IMarkdownValidationResult
): Promise<{
  status: "success" | "failure";
  message: string;
}> {
  const { markdownPreviewInput, setHTML } = props;
  const response = await fetch(
    "https://thunderstore.io/api/experimental/frontend/render-markdown/",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ markdown: markdownPreviewInput }),
    }
  );

  if (response.status === 200) {
    const parsedResponse = await response.json();
    if (isHTMLResponse(parsedResponse)) {
      setHTML(parsedResponse.html);
      return { status: "success", message: "All systems go!" };
    }
  }
  return {
    status: "failure",
    message: "Problem, alarm, danger. Everything is going to explode.",
  };
}

export default function Page() {
  const placeholder =
    '<h1>Markdown syntax guide</h1>\n<h1>This is a Heading h1</h1>\n<h2>This is a Heading h2</h2>\n<h3>This is a Heading h3</h3>\n<h4>This is a Heading h4</h4>\n<h5>This is a Heading h5</h5>\n<h6>This is a Heading h6</h6>\n<h2>Emphasis</h2>\n<p><em>This text will be italic</em>_\nThis will also be italic_</p>\n<p><strong>This text will be bold</strong><br>\n<strong>This will also be bold</strong></p>\n<p><em>You <strong>can</strong> combine them</em></p>\n<h2>Lists</h2>\n<h3>Unordered</h3>\n<ul>\n<li>Item 1</li>\n<li>Item 2\n<ul>\n<li>Item 2a</li>\n<li>Item 2b</li>\n</ul>\n</li>\n</ul>\n<h3>Ordered</h3>\n<ol>\n<li>Item 1</li>\n<li>Item 2</li>\n<li>Item 3</li>\n<li>Item 3a</li>\n<li>Item 3b</li>\n</ol>\n<h2>Images</h2>\n<p><img alt="This is an alt text." src="/image/sample.png"></p>\n<h2>Links</h2>\n<p>You may be using <a href="https://markdownlivepreview.com/">Markdown Live Preview</a>.</p>\n<h2>Blockquotes</h2>\n<blockquote>\n<p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.</p>\n<blockquote>\n<p>Markdown is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>\n</blockquote>\n</blockquote>\n<h2>Tables</h2>\n<table>\n<thead>\n<tr>\n<th>Left columns</th>\n<th>Right columns</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>left foo</td>\n<td>right foo</td>\n</tr>\n<tr>\n<td>left bar</td>\n<td>right bar</td>\n</tr>\n<tr>\n<td>left baz</td>\n<td>right baz</td>\n</tr>\n</tbody>\n</table>\n<h2>Blocks of code</h2>\n<pre><code>let message = \'Hello world\';\nalert(message);\n</code></pre>\n<h2>Inline code</h2>\n<p>This web site is using <code>markedjs/marked</code>.</p>\n';
  const [markdownPreviewInput, setMarkdownPreviewInput] = useState("");
  const [html, setHTML] = useState<undefined | string>(undefined);
  const [validationTrigger, setValidationTrigger] = useState(false);

  const validator = {
    validationFunc: MarkdownValidationResult,
    args: { markdownPreviewInput, setHTML },
  };

  useEffect(() => {
    if (markdownPreviewInput) {
      setValidationTrigger(true);
    } else {
      setValidationTrigger(false);
    }
  }, [markdownPreviewInput]);

  return (
    <div className={styles.root}>
      <SettingItem
        title="Markdown input"
        description="Input your markdown code"
        content={
          <CodeInput
            placeholder="# This is a markdown preview placeholder"
            setValue={setMarkdownPreviewInput}
            value={markdownPreviewInput}
            validator={validator}
            shouldValidate={validationTrigger}
          />
        }
      />
      <SettingItem
        title="Markdown output"
        description="A preview of your rendered markdown"
        content={<Markdown input={html} placeholder={placeholder} dangerous />}
      />
    </div>
  );
}
