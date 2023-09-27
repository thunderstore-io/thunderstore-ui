import { StoryFn, Meta } from "@storybook/react";
import {
  CopyButton,
  MetaInfoItem,
  MetaInfoItemProps,
} from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Components/MetaInfoItem",
  component: MetaInfoItem,
} as Meta<typeof MetaInfoItem>;

const defaultArgs: MetaInfoItemProps = {};

const Template: StoryFn<typeof MetaInfoItem> = (args) => (
  <div style={{ width: "400px" }}>
    <MetaInfoItem {...args} />
  </div>
);

const ReferenceMetaInfoItem = Template.bind({});
ReferenceMetaInfoItem.args = {
  ...defaultArgs,
  label: "Likes",
  content: "375",
};

const MetaInfoItemWithCopyButton = Template.bind({});
MetaInfoItemWithCopyButton.args = {
  ...defaultArgs,
  label: "Server code",
  content: (
    <>
      <div>123.456.789</div>
      <CopyButton text={"123.456.789"} />
    </>
  ),
};

export { meta as default, ReferenceMetaInfoItem, MetaInfoItemWithCopyButton };
