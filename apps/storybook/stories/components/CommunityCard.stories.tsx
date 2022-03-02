import { Flex } from "@chakra-ui/react";
import { CommunityCard } from "@thunderstore/components";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

const meta = { component: CommunityCard } as ComponentMeta<
  typeof CommunityCard
>;

const Template: ComponentStory<typeof CommunityCard> = ({ communities }) => (
  <Flex columnGap="30px" justify="center" m="60px 0" rowGap="32px" wrap="wrap">
    {communities.map((props) => (
      <CommunityCard key={props.name} {...props} />
    ))}
  </Flex>
);

const imageSrc = "/img/decorative-2000x200.jpg";
const communities = [
  {
    downloadCount: 40000,
    identifier: "riskofrain2",
    imageSrc,
    packageCount: 642,
    name: "Risk of Rain 2",
  },
  {
    downloadCount: 1408576,
    identifier: "h3vr",
    imageSrc,
    packageCount: 2048,
    name: "H3VR",
  },
  {
    downloadCount: 100000000,
    identifier: "valheim",
    imageSrc,
    packageCount: 10000000,
    name: "Valheim",
  },
  {
    downloadCount: 0,
    identifier: "boneworks",
    imageSrc: null,
    packageCount: 0,
    name: "BONEWORKS",
  },
  {
    downloadCount: 23232,
    identifier: "gtfo",
    imageSrc,
    packageCount: 23,
    name: "GTFO",
  },
];

const Cards = Template.bind({});
Cards.args = {
  communities,
};

export { meta as default, Cards as CommunityCard };
