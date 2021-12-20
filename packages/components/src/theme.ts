import { extendTheme } from "@chakra-ui/react";

import { TagBoxStyles } from "./components/TagBox";

const babyBlue = "#ccddfe";
const blue = "#242e48";
const coolGray = "#93a0c2";
const darkBlue = "#17213b";
const lightBlue = "#353e58";
const orange = "#ffa96b";
const white = "#fff";

export const theme = extendTheme({
  colors: {
    ts: {
      babyBlue,
      blue,
      coolGray,
      darkBlue,
      lightBlue,
      orange,
      white,
    },
  },
  components: {
    TagBox: TagBoxStyles,
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
        color: white,
        font: "500 16px/1.2 Exo2, sans-serif",
      },
      "html, body": {
        backgroundColor: blue,
      },
    },
  },
});
