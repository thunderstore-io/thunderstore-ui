import { Box } from "@chakra-ui/react";
import React from "react";

interface StickyFooterProps {
  children: React.ReactNode;
}

export function StickyFooter({ children }: StickyFooterProps) {
  return (
    <Box position="sticky" bottom={0} p={4} bg="gray">
      {children}
    </Box>
  );
}
