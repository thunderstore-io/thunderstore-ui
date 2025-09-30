import "./Tabs.css";
import { memo } from "react";
import {
  Frame,
  type FrameWindowProps,
} from "../../primitiveComponents/Frame/Frame";
import { classnames, componentClasses } from "../../utils/utils";
import {
  type TabsSizes,
  type TabsVariants,
} from "@thunderstore/cyberstorm-theme/src/components";

interface TabsProps extends Omit<FrameWindowProps, "primitiveType"> {
  csVariant?: TabsVariants;
  csSize?: TabsSizes;
}

export const Tabs = memo(function Tabs(props: TabsProps) {
  const {
    csVariant = "default",
    csSize = "medium",
    rootClasses,
    children,
    ...forwardedProps
  } = props;

  return (
    <Frame
      {...forwardedProps}
      primitiveType={"window"}
      rootClasses={classnames(
        "tabs",
        ...componentClasses("tabs", csVariant, csSize),
        rootClasses
      )}
    >
      {children}
    </Frame>
  );
});

Tabs.displayName = "Tabs";
