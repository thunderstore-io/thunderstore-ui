"use client";
import React, {
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
  useRef,
} from "react";
import styles from "./Button.module.css";

type _ButtonProps = {
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: "tiny" | "small" | "medium";
  colorScheme?:
    | "danger"
    | "default"
    | "defaultWithBorder"
    | "primary"
    | "warning"
    | "specialGreen"
    | "specialPurple"
    | "transparentDefault"
    | "transparentTertiary"
    | "transparentPrimary";
  onClick?: MouseEventHandler<HTMLButtonElement>;
};
export type ButtonProps = _ButtonProps &
  Omit<React.HTMLProps<HTMLButtonElement>, keyof _ButtonProps>;

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

Button.displayName = "Button";

const getStyle = (scheme: ButtonProps["colorScheme"] = "default") => {
  return {
    danger: styles.button__danger,
    default: styles.button__default,
    defaultWithBorder: styles.button__defaultWithBorder,
    primary: styles.button__primary,
    warning: styles.button__warning,
    specialGreen: styles.button__specialGreen,
    specialPurple: styles.button__specialPurple,
    transparentDefault: styles.button__transparentDefault,
    transparentTertiary: styles.button__transparentTertiary,
    transparentPrimary: styles.button__transparentPrimary,
  }[scheme];
};

const getSize = (scheme: ButtonProps["size"] = "medium") => {
  return {
    tiny: styles.tiny,
    small: styles.small,
    medium: "",
  }[scheme];
};
