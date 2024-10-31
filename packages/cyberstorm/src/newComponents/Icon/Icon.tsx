import { Frame, FrameIconProps } from "../../primitiveComponents/Frame/Frame";
import React from "react";
import "./Icon.css";
import { classnames, componentClasses } from "../../utils/utils";
import { IconVariants } from "@thunderstore/cyberstorm-theme/src/components";

interface IconProps extends Omit<FrameIconProps, "primitiveType"> {
  csVariant?: IconVariants;
}

export const Icon = React.forwardRef<
  HTMLDivElement | HTMLSpanElement | SVGElement,
  IconProps
>((props: IconProps, forwardedRef) => {
  const { rootClasses, csVariant, ...forwardedProps } = props;
  return (
    <Frame
      primitiveType="icon"
      {...forwardedProps}
      ref={forwardedRef}
      rootClasses={classnames(
        ...componentClasses(csVariant, undefined, undefined),
        rootClasses
      )}
    />
  );
});

Icon.displayName = "Icon";
