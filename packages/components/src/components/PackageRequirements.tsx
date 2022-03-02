import { Box, BoxProps, chakra, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { PackageLink } from "..";

import { MaybeImage } from "./Internals";

export interface PackageDependency {
  communityIdentifier: string;
  description: string;
  imageSrc: string | null;
  packageName: string;
  preferredVersion: string;
}

interface PackageRequirementsProps extends BoxProps {
  requirements: PackageDependency[];
}

/**
 * Render list of dependency packages.
 */
export const PackageRequirements: React.FC<PackageRequirementsProps> = (
  props
) => {
  const { requirements, ...boxProps } = props;

  if (!requirements.length) {
    return null;
  }

  return (
    <Box {...boxProps}>
      <Heading as="h3" variant="ts.subtle" mb="20px">
        Required Mods
      </Heading>
      {requirements.map((r) => (
        <Dependency
          key={`${r.communityIdentifier}-${r.packageName}`}
          package={r}
        />
      ))}
    </Box>
  );
};

/**
 * TODO: Using PackageLink here assumes the dependency is listed in the
 * community as the dependant package, but this is not guaranteed. As a
 * fallback, we should link to community-agnostic package view, or
 * select one of the communities where the package is listed and link
 * there.
 */
const Dependency: React.FC<{ package: PackageDependency }> = (props) => {
  const {
    communityIdentifier,
    description,
    imageSrc,
    packageName,
    preferredVersion,
  } = props.package;

  return (
    <Flex mb="20px">
      <Box flex="0 0 100px">
        <MaybeImage height="100px" imageSrc={imageSrc} />
      </Box>

      <Box flex="1 1 auto" p="10px 20px" isTruncated>
        <PackageLink community={communityIdentifier} package={packageName}>
          <Heading
            as="h4"
            isTruncated
            size="sm"
            title={`${communityIdentifier}-${packageName}`}
          >
            {communityIdentifier}-{packageName}
          </Heading>
        </PackageLink>

        <Text isTruncated title={description} color="ts.babyBlue" my="10px">
          {description}
        </Text>

        <Text
          isTruncated
          title={`Preferred version: ${preferredVersion}`}
          color="ts.coolGray"
        >
          Preferred version:
          <chakra.span color="ts.white" fontWeight={600} ml="4px">
            {preferredVersion}
          </chakra.span>
        </Text>
      </Box>
    </Flex>
  );
};
