"use client";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { BreadCrumbs } from "../../../BreadCrumbs/BreadCrumbs";
import { MarkdownPreviewLink } from "../../../Links/Links";
import { BaseLayout } from "../../BaseLayout/BaseLayout";
import { PageHeader } from "../../BaseLayout/PageHeader/PageHeader";
import { useState } from "react";
import { Markdown } from "../../../Markdown/Markdown";
import styles from "./MarkdownPreviewLayout.module.css";
import { TextAreaInput } from "../../../TextAreaInput/TextAreaInput";

/**
 * Cyberstorm MarkdownPreview Layout
 */
export function MarkdownPreviewLayout() {
  const [markdownPreviewInput, setMarkdownPreviewInput] = useState("");

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
