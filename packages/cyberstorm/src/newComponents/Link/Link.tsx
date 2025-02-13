import "./Link.css";
import { LinkVariants } from "@thunderstore/cyberstorm-theme/src/components";
import {
  Actionable,
  ActionableCyberstormLinkProps,
  ActionableLinkProps,
} from "../../primitiveComponents/Actionable/Actionable";
import React from "react";
import { classnames } from "../../utils/utils";

interface LinkProps extends ActionableLinkProps {
  csVariant?: LinkVariants;
}

interface CyberstormLinkProps extends ActionableCyberstormLinkProps {
  csVariant?: LinkVariants;
}

export const Link = React.forwardRef<
  HTMLAnchorElement,
  LinkProps | CyberstormLinkProps
>((props: LinkProps | CyberstormLinkProps, forwardedRef) => {
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
      ref={forwardedRef}
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
