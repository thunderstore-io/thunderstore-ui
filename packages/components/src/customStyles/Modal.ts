/** Custom styles for Chakra UI's Modal and related components. */
export const ModalStyles = {
  baseStyle: {
    dialog: {
      bgColor: "ts.darkBlue",
      borderColor: "ts.lightBlue",
      borderRadius: 0,
      borderWidth: 2,
      padding: "30px 0 20px 0",
    },
    header: {
      marginBottom: "20px",
      padding: "0 30px",
    },
    body: {
      marginBottom: "20px",
      padding: "0 30px",
    },
    footer: {
      padding: "0 30px",
    },
    closeButton: {
      top: "10px",
      right: "10px",
    },
  },
  defaultProps: {
    size: "xl",
  },
};
