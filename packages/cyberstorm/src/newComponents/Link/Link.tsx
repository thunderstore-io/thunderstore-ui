import { memo } from "react";

import {
  Actionable,
  type ActionableCyberstormLinkProps,
  type ActionableLinkProps,
} from "../../primitiveComponents/Actionable/Actionable";
import { classnames } from "../../utils/utils";
import "./Link.css";
import { type LinkVariants } from "./Link.types";

export interface LinkProps extends ActionableLinkProps {
  csVariant?: LinkVariants;
}

export interface CyberstormLinkProps extends ActionableCyberstormLinkProps {
  csVariant?: LinkVariants;
}

export const Link = memo(function Link(props: LinkProps | CyberstormLinkProps) {
  const { children, rootClasses, csVariant, ...forwardedProps } = props;
  return (
    <Actionable
      {...forwardedProps}
      rootClasses={classnames(
        "link",
        csVariant === "primary" ? "link--variant--primary" : undefined,
        forwardedProps.disabled ? "link-disabled" : undefined,
        rootClasses
      )}
    >
      {children}
    </Actionable>
  );
});

Link.displayName = "Link";
