"use client";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { BreadCrumbs } from "../../../BreadCrumbs/BreadCrumbs";
import { MarkdownPreviewLink } from "../../../Links/Links";
import { BaseLayout } from "../../BaseLayout/BaseLayout";
import { PageHeader } from "../../BaseLayout/PageHeader/PageHeader";
import { useState, useEffect } from "react";
import markdownStyles from "../../../Markdown/Markdown.module.css";
import styles from "./MarkdownPreviewLayout.module.css";
import { PLACEHOLDER } from "./MarkdownPlaceholder";
import { CodeInput } from "../../../CodeInput/CodeInput";

interface HTMLResponse {
  html: string;
}

export const isRecord = (obj: unknown): obj is Record<string, unknown> =>
  obj instanceof Object;

function isHTMLResponse(response: unknown): response is HTMLResponse {
  return isRecord(response) && typeof response.html === "string";
}

/**
 * Cyberstorm MarkdownPreview Layout
 */
export function MarkdownPreviewLayout() {
  const [markdownPreviewInput, setMarkdownPreviewInput] = useState("");
  const [validationStatus, setValidationStatus] = useState<
    "waiting" | "validating" | "success" | "failure"
  >("waiting");

  const placeholder = PLACEHOLDER();

  const [html, setHTML] = useState<null | string>(null);
  useEffect(() => {
    async function getHTML() {
      setValidationStatus("validating");
      fetch(
        "https://thunderstore.io/api/experimental/frontend/render-markdown/",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ markdown: markdownPreviewInput }),
        }
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Something went wrong");
        })
        .then((responseJson) => {
          if (isHTMLResponse(responseJson)) {
            setHTML(responseJson.html);
            setValidationStatus("success");
          } else {
            setValidationStatus("failure");
          }
        })
        .catch(() => {
          setValidationStatus("failure");
        });
    }
    if (markdownPreviewInput) {
      getHTML();
    } else {
      setHTML(null);
    }
  }, [markdownPreviewInput]);

  const input = (
    <div
      className={`${styles.inputContainer} ${
        validationStatus === "failure" ? styles.inputContainerFailure : null
      }`}
    >
      <CodeInput
        placeholder="# This is a markdown preview placeholder"
        setValue={setMarkdownPreviewInput}
        value={markdownPreviewInput}
        validationBar
        validationStatus={validationStatus}
      />
    </div>
  );

  return (
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <MarkdownPreviewLink>Markdown Preview</MarkdownPreviewLink>
        </BreadCrumbs>
      }
      header={<PageHeader title="Markdown Preview" />}
      mainContent={
        <div className={styles.root}>
          <SettingItem
            title="Markdown input"
            description="Input your markdown code"
            content={input}
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
