import { Flex } from "@chakra-ui/react";
import { CommunityCard } from "@thunderstore/components";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

const meta = { component: CommunityCard } as ComponentMeta<
  typeof CommunityCard
>;

const Template: ComponentStory<typeof CommunityCard> = ({ communities }) => (
  <Flex
    justify="center"
    m="60px 0"
    wrap="wrap"
    sx={{ columnGap: 30, rowGap: 32 }}
  >
    {communities.map((props) => (
      <CommunityCard key={props.name} {...props} />
    ))}
  </Flex>
);

const imageSrc = "https://api.lorem.space/image/game?w=356&h=110";
const communities = [
  {
    downloadCount: 40000,
    imageSrc,
    modCount: 642,
    name: "Risk of Rain 2",
  },
  {
    downloadCount: 1408576,
    imageSrc,
    modCount: 2048,
    name: "H3VR",
  },
  {
    downloadCount: 100000000,
    imageSrc,
    modCount: 10000000,
    name: "Valheim",
  },
  {
    downloadCount: 0,
    imageSrc: null,
    modCount: 0,
    name: "BONEWORKS",
  },
  {
    downloadCount: 23232,
    imageSrc,
    modCount: 23,
    name: "GTFO",
  },
];

const Cards = Template.bind({});
Cards.args = {
  communities,
};

export { meta as default, Cards as CommunityCard };