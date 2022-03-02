import { PackageHeader } from "@thunderstore/components";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

const meta = { component: PackageHeader } as ComponentMeta<
  typeof PackageHeader
>;

const Template: ComponentStory<typeof PackageHeader> = (props) => (
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

export { meta as default, Header as PackageHeader };
