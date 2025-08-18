import "./Button.css";
import React, { memo } from "react";
import { classnames, componentClasses } from "../../utils/utils";
import {
  ActionableButtonProps,
  Actionable,
  ActionableCyberstormLinkProps,
  ActionableLinkProps,
} from "../../primitiveComponents/Actionable/Actionable";
import {
  ButtonVariants,
  ButtonSizes,
  ButtonModifiers,
} from "@thunderstore/cyberstorm-theme/src/components";

interface IButton {
  csVariant?: ButtonVariants;
  csSize?: ButtonSizes;
  csModifiers?: ButtonModifiers[];
}

interface ButtonButton extends IButton, ActionableButtonProps {}
interface ButtonLinkButton extends IButton, ActionableLinkProps {}
interface ButtonCyberstormLinkButton
  extends IButton,
    ActionableCyberstormLinkProps {}

export type ButtonComponentProps =
  | (Omit<ButtonButton, "primitiveType"> & {
      icon?: false;
      primitiveType?: "button";
    })
  | (ButtonLinkButton & { icon?: false; primitiveType: "link" })
  | (ButtonCyberstormLinkButton & {
      icon?: false;
      primitiveType: "cyberstormLink";
    });

// TODO: Add style support for disabled
export const Button = memo(function Button(props: ButtonComponentProps) {
  const {
    children,
    rootClasses,
    csVariant = "primary",
    csSize = "medium",
    csModifiers,
    icon,
    ...forwardedProps
  } = props;

  return (
    <Actionable
      {...forwardedProps}
      rootClasses={classnames(
        "button",
        ...componentClasses("button", csVariant, csSize, csModifiers),
        rootClasses
      )}
    >
      {children}
    </Actionable>
  );
});

Button.displayName = "Button";
