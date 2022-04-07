import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import { useMediaQuery } from "@thunderstore/hooks";
import React from "react";

import { LikeIcon } from "./Icons";
import { AnonymousLink, PackageDependantsLink } from "./Links";
import { RelativeTime } from "./RelativeTime";

export interface PackageActionsProps {
  communityIdentifier: string;
  dependantCount: number;
  dependencyString: string;
  downloadCount: number;
  downloadUrl: string;
  installUrl: string;
  lastUpdated: string;
  packageName: string;
  ratingScore: number;
  renderFullWidth?: boolean;
}

/**
 * Display package's action buttons and statistics.
 */
export const PackageActions: React.FC<PackageActionsProps> = (props) => {
  const {
    communityIdentifier,
    dependantCount,
    dependencyString,
    downloadCount,
    downloadUrl,
    installUrl,
    lastUpdated,
    packageName,
    ratingScore,
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
          <AnonymousLink url={installUrl}>
            <Button variant="ts.mainAction">Mod Manager Install</Button>
          </AnonymousLink>

          <AnonymousLink url={downloadUrl}>
            <Button variant="ts.altAction">Manual Download</Button>
          </AnonymousLink>
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
            {ratingScore.toLocaleString()}
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

        <PackageDependantsLink
          community={communityIdentifier}
          package={packageName}
        >
          <Button variant="ts.auxiliary" m="0 8px 8px 0">
            {dependantCount} dependants
          </Button>
        </PackageDependantsLink>
      </Box>
    </Box>
  );
};
