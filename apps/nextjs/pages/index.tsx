import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { CommunityCard } from "@thunderstore/components";

import { HalfPageBackground } from "components/Background";
import { ContentWrapper } from "components/Wrapper";

export default function Home(): JSX.Element {
  // TODO: Fetch actual data with provider.
  const { communities, downloadCount, modCount } = fakeData;

  return (
    <>
      <HalfPageBackground url="/index-bg.svg" />
      <ContentWrapper>
        <Heading
          color="ts.orange"
          fontSize={56}
          fontWeight={900}
          m="0 auto"
          maxW={770}
          textAlign="center"
          pt="100px"
        >
          Download the mods you need for a variety of games
        </Heading>
        <Text mt="20px" fontSize={18} opacity={0.7} textAlign="center">
          No account or prior experience needed.
        </Text>

        <Flex columnGap="20px" justify="center" mt="30px">
          <HighlighBox count={modCount} items="mods" />
          <HighlighBox count={downloadCount} items="downloads" />
        </Flex>

        <Flex
          columnGap="30px"
          justify="center"
          m="60px 0"
          rowGap="32px"
          wrap="wrap"
        >
          {communities.map((props) => (
            <CommunityCard key={props.name} {...props} />
          ))}
        </Flex>
      </ContentWrapper>
    </>
  );
}

interface HighlighProps {
  count: number;
  items: string;
}

/**
 * Component for highlighting the abundance of content in Thunderstore
 */
const HighlighBox: React.FC<HighlighProps> = (props) => {
  const { count, items } = props;

  return (
    <Box
      bg="#232c47"
      borderColor="ts.lightBlue"
      borderWidth={1}
      display="inline-block"
      h="60px"
      p="9px 30px 10px 30px"
      textAlign="center"
    >
      <Text fontFamily="Raleway" fontSize={22} fontWeight={800}>
        {count.toLocaleString()}
      </Text>
      <Text color="ts.coolGray" fontSize={14} mt={-1}>
        {items}
      </Text>
    </Box>
  );
};

const imageSrc = "https://api.lorem.space/image/game?w=356&h=110";
const fakeData = {
  communities: [
    {
      downloadCount: 40000,
      imageSrc,
      modCount: 600,
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
      imageSrc,
      modCount: 0,
      name: "BONEWORKS",
    },
    {
      downloadCount: 23232,
      imageSrc: null,
      modCount: 23,
      name: "GTFO",
    },
    {
      downloadCount: 1000,
      imageSrc,
      modCount: 1,
      name: "Outward",
    },
    {
      downloadCount: 123456789,
      imageSrc,
      modCount: 1024,
      name: "ROUNDS",
    },
    {
      downloadCount: 128,
      imageSrc,
      modCount: 3,
      name: "Talespire",
    },
  ],
  downloadCount: 15215000,
  modCount: 5000,
};
