import { extendTheme } from "@chakra-ui/react";

const blue = "#242e48";
const coolGray = "#93a0c2";
const darkBlue = "#17213b";
const lightBlue = "#353e58";
const orange = "#ffa96b";
const white = "#fff";

export const theme = extendTheme({
  colors: {
    ts: {
      blue,
      coolGray,
      darkBlue,
      lightBlue,
      orange,
      white,
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
        color: white,
      },
      "html, body": {
        backgroundColor: blue,
      },
    },
  },
});
