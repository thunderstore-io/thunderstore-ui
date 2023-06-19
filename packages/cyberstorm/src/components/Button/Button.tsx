"use client";
import React, {
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
  useRef,
} from "react";
import styles from "./Button.module.css";

interface _ButtonProps extends _PlainButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

interface _PlainButtonProps {
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: "tiny" | "small" | "medium" | "mediumTight" | "mediumIcon" | "large";
  colorScheme?:
    | "danger"
    | "default"
    | "primary"
    | "accent"
    | "warning"
    | "specialGreen"
    | "specialPurple"
    | "transparentDefault"
    | "transparentTertiary"
    | "transparentAccent"
    | "transparentPrimary";
}

export type ButtonProps = _ButtonProps &
  Omit<React.HTMLProps<HTMLButtonElement>, keyof _ButtonProps>;

export type PlainButtonProps = _PlainButtonProps &
  Omit<React.HTMLProps<HTMLDivElement>, keyof _PlainButtonProps>;

/**
 * Cyberstorm Button component
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props: PropsWithChildren<ButtonProps>, forwardedRef) => {
    const {
      label,
      leftIcon,
      rightIcon,
      colorScheme = "default",
      onClick,
      size = "medium",
      ...forwardedProps
    } = props;

    const fallbackRef = useRef(null);
    const ref = forwardedRef || fallbackRef;

    return (
      <button
        {...forwardedProps}
        ref={ref}
        type="button"
        className={`${styles.root} ${getStyle(colorScheme)} ${getSize(size)}`}
        onClick={onClick}
      >
        {leftIcon}
        {label ? <div className={styles.label}>{label}</div> : null}
        {rightIcon}
      </button>
    );
  }
);

export const PlainButton = React.forwardRef<HTMLDivElement, PlainButtonProps>(
  (props: PropsWithChildren<PlainButtonProps>, forwardedRef) => {
    const {
      label,
      leftIcon,
      rightIcon,
      colorScheme = "default",
      size = "medium",
      ...forwardedProps
    } = props;

    const fallbackRef = useRef(null);
    const ref = forwardedRef || fallbackRef;

    return (
      <div
        {...forwardedProps}
        ref={ref}
        className={`${styles.root} ${getStyle(colorScheme)} ${getSize(size)}`}
      >
        {leftIcon}
        {label ? <div className={styles.label}>{label}</div> : null}
        {rightIcon}
      </div>
    );
  }
);

Button.displayName = "Button";
PlainButton.displayName = "PlainButton";

const getStyle = (scheme: string) => {
  return {
    danger: styles.button__danger,
    primary: styles.button__primary,
    default: styles.button__default,
    accent: styles.button__accent,
    warning: styles.button__warning,
    specialGreen: styles.button__specialGreen,
    specialPurple: styles.button__specialPurple,
    transparentDefault: styles.button__transparentDefault,
    transparentTertiary: styles.button__transparentTertiary,
    transparentPrimary: styles.button__transparentPrimary,
    transparentAccent: styles.button__transparentAccent,
  }[scheme];
};

const getSize = (scheme: string) => {
  return {
    tiny: styles.tiny,
    small: styles.small,
    mediumTight: styles.mediumTight,
    mediumIcon: styles.mediumIcon,
    large: styles.large,
    medium: "",
  }[scheme];
};
