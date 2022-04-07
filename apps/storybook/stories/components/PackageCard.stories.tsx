import { Flex } from "@chakra-ui/react";
import { PackageCard } from "@thunderstore/components";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

const meta = { component: PackageCard } as ComponentMeta<typeof PackageCard>;

const Template: ComponentStory<typeof PackageCard> = ({ packages }) => (
  <Flex columnGap="20px" justify="center" m="60px 0" rowGap="20px" wrap="wrap">
    {packages.map((props) => (
      <PackageCard key={props.packageName} {...props} />
    ))}
  </Flex>
);

const now = Date.now();
const day = 86400000;
const hour = 3600000;

const packageBase = {
  categoryOnClick: () => null,
  communityIdentifier: "riskofrain2",
  deprecated: false,
  imageSrc: "/img/decorative-2000x200.jpg",
  nsfw: false,
};

const packages = [
  {
    ...packageBase,
    categories: [
      { value: "1", label: "Mods" },
      { value: "2", label: "Libraries" },
    ],
    description:
      "Unified BepInEx all-in-one modding pack - plugin framework, detour library",
    downloadCount: 1273260,
    lastUpdated: new Date(now - day * 2),
    packageName: "BepInExPack",
    pinned: true,
    ratingScore: 266,
    teamName: "bbepis",
  },
  {
    ...packageBase,
    categories: [{ value: "2", label: "Libraries" }],
    description: "A modding API for Risk of Rain 2 ",
    downloadCount: 1510749,
    lastUpdated: new Date(now - day * 4),
    packageName: "R2API",
    pinned: true,
    ratingScore: 269,
    teamName: "tristanmcpherson",
  },
  {
    ...packageBase,
    categories: [{ value: "3", label: "Tools" }],
    description:
      "A simple and easy to use mod manager for several Unity games using Thunderstore ",
    downloadCount: 811257,
    lastUpdated: new Date(now - day * 22),
    packageName: "r2modman",
    pinned: true,
    ratingScore: 326,
    teamName: "ebkr",
  },
  {
    ...packageBase,
    categories: [{ value: "4", label: "Player Characters" }],
    description: "Zot Returns. WIP! GEM SYSTEM NOT IMPLEMENTED!",
    downloadCount: 29638,
    lastUpdated: new Date(now - hour * 2),
    packageName: "LordZot",
    pinned: false,
    ratingScore: 14,
    teamName: "Jot",
  },
  {
    ...packageBase,
    categories: [{ value: "5", label: "Skills" }],
    description:
      "Critically Acclaimed Mod dev Heyimnoob's Skill mod. Currently adds 2 Skills. More skills coming soon! ",
    downloadCount: 2216,
    lastUpdated: new Date(now - hour * 5),
    packageName: "SkillsFromtheDeepEnd",
    pinned: false,
    ratingScore: 2,
    teamName: "Heyimnoob",
  },
  {
    ...packageBase,
    categories: [
      { value: "6", label: "Artifacts" },
      { value: "1", label: "Mods" },
    ],
    description:
      "Adds 6 artifacts to ruin your run with. Features Origin from Risk of Rain 1! ",
    downloadCount: 10299,
    lastUpdated: new Date(now - hour * 6),
    packageName: "Risky Artifacts",
    pinned: false,
    ratingScore: 2,
    teamName: "Moffein",
  },
];

const Cards = Template.bind({});
Cards.args = {
  packages,
};

export { meta as default, Cards as PackageCard };
