import { Box, BoxProps, chakra, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { PackageLink } from "..";

import { MaybeImage } from "./Internals";

export interface PackageDependency {
  communityIdentifier: string | null;
  description: string;
  imageSrc: string | null;
  namespace: string;
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

const Dependency: React.FC<{ package: PackageDependency }> = (props) => {
  const {
    communityIdentifier,
    description,
    imageSrc,
    namespace,
    packageName,
    preferredVersion,
  } = props.package;

  return (
    <Flex mb="20px">
      <Box flex="0 0 100px">
        <MaybeImage height="100px" imageSrc={imageSrc} />
      </Box>

      <Box flex="1 1 auto" p="10px 20px" isTruncated>
        {communityIdentifier ? (
          <PackageLink
            community={communityIdentifier}
            namespace={namespace}
            package={packageName}
          >
            <Heading
              as="h4"
              isTruncated
              size="sm"
              title={`${communityIdentifier}-${packageName}`}
            >
              {communityIdentifier}-{packageName}
            </Heading>
          </PackageLink>
        ) : (
          <Heading as="h4" isTruncated size="sm" title={packageName}>
            {packageName}
          </Heading>
        )}

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
