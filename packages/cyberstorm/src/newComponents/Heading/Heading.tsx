import styles from "./Heading.module.css";
import React from "react";
import {
  Frame,
  FrameHeadingProps,
  FrameDisplayProps,
} from "../../primitiveComponents/Frame/Frame";
import { classnames } from "../../utils/utils";

interface DefaultProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    Omit<FrameHeadingProps, "primitiveType">,
    Omit<FrameDisplayProps, "primitiveType"> {
  mode?: "heading" | "display";
}

export const Heading = React.forwardRef<HTMLHeadingElement, DefaultProps>(
  (props: DefaultProps, forwardedRef) => {
    const {
      children,
      rootClasses,
      csVariant = "primary",
      csLevel = "1",
      csStyleLevel,
      mode = "heading",
      ...forwardedProps
    } = props;
    const fProps = forwardedProps as DefaultProps;
    return (
      <Frame
        {...fProps}
        primitiveType={mode}
        rootClasses={classnames(styles.heading, rootClasses)}
        csVariant={csVariant}
        csLevel={csLevel}
        csStyleLevel={csStyleLevel ? csStyleLevel : csLevel}
        ref={forwardedRef}
      >
        {children}
      </Frame>
    );
  }
);

Heading.displayName = "Heading";
