import { memo } from "react";

import {
  Frame,
  type FrameWindowProps,
} from "../../primitiveComponents/Frame/Frame";
import { classnames, componentClasses } from "../../utils/utils";
import "./Tabs.css";
import { type TabsVariants } from "./Tabs.types";

interface TabsProps extends Omit<FrameWindowProps, "primitiveType"> {
  csVariant?: TabsVariants;
}

export const Tabs = memo(function Tabs(props: TabsProps) {
  const {
    csVariant = "default",
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
        ...componentClasses("tabs", csVariant),
        rootClasses
      )}
    >
      {children}
    </Frame>
  );
});

Tabs.displayName = "Tabs";
