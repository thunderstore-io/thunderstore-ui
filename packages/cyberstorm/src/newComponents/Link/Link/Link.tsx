import {
  Actionable,
  ActionableCyberstormLinkProps,
  ActionableLinkProps,
} from "../../../primitiveComponents/Actionable/Actionable";
import React from "react";

export const Link = React.forwardRef<
  HTMLAnchorElement,
  ActionableLinkProps | ActionableCyberstormLinkProps
>(
  (
    props: ActionableLinkProps | ActionableCyberstormLinkProps,
    forwardedRef
  ) => {
    const { children, rootClasses, ...forwardedProps } = props;
    return (
      <Actionable
        {...forwardedProps}
        rootClasses={rootClasses}
        ref={forwardedRef}
      >
        {children}
      </Actionable>
    );
  }
);

Link.displayName = "Link";
