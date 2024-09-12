import {
  Actionable,
  ActionableCyberstormLinkProps,
  ActionableLinkProps,
} from "../../../primitiveComponents/Actionable/Actionable";
import styles from "../../../sharedVariantStyles/ButtonStyles/Button.module.css";
import React from "react";
import { classnames } from "../../../utils/utils";

export const LinkButton = React.forwardRef<
  HTMLAnchorElement,
  ActionableLinkProps | ActionableCyberstormLinkProps
>(
  (
    props: ActionableLinkProps | ActionableCyberstormLinkProps,
    forwardedRef
  ) => {
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
  }
);

LinkButton.displayName = "LinkButton";
