"use client";
import React, {
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
  useRef,
} from "react";
import styles from "./SquareButton.module.css";
import buttonStyles from "../Button/Button.module.css";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Tooltip } from "../Tooltip/Tooltip";

interface _SquareButtonProps extends _SquarePlainButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

interface _SquarePlainButtonProps {
  icon: ReactNode;
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
  tooltipText: string;
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
    icon,
    colorScheme = "default",
    onClick,
    tooltipText,
    ...forwardedProps
  } = props;

  const fallbackRef = useRef(null);
  const ref = forwardedRef || fallbackRef;

  return (
    <TooltipProvider>
      <Tooltip content={tooltipText}>
        <button
          {...forwardedProps}
          ref={ref}
          type="button"
          className={`${styles.root} ${getStyle(colorScheme)}`}
          onClick={onClick}
        >
          {icon ? <div>{icon}</div> : null}
        </button>
      </Tooltip>
    </TooltipProvider>
  );
});

export const SquarePlainButton = React.forwardRef<
  HTMLDivElement,
  SquarePlainButtonProps
>((props: PropsWithChildren<SquarePlainButtonProps>, forwardedRef) => {
  const {
    icon,
    colorScheme = "default",
    tooltipText,
    ...forwardedProps
  } = props;

  const fallbackRef = useRef(null);
  const ref = forwardedRef || fallbackRef;

  return (
    <TooltipProvider>
      <Tooltip content={tooltipText}>
        <div
          {...forwardedProps}
          ref={ref}
          className={`${styles.root} ${getStyle(colorScheme)}`}
        >
          {icon ? <div>{icon}</div> : null}
        </div>
      </Tooltip>
    </TooltipProvider>
  );
});

SquareButton.displayName = "SquareButton";
SquarePlainButton.displayName = "SquarePlainButton";

const getStyle = (scheme: string) => {
  return {
    danger: buttonStyles.button__danger,
    primary: buttonStyles.button__primary,
    default: buttonStyles.button__default,
    accent: buttonStyles.button__accent,
    tertiary: buttonStyles.button__tertiary,
    fancyAccent: buttonStyles.button__fancyAccent,
    success: buttonStyles.button__success,
    warning: buttonStyles.button__warning,
    specialGreen: buttonStyles.button__specialGreen,
    specialPurple: buttonStyles.button__specialPurple,
    transparentDanger: buttonStyles.button__transparentDanger,
    transparentDefault: buttonStyles.button__transparentDefault,
    transparentTertiary: buttonStyles.button__transparentTertiary,
    transparentPrimary: buttonStyles.button__transparentPrimary,
    transparentAccent: buttonStyles.button__transparentAccent,
  }[scheme];
};
