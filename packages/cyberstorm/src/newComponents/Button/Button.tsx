import "./Button.css";
import "./IconButton.css";
import React from "react";
import { classnames, componentClasses } from "../../utils/utils";
import {
  ActionableButtonProps,
  Actionable,
} from "../../primitiveComponents/Actionable/Actionable";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NewIcon } from "../..";
import {
  ButtonVariants,
  ButtonSizes,
  ButtonModifiers,
  IconButtonVariants,
  IconButtonModifiers,
  IconButtonSizes,
} from "@thunderstore/cyberstorm-theme/src/components";

interface ButtonProps extends Omit<ActionableButtonProps, "primitiveType"> {
  csVariant?: ButtonVariants;
  csSize?: ButtonSizes;
  csModifiers?: ButtonModifiers[];
}

interface IconButtonProps
  extends Omit<ActionableButtonProps, "primitiveType" | "children"> {
  csVariant?: IconButtonVariants;
  csSize?: IconButtonSizes;
  csModifiers?: IconButtonModifiers[];
  icon: IconProp;
}

export type ButtonComponentProps =
  | ({ icon?: false } & ButtonProps)
  | ({ icon: IconProp } & IconButtonProps);

// TODO: Add style support for disabled
export const Button = React.forwardRef<HTMLButtonElement, ButtonComponentProps>(
  (props: ButtonComponentProps, forwardedRef) => {
    const { rootClasses, icon, ...forwardedProps } = props;

    if (icon) {
      const {
        csVariant = "primary",
        csSize = "medium",
        csModifiers,
        ...fProps
      } = forwardedProps as IconButtonProps;

      return (
        <Actionable
          primitiveType="button"
          {...fProps}
          rootClasses={classnames(
            "ts-iconbutton",
            ...componentClasses(csVariant, csSize, csModifiers),
            rootClasses
          )}
          ref={forwardedRef}
        >
          <NewIcon csMode="inline" noWrapper rootClasses="ts-iconbutton__icon">
            <FontAwesomeIcon icon={icon} />
          </NewIcon>
        </Actionable>
      );
    }

    const {
      children,
      csVariant = "primary",
      csSize = "medium",
      csModifiers,
      ...fProps
    } = forwardedProps as ButtonProps;

    return (
      <Actionable
        primitiveType="button"
        {...fProps}
        rootClasses={classnames(
          "ts-button",
          ...componentClasses(csVariant, csSize, csModifiers),
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
