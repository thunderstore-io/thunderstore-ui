import {
  Content,
  type DropdownMenuItemProps,
  type DropdownMenuSubContentProps,
  type DropdownMenuSubTriggerProps,
  Item,
  Portal,
  Root,
  Sub,
  SubContent,
  SubTrigger,
  Trigger,
} from "@radix-ui/react-dropdown-menu";
import { type ReactElement, type ReactNode, memo, useContext } from "react";

import { type PrimitiveComponentDefaultProps } from "../../primitiveComponents/utils/utils";
import { TopLayerContainerContext } from "../../utils/TopLayerContainerContext";
import { classnames, componentClasses } from "../../utils/utils";
import "./DropDown.css";
import {
  type DropDownDividerModifiers,
  type DropDownItemModifiers,
  type DropDownItemVariants,
  type DropDownModifiers,
  type DropDownVariants,
} from "./DropDown.types";

interface DropDownProps extends PrimitiveComponentDefaultProps {
  /** Controlled open state. Use this only when the menu absolutely needs to stay open. */
  open?: boolean;
  /** Uncontrolled initial state. A later focus outside the menu closes it. */
  defaultOpen?: boolean;
  contentAlignment?: "start" | "center" | "end";
  trigger: ReactNode | ReactElement;
  /** Disables the trigger so the menu cannot open. */
  disabled?: boolean;
  csVariant?: DropDownVariants;
  csModifiers?: DropDownModifiers[];
}

export const DropDown = memo(function DropDown(props: DropDownProps) {
  const {
    children,
    rootClasses,
    csVariant = "primary",
    csModifiers,
    disabled = false,
    open,
    defaultOpen = false,
    contentAlignment = "start",
    trigger,
  } = props;

  const container = useContext(TopLayerContainerContext);

  return (
    <Root modal={false} open={open} defaultOpen={defaultOpen}>
      <Trigger asChild disabled={disabled || !children}>
        {trigger}
      </Trigger>

      <Portal container={container ?? undefined}>
        <Content
          align={contentAlignment}
          sideOffset={8}
          collisionPadding={8}
          className={classnames(
            "dropdown",
            ...componentClasses("dropdown", csVariant, undefined, csModifiers),
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
  csModifiers?: DropDownItemModifiers[];
}

export const DropDownItem = memo(function DropDownItem(
  props: DropDownItemProps
) {
  const {
    children,
    rootClasses,
    csVariant = "primary",
    csModifiers,
    ...fProps
  } = props;

  return (
    <Item
      {...fProps}
      disabled={csVariant === "disabled" || fProps.disabled}
      className={classnames(
        "dropdown__item",
        ...componentClasses(
          "dropdown__item",
          csVariant,
          undefined,
          csModifiers
        ),
        rootClasses
      )}
      asChild
    >
      {children}
    </Item>
  );
});

interface DropDownDividerProps extends PrimitiveComponentDefaultProps {
  csModifiers?: DropDownDividerModifiers[];
}

export const DropDownDivider = memo(function DropDownDivider(
  props: DropDownDividerProps
) {
  const { rootClasses, csModifiers, ...fProps } = props;
  return (
    <div
      className={classnames(
        "dropdown__divider",
        ...componentClasses(
          "dropdown__divider",
          undefined,
          undefined,
          csModifiers
        ),
        rootClasses
      )}
      {...fProps}
    />
  );
});

export const DropDownSub = Sub;

interface DropDownSubTriggerProps
  extends PrimitiveComponentDefaultProps,
    DropdownMenuSubTriggerProps {
  csVariant?: DropDownItemVariants;
  csModifiers?: DropDownItemModifiers[];
}

export const DropDownSubTrigger = memo(function DropDownSubTrigger(
  props: DropDownSubTriggerProps
) {
  const {
    children,
    rootClasses,
    csVariant = "primary",
    csModifiers,
    ...fProps
  } = props;

  return (
    <SubTrigger
      {...fProps}
      disabled={csVariant === "disabled" || fProps.disabled}
      className={classnames(
        "dropdown__item",
        ...componentClasses(
          "dropdown__item",
          csVariant,
          undefined,
          csModifiers
        ),
        rootClasses
      )}
    >
      {children}
    </SubTrigger>
  );
});

interface DropDownSubContentProps
  extends PrimitiveComponentDefaultProps,
    DropdownMenuSubContentProps {
  csVariant?: DropDownVariants;
  csModifiers?: DropDownModifiers[];
}

export const DropDownSubContent = memo(function DropDownSubContent(
  props: DropDownSubContentProps
) {
  const {
    children,
    rootClasses,
    csVariant = "primary",
    csModifiers,
    ...fProps
  } = props;

  const container = useContext(TopLayerContainerContext);

  return (
    <Portal container={container ?? undefined}>
      <SubContent
        {...fProps}
        sideOffset={8}
        collisionPadding={8}
        className={classnames(
          "dropdown",
          ...componentClasses("dropdown", csVariant, undefined, csModifiers),
          rootClasses
        )}
      >
        {children}
      </SubContent>
    </Portal>
  );
});

DropDown.displayName = "DropDown";
DropDownSub.displayName = "DropDownSub";
DropDownSubTrigger.displayName = "DropDownSubTrigger";
DropDownSubContent.displayName = "DropDownSubContent";
DropDownItem.displayName = "DropDownItem";
DropDownDivider.displayName = "DropDownDivider";
