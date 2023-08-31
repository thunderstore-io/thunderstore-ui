"use client";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { TitleOnlyBreadCrumbs } from "../../../BreadCrumbs/BreadCrumbs";
import { BaseLayout } from "../../BaseLayout/BaseLayout";
import { PageHeader } from "../../BaseLayout/PageHeader/PageHeader";
import { useState } from "react";
import { Markdown } from "../../../Markdown/Markdown";
import styles from "./MarkdownPreviewLayout.module.css";
import { TextAreaInput } from "../../../TextAreaInput/TextAreaInput";

const PAGE_TITLE = "Markdown Preview";

/**
 * Cyberstorm MarkdownPreview Layout
 */
export function MarkdownPreviewLayout() {
  const [markdownPreviewInput, setMarkdownPreviewInput] = useState("");

  return (
    <BaseLayout
      breadCrumb={<TitleOnlyBreadCrumbs pageTitle={PAGE_TITLE} />}
      header={<PageHeader title={PAGE_TITLE} />}
      mainContent={
        <div className={styles.root}>
          <SettingItem
            title="Markdown input"
            description="Input your markdown code"
            content={
              <TextAreaInput
                placeHolder="# This is a markdown preview placeholder"
                setValue={setMarkdownPreviewInput}
                value={markdownPreviewInput}
              />
            }
          />
          <SettingItem
            title="Markdown output"
            description="A preview of your rendered markdown"
            content={<Markdown>{markdownPreviewInput}</Markdown>}
          />
        </div>
      }
    />
  );
}

MarkdownPreviewLayout.displayName = "MarkdownPreviewLayout";
