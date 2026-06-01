import React, { memo } from "react";

import { type IconVariants } from "@thunderstore/cyberstorm-theme";

import {
  Frame,
  type FrameIconProps,
} from "../../primitiveComponents/Frame/Frame";
import { classnames, componentClasses } from "../../utils/utils";
import "./Icon.css";

interface IconProps extends Omit<FrameIconProps, "primitiveType"> {
  csVariant?: IconVariants;
  csWidth?: string;
  csHeight?: string;
}

export const Icon = memo(function Icon(props: IconProps) {
  const {
    rootClasses,
    csVariant,
    csWidth,
    csHeight,
    style,
    ...forwardedProps
  } = props;

  const cssVars = {
    ...(csWidth ? { "--icon-width": csWidth } : {}),
    ...(csHeight ? { "--icon-height": csHeight } : {}),
  } as React.CSSProperties;

  const isFixed = Boolean(csWidth) || Boolean(csHeight);

  return (
    <Frame
      primitiveType="icon"
      {...forwardedProps}
      style={{ ...style, ...cssVars }}
      wrapperClasses={classnames(
        props.noWrapper ? undefined : props.wrapperClasses
      )}
      rootClasses={classnames(
        ...componentClasses("icon", csVariant, undefined, undefined),
        isFixed ? "icon--fixed" : null,
        props.noWrapper ? rootClasses : undefined
      )}
    />
  );
});

Icon.displayName = "Icon";
