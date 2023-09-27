import { StoryFn, Meta } from "@storybook/react";
import { MarkdownPreviewLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/Developers",
  component: MarkdownPreviewLayout,
} as Meta<typeof MarkdownPreviewLayout>;

const Template: StoryFn<typeof MarkdownPreviewLayout> = () => (
  <div>
    <MarkdownPreviewLayout />
  </div>
);

const DefaultMarkdownPreviewLayout = Template.bind({});

export { meta as default, DefaultMarkdownPreviewLayout as MarkdownPreview };
