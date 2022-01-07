import { Box, Flex, Spacer, Text } from "@chakra-ui/react";
import React from "react";

import { formatCount } from "../utils/number";
import { ChevronRight, DownloadIcon, ModIcon } from "./Icons";
import { MaybeImage } from "./Internals";
import { CommunityLink } from "./Links";

interface CommunityCardProps {
  downloadCount: number;
  imageSrc: string | null;
  modCount: number;
  name: string;
}

/**
 * Simple card component for listing communities.
 *
 * Displays community's name, cover image and basic mod stats.
 */
export const CommunityCard: React.FC<CommunityCardProps> = (props) => {
  const { downloadCount, imageSrc, modCount, name } = props;
  return (
    <Box bg="ts.blue" {...borderStyles} borderWidth={2} w={360}>
      <MaybeImage imageSrc={imageSrc} height="110px" />

      <Text
        {...borderStyles}
        fontSize={18}
        fontWeight={700}
        p="20px 20px 14px 20px"
      >
        <CommunityLink
          community={name}
          _hover={{ textDecoration: "underline solid white 2px" }}
        >
          {name}
        </CommunityLink>
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
            {formatCount(modCount)}
          </Box>
          <Box>
            <DownloadIcon {...iconStyles} />
            {formatCount(downloadCount)}
          </Box>
        </Flex>
        <Spacer />
        <Box>
          <CommunityLink community={name}>
            <ChevronRight {...iconStyles} mr="0" />
          </CommunityLink>
        </Box>
      </Flex>
    </Box>
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
