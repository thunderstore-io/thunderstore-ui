import { Box } from "@chakra-ui/react";
import React from "react";
import { Anonymous as LinkTo, Index, Package } from "./Links";

export const TopBar: React.FC = () => (
  <Box
    h={200}
    pb={100}
    display="flex"
    flexDirection="row"
    alignItems="center"
    justifyContent="space-between"
  >
    <Index flex="1 0 auto">Thunderstore</Index>
    <Box flex="1 0 auto" display="flex" justifyContent="flex-end">
      <Package community="RoR2" package="Enforcer" ml="1rem">
        Upload
      </Package>
      <LinkTo url="https://google.com" ml="1rem">
        Browse
      </LinkTo>
      <LinkTo url={"/some/path/from/database"} ml="1rem">
        Login
      </LinkTo>
    </Box>
  </Box>
);
