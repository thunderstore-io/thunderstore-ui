import { Box, BoxProps } from "@chakra-ui/react";
import { TopBar } from "@thunderstore/components";

/**
 * Wrapper for setting content's max-width and centering it
 *
 * Accepts the same styling props as Chakra UI's Box element does.
 */
export const ContentWrapper: React.FC<BoxProps> = (props) => {
  const { children, ...boxProps } = props;

  return (
    <Box
      margin="0 auto"
      maxWidth="1180px"
      padding="0 20px"
      position="relative"
      {...boxProps}
    >
      <TopBar />
      {children}
    </Box>
  );
};
