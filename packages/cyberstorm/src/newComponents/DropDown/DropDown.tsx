import { ReactNode, ReactElement } from "react";
import styles from "./DropDown.module.css";

import {
  Root,
  Trigger,
  Portal,
  Content,
  DropdownMenuItemProps,
  Item,
} from "@radix-ui/react-dropdown-menu";
import { Container } from "../Container/Container";
import { classnames } from "../../utils/utils";
import { PrimitiveComponentDefaultProps } from "../../primitiveComponents/utils/utils";

interface DropDownProps extends PrimitiveComponentDefaultProps {
  defaultOpen?: boolean;
  contentAlignment?: "start" | "center" | "end";
  trigger: ReactNode | ReactElement;
}

export function DropDown(props: DropDownProps) {
  const {
    children,
    rootClasses,
    csColor,
    csVariant,
    csSize,
    csTextStyles,
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
            styles.dropdown,
            ...(csTextStyles ? csTextStyles : []),
            rootClasses
          )}
          data-color={csColor}
          data-variant={csVariant}
          data-size={csSize}
        >
          {children}
        </Content>
      </Portal>
    </Root>
  );
}

interface DropDownItemProps
  extends PrimitiveComponentDefaultProps,
    DropdownMenuItemProps {}

export function DropDownItem(props: DropDownItemProps) {
  const {
    children,
    rootClasses,
    csTextStyles,
    csColor,
    csVariant,
    csSize,
    ...fProps
  } = props;

  return (
    <Item
      {...fProps}
      className={classnames(
        styles.dropdownItem,
        ...(csTextStyles ? csTextStyles : []),
        rootClasses
      )}
      data-color={csColor}
      data-variant={csVariant}
      data-size={csSize}
    >
      {children}
    </Item>
  );
}

export function DropDownDivider(props: PrimitiveComponentDefaultProps) {
  const { rootClasses, ...fProps } = props;
  return (
    <Container
      rootClasses={classnames(styles.divider, rootClasses)}
      {...fProps}
    />
  );
}

DropDown.displayName = "DropDown";
DropDownItem.displayName = "DropDownItem";
DropDownDivider.displayName = "DropDownDivider";
