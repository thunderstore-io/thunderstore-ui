import "./DropDown.css";
import { ReactNode, ReactElement } from "react";
// import styles from "./DropDown.module.css";

import {
  Root,
  Trigger,
  Portal,
  Content,
  DropdownMenuItemProps,
  Item,
} from "@radix-ui/react-dropdown-menu";
import { classnames, componentClasses } from "../../utils/utils";
import { PrimitiveComponentDefaultProps } from "../../primitiveComponents/utils/utils";
import {
  DropDownVariants,
  DropDownSizes,
  DropDownModifiers,
  DropDownItemModifiers,
  DropDownItemSizes,
  DropDownItemVariants,
  DropDownDividerModifiers,
  DropDownDividerSizes,
  DropDownDividerVariants,
} from "@thunderstore/cyberstorm-theme/src/components";

interface DropDownProps extends PrimitiveComponentDefaultProps {
  defaultOpen?: boolean;
  contentAlignment?: "start" | "center" | "end";
  trigger: ReactNode | ReactElement;
  csVariant?: DropDownVariants;
  csSize?: DropDownSizes;
  csModifiers?: DropDownModifiers[];
}

export function DropDown(props: DropDownProps) {
  const {
    children,
    rootClasses,
    csVariant = "primary",
    csSize = "medium",
    csModifiers,
    defaultOpen = false,
    contentAlignment = "start",
    trigger,
  } = props;

  return (
    <Root modal={false} defaultOpen={defaultOpen}>
      <Trigger asChild disabled={!children}>
        {trigger}
      </Trigger>

      <Portal>
        <Content
          align={contentAlignment}
          sideOffset={8}
          className={classnames(
            "ts-dropdown",
            ...componentClasses(csVariant, csSize, csModifiers),
            rootClasses
          )}
        >
          {children}
        </Content>
      </Portal>
    </Root>
  );
}

interface DropDownItemProps
  extends PrimitiveComponentDefaultProps,
    DropdownMenuItemProps {
  csVariant?: DropDownItemVariants;
  csSize?: DropDownItemSizes;
  csModifiers?: DropDownItemModifiers[];
}

export function DropDownItem(props: DropDownItemProps) {
  const {
    children,
    rootClasses,
    csVariant = "primary",
    csSize = "medium",
    csModifiers,
    ...fProps
  } = props;

  return (
    <Item
      {...fProps}
      className={classnames(
        "ts-dropdown__item",
        ...componentClasses(csVariant, csSize, csModifiers),
        rootClasses
      )}
    >
      {children}
    </Item>
  );
}

interface DropDownDividerProps extends PrimitiveComponentDefaultProps {
  csVariant?: DropDownDividerVariants;
  csSize?: DropDownDividerSizes;
  csModifiers?: DropDownDividerModifiers[];
}

export function DropDownDivider(props: DropDownDividerProps) {
  const {
    rootClasses,
    csVariant = "primary",
    csSize = "medium",
    csModifiers,
    ...fProps
  } = props;
  return (
    <div
      className={classnames(
        "ts-dropdown__divider",
        ...componentClasses(csVariant, csSize, csModifiers),
        rootClasses
      )}
      {...fProps}
    />
  );
}

DropDown.displayName = "DropDown";
DropDownItem.displayName = "DropDownItem";
DropDownDivider.displayName = "DropDownDivider";
