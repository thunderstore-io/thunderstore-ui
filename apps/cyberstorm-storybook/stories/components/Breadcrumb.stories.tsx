import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  BreadCrumb,
  CommunityLink,
  CommunityPackagesLink,
  DefaultHomeCrumb,
} from "@thunderstore/cyberstorm";

const meta = {
  title: "Cyberstorm/Components/Breadcrumb",
  component: BreadCrumb,
} as ComponentMeta<typeof BreadCrumb>;

const Template: ComponentStory<typeof BreadCrumb> = (args) => (
  <BreadCrumb {...args} />
);

const community = "riskofrain2";
const communityCrumb = {
  LinkComponent: CommunityLink,
  LinkProps: { community },
  label: "Risk of Rain 2",
};

const FirstLevel = Template.bind({});
FirstLevel.args = {
  parts: [DefaultHomeCrumb],
};

const SecondLevel = Template.bind({});
SecondLevel.args = {
  parts: [DefaultHomeCrumb, { label: "Risk of Rain 2" }],
};

const ThirdLevel = Template.bind({});
ThirdLevel.args = {
  parts: [
    DefaultHomeCrumb,
    communityCrumb,
    {
      label: "Packages",
    },
  ],
};

const FourthLevel = Template.bind({});
FourthLevel.args = {
  parts: [
    DefaultHomeCrumb,
    communityCrumb,
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

export { meta as default, FirstLevel, SecondLevel, ThirdLevel, FourthLevel };
