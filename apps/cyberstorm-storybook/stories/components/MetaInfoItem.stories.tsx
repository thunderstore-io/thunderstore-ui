import { StoryFn, Meta } from "@storybook/react";
import { MetaInfoItem, MetaInfoItemProps } from "@thunderstore/cyberstorm";
import React from "react";

export default {
  title: "Cyberstorm/Components/MetaInfoItem",
  component: MetaInfoItem,
} as Meta;

const defaultArgs: MetaInfoItemProps = {
  colorScheme: "default",
};

const Template: StoryFn<typeof MetaInfoItem> = (args) => (
  <div style={{ width: "200px" }}>
    <MetaInfoItem {...args}>
      <span>Game</span>
      <span>V Rising</span>
    </MetaInfoItem>
  </div>
);

const ReferenceMetaInfoItem = Template.bind({});
ReferenceMetaInfoItem.args = {
  ...defaultArgs,
  colorScheme: "tertiary",
};

export { ReferenceMetaInfoItem };
