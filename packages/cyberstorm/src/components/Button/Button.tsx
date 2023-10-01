"use client";
import React, {
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
  useRef,
} from "react";
import styles from "./Button.module.css";

export interface ButtonProps {
  children?: ReactNode | ReactNode[];
  plain?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  iconAlignment?: "default" | "side";
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
    | "transparentPrimary";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onMouseOver?: MouseEventHandler<HTMLElement>;
  onMouseOut?: MouseEventHandler<HTMLElement>;
  style?: { [key: string]: string };
  type?: "button" | "submit" | "reset";
}

/**
 * Cyberstorm Button component
 */
const Button = React.forwardRef<
  HTMLButtonElement | HTMLDivElement,
  ButtonProps
>((props: PropsWithChildren<ButtonProps>, forwardedRef) => {
  const {
    children,
    plain = false,
    type = "button",
    colorScheme = "default",
    onClick,
    paddingSize = "medium",
    iconAlignment = "default",
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
        className={`${styles.root} ${getIconAlignment(
          iconAlignment
        )} ${getStyle(colorScheme)} ${getPaddingSize(paddingSize)}`}
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
        className={`${styles.root} ${getIconAlignment(
          iconAlignment
        )} ${getStyle(colorScheme)} ${getPaddingSize(paddingSize)}`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
});

Button.displayName = "Button";

const getStyle = (scheme: string) => {
  return {
    danger: styles.button__danger,
    primary: styles.button__primary,
    default: styles.button__default,
    accent: styles.button__accent,
    tertiary: styles.button__tertiary,
    fancyAccent: styles.button__fancyAccent,
    success: styles.button__success,
    warning: styles.button__warning,
    discord: styles.button__discord,
    github: styles.button__github,
    overwolf: styles.button__overwolf,
    specialGreen: styles.button__specialGreen,
    specialPurple: styles.button__specialPurple,
    transparentDanger: styles.button__transparentDanger,
    transparentDefault: styles.button__transparentDefault,
    transparentTertiary: styles.button__transparentTertiary,
    transparentPrimary: styles.button__transparentPrimary,
    transparentAccent: styles.button__transparentAccent,
  }[scheme];
};

const getPaddingSize = (scheme: string) => {
  return {
    none: styles.padding__none,
    small: styles.padding__small,
    medium: styles.padding__medium,
    mediumSquare: styles.padding__mediumSquare,
    large: styles.padding__large,
    huge: styles.padding__huge,
  }[scheme];
};

const getIconAlignment = (scheme: string) => {
  return {
    default: styles.iconAlignment__default,
    side: styles.iconAlignment__side,
  }[scheme];
};

const Root = Button;
export { Root };
