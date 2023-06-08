import { ComponentStory, ComponentMeta } from "@storybook/react";
import { InternalServerErrorLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/SimplePages",
  component: InternalServerErrorLayout,
} as ComponentMeta<typeof InternalServerErrorLayout>;

const Template: ComponentStory<typeof InternalServerErrorLayout> = () => (
  <div>
    <InternalServerErrorLayout />
  </div>
);

const DefaultInternalServerErrorLayout = Template.bind({});

export {
  meta as default,
  DefaultInternalServerErrorLayout as InternalServerError,
};
