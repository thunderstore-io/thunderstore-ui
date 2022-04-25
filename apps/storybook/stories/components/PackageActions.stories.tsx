import { PackageActions } from "@thunderstore/components";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

const meta = { component: PackageActions } as ComponentMeta<
  typeof PackageActions
>;

const Template: ComponentStory<typeof PackageActions> = (args) => (
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

export { meta as default, Actions as PackageActions };
