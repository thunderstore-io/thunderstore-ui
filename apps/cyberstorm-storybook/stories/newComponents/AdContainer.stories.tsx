import { StoryFn, Meta } from "@storybook/react";
import { AdContainer } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "AdContainer",
  component: AdContainer,
} as Meta<typeof AdContainer>;

const defaultArgs = {
  containerId: "test",
};

const Template: StoryFn<typeof AdContainer> = (args) => (
  <AdContainer {...args} />
);

const ReferenceAdContainer = Template.bind({});
ReferenceAdContainer.args = defaultArgs;

export { meta as default, ReferenceAdContainer };
