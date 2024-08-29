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
      ...forwardedProps
    } = props;
    return (
      <Actionable
        {...forwardedProps}
        rootClasses={classnames(styles.button, rootClasses)}
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
