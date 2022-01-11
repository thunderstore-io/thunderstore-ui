import { Box, Flex, Spacer, Tag, TagLeftIcon, Text } from "@chakra-ui/react";
import React from "react";

import { formatCount } from "../utils/number";
import { DownloadIcon, LikeIcon, PinIcon } from "./Icons";
import { MaybeImage } from "./Internals";
import { PackageLink, TeamLink } from "./Links";
import { RelativeTime } from "./RelativeTime";

export interface PackageCardProps {
  communityName: string;
  deprecated: boolean;
  description: string;
  downloadCount: number;
  imageSrc: string | null;
  lastUpdated: string;
  likeCount: number;
  nsfw: boolean;
  packageName: string;
  pinned: boolean;
  tagOnClick: (tagId: string) => void;
  tags: { id: string; label: string }[];
  teamName: string;
}

/**
 * Card component for listing mods/modpacks.
 */
export const PackageCard: React.FC<PackageCardProps> = (props) => {
  const {
    communityName,
    description,
    downloadCount,
    imageSrc,
    lastUpdated,
    likeCount,
    packageName,
    pinned,
    tagOnClick,
    tags,
    teamName,
  } = props;

  return (
    <Box
      bg="ts.blue"
      borderColor="ts.lightBlue"
      borderRadius="5px"
      borderWidth={2}
      w={270}
      pos="relative"
    >
      <MaybeImage
        borderRadius="3px 3px 0 0"
        height="200px"
        imageSrc={imageSrc}
      />
      <PinnedTag pinned={pinned} />

      <Flex
        bgColor="#18223C99"
        h="34px"
        p="7px 20px"
        pos="absolute"
        top="166px"
        w="100%"
      >
        <Box>
          <LikeIcon boxSize="12px" m="-3px 5px 0 0" />
          {formatCount(likeCount)}
        </Box>
        <Spacer />
        <Box>
          <DownloadIcon boxSize="12px" m="-3px 5px 0 0" />
          {formatCount(downloadCount)}
        </Box>
      </Flex>

      <Box p="20px 20px 15px 20px">
        <Text fontSize={18} fontWeight={800}>
          <PackageLink
            community={communityName}
            package={packageName}
            _hover={{ textDecoration: "underline solid white 2px" }}
          >
            {packageName}
          </PackageLink>
        </Text>

        <Text color="ts.coolGray" m="5px 0 10px 0">
          by
          <TeamLink team={teamName} pl="3px">
            {teamName}
          </TeamLink>
        </Text>

        <Text>{description}</Text>

        <Box mt="33px">
          {tags.map((tag) => (
            <Tag
              key={tag.id}
              onClick={() => tagOnClick(tag.id)}
              size="md"
              cursor="pointer"
            >
              {tag.label}
            </Tag>
          ))}
        </Box>

        <RelativeTime
          prefix="Last updated:"
          time={lastUpdated}
          color="ts.coolGray"
          fontSize={12}
        />
      </Box>
    </Box>
  );
};

/**
 * Tag for marking a package as pinned.
 */
const PinnedTag: React.FC<{ pinned: boolean }> = (props) => {
  if (!props.pinned) {
    return null;
  }

  return (
    <Tag size="sm" variant="translucent" pos="absolute" top="20px" left="20px">
      <TagLeftIcon as={PinIcon} mr="5px" />
      Pinned
    </Tag>
  );
};
