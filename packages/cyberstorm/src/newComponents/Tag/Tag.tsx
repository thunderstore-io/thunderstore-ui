import "./Tag.css";
import React from "react";
import { Frame, FrameWindowProps } from "../../primitiveComponents/Frame/Frame";
import { classnames, componentClasses } from "../../utils/utils";
import {
  TagModifiers,
  TagSizes,
  TagVariants,
} from "@thunderstore/cyberstorm-theme/src/components";

interface TagProps extends Omit<FrameWindowProps, "primitiveType"> {
  csVariant?: TagVariants;
  csSize?: TagSizes;
  csModifiers?: TagModifiers[];
}

export const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  (props: TagProps, forwardedRef) => {
    const {
      children,
      rootClasses,
      csVariant = "primary",
      csSize = "medium",
      csModifiers,
      ...forwardedProps
    } = props;
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
  }
);

Tag.displayName = "Tag";
