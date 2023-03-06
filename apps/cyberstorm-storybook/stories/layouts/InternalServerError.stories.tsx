import { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  Footer,
  Heading,
  InternalServerErrorLayout,
} from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/SimplePages",
  component: InternalServerErrorLayout,
} as ComponentMeta<typeof InternalServerErrorLayout>;

const Template: ComponentStory<typeof InternalServerErrorLayout> = (args) => (
  <div>
    <Heading />
    <InternalServerErrorLayout {...args} />
    <Footer />
  </div>
);

const DefaultInternalServerErrorLayout = Template.bind({});
DefaultInternalServerErrorLayout.args = {};

export { meta as default, DefaultInternalServerErrorLayout };
