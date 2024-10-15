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

interface ButtonProps extends Omit<ActionableButtonProps, "primitiveType"> {
  csVariant?:
    | "default"
    | "defaultPeek"
    | "primary"
    | "secondary"
    | "tertiary"
    | "minimal"
    | "accent"
    | "special";
  csSize?: "xs" | "s" | "m" | "l";
}

interface IconButtonProps
  extends Omit<
    ActionableButtonProps,
    "primitiveType" | "csVariant" | "csSize" | "children"
  > {
  csVariant?:
    | "default"
    | "defaultPeek"
    | "primary"
    | "secondary"
    | "tertiary"
    | "tertiaryDimmed"
    | "minimal";
  csSize?: "xs" | "s" | "m";
  icon: IconProp;
}

export type ButtonComponentProps =
  | ({ icon?: false } & ButtonProps)
  | ({ icon: IconProp } & IconButtonProps);

export const Button = React.forwardRef<HTMLButtonElement, ButtonComponentProps>(
  (props: ButtonComponentProps, forwardedRef) => {
    const { rootClasses, csTextStyles, icon, ...forwardedProps } = props;

    if (icon) {
      const {
        csVariant = "default",
        csColor = "purple",
        csSize = "m",
        ...fProps
      } = forwardedProps as IconButtonProps;

      return (
        <Actionable
          primitiveType="button"
          {...fProps}
          rootClasses={classnames(iconButtonStyles.iconButton, rootClasses)}
          csColor={csColor}
          csSize={csSize}
          csVariant={csVariant}
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
      csVariant = "default",
      csColor = "purple",
      csSize = "m",
      ...fProps
    } = forwardedProps as ButtonProps;

    // TODO: Turn into a proper resolver function
    // Same logic is in LinkButton too
    const fontStyles = (size: typeof csSize) => {
      if (size === "xs") {
        return ["fontSizeXS", "fontWeightBold", "lineHeightAuto"];
      } else if (size === "s") {
        return ["fontSizeS", "fontWeightBold", "lineHeightAuto"];
      } else {
        return ["fontSizeM", "fontWeightBold", "lineHeightAuto"];
      }
    };

    return (
      <Actionable
        primitiveType="button"
        {...fProps}
        rootClasses={classnames(
          ...(csTextStyles ? csTextStyles : fontStyles(csSize)),
          buttonStyles.button,
          rootClasses
        )}
        csColor={csColor}
        csSize={csSize}
        csVariant={csVariant}
        ref={forwardedRef}
      >
        {children}
      </Actionable>
    );
  }
);

Button.displayName = "Button";
