"use client";
import React, {
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
  useRef,
} from "react";
import styles from "./SquareButton.module.css";

interface _SquareButtonProps extends _SquarePlainButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

interface _SquarePlainButtonProps {
  Icon?: ReactNode;
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

export type SquareButtonProps = _SquareButtonProps &
  Omit<React.HTMLProps<HTMLButtonElement>, keyof _SquareButtonProps>;

export type SquarePlainButtonProps = _SquarePlainButtonProps &
  Omit<React.HTMLProps<HTMLDivElement>, keyof _SquarePlainButtonProps>;

/**
 * Cyberstorm SquareButton component
 */
export const SquareButton = React.forwardRef<
  HTMLButtonElement,
  SquareButtonProps
>((props: PropsWithChildren<SquareButtonProps>, forwardedRef) => {
  const {
    label,
    Icon,
    colorScheme = "default",
    onClick,
    ...forwardedProps
  } = props;
  v;

  const fallbackRef = useRef(null);
  const ref = forwardedRef || fallbackRef;

  return (
    <button
      {...forwardedProps}
      ref={ref}
      type="button"
      className={`${styles.root} ${getStyle(colorScheme)}`}
      onClick={onClick}
    >
      {Icon ? <div className={styles.Icon}>{Icon}</div> : null}
    </button>
  );
});

export const SquarePlainButton = React.forwardRef<
  HTMLDivElement,
  SquarePlainButtonProps
>((props: PropsWithChildren<SquarePlainButtonProps>, forwardedRef) => {
  const { Icon, colorScheme = "default", ...forwardedProps } = props;

  const fallbackRef = useRef(null);
  const ref = forwardedRef || fallbackRef;

  return (
    <div
      {...forwardedProps}
      ref={ref}
      className={`${styles.root}
        )} ${getStyle(colorScheme)}`}
    >
      {Icon}
    </div>
  );
});

SquareButton.displayName = "SquareButton";
SquarePlainButton.displayName = "SquarePlainButton";

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
