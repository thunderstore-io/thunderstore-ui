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
        <Links.Package community="RoR2" package="Enforcer" ml="1rem">
          Upload
        </Links.Package>
        <Links.Anonymous url="https://google.com" ml="1rem">
          Browse
        </Links.Anonymous>
        <Links.Anonymous url={"/some/path/from/database"} ml="1rem">
          Login
        </Links.Anonymous>
      </Box>
    </Box>
  );
};
