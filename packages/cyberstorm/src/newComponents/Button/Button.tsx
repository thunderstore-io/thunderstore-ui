import styles from "../../sharedComponentStyles/ButtonStyles/Button.module.css";
import React from "react";
import { classnames } from "../../utils/utils";
import {
  ActionableButtonProps,
  Actionable,
} from "../../primitiveComponents/Actionable/Actionable";

export const Button = React.forwardRef<
  HTMLButtonElement,
  Omit<ActionableButtonProps, "primitiveType">
>((props: Omit<ActionableButtonProps, "primitiveType">, forwardedRef) => {
  const {
    children,
    rootClasses,
    csVariant = "default",
    csColor = "purple",
    csSize = "m",
    csTextStyles,
    ...forwardedProps
  } = props;

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
      {...forwardedProps}
      rootClasses={classnames(
        ...(csTextStyles ? csTextStyles : fontStyles(csSize)),
        styles.button,
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
});

Button.displayName = "Button";
