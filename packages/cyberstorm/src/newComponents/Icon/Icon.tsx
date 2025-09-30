import {
  Frame,
  type FrameIconProps,
} from "../../primitiveComponents/Frame/Frame";
import { memo } from "react";
import "./Icon.css";
import { classnames, componentClasses } from "../../utils/utils";
import { type IconVariants } from "@thunderstore/cyberstorm-theme/src/components";

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
