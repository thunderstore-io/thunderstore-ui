import { Meta, StoryFn } from "@storybook/react";
import { BetaLoginLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/Login",
  component: BetaLoginLayout,
} as Meta<typeof BetaLoginLayout>;

export const DefaultBetaLoginLayout: StoryFn<typeof BetaLoginLayout> = () => (
  <div>
    <BetaLoginLayout />
  </div>
);
DefaultBetaLoginLayout.args = {};

export { meta as default };
