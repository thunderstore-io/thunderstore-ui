"use client";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { BreadCrumbs } from "../../../BreadCrumbs/BreadCrumbs";
import { CyberstormLink } from "../../../Links/Links";
import { BaseLayout } from "../../BaseLayout/BaseLayout";
import { PageHeader } from "../../BaseLayout/PageHeader/PageHeader";
import { useState, useEffect } from "react";
import markdownStyles from "../../../Markdown/Markdown.module.css";
import styles from "./MarkdownPreviewLayout.module.css";
import { PLACEHOLDER } from "./MarkdownPlaceholder";
import { CodeInput } from "../../../CodeInput/CodeInput";
import { isRecord } from "../../../../utils/type_guards";

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

/**
 * Cyberstorm MarkdownPreview Layout
 */
export function MarkdownPreviewLayout() {
  const placeholder = PLACEHOLDER();
  const [markdownPreviewInput, setMarkdownPreviewInput] = useState("");
  const [html, setHTML] = useState<null | string>(null);
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
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <CyberstormLink linkId="MarkdownPreview">
            Markdown Preview
          </CyberstormLink>
        </BreadCrumbs>
      }
      header={<PageHeader title="Markdown Preview" />}
      mainContent={
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
            content={
              <div
                dangerouslySetInnerHTML={{ __html: html ? html : placeholder }}
                className={markdownStyles.root}
              />
            }
          />
        </div>
      }
    />
  );
}

MarkdownPreviewLayout.displayName = "MarkdownPreviewLayout";
