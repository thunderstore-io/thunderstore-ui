import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { CommunityCard } from "@thunderstore/components";

export default function Home(): JSX.Element {
  // TODO: Fetch actual data with provider.
  const { communities, downloadCount, modCount } = fakeData;

  return (
    <>
      <Box
        position="fixed"
        w="100%"
        h="650px"
        zIndex={0}
        top="0"
        left="0"
        borderColor="ts.lightBlue"
        borderStyle="solid"
        borderBottomWidth={2}
        sx={{
          bg: `url('/index-bg.svg') 52% 0/auto 648px no-repeat,
               radial-gradient(56.98% 106.3% at 26.85% 43.5%, #252F4A 0%, rgba(32, 41, 65, 0) 100%)`,
        }}
      />
      <Box position="relative">
        <Heading
          color="ts.orange"
          fontSize={56}
          fontWeight={900}
          m="0 auto"
          maxW={770}
          textAlign="center"
        >
          Download the mods you need for a variety of games
        </Heading>
        <Text mt="20px" fontSize={18} opacity={0.7} textAlign="center">
          No account or prior experience needed.
        </Text>

        <Flex justify="center" mt="30px" sx={{ columnGap: 20 }}>
          <HighlighBox count={modCount} items="mods" />
          <HighlighBox count={downloadCount} items="downloads" />
        </Flex>

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
      </Box>
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
