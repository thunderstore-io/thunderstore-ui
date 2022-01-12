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
  communityName: "Risk of Rain 2",
  deprecated: false,
  imageSrc: "https://api.lorem.space/image/game?w=266&h=200",
  nsfw: false,
  tagOnClick: () => null,
};

const packages = [
  {
    ...packageBase,
    description:
      "Unified BepInEx all-in-one modding pack - plugin framework, detour library",
    downloadCount: 1273260,
    lastUpdated: new Date(now - day * 2),
    likeCount: 266,
    packageName: "BepInExPack",
    pinned: true,
    tags: [
      { id: "1", label: "Mods" },
      { id: "2", label: "Libraries" },
    ],
    teamName: "bbepis",
  },
  {
    ...packageBase,
    description: "A modding API for Risk of Rain 2 ",
    downloadCount: 1510749,
    lastUpdated: new Date(now - day * 4),
    likeCount: 269,
    packageName: "R2API",
    pinned: true,
    tags: [{ id: "2", label: "Libraries" }],
    teamName: "tristanmcpherson",
  },
  {
    ...packageBase,
    description:
      "A simple and easy to use mod manager for several Unity games using Thunderstore ",
    downloadCount: 811257,
    lastUpdated: new Date(now - day * 22),
    likeCount: 326,
    packageName: "r2modman",
    pinned: true,
    tags: [{ id: "3", label: "Tools" }],
    teamName: "ebkr",
  },
  {
    ...packageBase,
    description: "Zot Returns. WIP! GEM SYSTEM NOT IMPLEMENTED!",
    downloadCount: 29638,
    lastUpdated: new Date(now - hour * 2),
    likeCount: 14,
    packageName: "LordZot",
    pinned: false,
    tags: [{ id: "4", label: "Player Characters" }],
    teamName: "Jot",
  },
  {
    ...packageBase,
    description:
      "Critically Acclaimed Mod dev Heyimnoob's Skill mod. Currently adds 2 Skills. More skills coming soon! ",
    downloadCount: 2216,
    lastUpdated: new Date(now - hour * 5),
    likeCount: 2,
    packageName: "SkillsFromtheDeepEnd",
    pinned: false,
    tags: [{ id: "5", label: "Skills" }],
    teamName: "Heyimnoob",
  },
  {
    ...packageBase,
    description:
      "Adds 6 artifacts to ruin your run with. Features Origin from Risk of Rain 1! ",
    downloadCount: 10299,
    lastUpdated: new Date(now - hour * 6),
    likeCount: 2,
    packageName: "Risky Artifacts",
    pinned: false,
    tags: [
      { id: "6", label: "Artifacts" },
      { id: "1", label: "Mods" },
    ],
    teamName: "Moffein",
  },
];

const Cards = Template.bind({});
Cards.args = {
  packages,
};

export { meta as default, Cards as PackageCard };
