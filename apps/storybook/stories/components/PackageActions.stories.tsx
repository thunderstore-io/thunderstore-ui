import { PackageActions } from "@thunderstore/components";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

const meta = { component: PackageActions } as ComponentMeta<
  typeof PackageActions
>;

const Template: ComponentStory<typeof PackageActions> = (args) => (
  <PackageActions {...args} />
);

const Actions = Template.bind({});
Actions.args = {
  communityName: "Risk of Rain 2",
  dependantCount: 28,
  dependencyString: "Gnome-ChefMod-2.0.15",
  downloadCount: 245111867,
  lastUpdated: "2022-01-01",
  latestVersion: "2.0.15",
  likeCount: 32,
  packageName: "ChefMod",
  packageNamespace: "Gnome",
  renderFullWidth: false,
};

export { meta as default, Actions as PackageActions };
