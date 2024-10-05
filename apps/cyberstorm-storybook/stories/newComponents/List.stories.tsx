import { StoryFn, Meta } from "@storybook/react";
import { List, NewLink } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "List",
  component: List.Root,
} as Meta<typeof List.Root>;

const defaultArgs = {};

const Template: StoryFn<typeof List> = () => {
  return (
    <List.Root csTextStyles={["lineHeightBody", "fontSizeS"]}>
      <List.ListItem>
        <NewLink primitiveType="link" href="/api/docs" csVariant="accent">
          API Documentation
        </NewLink>
      </List.ListItem>
      <List.ListItem>
        <NewLink
          primitiveType="link"
          href="/package/create/docs/"
          csVariant="accent"
        >
          Package Format Docs
        </NewLink>
      </List.ListItem>
      <List.ListItem>
        <NewLink
          primitiveType="link"
          href="/tools/manifest-v1-validator/"
          csVariant="accent"
        >
          Manifest Validator
        </NewLink>
      </List.ListItem>
      <List.ListItem>
        <NewLink
          primitiveType="link"
          href="/tools/markdown-preview/"
          csVariant="accent"
        >
          Markdown Preview
        </NewLink>
      </List.ListItem>
      <List.ListItem>
        <NewLink
          primitiveType="link"
          href="https://github.com/thunderstore-io"
          csVariant="accent"
        >
          GitHub
        </NewLink>
      </List.ListItem>
    </List.Root>
  );
};

const ReferenceList = Template.bind({});
ReferenceList.args = defaultArgs;

export { meta as default, ReferenceList };
