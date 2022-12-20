import { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  Breadcrumbs,
  CommunityLink,
  CommunityPackagesLink,
} from "@thunderstore/cyberstorm";

export default {
  title: "Cyberstorm/Components/Breadcrumb",
  component: Breadcrumbs,
} as ComponentMeta<typeof Breadcrumbs>;

type BreadcrumbsStory = ComponentStory<typeof Breadcrumbs>;

const community = "riskofrain2";

export const FullCrumbs: BreadcrumbsStory = () => (
  <Breadcrumbs>
    <CommunityLink community={community}>Risk of Rain 2</CommunityLink>
    <CommunityPackagesLink community={community}>
      Packages
    </CommunityPackagesLink>
    Popular
  </Breadcrumbs>
);

export const HomeOnly: BreadcrumbsStory = () => <Breadcrumbs />;

export const TwoCrumbs: BreadcrumbsStory = () => (
  <Breadcrumbs>
    <CommunityLink community={community}>Risk of Rain 2</CommunityLink>
  </Breadcrumbs>
);

export const ThreeCrumbs: BreadcrumbsStory = () => (
  <Breadcrumbs>
    <CommunityLink community={community}>Risk of Rain 2</CommunityLink>
    <CommunityPackagesLink community={community}>
      Packages
    </CommunityPackagesLink>
  </Breadcrumbs>
);

export const WithoutHome: BreadcrumbsStory = () => (
  <Breadcrumbs excludeHome>
    <CommunityLink community={community}>Risk of Rain 2</CommunityLink>
    <CommunityPackagesLink community={community}>
      Packages
    </CommunityPackagesLink>
    Popular
  </Breadcrumbs>
);
