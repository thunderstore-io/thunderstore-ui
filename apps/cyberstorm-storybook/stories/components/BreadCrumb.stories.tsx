import { Meta, StoryFn } from "@storybook/react";
import {
  HomeOnlyBreadCrumbs,
  TitleOnlyBreadCrumbs,
  CommunityBreadCrumbs,
  PackageBreadCrumbs,
  PackageDependantsBreadCrumbs,
  TeamSettingsBreadCrumbs,
} from "@thunderstore/cyberstorm";
import React from "react";

export default {
  title: "Cyberstorm/Components/BreadCrumbs",
  component: HomeOnlyBreadCrumbs,
} as Meta;

const HomeOnlyBreadCrumbsTemplate: StoryFn<typeof HomeOnlyBreadCrumbs> = () => (
  <HomeOnlyBreadCrumbs />
);

const HomeOnlyBreadCrumbsStory = HomeOnlyBreadCrumbsTemplate.bind({});

const TitleOnlyBreadCrumbsTemplate: StoryFn<
  typeof TitleOnlyBreadCrumbs
> = () => <TitleOnlyBreadCrumbs pageTitle="Page title" />;

const TitleOnlyBreadCrumbsStory = TitleOnlyBreadCrumbsTemplate.bind({});

const CommunityBreadCrumbsTemplate: StoryFn<
  typeof CommunityBreadCrumbs
> = () => <CommunityBreadCrumbs pageTitle="Page title" />;

const CommunityBreadCrumbsStory = CommunityBreadCrumbsTemplate.bind({});

const PackageBreadCrumbsTemplate: StoryFn<typeof PackageBreadCrumbs> = () => (
  <PackageBreadCrumbs community="Community name" pageTitle="Page title" />
);

const PackageBreadCrumbsStory = PackageBreadCrumbsTemplate.bind({});

const PackageDependantsBreadCrumbsTemplate: StoryFn<
  typeof PackageDependantsBreadCrumbs
> = () => (
  <PackageDependantsBreadCrumbs
    packageName="Package name"
    packageNameSpace="Package namespace"
    community="Community name"
  />
);

const PackageDependantsBreadCrumbsStory =
  PackageDependantsBreadCrumbsTemplate.bind({});

const TeamSettingsBreadCrumbsTemplate: StoryFn<
  typeof TeamSettingsBreadCrumbs
> = () => <TeamSettingsBreadCrumbs pageTitle="Team name" />;

const TeamSettingsBreadCrumbsStory = TeamSettingsBreadCrumbsTemplate.bind({});

export {
  HomeOnlyBreadCrumbsStory as HomeOnlyBreadCrumb,
  TitleOnlyBreadCrumbsStory as TitleOnlyBreadCrumbs,
  CommunityBreadCrumbsStory as CommunityBreadCrumbs,
  PackageBreadCrumbsStory as PackageBreadCrumbs,
  PackageDependantsBreadCrumbsStory as PackageDependantsBreadCrumbs,
  TeamSettingsBreadCrumbsStory as TeamSettingsBreadCrumbs,
};
