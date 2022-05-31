import { topBarBaseStyles } from "./Link";

/** Custom styles for Chakra UI's Button component. */
export const ButtonStyles = {
  baseStyle: {
    borderRadius: 0,
    verticalAlign: "top",
    // Overwrite white-space setting imposed by Chakra to allow
    // multiline buttons for narrow screens.
    whiteSpace: "unset",
  },
  defaultProps: {
    size: "ts.autoHeight",
  },
  sizes: {
    // Overwrite height setting imposed by Chakra to allow multiline
    // buttons for narrow screens.
    "ts.autoHeight": {
      height: "auto",
    },
  },
  variants: {
    "ts.altAction": {
      bgColor: "ts.black",
      borderColor: "ts.orange",
      borderWidth: 2,
      color: "ts.orange",
      fontFamily: "Exo2",
      fontSize: "16px",
      fontWeight: 700,
      lineHeight: "1.2",
      padding: "12px 30px",
    },
    "ts.auxiliary": {
      bgColor: "ts.black",
      borderColor: "ts.babyBlue",
      borderWidth: 1,
      color: "ts.babyBlue",
      fontFamily: "Exo2",
      fontSize: "14px",
      fontWeight: 700,
      lineHeight: "1.2",
      padding: "4px 15px",
    },
    "ts.mainAction": {
      bgColor: "ts.orange",
      color: "ts.black",
      fontFamily: "Exo2",
      fontSize: "16px",
      fontWeight: 700,
      height: "auto",
      lineHeight: "1.2",
      padding: "14px 32px",
    },
    "ts.topBar": {
      ...topBarBaseStyles,
      marginLeft: "40px",
    },
    "ts.topBarMenu": {
      backgroundColor: "transparent",
      fontFamily: "Raleway",
      fontWeight: "700",
      height: "20px",
      lineHeight: "20px",
      marginLeft: "40px",
      padding: "0",
      width: "115px",
      _active: { backgroundColor: "transparent" },
      _focus: { boxShadow: "none !important" },
      _hover: { backgroundColor: "transparent" },
    },
  },
};
