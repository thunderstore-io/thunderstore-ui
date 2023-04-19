import { ReactNode } from "react";

export interface ContentTopProps {
  content?: ReactNode;
}

/**
 * Cyberstorm ContentTop
 */
export function ContentTop(props: ContentTopProps) {
  const { content } = props;

  return <div>{content}</div>;
}

ContentTop.displayName = "ContentTop";
ContentTop.defaultProps = { content: null };
