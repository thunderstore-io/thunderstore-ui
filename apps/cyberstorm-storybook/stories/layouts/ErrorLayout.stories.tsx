import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ErrorLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/Error",
  component: ErrorLayout,
} as ComponentMeta<typeof ErrorLayout>;

const Template: ComponentStory<typeof ErrorLayout> = (args) => (
  <div>
    <ErrorLayout {...args} />
  </div>
);

const NotFoundErrorLayout = Template.bind({});
NotFoundErrorLayout.args = { error: new Error("404") };

const InternalServerErrorLayout = Template.bind({});
InternalServerErrorLayout.args = { error: new Error("500") };

const UnknownErrorLayout = Template.bind({});
UnknownErrorLayout.args = { error: new Error("1234") };

export {
  meta as default,
  NotFoundErrorLayout,
  InternalServerErrorLayout,
  UnknownErrorLayout,
};
