"use client";
import React, {
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
  useRef,
} from "react";
import styles from "./IconButton.module.css";
import buttonStyles from "../Button/Button.module.css";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Tooltip } from "../Tooltip/Tooltip";

interface _IconButtonProps extends _IconPlainButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

interface _IconPlainButtonProps {
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

export type IconButtonProps = _IconButtonProps &
  Omit<React.HTMLProps<HTMLButtonElement>, keyof _IconButtonProps>;

export type IconPlainButtonProps = _IconPlainButtonProps &
  Omit<React.HTMLProps<HTMLDivElement>, keyof _IconPlainButtonProps>;

/**
 * Cyberstorm IconButton component
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (props: PropsWithChildren<IconButtonProps>, forwardedRef) => {
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
  }
);

export const IconPlainButton = React.forwardRef<
  HTMLDivElement,
  IconPlainButtonProps
>((props: PropsWithChildren<IconPlainButtonProps>, forwardedRef) => {
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

IconButton.displayName = "IconButton";
IconPlainButton.displayName = "IconPlainButton";

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
