import React, { ReactNode } from "react";

export interface ContentTopProps {
  content?: ReactNode;
}

/**
 * Cyberstorm ContentTop
 */
export const ContentTop: React.FC<ContentTopProps> = (props) => {
  const { content } = props;

  return <div>{content}</div>;
};

ContentTop.displayName = "ContentTop";
ContentTop.defaultProps = { content: null };
