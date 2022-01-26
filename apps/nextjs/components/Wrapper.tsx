import { Box, BoxProps } from "@chakra-ui/react";
import { TopBar } from "@thunderstore/components";
import { useMediaQuery } from "@thunderstore/hooks";

const MAX_WIDTH = "1180px"; // Content area 1140px + 40px horizontal padding.
export const FULL_WIDTH_BREAKPOINT = "1200px"; // MAX_WIDTH + possible sidebar.

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
      maxWidth={MAX_WIDTH}
      padding="0 20px"
      position="relative"
      {...boxProps}
    >
      <TopBar />
      {children}
    </Box>
  );
};

interface LayoutWrapperProps extends BoxProps {
  variant: "article" | "aside";
}

/**
 * Wrappers used for given a page a two column layout.
 *
 * "Article" variant should be used for the wider column containing the
 * main content, whereas "aside" should be used for the sidebar. This
 * applies only to full width page: on narrower displays the aside is
 * shown below the article.
 */
export const LayoutWrapper: React.FC<LayoutWrapperProps> = (props) => {
  const { children, variant, ...boxProps } = props;
  const isFullWidth = useMediaQuery(`(min-width: ${FULL_WIDTH_BREAKPOINT})`);
  const layoutProps: BoxProps = {
    display: "inline-block",
    verticalAlign: "top",
  };

  if (variant === "article") {
    layoutProps.margin = isFullWidth ? "0 30px 30px 0" : "0 0 30px 0";
    layoutProps.width = isFullWidth ? "775px" : "100%";
  } else if (variant === "aside") {
    layoutProps.marginBottom = "30px";
    layoutProps.width = isFullWidth ? "335px" : "100%";
  }

  return (
    <Box {...layoutProps} {...boxProps}>
      {children}
    </Box>
  );
};
