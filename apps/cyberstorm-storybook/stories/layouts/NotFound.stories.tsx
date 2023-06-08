import { ComponentStory, ComponentMeta } from "@storybook/react";
import { NotFoundLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/SimplePages",
  component: NotFoundLayout,
} as ComponentMeta<typeof NotFoundLayout>;

const Template: ComponentStory<typeof NotFoundLayout> = () => (
  <div>
    <NotFoundLayout />
  </div>
);

const DefaultNotFoundLayout = Template.bind({});

export { meta as default, DefaultNotFoundLayout as NotFound };
