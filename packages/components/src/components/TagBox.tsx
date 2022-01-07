import {
  Box,
  BoxProps,
  ComponentSingleStyleConfig,
  ThemingProps,
  useStyleConfig,
} from "@chakra-ui/react";
import React from "react";

/**
 * Stylized Box element for tag cloud tags.
 */
export const TagBox: React.FC<BoxProps & ThemingProps> = (props) => {
  const { children, size, variant, ...rest } = props;
  const styles = useStyleConfig("TagBox", { size, variant });

  return (
    <Box __css={styles} {...rest}>
      {children}
    </Box>
  );
};

export const TagBoxStyles: ComponentSingleStyleConfig = {
  baseStyle: {
    color: "ts.babyBlue",
    display: "inline-block",
  },
  defaultProps: {
    size: "md",
    variant: "default",
  },
  sizes: {
    sm: {
      padding: "4px 5px",
      fontSize: 12,
      fontWeight: 500,
    },
    md: {
      padding: "4px 10px",
      fontSize: 12,
      fontWeight: 600,
    },
    lg: {
      padding: "8px 15px",
      fontSize: 14,
      fontWeight: 700,
    },
  },
  variants: {
    default: {
      bgColor: "ts.lightBlue",
    },
    translucent: {
      bgColor: "#353e5899", // "ts.lightBlue" with 60% alpha.
    },
  },
};
