/** Custom styles for Chakra UI's Tag component. */
export const TagStyles = {
  baseStyle: {
    container: {
      bgColor: "ts.lightBlue",
      color: "ts.babyBlue",
    },
  },
  sizes: {
    sm: {
      container: {
        padding: "4px 5px",
        fontSize: 12,
        fontWeight: 500,
      },
    },
    md: {
      container: {
        padding: "4px 10px",
        fontSize: 12,
        fontWeight: 600,
      },
    },
    lg: {
      container: {
        padding: "8px 15px",
        fontSize: 14,
        fontWeight: 700,
      },
    },
  },
  variants: {
    multiselect: {
      container: {
        borderRadius: 0,
        height: "34px",
        margin: "0 5px 5px 0",
        padding: "0 10px",
      },
      label: {
        fontSize: "16px",
        fontWeight: 600,
        lineHeight: "34px",
      },
    },
    translucent: {
      container: {
        bgColor: "#353e5899", // "ts.lightBlue" with 60% alpha.
        borderRadius: 0,
      },
    },
    ts: {
      container: {
        borderRadius: 0,
        margin: "0 10px 10px 0",
      },
    },
  },
  defaultProps: {
    size: "md",
    variant: "ts",
  },
};
