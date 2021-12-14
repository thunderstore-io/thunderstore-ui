import { extendTheme } from "@chakra-ui/react";

const blue = "#242e48";
const darkBlue = "#17213b";
const lightBlue = "#353e58";

export const theme = extendTheme({
  colors: {
    ts: {
      blue,
      darkBlue,
      lightBlue,
    },
  },
  fonts: {
    body: "Exo2",
    heading: "Raleway",
  },
  styles: {
    global: {
      a: {
        _focus: {
          boxShadow: "none !important",
        },
      },
      body: {
        maxWidth: "1180px",
        margin: "0 auto !important",
        padding: "0 20px",
        font: "500 16px/1.2 Exo2, sans-serif",
      },
      "html, body": {
        backgroundColor: blue,
      },
    },
  },
});
