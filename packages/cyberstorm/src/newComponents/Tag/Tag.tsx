import "./Tag.css";
import React from "react";
import { Frame, FrameWindowProps } from "../../primitiveComponents/Frame/Frame";
import { classnames, componentClasses } from "../../utils/utils";
import {
  TagModifiers,
  TagSizes,
  TagVariants,
} from "@thunderstore/cyberstorm-theme/src/components";
import {
  Actionable,
  ActionableButtonProps,
  ActionableLinkProps,
} from "../../primitiveComponents/Actionable/Actionable";

interface TagProps
  extends Omit<
    FrameWindowProps | ActionableButtonProps | ActionableLinkProps,
    "primitiveType"
  > {
  csMode?: "tag" | "button" | "link";
  href?: string;
  csVariant?: TagVariants;
  csSize?: TagSizes;
  csModifiers?: TagModifiers[];
}

export const Tag = React.forwardRef<
  HTMLDivElement | HTMLButtonElement | HTMLAnchorElement,
  TagProps
>((props: TagProps, forwardedRef) => {
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
          "ts-tag",
          ...componentClasses(csVariant, csSize, csModifiers),
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
          "ts-tag",
          ...componentClasses(csVariant, csSize, csModifiers),
          rootClasses
        )}
        ref={fRef}
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
        "ts-tag",
        ...componentClasses(csVariant, csSize, csModifiers),
        rootClasses
      )}
      ref={forwardedRef}
    >
      {children}
    </Frame>
  );
});

Tag.displayName = "Tag";
