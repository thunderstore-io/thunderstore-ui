import { StoryFn, Meta } from "@storybook/react";
import { BreadCrumbs, CyberstormLink } from "@thunderstore/cyberstorm";

export default {
  title: "Cyberstorm/Components/BreadCrumbs",
  component: BreadCrumbs,
} as Meta;

type BreadCrumbsStory = StoryFn<typeof BreadCrumbs>;
const community = "riskofrain2";

const breadCrumbStory = () => (
  <>
    <BreadCrumbs />

    <BreadCrumbs>
      <CyberstormLink linkId="Community" community={community}>
        Risk of Rain 2
      </CyberstormLink>
    </BreadCrumbs>

    <BreadCrumbs>
      <CyberstormLink linkId="Community" community={community}>
        Risk of Rain 2
      </CyberstormLink>
      <CyberstormLink linkId="CommunityPackages" community={community}>
        Packages
      </CyberstormLink>
    </BreadCrumbs>

    <BreadCrumbs>
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

export const ReferenceCrumbs: BreadCrumbsStory = () => breadCrumbStory();
