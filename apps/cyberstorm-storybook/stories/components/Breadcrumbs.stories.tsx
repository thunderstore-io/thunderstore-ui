import { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  Breadcrumbs,
  CommunityLink,
  CommunityPackagesLink,
} from "@thunderstore/cyberstorm";

export default {
  title: "Cyberstorm/Components/Breadcrumbs",
  component: Breadcrumbs,
  argTypes: {
    excludeHome: {
      description: "If set to true, the home breadcrumb is excluded",
      defaultValue: false,
      control: "boolean",
    },
  },
} as ComponentMeta<typeof Breadcrumbs>;

type BreadcrumbsStory = ComponentStory<typeof Breadcrumbs>;
const community = "riskofrain2";

export const FullCrumbs: BreadcrumbsStory = (args) => (
  <Breadcrumbs {...args}>
    <CommunityLink community={community}>Risk of Rain 2</CommunityLink>
    <CommunityPackagesLink community={community}>
      Packages
    </CommunityPackagesLink>
    Popular
  </Breadcrumbs>
);

export const HomeOnly: BreadcrumbsStory = (args) => <Breadcrumbs {...args} />;

export const OneCrumb: BreadcrumbsStory = (args) => (
  <Breadcrumbs {...args}>
    <CommunityLink community={community}>Risk of Rain 2</CommunityLink>
  </Breadcrumbs>
);

export const TwoCrumbs: BreadcrumbsStory = (args) => (
  <Breadcrumbs {...args}>
    <CommunityLink community={community}>Risk of Rain 2</CommunityLink>
    <CommunityPackagesLink community={community}>
      Packages
    </CommunityPackagesLink>
  </Breadcrumbs>
);
