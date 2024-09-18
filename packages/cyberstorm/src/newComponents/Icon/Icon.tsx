import { Frame, FrameIconProps } from "../../primitiveComponents/Frame/Frame";
import React from "react";
import styles from "./Icon.module.css";
import { classnames } from "../../utils/utils";

export const Icon = React.forwardRef<
  HTMLDivElement | HTMLSpanElement | SVGElement,
  Omit<FrameIconProps, "primitiveType">
>((props: Omit<FrameIconProps, "primitiveType">, forwardedRef) => {
  const { rootClasses, ...forwardedProps } = props;
  return (
    <Frame
      primitiveType="icon"
      {...forwardedProps}
      ref={forwardedRef}
      rootClasses={classnames(styles.icon, rootClasses)}
    />
  );
});

Icon.displayName = "Icon";
