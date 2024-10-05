import { StoryFn, Meta } from "@storybook/react";
import { NewBreadCrumbs, NewLink } from "@thunderstore/cyberstorm";

export default {
  title: "BreadCrumbs",
  component: NewBreadCrumbs,
  argTypes: {
    excludeHome: {
      description: "If set to true, the home breadcrumb is excluded",
      defaultValue: false,
      control: "boolean",
    },
  },
} as Meta;

type BreadCrumbsStory = StoryFn<typeof NewBreadCrumbs>;
const community = "riskofrain2";

const breadCrumbStory = (args: { excludeHome?: boolean | undefined }) => (
  <>
    <NewBreadCrumbs {...args} />

    <NewBreadCrumbs {...args}>
      <NewLink
        primitiveType="cyberstormLink"
        linkId="Community"
        community={community}
      >
        Risk of Rain 2
      </NewLink>
    </NewBreadCrumbs>

    <NewBreadCrumbs {...args}>
      <NewLink
        primitiveType="cyberstormLink"
        linkId="Community"
        community={community}
      >
        Risk of Rain 2
      </NewLink>
      <NewLink
        primitiveType="cyberstormLink"
        linkId="CommunityPackages"
        community={community}
      >
        Packages
      </NewLink>
    </NewBreadCrumbs>

    <NewBreadCrumbs {...args}>
      <NewLink
        primitiveType="cyberstormLink"
        linkId="Community"
        community={community}
      >
        Risk of Rain 2
      </NewLink>
      <NewLink
        primitiveType="cyberstormLink"
        linkId="CommunityPackages"
        community={community}
      >
        Packages
      </NewLink>
      Popular
    </NewBreadCrumbs>
  </>
);

export const ReferenceCrumbs: BreadCrumbsStory = (args) =>
  breadCrumbStory(args);
export const ExcludeHomeCrumbs: BreadCrumbsStory = () =>
  breadCrumbStory({ excludeHome: true });
