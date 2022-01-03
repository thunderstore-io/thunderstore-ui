import {
  ComponentMultiStyleConfig,
  Flex,
  ThemingProps,
  useMultiStyleConfig,
} from "@chakra-ui/react";
import React, { SetStateAction } from "react";

interface ToggleSwitchProps extends ThemingProps {
  offLabel?: string;
  onLabel?: string;
  value: boolean;
  setValue: React.Dispatch<SetStateAction<boolean>>;
}

/**
 * On/off toggle switch with customizable labels.
 */
export const ToggleSwitch: React.FC<ToggleSwitchProps> = (props) => {
  const { offLabel, onLabel, setValue, size, value } = props;
  const styles = useMultiStyleConfig("ToggleSwitch", { size });

  return (
    <Flex __css={styles.container} onClick={() => setValue((old) => !old)}>
      <Flex
        __css={styles.toggle}
        bgColor={value ? "ts.babyBlue" : "ts.lightBlue"}
        color={value ? "ts.black" : "ts.babyBlue"}
        ml={value ? "50%" : "0"}
      >
        {value ? onLabel ?? "Yes" : offLabel ?? "No"}
      </Flex>
    </Flex>
  );
};

export const ToggleSwitchStyles: ComponentMultiStyleConfig = {
  baseStyle: {
    container: {
      bgColor: "ts.darkBlue",
      borderRadius: "3px",
      cursor: "pointer",
      height: "44px",
      padding: "5px",
    },
    toggle: {
      borderRadius: "3px",
      fontWeight: 700,
      height: "34px",
      lineHeight: "34px",
      textAlign: "center",
      textTransform: "uppercase",
      transition: "all 0.15s",
      width: "50%",
    },
  },
  defaultProps: {
    size: "sm",
  },
  sizes: {
    sm: {
      container: { width: "100px" },
    },
    md: {
      container: { width: "200px" },
    },
    lg: {
      container: { width: "300px" },
    },
    full: {
      container: { width: "100%" },
    },
  },
  parts: ["container", "toggle"],
};
