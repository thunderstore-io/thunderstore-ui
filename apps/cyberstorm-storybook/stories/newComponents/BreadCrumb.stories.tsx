import { StoryFn, Meta } from "@storybook/react";
import { NewBreadCrumbs, NewBreadCrumbsLink } from "@thunderstore/cyberstorm";

export default {
  title: "BreadCrumbs",
  component: NewBreadCrumbs,
} as Meta;

type BreadCrumbsStory = StoryFn<typeof NewBreadCrumbs>;
const community = "riskofrain2";

const breadCrumbStory = () => (
  <>
    <NewBreadCrumbs />

    <NewBreadCrumbs>
      <NewBreadCrumbsLink
        primitiveType="cyberstormLink"
        linkId="Community"
        community={community}
        csVariant="cyber"
      >
        Risk of Rain 2
      </NewBreadCrumbsLink>
    </NewBreadCrumbs>

    <NewBreadCrumbs>
      <NewBreadCrumbsLink
        primitiveType="cyberstormLink"
        linkId="Community"
        community={community}
        csVariant="cyber"
      >
        Risk of Rain 2
      </NewBreadCrumbsLink>
      <NewBreadCrumbsLink
        primitiveType="cyberstormLink"
        linkId="CommunityPackages"
        community={community}
      >
        Packages
      </NewBreadCrumbsLink>
    </NewBreadCrumbs>

    <NewBreadCrumbs>
      <NewBreadCrumbsLink
        primitiveType="cyberstormLink"
        linkId="Community"
        community={community}
        csVariant="cyber"
      >
        Risk of Rain 2
      </NewBreadCrumbsLink>
      <NewBreadCrumbsLink
        primitiveType="cyberstormLink"
        linkId="CommunityPackages"
        community={community}
        csVariant="cyber"
      >
        Packages
      </NewBreadCrumbsLink>
      <span>
        <span>Popular</span>
      </span>
    </NewBreadCrumbs>
  </>
);

export const ReferenceCrumbs: BreadCrumbsStory = () => breadCrumbStory();
