import React from "react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";

interface MarkdownProps {
  children: string;
}

/**
 * Wrapper for rendering markdown strings as proper markup.
 */
export const Markdown: React.FC<MarkdownProps> = ({ children }) => {
  const [markup, setMarkup] = React.useState<JSX.Element>();

  /*
   * react-markdown and remark-gfm are imported asynchronously because
   * regular imports result in server error: "Element type is invalid:
   * expected a string (for built-in components) or a class/function
   * (for composite components) but got: undefined" ever since
   * Preconstruct was introduced.
   */
  React.useEffect(() => {
    const generateMarkup = async () => {
      const { default: ReactMarkdown } = await import("react-markdown");
      const { default: gfm } = await import("remark-gfm");

      setMarkup(
        <ReactMarkdown
          className="markdown"
          components={ChakraUIRenderer()}
          plugins={[gfm]}
        >
          {children}
        </ReactMarkdown>
      );
    };
    generateMarkup();
  }, [children, setMarkup]);

  return markup ?? null;
};

export const markdownStyles = {
  ".markdown": {
    color: "ts.white",
    fontFamily: "Exo2, sans-serif",

    "h1, h2": {
      paddingBottom: "0.25em",
      borderBottom: "1px solid #c4c4c4",
      marginBottom: "0.5em",
    },
    h1: { fontSize: "32px" },
    h2: { fontSize: "24px" },
    h3: { fontSize: "18px" },
    h4: { fontSize: "16px" },
    h5: { fontSize: "14px" },
    h6: { fontSize: "12px" },
    p: {
      fontSize: "16px",
      fontWeight: "500",
      lineHeight: "1.2",
    },
    "img, ul, ol, p": { marginBottom: "1.25em" },
    img: { display: "inline-block" },
    "li > ul, li > ol": {
      marginTop: "0.25em",
    },
    code: {
      color: "ts.blue",
      padding: "3px 6px",
    },
    "pre > code": { padding: "1em" },
    a: { color: "ts.babyBlue" },
  },
};
