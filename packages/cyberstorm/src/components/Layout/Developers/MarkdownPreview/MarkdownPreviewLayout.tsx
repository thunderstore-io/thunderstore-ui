import { Title } from "../../../Title/Title";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { TextInput } from "../../../TextInput/TextInput";
import { BreadCrumbs } from "../../../BreadCrumbs/BreadCrumbs";
import { MarkdownPreviewLink } from "../../../Links/Links";
import { BaseLayout } from "../../BaseLayout/BaseLayout";

/**
 * Cyberstorm MarkdownPreview Layout
 */
export function MarkdownPreviewLayout() {
  return (
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <MarkdownPreviewLink>Markdown Preview</MarkdownPreviewLink>
        </BreadCrumbs>
      }
      header={<Title text="Markdown Preview" />}
      mainContent={
        <>
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
        </>
      }
    />
  );
}

MarkdownPreviewLayout.displayName = "MarkdownPreviewLayout";
