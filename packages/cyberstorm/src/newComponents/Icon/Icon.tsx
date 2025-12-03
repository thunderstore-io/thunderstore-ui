import { memo } from "react";

import { type IconVariants } from "@thunderstore/cyberstorm-theme";

import {
  Frame,
  type FrameIconProps,
} from "../../primitiveComponents/Frame/Frame";
import { classnames, componentClasses } from "../../utils/utils";
import "./Icon.css";

interface IconProps extends Omit<FrameIconProps, "primitiveType"> {
  csVariant?: IconVariants;
}

export const Icon = memo(function Icon(props: IconProps) {
  const { rootClasses, csVariant, ...forwardedProps } = props;
  return (
    <Frame
      primitiveType="icon"
      {...forwardedProps}
      wrapperClasses={classnames(
        props.noWrapper ? undefined : props.wrapperClasses
      )}
      rootClasses={classnames(
        ...componentClasses("icon", csVariant, undefined, undefined),
        props.noWrapper ? rootClasses : undefined
      )}
    />
  );
});

Icon.displayName = "Icon";
