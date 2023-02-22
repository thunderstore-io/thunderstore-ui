import { StoryFn, Meta } from "@storybook/react";
import {
  BreadCrumbs,
  CommunityLink,
  CommunityPackagesLink,
} from "@thunderstore/cyberstorm";

export default {
  title: "Cyberstorm/Components/BreadCrumbs",
  component: BreadCrumbs,
  argTypes: {
    excludeHome: {
      description: "If set to true, the home breadcrumb is excluded",
      defaultValue: false,
      control: "boolean",
    },
  },
} as Meta;

type BreadCrumbsStory = StoryFn<typeof BreadCrumbs>;
const community = "riskofrain2";

export const FullCrumbs: BreadCrumbsStory = (args) => (
  <BreadCrumbs {...args}>
    <CommunityLink community={community}>Risk of Rain 2</CommunityLink>
    <CommunityPackagesLink community={community}>
      Packages
    </CommunityPackagesLink>
    Popular
  </BreadCrumbs>
);

export const HomeOnly: BreadCrumbsStory = (args) => <BreadCrumbs {...args} />;

export const OneCrumb: BreadCrumbsStory = (args) => (
  <BreadCrumbs {...args}>
    <CommunityLink community={community}>Risk of Rain 2</CommunityLink>
  </BreadCrumbs>
);

export const TwoCrumbs: BreadCrumbsStory = (args) => (
  <BreadCrumbs {...args}>
    <CommunityLink community={community}>Risk of Rain 2</CommunityLink>
    <CommunityPackagesLink community={community}>
      Packages
    </CommunityPackagesLink>
  </BreadCrumbs>
);
