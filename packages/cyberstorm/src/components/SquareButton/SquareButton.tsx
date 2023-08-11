"use client";
import React, {
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
  useRef,
  useState,
} from "react";
import styles from "./SquareButton.module.css";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Tooltip } from "../Tooltip/Tooltip";

interface _SquareButtonProps extends _SquarePlainButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

interface _SquarePlainButtonProps {
  icon?: ReactNode;
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
  const { icon, colorScheme = "default", onClick, ...forwardedProps } = props;

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
      {icon ? <div className={styles.icon}>{icon}</div> : null}
    </button>
  );
});

export const SquarePlainButton = React.forwardRef<
  HTMLDivElement,
  SquarePlainButtonProps
>((props: PropsWithChildren<SquarePlainButtonProps>, forwardedRef) => {
  const { icon, colorScheme = "default", onClick, ...forwardedProps } = props;

  const fallbackRef = useRef(null);
  const ref = forwardedRef || fallbackRef;
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const button = (
    <SquarePlainButton
      colorScheme={colorScheme}
      onMouseOver={() => {
        setTooltipOpen(true);
      }}
      onMouseOut={() => {
        setTooltipOpen(false);
      }}
      icon={icon}
      onClick={onClick}
    />
  );

  return (
    <TooltipProvider>
      <Tooltip content={"derp"} open={tooltipOpen} side="bottom">
        <div
          {...forwardedProps}
          ref={ref}
          className={`${styles.root} ${getStyle(colorScheme)}`}
        >
          {button}
        </div>
      </Tooltip>
    </TooltipProvider>
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
