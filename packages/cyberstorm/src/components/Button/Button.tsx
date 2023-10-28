"use client";
import React, {
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
  useRef,
} from "react";
import styles from "./Button.module.css";

interface Props {
  children?: ReactNode | ReactNode[];
  plain?: boolean;
  paddingSize?: "none" | "small" | "medium" | "mediumSquare" | "large" | "huge";
  colorScheme?:
    | "danger"
    | "default"
    | "primary"
    | "accent"
    | "tertiary"
    | "fancyAccent"
    | "success"
    | "warning"
    | "discord"
    | "github"
    | "overwolf"
    | "specialGreen"
    | "specialPurple"
    | "transparentDanger"
    | "transparentDefault"
    | "transparentTertiary"
    | "transparentAccent"
    | "transparentPrimary"
    | "wideDarker";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onMouseOver?: MouseEventHandler<HTMLElement>;
  onMouseOut?: MouseEventHandler<HTMLElement>;
  style?: { [key: string]: string };
  type?: "button" | "submit" | "reset";
}

/**
 * Cyberstorm Button component
 */
const Button = React.forwardRef<HTMLButtonElement | HTMLDivElement, Props>(
  (props: PropsWithChildren<Props>, forwardedRef) => {
    const {
      children,
      plain = false,
      type = "button",
      colorScheme = "default",
      onClick,
      paddingSize = "medium",
      ...forwardedProps
    } = props;

    const fallbackRef = useRef(null);

    if (plain) {
      const fRef = forwardedRef as React.ForwardedRef<HTMLDivElement>;
      const ref = fRef || fallbackRef;
      return (
        <div
          {...forwardedProps}
          ref={ref}
          className={styles.root}
          data-padding={paddingSize}
          data-variant={colorScheme}
        >
          {children}
        </div>
      );
    } else {
      const fRef = forwardedRef as React.ForwardedRef<HTMLButtonElement>;
      const ref = fRef || fallbackRef;
      return (
        <button
          {...forwardedProps}
          ref={ref}
          type={type}
          className={styles.root}
          data-padding={paddingSize}
          data-variant={colorScheme}
          onClick={onClick}
        >
          {children}
        </button>
      );
    }
  }
);

Button.displayName = "Button";

export { Button as Root };
