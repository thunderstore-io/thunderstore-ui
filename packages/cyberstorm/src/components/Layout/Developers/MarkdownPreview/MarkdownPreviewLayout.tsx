import React from "react";
import styles from "./MarkdownPreviewLayout.module.css";
import { Title } from "../../../Title/Title";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { TextInput } from "../../../TextInput/TextInput";
import { BreadCrumbs } from "../../../BreadCrumbs/BreadCrumbs";
import { CommunityLink } from "../../../Links/Links";

/**
 * Cyberstorm MarkdownPreview Layout
 */
export const MarkdownPreviewLayout: React.FC = () => {
  return (
    <div className={styles.root}>
      <BreadCrumbs>
        <CommunityLink community={"Developers"}>Developers</CommunityLink>
      </BreadCrumbs>
      <Title text="Markdown Preview" />
      <SettingItem
        title="Markdown Input"
        description="Input your markdown code"
        content={
          <TextInput placeHolder="# This is a markdown preview placeholder" />
        }
      />
      <SettingItem
        title="Markdown Output"
        description="A preview of your rendered markdown"
        content={<Title text="This is a markdown preview placeholder" />}
      />
    </div>
  );
};

MarkdownPreviewLayout.displayName = "MarkdownPreviewLayout";
MarkdownPreviewLayout.defaultProps = {};
