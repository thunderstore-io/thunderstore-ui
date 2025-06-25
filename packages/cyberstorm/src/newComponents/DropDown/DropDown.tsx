import "./DropDown.css";
import { ReactNode, ReactElement, memo } from "react";

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

export const DropDown = memo(function DropDown(props: DropDownProps) {
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
            "dropdown",
            ...componentClasses("dropdown", csVariant, csSize, csModifiers),
            rootClasses
          )}
        >
          {children}
        </Content>
      </Portal>
    </Root>
  );
});

interface DropDownItemProps
  extends PrimitiveComponentDefaultProps,
    DropdownMenuItemProps {
  csVariant?: DropDownItemVariants;
  csSize?: DropDownItemSizes;
  csModifiers?: DropDownItemModifiers[];
}

export const DropDownItem = memo(function DropDownItem(
  props: DropDownItemProps
) {
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
        "dropdown__item",
        ...componentClasses("dropdown__item", csVariant, csSize, csModifiers),
        rootClasses
      )}
      asChild
    >
      {children}
    </Item>
  );
});

interface DropDownDividerProps extends PrimitiveComponentDefaultProps {
  csVariant?: DropDownDividerVariants;
  csSize?: DropDownDividerSizes;
  csModifiers?: DropDownDividerModifiers[];
}

export const DropDownDivider = memo(function DropDownDivider(
  props: DropDownDividerProps
) {
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
        "dropdown__divider",
        ...componentClasses(
          "dropdown__divider",
          csVariant,
          csSize,
          csModifiers
        ),
        rootClasses
      )}
      {...fProps}
    />
  );
});

DropDown.displayName = "DropDown";
DropDownItem.displayName = "DropDownItem";
DropDownDivider.displayName = "DropDownDivider";
