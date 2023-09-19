import { StoryFn, Meta } from "@storybook/react";
import { MarkdownPreviewLayout } from "@thunderstore/cyberstorm";
import React from "react";

export default {
  title: "Cyberstorm/Layouts/Developers",
  component: MarkdownPreviewLayout,
} as Meta;

const Template: StoryFn<typeof MarkdownPreviewLayout> = () => (
  <div>
    <MarkdownPreviewLayout />
  </div>
);

const DefaultMarkdownPreviewLayout = Template.bind({});

export { DefaultMarkdownPreviewLayout as MarkdownPreview };
