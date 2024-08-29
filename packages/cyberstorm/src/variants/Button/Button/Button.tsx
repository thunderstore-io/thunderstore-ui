import { PropsWithChildren } from "react";
import { Actionable } from "../../../primitiveComponents/Actionable/Actionable";
import styles from "../../../sharedVariantStyles/ButtonStyles/Button.module.css";
import React from "react";

type colors =
  | "surface"
  | "surface-alpha"
  | "blue"
  | "pink"
  | "red"
  | "orange"
  | "green"
  | "yellow"
  | "purple"
  | "cyber-green";

type sizes = "xs" | "s" | "m" | "l";

interface DefaultProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    PropsWithChildren {
  color?: colors;
  size?: sizes;
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "tertiary"
    | "accent"
    | "special";
}

export const Button = React.forwardRef<HTMLButtonElement, DefaultProps>(
  (props: DefaultProps, forwardedRef) => {
    const {
      variant = "default",
      color = "purple",
      size = "m",
      ...forwardedProps
    } = props;
    return (
      <Actionable
        {...forwardedProps}
        primitiveType={"button"}
        rootClasses={styles.button}
        csColor={color}
        csSize={size}
        csVariant={variant}
        ref={forwardedRef}
      >
        {props.children}
      </Actionable>
    );
  }
);

Button.displayName = "Button";
