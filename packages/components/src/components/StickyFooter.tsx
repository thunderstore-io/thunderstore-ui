import { Box } from "@chakra-ui/react";
import {} from "@chakra-ui/theme";
import React from "react";

interface StickyFooterProps {
  children: React.ReactNode;
}

export const StickyFooter: React.FC<StickyFooterProps> = ({ children }) => {
  return (
    <Box position="sticky" bottom={0} p={4} bg="gray.700">
      {children}
    </Box>
  );
};
