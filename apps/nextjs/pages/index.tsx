import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { CommunityCard, CommunityCardProps } from "@thunderstore/components";
import { Dapper } from "@thunderstore/dapper";
import { GetServerSideProps } from "next";

import { HalfPageBackground } from "components/Background";
import { ContentWrapper } from "components/Wrapper";
import { API_DOMAIN } from "utils/constants";

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
  const dapper = new Dapper(API_DOMAIN);
  const props = await dapper.getFrontpage();
  return { props };
};

interface HighlighProps {
  count: number;
  items: string;
}

/**
 * Component for highlighting the abundance of content in Thunderstore
 */
function HighlighBox(props: HighlighProps) {
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
}
