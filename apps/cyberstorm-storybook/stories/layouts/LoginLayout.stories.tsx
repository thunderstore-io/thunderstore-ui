import { Meta, StoryFn } from "@storybook/react";
import { LoginLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/Login",
  component: LoginLayout,
} as Meta<typeof LoginLayout>;

export const DefaultLoginLayout: StoryFn<typeof LoginLayout> = () => (
  <div>
    <LoginLayout />
  </div>
);

DefaultLoginLayout.args = {};

export { meta as default };
