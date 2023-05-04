import { ComponentStory, ComponentMeta } from "@storybook/react";
import { MarkdownPreviewLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/Developers",
  component: MarkdownPreviewLayout,
} as ComponentMeta<typeof MarkdownPreviewLayout>;

const Template: ComponentStory<typeof MarkdownPreviewLayout> = () => (
  <div>
    <MarkdownPreviewLayout />
  </div>
);

const DefaultMarkdownPreviewLayout = Template.bind({});
DefaultMarkdownPreviewLayout.args = {};

export { meta as default, DefaultMarkdownPreviewLayout };
