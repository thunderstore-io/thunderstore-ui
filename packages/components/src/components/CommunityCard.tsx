import { Box, Flex, Image, Spacer, Text } from "@chakra-ui/react";
import React from "react";

import { formatCount } from "../utils/number";
import { ChevronRight, DownloadIcon, ModIcon, QuestionMarkIcon } from "./Icons";
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
      <CoverImage imageSrc={imageSrc} />

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

/**
 * Show community's cover image or a placeholder.
 */
const CoverImage: React.FC<Pick<CommunityCardProps, "imageSrc">> = (props) => {
  if (!props.imageSrc) {
    return (
      <Flex align="center" bg="#0e1832" h="110px" justify="center">
        <QuestionMarkIcon color="ts.lightBlue" h="50px" w="25px" />
      </Flex>
    );
  }

  return (
    <Image
      src={props.imageSrc}
      role="presentation"
      h="110px"
      objectFit="cover"
      w="100%"
    />
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
