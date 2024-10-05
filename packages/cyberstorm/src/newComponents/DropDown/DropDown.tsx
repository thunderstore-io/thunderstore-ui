import { ReactNode, ReactElement } from "react";
import styles from "./DropDown.module.css";

import * as RadixDropDown from "@radix-ui/react-dropdown-menu";
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
    <RadixDropDown.Root modal={false} defaultOpen={defaultOpen}>
      <RadixDropDown.Trigger asChild disabled={!children}>
        {trigger}
      </RadixDropDown.Trigger>

      <RadixDropDown.Portal>
        <RadixDropDown.Content
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
        </RadixDropDown.Content>
      </RadixDropDown.Portal>
    </RadixDropDown.Root>
  );
}

export function DropDownItem(props: PrimitiveComponentDefaultProps) {
  const { children, rootClasses, csTextStyles, csColor, csVariant, csSize } =
    props;

  return (
    <RadixDropDown.Item
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
    </RadixDropDown.Item>
  );
}

export function DropDownDivider() {
  return <Container rootClasses={styles.divider} />;
}

DropDown.displayName = "DropDown";
DropDownItem.displayName = "DropDownItem";
DropDownDivider.displayName = "DropDownDivider";
