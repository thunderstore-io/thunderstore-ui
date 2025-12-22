import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import { useDebounce } from "use-debounce";
import { Markdown } from "~/commonComponents/Markdown/Markdown";

import { CodeInput, isRecord } from "@thunderstore/cyberstorm";
import {
  type RequestConfig,
  isApiError,
  toolsMarkdownPreview,
} from "@thunderstore/thunderstore-api";

import { PageHeader } from "../../commonComponents/PageHeader/PageHeader";
import { type OutletContextShape } from "../../root";
import "./MarkdownPreview.css";

export default function MarkdownPreview() {
  const outletContext = useOutletContext() as OutletContextShape;

  const placeholder =
    '<h1>Markdown syntax guide</h1>\n<h1>This is a Heading h1</h1>\n<h2>This is a Heading h2</h2>\n<h3>This is a Heading h3</h3>\n<h4>This is a Heading h4</h4>\n<h5>This is a Heading h5</h5>\n<h6>This is a Heading h6</h6>\n<h2>Emphasis</h2>\n<p><em>This text will be italic</em>_\nThis will also be italic_</p>\n<p><strong>This text will be bold</strong><br>\n<strong>This will also be bold</strong></p>\n<p><em>You <strong>can</strong> combine them</em></p>\n<h2>Lists</h2>\n<h3>Unordered</h3>\n<ul>\n<li>Item 1</li>\n<li>Item 2\n<ul>\n<li>Item 2a</li>\n<li>Item 2b</li>\n</ul>\n</li>\n</ul>\n<h3>Ordered</h3>\n<ol>\n<li>Item 1</li>\n<li>Item 2</li>\n<li>Item 3</li>\n<li>Item 3a</li>\n<li>Item 3b</li>\n</ol>\n<h2>Images</h2>\n<p><img alt="This is an alt text." src="/image/sample.png"></p>\n<h2>Links</h2>\n<p>You may be using <a href="https://markdownlivepreview.com/">Markdown Live Preview</a>.</p>\n<h2>Blockquotes</h2>\n<blockquote>\n<p>Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.</p>\n<blockquote>\n<p>Markdown is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>\n</blockquote>\n</blockquote>\n<h2>Tables</h2>\n<table>\n<thead>\n<tr>\n<th>Left columns</th>\n<th>Right columns</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>left foo</td>\n<td>right foo</td>\n</tr>\n<tr>\n<td>left bar</td>\n<td>right bar</td>\n</tr>\n<tr>\n<td>left baz</td>\n<td>right baz</td>\n</tr>\n</tbody>\n</table>\n<h2>Blocks of code</h2>\n<pre><code>let message = \'Hello world\';\nalert(message);\n</code></pre>\n<h2>Inline code</h2>\n<p>This web site is using <code>markedjs/marked</code>.</p>\n';
  const [markdownPreviewInput, setMarkdownPreviewInput] = useState("");
  const [html, setHTML] = useState<undefined | string>(undefined);

  const [validation, setValidation] = useState<{
    status: "waiting" | "processing" | "success" | "failure";
    message?: string;
  }>({ status: "waiting", message: "Waiting for input" });

  const [debouncedMarkdownPreviewInput] = useDebounce(
    markdownPreviewInput,
    300,
    {
      maxWait: 300,
    }
  );

  useEffect(() => {
    if (debouncedMarkdownPreviewInput !== "") {
      setValidation({ status: "processing" });
      MarkdownValidationResult(
        debouncedMarkdownPreviewInput,
        outletContext.requestConfig,
        setHTML,
        setValidation
      );
    } else {
      setHTML(undefined);
      setValidation({
        status: "waiting",
        message: "Waiting for manifest text",
      });
    }
  }, [debouncedMarkdownPreviewInput]);

  return (
    <>
      <PageHeader headingLevel="1" headingSize="2">
        Markdown Preview
      </PageHeader>
      <section className="container container--y container--full markdown-preview">
        <div className="container container--x container--full markdown-preview__row">
          <div className="markdown-preview__meta">
            <p className="markdown-preview__title">Manifest Validator</p>
            <p className="markdown-preview__description">
              Select a team to validate a package
            </p>
          </div>
          <div className="markdown-preview__content">
            <CodeInput
              placeholder="# This is a markdown preview placeholder"
              onChange={(e) => setMarkdownPreviewInput(e.currentTarget.value)}
              value={markdownPreviewInput}
              validationBarProps={validation}
            />
          </div>
        </div>
        <div className="markdown-preview__divider" />
        <div className="container container--x container--full markdown-preview__row">
          <div className="markdown-preview__meta">
            <p className="markdown-preview__title">Markdown output</p>
            <p className="markdown-preview__description">
              A preview of your rendered markdown
            </p>
          </div>
          <div className="markdown-preview__content">
            <Markdown input={html} placeholder={placeholder} dangerous />
          </div>
        </div>
      </section>
    </>
  );
}

async function MarkdownValidationResult(
  markdownPreviewInput: string,
  config: () => RequestConfig,
  setHTML: React.Dispatch<React.SetStateAction<undefined | string>>,
  setValidation: (validation: {
    status: "waiting" | "processing" | "success" | "failure";
    message?: string;
  }) => void
) {
  try {
    const response = await toolsMarkdownPreview({
      config: config,
      data: {
        markdown: markdownPreviewInput,
      },
      params: {},
      queryParams: {},
    });
    if (isRecord(response) && typeof response.html === "string") {
      setHTML(response.html);
      setValidation({ status: "success", message: "All systems go!" });
    }
  } catch (e) {
    if (isApiError(e)) {
      if (
        isRecord(e.responseJson) &&
        typeof e.responseJson.detail === "string"
      ) {
        if (e.responseJson.detail) {
          setValidation({
            status: "failure",
            message: e.responseJson.detail,
          });
        }
      }
    } else {
      // REMIX TODO: Add sentry logging here
      setValidation({ status: "failure", message: "Unknown error" });
      throw e;
    }
  }
}
