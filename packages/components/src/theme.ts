import { extendTheme } from "@chakra-ui/react";

import { markdownStyles } from "./components/Markdown";
import { MultiSelectStyles } from "./components/Select";
import { ToggleSwitchStyles } from "./components/ToggleSwitch";
import { ButtonStyles } from "./customStyles/Button";
import { FormLabelStyles } from "./customStyles/FormLabel";
import { ModalStyles } from "./customStyles/Modal";
import { TagStyles } from "./customStyles/Tag";
import { TextStyles } from "./customStyles/Text";

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
    Button: ButtonStyles,
    FormLabel: FormLabelStyles,
    Modal: ModalStyles,
    MultiSelect: MultiSelectStyles,
    Tag: TagStyles,
    Text: TextStyles,
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
      ...markdownStyles,
    },
  },
});
