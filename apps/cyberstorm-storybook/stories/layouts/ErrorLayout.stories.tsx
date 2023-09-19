import { StoryFn, Meta } from "@storybook/react";
import { ErrorLayout } from "@thunderstore/cyberstorm";
import React from "react";

export default {
  title: "Cyberstorm/Layouts/Error",
  component: ErrorLayout,
} as Meta;

const Template: StoryFn<typeof ErrorLayout> = (args) => (
  <div>
    <ErrorLayout {...args} />
  </div>
);

const NotFoundErrorLayout = Template.bind({});
NotFoundErrorLayout.args = { error: 404 };

const InternalServerErrorLayout = Template.bind({});
InternalServerErrorLayout.args = { error: 500 };

export { NotFoundErrorLayout, InternalServerErrorLayout };
