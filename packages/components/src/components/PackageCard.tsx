import { Box, Flex, Spacer, Tag, TagLeftIcon, Text } from "@chakra-ui/react";
import React from "react";

import { formatCount } from "../utils/number";
import { DownloadIcon, LikeIcon, PinIcon } from "./Icons";
import { MaybeImage } from "./Internals";
import { PackageLink, TeamLink } from "./Links";
import { RelativeTime } from "./RelativeTime";
import { SelectOption } from "./Select";

// TODO: `isDeprecated` and `isNsfw` are not used in UI currently,
// although they probably should be.
export interface PackageCardProps {
  categories: SelectOption[];
  categoryOnClick?: (value: string) => void;
  communityIdentifier: string;
  description: string;
  downloadCount: number;
  imageSrc: string | null;
  isDeprecated: boolean;
  isNsfw: boolean;
  isPinned: boolean;
  lastUpdated: string;
  namespace: string;
  packageName: string;
  ratingScore: number;
  teamName: string;
}

/**
 * Card component for listing mods/modpacks.
 */
export const PackageCard: React.FC<PackageCardProps> = (props) => {
  const {
    categories,
    categoryOnClick,
    communityIdentifier,
    description,
    downloadCount,
    imageSrc,
    isPinned,
    lastUpdated,
    namespace,
    packageName,
    ratingScore,
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
      <PackageLink
        community={communityIdentifier}
        namespace={namespace}
        package={packageName}
      >
        <MaybeImage
          borderRadius="3px 3px 0 0"
          height="200px"
          imageSrc={imageSrc}
        />
      </PackageLink>
      <PinnedTag isPinned={isPinned} />

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
          {formatCount(ratingScore)}
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
            community={communityIdentifier}
            namespace={namespace}
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
          {categories.map((category) => (
            <Tag
              key={category.value}
              onClick={() => categoryOnClick?.(category.value)}
              size="md"
              cursor="pointer"
            >
              {category.label}
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
const PinnedTag: React.FC<{ isPinned: boolean }> = (props) => {
  if (!props.isPinned) {
    return null;
  }

  return (
    <Tag size="sm" variant="translucent" pos="absolute" top="20px" left="20px">
      <TagLeftIcon as={PinIcon} mr="5px" />
      Pinned
    </Tag>
  );
};
