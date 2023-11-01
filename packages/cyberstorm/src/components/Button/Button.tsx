"use client";
import React, {
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
  useRef,
} from "react";
import styles from "./Button.module.css";
import { Tooltip } from "../Tooltip/Tooltip";
import { classnames } from "../../utils/utils";

export interface ButtonProps {
  children?: ReactNode | ReactNode[];
  plain?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  iconAlignment?: "default" | "side";
  paddingSize?:
    | "none"
    | "small"
    | "medium"
    | "mediumSquare"
    | "large"
    | "largeBorderCompensated"
    | "huge";
  fontSize?: "small" | "medium" | "large" | "huge";
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
  tooltipText?: string;
}

const TooltipWrapper = (props: TooltipWrapperProps) =>
  props.tooltipText ? (
    <Tooltip content={props.tooltipText} side="bottom">
      {props.children}
    </Tooltip>
  ) : (
    <>{props.children}</>
  );
interface TooltipWrapperProps extends PropsWithChildren {
  tooltipText?: string;
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
    type,
    colorScheme = "default",
    onClick,
    fontSize = "large",
    paddingSize = "medium",
    iconAlignment = "default",
    tooltipText,
    ...forwardedProps
  } = props;

  const fallbackRef = useRef(null);

  if (plain) {
    const fRef = forwardedRef as React.ForwardedRef<HTMLDivElement>;
    const ref = fRef || fallbackRef;
    return (
      <TooltipWrapper tooltipText={tooltipText}>
        <div
          {...forwardedProps}
          ref={ref}
          className={classnames(
            styles.root,
            getFontSize(fontSize),
            getIconAlignment(iconAlignment),
            getStyle(colorScheme),
            getPaddingSize(paddingSize)
          )}
        >
          {children}
        </div>
      </TooltipWrapper>
    );
  } else {
    const fRef = forwardedRef as React.ForwardedRef<HTMLButtonElement>;
    const ref = fRef || fallbackRef;
    return (
      <TooltipWrapper tooltipText={tooltipText}>
        <button
          {...forwardedProps}
          ref={ref}
          type={type}
          className={classnames(
            styles.root,
            getFontSize(fontSize),
            getIconAlignment(iconAlignment),
            getStyle(colorScheme),
            getPaddingSize(paddingSize)
          )}
          onClick={onClick}
        >
          {children}
        </button>
      </TooltipWrapper>
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
    wideDarker: styles.button__wideDarker,
  }[scheme];
};

const getPaddingSize = (scheme: string) => {
  return {
    none: styles.padding__none,
    small: styles.padding__small,
    medium: styles.padding__medium,
    mediumSquare: styles.padding__mediumSquare,
    large: styles.padding__large,
    largeBorderCompensated: styles.padding__large__borderCompensated,
    huge: styles.padding__huge,
  }[scheme];
};

const getFontSize = (scheme: string) => {
  return {
    small: styles.ButtonLabel__font__small,
    medium: styles.ButtonLabel__font__medium,
    large: styles.ButtonLabel__font__large,
    huge: styles.ButtonLabel__font__huge,
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
