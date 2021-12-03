import { Box } from "@chakra-ui/react";
import React from "react";
import { LinkingContext } from "./LinkingProvider";

export const TopBar: React.FC = () => {
  const Links = React.useContext(LinkingContext);

  return (
    <Box
      h={200}
      pb={100}
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Links.Index flex="1 0 auto">Thunderstore</Links.Index>
      <Box flex="1 0 auto" display="flex" justifyContent="flex-end">
        <Links.Package urlParams={["RoR2", "Enforcer"]} ml="1rem">
          Upload
        </Links.Package>
        <Links.Anonymous urlParams={["/team-picker"]} ml="1rem">
          Browse
        </Links.Anonymous>
        <Links.Anonymous urlParams={["/community-picker"]} ml="1rem">
          Login
        </Links.Anonymous>
      </Box>
    </Box>
  );
};
