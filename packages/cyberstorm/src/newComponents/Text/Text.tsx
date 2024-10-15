import styles from "./Text.module.css";
import React from "react";
import { FrameTextProps, Frame } from "../../primitiveComponents/Frame/Frame";
import { classnames } from "../../utils/utils";

export const Text = React.forwardRef<
  HTMLParagraphElement,
  Omit<FrameTextProps, "primitiveType">
>((props: Omit<FrameTextProps, "primitiveType">, forwardedRef) => {
  const { children, rootClasses, ...forwardedProps } = props;
  return (
    <Frame
      primitiveType="text"
      {...forwardedProps}
      rootClasses={classnames(styles.text, rootClasses)}
      ref={forwardedRef}
    >
      {children}
    </Frame>
  );
});

Text.displayName = "Text";
