import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import { useMediaQuery } from "@thunderstore/hooks";
import React from "react";

import { LikeIcon } from "./Icons";
import {
  PackageDependantsLink,
  PackageDownloadLink,
  PackageInstallLink,
} from "./Links";
import { RelativeTime } from "./RelativeTime";

export interface PackageActionsProps {
  communityName: string;
  dependantCount: number;
  dependencyString: string;
  downloadCount: number;
  lastUpdated: string;
  latestVersion: string;
  likeCount: number;
  packageName: string;
  packageNamespace: string;
  renderFullWidth?: boolean;
}

/**
 * Display package's action buttons and statistics.
 */
export const PackageActions: React.FC<PackageActionsProps> = (props) => {
  const {
    communityName,
    dependantCount,
    dependencyString,
    downloadCount,
    lastUpdated,
    latestVersion,
    likeCount,
    packageName,
    packageNamespace,
    renderFullWidth,
  } = props;

  const belowBreakpoint = useMediaQuery("(max-width: 500px)");
  const isWrapped = !renderFullWidth || belowBreakpoint;

  return (
    <Box
      bgColor="ts.blue"
      borderColor="ts.lightBlue"
      borderWidth={2}
      minHeight="261px"
    >
      <Flex
        borderColor="ts.lightBlue"
        borderBottomWidth={2}
        justifyContent="space-between"
        p="30px 30px 20px 30px"
        flexWrap="wrap"
      >
        <VStack
          spacing="20px"
          align={isWrapped ? "center" : "start"}
          mb={isWrapped ? "20px" : "0"}
          width={isWrapped ? "100%" : "auto"}
        >
          <PackageInstallLink
            namespace={packageNamespace}
            package={packageName}
            version={latestVersion}
          >
            <Button variant="ts.mainAction">Mod Manager Install</Button>
          </PackageInstallLink>

          <PackageDownloadLink
            namespace={packageNamespace}
            package={packageName}
            version={latestVersion}
          >
            <Button variant="ts.altAction">Manual Download</Button>
          </PackageDownloadLink>
        </VStack>

        <Box
          textAlign={isWrapped ? "center" : "right"}
          width={isWrapped ? "100%" : "auto"}
        >
          <Text variant="ts.keyInfo">{downloadCount.toLocaleString()}</Text>
          <Text variant="ts.keyInfoLabel">downloads</Text>

          <RelativeTime time={lastUpdated} variant="ts.keyInfo" mt="12px" />
          <Text variant="ts.keyInfoLabel">last updated</Text>

          <Text variant="ts.keyInfo" mt="12px">
            {likeCount.toLocaleString()}
            <LikeIcon boxSize="18px" m="-3px 0 0 5px" />
          </Text>
          <Text variant="ts.keyInfoLabel">total rating</Text>
        </Box>
      </Flex>

      {/**
       * TODO: figure out how to actually implement dependency string
       * copying and linking to dependants page
       */}
      <Box p="20px 30px 12px 30px">
        <Button variant="ts.auxiliary" size="autoHeight" m="0 8px 8px 0">
          {dependencyString}
        </Button>

        <PackageDependantsLink community={communityName} package={packageName}>
          <Button variant="ts.auxiliary" m="0 8px 8px 0">
            {dependantCount} dependants
          </Button>
        </PackageDependantsLink>
      </Box>
    </Box>
  );
};
