import { PropsWithChildren } from "react";
import styles from "./Heading.module.css";
import React from "react";
import { Frame } from "../../../primitiveComponents/Frame/Frame";

interface DefaultProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    PropsWithChildren {
  level?: "1" | "2" | "3" | "4";
  variant?: "primary" | "secondary" | "tertiary" | "accent";
  mode?: "heading" | "display";
}

export const Heading = React.forwardRef<HTMLHeadingElement, DefaultProps>(
  (props: DefaultProps, forwardedRef) => {
    const {
      children,
      variant = "primary",
      level = "1",
      mode = "heading",
      ...forwardedProps
    } = props;
    const fProps = forwardedProps as DefaultProps;
    return (
      <Frame
        {...fProps}
        primitiveType={mode}
        rootClasses={styles.heading}
        csVariant={variant}
        csLevel={level}
        ref={forwardedRef}
      >
        {children}
      </Frame>
    );
  }
);

Heading.displayName = "Heading";
