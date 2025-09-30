import "./MetaItem.css";
import React from "react";
import {
  Frame,
  type FrameWindowProps,
} from "../../primitiveComponents/Frame/Frame";
import { classnames, componentClasses } from "../../utils/utils";
import {
  type MetaItemSizes,
  type MetaItemVariants,
} from "@thunderstore/cyberstorm-theme/src/components";
import {
  Actionable,
  type ActionableButtonProps,
} from "../../primitiveComponents/Actionable/Actionable";

interface MetaItemProps extends Omit<FrameWindowProps, "primitiveType"> {
  csVariant?: MetaItemVariants;
  csSize?: MetaItemSizes;
  primitiveType?: "metaItem";
}

interface MetaItemActionableProps
  extends Omit<ActionableButtonProps, "primitiveType"> {
  csVariant?: MetaItemVariants;
  csSize?: MetaItemSizes;
  primitiveType?: "metaItemActionable";
}

export const MetaItem = React.forwardRef<
  HTMLDivElement | HTMLButtonElement,
  MetaItemProps | MetaItemActionableProps
>((props: MetaItemProps | MetaItemActionableProps, forwardedRef) => {
  const {
    children,
    csVariant = "default",
    csSize = "16",
    rootClasses,
    primitiveType = "metaItem",
    ...forwardedProps
  } = props;

  if (primitiveType === "metaItemActionable") {
    const fRef = forwardedRef as React.ForwardedRef<HTMLButtonElement>;
    const fProps = forwardedProps as MetaItemActionableProps;
    return (
      <Actionable
        {...fProps}
        primitiveType={"button"}
        rootClasses={classnames(
          "meta-item",
          ...componentClasses("meta-item", csVariant, csSize),
          rootClasses
        )}
        ref={fRef}
      >
        {children}
      </Actionable>
    );
  }
  const fRef = forwardedRef as React.ForwardedRef<HTMLDivElement>;
  const fProps = forwardedProps as MetaItemProps;
  return (
    <Frame
      {...fProps}
      primitiveType={"window"}
      rootClasses={classnames(
        "meta-item",
        ...componentClasses("meta-item", csVariant, csSize),
        rootClasses
      )}
      ref={fRef}
    >
      {children}
    </Frame>
  );
});

MetaItem.displayName = "MetaItem";
