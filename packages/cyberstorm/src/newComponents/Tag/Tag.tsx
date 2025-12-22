import React from "react";

import {
  type TagModifiers,
  type TagSizes,
  type TagVariants,
} from "@thunderstore/cyberstorm-theme/src/components";

import {
  Actionable,
  type ActionableButtonProps,
  type ActionableCyberstormLinkProps,
  type ActionableLinkProps,
} from "../../primitiveComponents/Actionable/Actionable";
import {
  Frame,
  type FrameWindowProps,
} from "../../primitiveComponents/Frame/Frame";
import { classnames, componentClasses } from "../../utils/utils";
import "./Tag.css";

interface TagProps extends Omit<FrameWindowProps, "primitiveType"> {
  csMode?: "tag";
  csVariant?: TagVariants;
  csSize?: TagSizes;
  csModifiers?: TagModifiers[];
}

interface TagButtonProps extends Omit<ActionableButtonProps, "primitiveType"> {
  csMode: "button";
  href?: string;
  csVariant?: TagVariants;
  csSize?: TagSizes;
  csModifiers?: TagModifiers[];
}

interface TagLinkProps extends Omit<ActionableLinkProps, "primitiveType"> {
  csMode: "link";
  csVariant?: TagVariants;
  csSize?: TagSizes;
  csModifiers?: TagModifiers[];
}

interface TagCyberstormLinkProps
  extends Omit<ActionableCyberstormLinkProps, "primitiveType"> {
  csMode: "cyberstormLink";
  csVariant?: TagVariants;
  csSize?: TagSizes;
  csModifiers?: TagModifiers[];
}

export const Tag = React.forwardRef<
  HTMLDivElement | HTMLButtonElement | HTMLAnchorElement,
  TagProps | TagButtonProps | TagLinkProps | TagCyberstormLinkProps
>(
  (
    props: TagProps | TagButtonProps | TagLinkProps | TagCyberstormLinkProps,
    forwardedRef
  ) => {
    const {
      csMode = "tag",
      children,
      rootClasses,
      csVariant = "primary",
      csSize = "medium",
      csModifiers,
      ...forwardedProps
    } = props;

    if (csMode === "button") {
      const fProps = forwardedProps as ActionableButtonProps;
      const fRef = forwardedRef as React.ForwardedRef<HTMLButtonElement>;
      return (
        <Actionable
          {...fProps}
          primitiveType={"button"}
          rootClasses={classnames(
            "tag",
            ...componentClasses("tag", csVariant, csSize, csModifiers),
            rootClasses
          )}
          ref={fRef}
        >
          {children}
        </Actionable>
      );
    }

    if (csMode === "link") {
      const fProps = forwardedProps as ActionableLinkProps;
      const fRef = forwardedRef as React.ForwardedRef<HTMLAnchorElement>;
      return (
        <Actionable
          {...fProps}
          primitiveType={"link"}
          rootClasses={classnames(
            "tag",
            ...componentClasses("tag", csVariant, csSize, csModifiers),
            rootClasses
          )}
          ref={fRef}
        >
          {children}
        </Actionable>
      );
    }

    if (csMode === "cyberstormLink") {
      const fProps = forwardedProps as ActionableCyberstormLinkProps;
      return (
        <Actionable
          {...fProps}
          primitiveType={"cyberstormLink"}
          rootClasses={classnames(
            "tag",
            ...componentClasses("tag", csVariant, csSize, csModifiers),
            rootClasses
          )}
          ref={forwardedRef as React.ForwardedRef<HTMLAnchorElement>}
        >
          {children}
        </Actionable>
      );
    }

    const fProps = forwardedProps as FrameWindowProps;
    return (
      <Frame
        {...fProps}
        primitiveType={"window"}
        rootClasses={classnames(
          "tag",
          ...componentClasses("tag", csVariant, csSize, csModifiers),
          rootClasses
        )}
        ref={forwardedRef as React.ForwardedRef<HTMLDivElement>}
      >
        {children}
      </Frame>
    );
  }
);

Tag.displayName = "Tag";
