import {
  Actionable,
  ActionableCyberstormLinkProps,
  ActionableLinkProps,
} from "../../../primitiveComponents/Actionable/Actionable";
import React from "react";
import { classnames, componentClasses } from "../../../utils/utils";
import {
  ButtonVariants,
  ButtonSizes,
  ButtonModifiers,
} from "@thunderstore/cyberstorm-theme/src/components";

interface LinkButtonProps extends ActionableLinkProps {
  csVariant?: ButtonVariants;
  csSize?: ButtonSizes;
  csModifiers?: ButtonModifiers[];
}

interface CyberstormLinkButtonProps extends ActionableCyberstormLinkProps {
  csVariant?: ButtonVariants;
  csSize?: ButtonSizes;
  csModifiers?: ButtonModifiers[];
}

// TODO: Add style support for disabled
export const LinkButton = React.forwardRef<
  HTMLAnchorElement,
  LinkButtonProps | CyberstormLinkButtonProps
>((props: LinkButtonProps | CyberstormLinkButtonProps, forwardedRef) => {
  const {
    children,
    rootClasses,
    csVariant = "primary",
    csSize = "meedium",
    csModifiers,
    ...forwardedProps
  } = props;

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

LinkButton.displayName = "LinkButton";
