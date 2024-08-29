import {
  Actionable,
  ActionableCyberstormLinkProps,
  ActionableLinkProps,
} from "../../../primitiveComponents/Actionable/Actionable";
import styles from "./Link.module.css";
import React from "react";
import { classnames } from "../../../utils/utils";

export const Link = React.forwardRef<
  HTMLAnchorElement,
  ActionableLinkProps | ActionableCyberstormLinkProps
>(
  (
    props: ActionableLinkProps | ActionableCyberstormLinkProps,
    forwardedRef
  ) => {
    const { children, rootClasses, csMode, csVariant, ...forwardedProps } =
      props;
    return (
      <Actionable
        {...forwardedProps}
        csVariant={csVariant ?? "accent"}
        csMode={csMode ?? "auto"}
        rootClasses={classnames(styles.link, rootClasses)}
        ref={forwardedRef}
      >
        {children}
      </Actionable>
    );
  }
);

Link.displayName = "Link";
