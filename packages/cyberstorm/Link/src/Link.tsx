import "./Link.css";
import { type LinkVariants } from "@thunderstore/cyberstorm-theme/src/components";
import {
  Actionable,
  type ActionableCyberstormLinkProps,
  type ActionableLinkProps,
} from "@thunderstore/cyberstorm-actionable";
import { memo } from "react";
import { classnames } from "@thunderstore/cyberstorm-utils";

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
