import { Box, Heading } from "@chakra-ui/react";
import React from "react";

import { Markdown } from "./Markdown";

export interface PackageInfoProps {
  markdown: string;
}

/**
 * Render package's markdown information as markup.
 */
export const PackageInfo: React.FC<PackageInfoProps> = (props) => {
  const { markdown } = props;

  return (
    <Box>
      <Heading as="h3" variant="ts.subtle" mb="20px">
        Information
      </Heading>
      <Markdown>{markdown}</Markdown>
    </Box>
  );
};
