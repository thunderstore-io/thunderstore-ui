import "./Tabs.css";
import React, { memo, ReactElement } from "react";
import { Frame, FrameWindowProps } from "../../primitiveComponents/Frame/Frame";
import { classnames, componentClasses } from "../../utils/utils";
import {
  TabsSizes,
  TabsVariants,
} from "@thunderstore/cyberstorm-theme/src/components";
import { NewLink } from "../..";

interface TabsProps<IP extends { rootClasses?: string }>
  extends Omit<FrameWindowProps, "primitiveType" | "children"> {
  csVariant?: TabsVariants;
  csSize?: TabsSizes;
  tabItems: {
    itemProps: IP;
    current: boolean;
    numberSlateValue?: number;
    disabled?: boolean;
    tabItemNumberSlateRootClasses?: string;
    key: string;
  }[];
  renderTabItem: (
    key: string,
    itemProps: IP,
    numberSlate?: ReactElement
  ) => ReturnType<typeof NewLink>;
  ref?: React.Ref<HTMLDivElement>;
}

export const Tabs = memo(function Tabs<IP extends { rootClasses?: string }>(
  props: TabsProps<IP>
) {
  const {
    csVariant = "default",
    csSize = "medium",
    rootClasses,
    tabItems,
    renderTabItem,
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
      {tabItems.map((item) => {
        const tabsClasses = classnames(
          "tabs__item",
          ...componentClasses("tabs__item", csVariant, csSize),
          item.current ? "tabs__item--current" : undefined
        );
        if (item.itemProps.rootClasses) {
          item.itemProps.rootClasses += tabsClasses;
        } else {
          item.itemProps.rootClasses = tabsClasses;
        }
        return renderTabItem(
          item.key,
          item.itemProps,
          item.numberSlateValue ? (
            <div
              className={classnames(
                "tabs__number-slate",
                ...componentClasses("tabs__number-slate", csVariant, csSize),
                item.current ? "tabs__item--current" : undefined,
                item.tabItemNumberSlateRootClasses
              )}
            >
              {item.numberSlateValue}
            </div>
          ) : undefined
        );
      })}
    </Frame>
  );
});

Tabs.displayName = "Tabs";
