import "./MetaItem.css";
import React from "react";
import { Frame, FrameWindowProps } from "../../primitiveComponents/Frame/Frame";
import { classnames, componentClasses } from "../../utils/utils";
import {
  MetaItemSizes,
  MetaItemVariants,
} from "@thunderstore/cyberstorm-theme/src/components";

interface MetaItemProps extends Omit<FrameWindowProps, "primitiveType"> {
  csVariant?: MetaItemVariants;
  csSize?: MetaItemSizes;
}

export const MetaItem = React.forwardRef<HTMLDivElement, MetaItemProps>(
  (props: MetaItemProps, forwardedRef) => {
    const {
      children,
      csVariant = "default",
      csSize = "16",
      rootClasses,
      ...forwardedProps
    } = props;

    return (
      <Frame
        {...forwardedProps}
        primitiveType={"window"}
        rootClasses={classnames(
          "meta-item",
          ...componentClasses("meta-item", csVariant, csSize),
          rootClasses
        )}
        ref={forwardedRef}
      >
        {children}
      </Frame>
    );
  }
);

MetaItem.displayName = "MetaItem";
