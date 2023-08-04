import { ComponentStory, ComponentMeta } from "@storybook/react";
import { LoginLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/Login",
  component: LoginLayout,
} as ComponentMeta<typeof LoginLayout>;

const Template: ComponentStory<typeof LoginLayout> = () => (
  <div>
    <LoginLayout />
  </div>
);

const DefaultLoginLayout = Template.bind({});

export { meta as default, DefaultLoginLayout as Login };
