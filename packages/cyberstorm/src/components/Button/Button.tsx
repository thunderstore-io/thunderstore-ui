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
  fontSize?: "small" | "medium" | "large" | "huge";
  paddingSize?: "none" | "small" | "medium" | "mediumSquare" | "large" | "huge";
  fontWeight?: "600" | "700" | "800";
  colorScheme?:
    | "danger"
    | "default"
    | "primary"
    | "accent"
    | "tertiary"
    | "fancyAccent"
    | "success"
    | "warning"
    | "specialGreen"
    | "specialPurple"
    | "transparentDanger"
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
      fontSize = "medium",
      paddingSize = "medium",
      fontWeight = "700",
      ...forwardedProps
    } = props;

    const fallbackRef = useRef(null);
    const ref = forwardedRef || fallbackRef;

    return (
      <button
        {...forwardedProps}
        ref={ref}
        type="button"
        className={`${styles.root} ${getStyle(colorScheme)} ${getFontSize(
          fontSize
        )} ${getPaddingSize(paddingSize)}`}
        onClick={onClick}
      >
        {leftIcon}
        {label ? (
          <div className={`${styles.label} ${getFontWeight(fontWeight)}`}>
            {label}
          </div>
        ) : null}
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
      fontSize = "medium",
      paddingSize = "medium",
      fontWeight = "700",
      ...forwardedProps
    } = props;

    const fallbackRef = useRef(null);
    const ref = forwardedRef || fallbackRef;

    return (
      <div
        {...forwardedProps}
        ref={ref}
        className={`${styles.root} ${getStyle(colorScheme)} ${getFontSize(
          fontSize
        )} ${getPaddingSize(paddingSize)}`}
      >
        {leftIcon}
        {label ? (
          <div
            className={`${styles.label} ${getFontSize(
              fontSize
            )} ${getFontWeight(fontWeight)}`}
          >
            {label ? (
              <div className={`${styles.label} ${getFontWeight(fontWeight)}`}>
                {label}
              </div>
            ) : null}
          </div>
        ) : null}
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
    tertiary: styles.button__tertiary,
    fancyAccent: styles.button__fancyAccent,
    success: styles.button__success,
    warning: styles.button__warning,
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

const getFontSize = (scheme: string) => {
  return {
    small: styles.font__small,
    medium: styles.font__medium,
    large: styles.font__large,
    huge: styles.font__huge,
  }[scheme];
};

const getFontWeight = (scheme: string) => {
  return {
    "600": styles.fontWeight__600,
    "700": styles.fontWeight__700,
    "800": styles.fontWeight__800,
  }[scheme];
};
