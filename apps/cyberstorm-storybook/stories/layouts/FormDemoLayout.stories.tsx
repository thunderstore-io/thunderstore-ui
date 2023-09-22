import { Meta, StoryObj } from "@storybook/react";
import { FormDemoLayout } from "@thunderstore/cyberstorm";

export default {
  title: "Cyberstorm/Layouts/FormDemo",
  component: FormDemoLayout,
} as Meta<typeof FormDemoLayout>;

export const Primary: StoryObj<typeof FormDemoLayout> = {
  render: () => <FormDemoLayout />,
};
