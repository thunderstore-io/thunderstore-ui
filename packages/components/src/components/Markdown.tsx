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
        <ReactMarkdown plugins={[gfm]} components={ChakraUIRenderer()}>
          {children}
        </ReactMarkdown>
      );
    };
    generateMarkup();
  }, [children, setMarkup]);

  return markup ?? null;
};
