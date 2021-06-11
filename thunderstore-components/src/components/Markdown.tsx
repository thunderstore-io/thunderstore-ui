import React from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";

interface MarkdownProps {
  children: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ children }) => {
  return (
    <ReactMarkdown plugins={[gfm]} components={ChakraUIRenderer()}>
      {children}
    </ReactMarkdown>
  );
};
