import { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  Footer,
  Heading,
  MarkdownPreviewLayout,
} from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/Developers",
  component: MarkdownPreviewLayout,
} as ComponentMeta<typeof MarkdownPreviewLayout>;

const Template: ComponentStory<typeof MarkdownPreviewLayout> = (args) => (
  <div>
    <Heading />
    <MarkdownPreviewLayout {...args} />
    <Footer />
  </div>
);

const DefaultMarkdownPreviewLayout = Template.bind({});
DefaultMarkdownPreviewLayout.args = {};

export { meta as default, DefaultMarkdownPreviewLayout };
