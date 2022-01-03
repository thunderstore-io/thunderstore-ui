import { extendTheme } from "@chakra-ui/react";

import { TagBoxStyles } from "./components/TagBox";
import { ToggleSwitchStyles } from "./components/ToggleSwitch";

const babyBlue = "#ccddfe";
const black = "#222c45";
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
      black,
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
    ToggleSwitch: ToggleSwitchStyles,
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
