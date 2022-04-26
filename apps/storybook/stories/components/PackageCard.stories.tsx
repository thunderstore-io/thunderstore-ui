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
  isDeprecated: false,
  imageSrc: "/img/decorative-2000x200.jpg",
  isNsfw: false,
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
    isPinned: true,
    lastUpdated: new Date(now - day * 2),
    namespace: "bbepis",
    packageName: "BepInExPack",
    ratingScore: 266,
    teamName: "bbepis",
  },
  {
    ...packageBase,
    categories: [{ value: "2", label: "Libraries" }],
    description: "A modding API for Risk of Rain 2 ",
    downloadCount: 1510749,
    isPinned: true,
    lastUpdated: new Date(now - day * 4),
    namespace: "tristanmcpherson",
    packageName: "R2API",
    ratingScore: 269,
    teamName: "tristanmcpherson",
  },
  {
    ...packageBase,
    categories: [{ value: "3", label: "Tools" }],
    description:
      "A simple and easy to use mod manager for several Unity games using Thunderstore ",
    downloadCount: 811257,
    isPinned: true,
    lastUpdated: new Date(now - day * 22),
    namespace: "ebkr",
    packageName: "r2modman",
    ratingScore: 326,
    teamName: "ebkr",
  },
  {
    ...packageBase,
    categories: [{ value: "4", label: "Player Characters" }],
    description: "Zot Returns. WIP! GEM SYSTEM NOT IMPLEMENTED!",
    downloadCount: 29638,
    isPinned: false,
    lastUpdated: new Date(now - hour * 2),
    namespace: "Jot",
    packageName: "LordZot",
    ratingScore: 14,
    teamName: "Jot",
  },
  {
    ...packageBase,
    categories: [{ value: "5", label: "Skills" }],
    description:
      "Critically Acclaimed Mod dev Heyimnoob's Skill mod. Currently adds 2 Skills. More skills coming soon! ",
    downloadCount: 2216,
    isPinned: false,
    lastUpdated: new Date(now - hour * 5),
    namespace: "Heyimnoob",
    packageName: "SkillsFromtheDeepEnd",
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
    isPinned: false,
    lastUpdated: new Date(now - hour * 6),
    namespace: "Moffein",
    packageName: "Risky Artifacts",
    ratingScore: 2,
    teamName: "Moffein",
  },
];

const Cards = Template.bind({});
Cards.args = {
  packages,
};

export { meta as default, Cards as PackageCard };
