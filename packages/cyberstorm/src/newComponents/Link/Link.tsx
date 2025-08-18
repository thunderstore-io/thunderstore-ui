import "./Link.css";
import { LinkVariants } from "@thunderstore/cyberstorm-theme/src/components";
import {
  Actionable,
  ActionableCyberstormLinkProps,
  ActionableLinkProps,
} from "../../primitiveComponents/Actionable/Actionable";
import { memo } from "react";
import { classnames } from "../../utils/utils";

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
        csVariant === "primary"
          ? "link link--variant--primary"
          : csVariant === "cyber"
            ? "link link--variant--cyber"
            : "link",
        forwardedProps.disabled ? "link-disabled" : undefined,
        rootClasses
      )}
    >
      {forwardedProps.disabled ? (
        <s className="link-strikethrough">{children}</s>
      ) : (
        children
      )}
    </Actionable>
  );
});

Link.displayName = "Link";
