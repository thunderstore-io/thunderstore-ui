import { Box, Flex, Spacer, Text } from "@chakra-ui/react";
import React from "react";

import { formatCount } from "../utils/number";
import { ChevronRight, DownloadIcon, ModIcon } from "./Icons";
import { MaybeImage } from "./Internals";
import { CommunityLink } from "./Links";

export interface CommunityCardProps {
  downloadCount: number;
  identifier: string;
  imageSrc: string | null;
  packageCount: number;
  name: string;
}

/**
 * Simple card component for listing communities.
 *
 * Displays community's name, cover image and basic mod stats.
 */
export const CommunityCard: React.FC<CommunityCardProps> = (props) => {
  const { downloadCount, identifier, imageSrc, packageCount, name } = props;
  return (
    <CommunityLink
      community={identifier}
      bg="ts.blue"
      {...borderStyles}
      borderWidth={2}
      transition="border 100ms linear"
      w={360}
      _hover={{
        borderColor: "ts.lightBlue.115",
        textDecoration: "none",
      }}
    >
      <MaybeImage imageSrc={imageSrc} height="110px" />

      <Text
        {...borderStyles}
        fontSize={18}
        fontWeight={700}
        p="20px 20px 14px 20px"
      >
        {name}
      </Text>

      <Flex
        align="center"
        fontSize={14}
        fontWeight={700}
        p="13px 20px 12px 20px"
      >
        <Flex>
          <Box mr="15px">
            <ModIcon {...iconStyles} />
            {formatCount(packageCount)}
          </Box>
          <Box>
            <DownloadIcon {...iconStyles} />
            {formatCount(downloadCount)}
          </Box>
        </Flex>
        <Spacer />
        <ChevronRight {...iconStyles} mr="0" mt="2px" />
      </Flex>
    </CommunityLink>
  );
};

const borderStyles = {
  borderColor: "ts.lightBlue",
  borderStyle: "solid",
  borderBottomWidth: 2,
};

const iconStyles = {
  h: "10px",
  m: "-2px 5px 0 0",
  w: "10px",
};
