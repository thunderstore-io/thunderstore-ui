import "./Button.css";
import "./IconButton.css";
import React from "react";
import { classnames, componentClasses } from "../../utils/utils";
import {
  ActionableButtonProps,
  Actionable,
  ActionableCyberstormLinkProps,
  ActionableLinkProps,
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

interface IButton {
  csVariant?: ButtonVariants;
  csSize?: ButtonSizes;
  csModifiers?: ButtonModifiers[];
}

interface IIconButton {
  csVariant?: IconButtonVariants;
  csSize?: IconButtonSizes;
  csModifiers?: IconButtonModifiers[];
  icon: IconProp;
}

interface ButtonButton extends IButton, ActionableButtonProps {}
interface ButtonLinkButton extends IButton, ActionableLinkProps {}
interface ButtonCyberstormLinkButton
  extends IButton,
    ActionableCyberstormLinkProps {}

interface IconButtonButton extends IIconButton, ActionableButtonProps {}
interface IconButtonLinkButton extends IIconButton, ActionableLinkProps {}
interface IconButtonCyberstormLinkButton
  extends IIconButton,
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
    })
  | (Omit<IconButtonButton, "primitiveType"> & {
      icon: IconProp;
      primitiveType?: "button";
    })
  | (IconButtonLinkButton & { icon: IconProp; primitiveType: "link" })
  | (IconButtonCyberstormLinkButton & {
      icon: IconProp;
      primitiveType: "cyberstormLink";
    });

// TODO: Add style support for disabled
export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonComponentProps
>((props: ButtonComponentProps, forwardedRef) => {
  const {
    children,
    rootClasses,
    csVariant = "primary",
    csSize = "medium",
    csModifiers,
    icon,
    ...forwardedProps
  } = props;

  if (icon) {
    return (
      <Actionable
        {...forwardedProps}
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

  return (
    <Actionable
      {...forwardedProps}
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
});

Button.displayName = "Button";
