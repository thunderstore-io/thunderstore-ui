import { StoryFn, Meta } from "@storybook/react";
import { BreadCrumbs, CyberstormLink } from "@thunderstore/cyberstorm";

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

const breadCrumbStory = (args: { excludeHome?: boolean | undefined }) => (
  <>
    <BreadCrumbs {...args} />

    <BreadCrumbs {...args}>
      <CyberstormLink linkId="Community" community={community}>
        Risk of Rain 2
      </CyberstormLink>
    </BreadCrumbs>

    <BreadCrumbs {...args}>
      <CyberstormLink linkId="Community" community={community}>
        Risk of Rain 2
      </CyberstormLink>
      <CyberstormLink linkId="CommunityPackages" community={community}>
        Packages
      </CyberstormLink>
    </BreadCrumbs>

    <BreadCrumbs {...args}>
      <CyberstormLink linkId="Community" community={community}>
        Risk of Rain 2
      </CyberstormLink>
      <CyberstormLink linkId="CommunityPackages" community={community}>
        Packages
      </CyberstormLink>
      Popular
    </BreadCrumbs>
  </>
);

export const DefaultCrumbs: BreadCrumbsStory = (args) => breadCrumbStory(args);
export const ExcludeHomeCrumbs: BreadCrumbsStory = () =>
  breadCrumbStory({ excludeHome: true });
