import { StoryFn, Meta } from "@storybook/react";
import { ErrorLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/Error",
  component: ErrorLayout,
} as Meta<typeof ErrorLayout>;

const Template: StoryFn<typeof ErrorLayout> = (args) => (
  <div>
    <ErrorLayout {...args} />
  </div>
);

const NotFoundErrorLayout = Template.bind({});
NotFoundErrorLayout.args = { error: 404 };

const InternalServerErrorLayout = Template.bind({});
InternalServerErrorLayout.args = { error: 500 };

export { meta as default, NotFoundErrorLayout, InternalServerErrorLayout };
