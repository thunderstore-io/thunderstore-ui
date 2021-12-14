import { TopBar } from "@thunderstore/components";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

const meta = { component: TopBar } as ComponentMeta<typeof TopBar>;

const Template: ComponentStory<typeof TopBar> = () => <TopBar />;

const TopBar_ = Template.bind({});

export { meta as default, TopBar_ as TopBar };
