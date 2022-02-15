import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { CommunityCard, CommunityCardProps } from "@thunderstore/components";
import { GetServerSideProps } from "next";

import { HalfPageBackground } from "components/Background";
import { ContentWrapper } from "components/Wrapper";
import { communityCardToProps } from "utils/transforms/communityCard";

interface PageProps {
  communities: CommunityCardProps[];
  downloadCount: number;
  packageCount: number;
}

export default function Home(props: PageProps): JSX.Element {
  const { communities, downloadCount, packageCount } = props;

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
          <HighlighBox count={packageCount} items="mods" />
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
            <CommunityCard key={props.identifier} {...props} />
          ))}
        </Flex>
      </ContentWrapper>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  // TODO: Fetch actual data with provider.
  return {
    props: {
      communities: fakeData.communities.map((c) => communityCardToProps(c)),
      downloadCount: fakeData.download_count,
      packageCount: fakeData.package_count,
    },
  };
};

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

const bg_image_src = "https://api.lorem.space/image/game?w=356&h=110";
const fakeData = {
  communities: [
    {
      download_count: 40000,
      bg_image_src,
      identifier: "riskofrain2",
      package_count: 600,
      name: "Risk of Rain 2",
    },
    {
      download_count: 1408576,
      bg_image_src,
      identifier: "h3vr",
      package_count: 2048,
      name: "H3VR",
    },
    {
      download_count: 100000000,
      bg_image_src,
      identifier: "valheim",
      package_count: 10000000,
      name: "Valheim",
    },
    {
      download_count: 0,
      bg_image_src,
      identifier: "boneworks",
      package_count: 0,
      name: "BONEWORKS",
    },
    {
      download_count: 23232,
      bg_image_src: null,
      identifier: "gtfo",
      package_count: 23,
      name: "GTFO",
    },
    {
      download_count: 1000,
      bg_image_src,
      identifier: "outward",
      package_count: 1,
      name: "Outward",
    },
    {
      download_count: 123456789,
      bg_image_src,
      identifier: "rounds",
      package_count: 1024,
      name: "ROUNDS",
    },
    {
      download_count: 128,
      bg_image_src,
      identifier: "talespire",
      package_count: 3,
      name: "Talespire",
    },
  ],
  download_count: 15215000,
  package_count: 5000,
};
