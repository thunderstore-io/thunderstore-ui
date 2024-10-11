import buttonStyles from "../../sharedComponentStyles/ButtonStyles/Button.module.css";
import iconButtonStyles from "../../sharedComponentStyles/ButtonStyles/IconButton.module.css";
import React from "react";
import { classnames } from "../../utils/utils";
import {
  ActionableButtonProps,
  Actionable,
} from "../../primitiveComponents/Actionable/Actionable";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NewIcon } from "../..";

interface Modifiers {
  dimmed?: boolean;
  subtle?: boolean;
  disabled?: boolean;
}

interface ButtonProps extends Omit<ActionableButtonProps, "primitiveType" | "csVariant">, Modifiers {
  csVariant?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "accent"
    | "special"
    | "info"
    | "success"
    | "warning"
    | "danger";
  csSize?: "xs" | "s" | "m" | "l";
}

interface IconButtonProps
  extends Omit<
    ActionableButtonProps,
    "primitiveType" | "csVariant" | "csSize" | "children"
  >, Modifiers {
  csVariant?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "danger"
    | "minimal";
  csSize?: "xs" | "s" | "m";
  icon: IconProp;
}

export type ButtonComponentProps =
  | ({ icon?: false } & ButtonProps)
  | ({ icon: IconProp } & IconButtonProps);

export const Button = React.forwardRef<HTMLButtonElement, ButtonComponentProps>(
  (props: ButtonComponentProps, forwardedRef) => {
    const { rootClasses, csTextStyles, icon, dimmed, subtle, disabled,  ...forwardedProps } = props;

    if (icon) {
      const {
        csVariant = "default",
        csSize = "m",
        ...fProps
      } = forwardedProps as IconButtonProps;

      return (
        <Actionable
          primitiveType="button"
          {...fProps}
          rootClasses={classnames(iconButtonStyles.iconButton, rootClasses)}
          ref={forwardedRef}
        >
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={icon} />
          </NewIcon>
        </Actionable>
      );
    }

    const {
      children,
      csVariant = "primary",
      csSize = "m",
      ...fProps
    } = forwardedProps as ButtonProps;

    return (
      <Actionable
        primitiveType="button"
        {...fProps}
        disabled={disabled}
        rootClasses={classnames(
          buttonStyles.button,
          getSize(csSize),
          getVariant(csVariant),
          dimmed ? buttonStyles["button--dimmed"] : null,
          subtle ? buttonStyles["button--subtle"] : null,
          disabled ? buttonStyles["button--disabled"] : null,
          rootClasses
        )}
        ref={forwardedRef}
      >
        {children}
      </Actionable>
    );
  }
);

Button.displayName = "Button";

const getVariant = (scheme: string) => {
  return {
    primary: buttonStyles.button__primary,
    secondary: buttonStyles.button__secondary,
    tertiary: buttonStyles.button__tertiary,
    accent: buttonStyles.button__accent,
    special: buttonStyles.button__special,
    info: buttonStyles.button__info,
    success: buttonStyles.button__success,
    warning: buttonStyles.button__warning,
    danger: buttonStyles.button__danger,
  }[scheme];
};

const getSize = (scheme: string) => {
  return {
    xs: buttonStyles["button--size-xs"],
    s: buttonStyles["button--size-s"],
    m: buttonStyles["button--size-m"],
    l: buttonStyles["button--size-l"],
  }[scheme];
};