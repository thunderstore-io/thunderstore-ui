import { ComponentStory, ComponentMeta } from "@storybook/react";
import { InternalServerErrorLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/SimplePages",
  component: InternalServerErrorLayout,
} as ComponentMeta<typeof InternalServerErrorLayout>;

const Template: ComponentStory<typeof InternalServerErrorLayout> = (args) => (
  <InternalServerErrorLayout {...args} />
);

const DefaultInternalServerErrorLayout = Template.bind({});
DefaultInternalServerErrorLayout.args = {};

export { meta as default, DefaultInternalServerErrorLayout };
