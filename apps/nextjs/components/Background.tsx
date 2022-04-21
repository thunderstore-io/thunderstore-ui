import { Box, BoxProps } from "@chakra-ui/react";

interface ContentHeadProps extends BoxProps {
  url: string | null;
}

/**
 * Component for displaying page's background image and gradient
 *
 * Displays a short, banner-like image and a full-page gradient on top
 * of it.
 *
 * Accepts the same styling props as Chakra UI's Box element does.
 */
export const Background: React.FC<ContentHeadProps> = (props) => {
  const { url, children, ...boxProps } = props;

  return (
    <Box position="absolute" w="100%" h="200px" {...boxProps}>
      <Box
        id="head-img"
        bgImage={url ?? undefined}
        bgPosition="center center"
        bgRepeat="no-repeat"
        bgSize="cover"
        height="200px"
        position="absolute"
        w="100%"
      />
      <BgGradient h="100vh" />
    </Box>
  );
};

/**
 * Component for displaying page's background image and gradient
 *
 * Displays a mid-sized image on top of a gradient, but only at the top
 * of the page, whereas the bottom of the page has no background (unless
 * defined somewhere else).
 *
 * Accepts the same styling props as Chakra UI's Box element does.
 */
export const HalfPageBackground: React.FC<ContentHeadProps> = (props) => {
  const { url, children, ...boxProps } = props;
  const partialHeight = "648px";

  return (
    <Box position="absolute" w="100%" h={partialHeight} {...boxProps}>
      <BgGradient h={partialHeight} />
      <Box
        bgImage={url ?? undefined}
        bgPosition="52% 0"
        bgRepeat="no-repeat"
        bgSize={`auto ${partialHeight}`}
        borderBottomColor="ts.lightBlue"
        borderBottomWidth="2px"
        height={partialHeight}
        position="absolute"
        w="100%"
      />
    </Box>
  );
};

interface BgGradientProps {
  h: string;
}

/**
 * Absolutely positioned div with a radial gradient as a background.
 */
const BgGradient: React.FC<BgGradientProps> = (props) => (
  <Box
    bgImage="radial-gradient(2000px 2000px at 30% 300px, #252f4a 0%, rgba(32, 41, 65, 0) 55%)"
    position="absolute"
    w="100%"
    {...props}
  />
);
