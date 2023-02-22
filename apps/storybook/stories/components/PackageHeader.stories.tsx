import { PackageHeader } from "@thunderstore/components";
import { StoryFn, Meta } from "@storybook/react";
import React from "react";

export default { component: PackageHeader } as Meta;

const Template: StoryFn<typeof PackageHeader> = (props) => (
  <PackageHeader {...props} />
);

const Header = Template.bind({});
Header.args = {
  categories: [
    { value: "1", label: "Mods" },
    { value: "2", label: "Player Characters" },
  ],
  communityIdentifier: "riskofrain2",
  description:
    "Adds the CHEF robot from RoR1 as a survivor. Multiplayer-compatible!",
  imageSrc: "/img/decorative-1000x1000.jpg",
  packageName: "ChefMod",
  teamName: "Gnome",
  website: "https://github.com/GnomeModder/ChefMod",
};

export { Header as PackageHeader };
