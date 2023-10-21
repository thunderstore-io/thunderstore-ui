"use client";
import React, {
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
  useRef,
} from "react";
import styles from "./Button.module.css";
import classNames from "classnames";

export interface ButtonProps {
  children?: ReactNode | ReactNode[];
  plain?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  paddingSize?: "none" | "small" | "medium" | "mediumSquare" | "large" | "huge";
  variant?:
    | "default"
    | "primary"
    | "accent"
    | "tertiary"
    | "install"
    | "status"
    | "alert"
    | "discord"
    | "github"
    | "overwolf"
    | "specialGreen"
    | "specialPurple"
    | "transparentAlert"
    | "transparentDefault"
    | "transparentTertiary"
    | "transparentAccent"
    | "transparentPrimary"
    | "wideDarker";
  color?:
    | "red"
    | "pink"
    | "orange"
    | "yellow"
    | "green"
    | "blue"
    | "cyber-green"
    | "purple";
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
    variant = "default",
    color = "pink",
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
        className={classNames(
          styles.root,
          getVariant(variant),
          getPaddingSize(paddingSize)
        )}
        data-color={color}
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
        className={classNames(
          styles.root,
          getVariant(variant),
          getPaddingSize(paddingSize)
        )}
        data-color={color}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
});

Button.displayName = "Button";

const getVariant = (scheme: string) => {
  return {
    primary: styles.primary,
    default: styles.default,
    accent: styles.accent,
    tertiary: styles.tertiary,
    status: styles.status,
    alert: styles.alert,
    install: styles.install,
    discord: styles.discord,
    github: styles.github,
    overwolf: styles.overwolf,
    specialGreen: styles.specialGreen,
    specialPurple: styles.specialPurple,
    transparentAlert: styles.transparentAlert,
    transparentDefault: styles.transparentDefault,
    transparentTertiary: styles.transparentTertiary,
    transparentPrimary: styles.transparentPrimary,
    transparentAccent: styles.transparentAccent,
    wideDarker: styles.wideDarker,
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

const Root = Button;
export { Root };
