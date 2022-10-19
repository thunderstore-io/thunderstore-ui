import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Icon } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Components/Icon",
  component: Icon,
} as ComponentMeta<typeof Icon>;

const Template: ComponentStory<typeof Icon> = (args) => <Icon {...args} />;

const CoffeeIcon = Template.bind({});
CoffeeIcon.args = { iconName: "coffee" };

export { meta as default, CoffeeIcon };
