/** Custom styles for Chakra UI's Link component. */
const topBarBaseStyles = {
  fontFamily: "Raleway",
  fontSize: "16px",
  fontWeight: 700,
  lineHeight: "20px",
  _hover: { textDecoration: "underline solid white 2px" },
};

export const LinkStyles = {
  variants: {
    "ts.topBar": {
      ...topBarBaseStyles,
      marginLeft: "40px",
    },
    "ts.topBarIndex": {
      ...topBarBaseStyles,
      fontWeight: 900,
    },
    "ts.topBarMenu": {
      display: "block",
      padding: "0.4rem 0.8rem",
      width: "100%",
      _hover: { textDecoration: "none" },
    },
  },
};
