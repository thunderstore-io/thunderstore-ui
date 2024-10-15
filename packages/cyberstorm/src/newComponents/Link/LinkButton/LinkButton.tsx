import {
  Actionable,
  ActionableCyberstormLinkProps,
  ActionableLinkProps,
} from "../../../primitiveComponents/Actionable/Actionable";
import buttonStyles from "../../../sharedComponentStyles/ButtonStyles/Button.module.css";
import React from "react";
import { classnames } from "../../../utils/utils";

interface Modifiers {
  dimmed?: boolean;
  subtle?: boolean;
  disabled?: boolean;
}

interface LinkProps extends ActionableLinkProps, Modifiers {}
interface CyberstormLinkProps extends ActionableCyberstormLinkProps, Modifiers {}


export const LinkButton = React.forwardRef<
  HTMLAnchorElement,
  LinkProps | CyberstormLinkProps
>(
  (
    props: LinkProps | CyberstormLinkProps,
    forwardedRef
  ) => {
    const {
      children,
      rootClasses,
      csVariant = "default",
      csSize = "m",
      csTextStyles,
      dimmed,
      subtle,
      disabled,
      ...forwardedProps
    } = props;

    return (
      <Actionable
        {...forwardedProps}
        // disabled={disabled} TODO: Implement disabled for a tags?
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

LinkButton.displayName = "LinkButton";

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