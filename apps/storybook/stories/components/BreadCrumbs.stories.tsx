import { StoryFn, Meta } from "@storybook/react";
import {
  BreadCrumbs,
  CommunityLink,
  CommunityPackagesLink,
} from "@thunderstore/components";
import React from "react";

export default {
  title: "BreadCrumbs",
  component: BreadCrumbs,
} as Meta;

const Template: StoryFn<typeof BreadCrumbs> = (args) => (
  <BreadCrumbs {...args} />
);

const community = "Risk of Rain 2";

const FirstLevel = Template.bind({});
FirstLevel.args = {
  parts: [{ label: community }],
};

const SecondLevel = Template.bind({});
SecondLevel.args = {
  parts: [
    {
      LinkComponent: CommunityLink,
      LinkProps: { community },
      label: community,
    },
    {
      label: "Packages",
    },
  ],
};

const ThirdLevel = Template.bind({});
ThirdLevel.args = {
  parts: [
    {
      LinkComponent: CommunityLink,
      LinkProps: { community },
      label: community,
    },
    {
      LinkComponent: CommunityPackagesLink,
      LinkProps: { community },
      label: "Packages",
    },
    {
      label: "Statistics",
    },
  ],
};

export { FirstLevel, SecondLevel, ThirdLevel };
