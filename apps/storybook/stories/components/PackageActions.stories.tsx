import { PackageActions } from "@thunderstore/components";
import { StoryFn, Meta } from "@storybook/react";
import React from "react";

export default { component: PackageActions } as Meta;

const Template: StoryFn<typeof PackageActions> = (args) => (
  <PackageActions {...args} />
);

const lastWeek = new Date(Date.now() - 604800000);

const Actions = Template.bind({});
Actions.args = {
  communityIdentifier: "riskofrain2",
  dependantCount: 28,
  dependencyString: "Gnome-ChefMod-2.0.15",
  downloadCount: 245111867,
  downloadUrl: "/",
  installUrl: "/",
  lastUpdated: lastWeek,
  namespace: "riskofrain2",
  packageName: "ChefMod",
  ratingScore: 32,
  renderFullWidth: false,
};

export { Actions as PackageActions };
