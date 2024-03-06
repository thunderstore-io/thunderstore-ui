"use client";
import { ReactNode, ReactElement } from "react";
import styles from "./DropDown.module.css";

import * as RadixDropDown from "@radix-ui/react-dropdown-menu";

type DropDownProps = {
  colorScheme?: "default" | "accent";
  defaultOpen?: boolean;
  content?: ReactElement[];
  contentAlignment?: "start" | "center" | "end";
  trigger: ReactNode | ReactElement;
};
type DropDownItemProps = {
  content?: ReactElement;
};

export function DropDown(props: DropDownProps) {
  const {
    defaultOpen = false,
    content = null,
    contentAlignment = "start",
    trigger,
  } = props;

  return (
    <div className={styles.root}>
      <RadixDropDown.Root modal={false} defaultOpen={defaultOpen}>
        <RadixDropDown.Trigger asChild disabled={!content}>
          {trigger}
        </RadixDropDown.Trigger>

        <RadixDropDown.Portal>
          <RadixDropDown.Content
            align={contentAlignment}
            sideOffset={8}
            className={styles.content}
          >
            {content}
          </RadixDropDown.Content>
        </RadixDropDown.Portal>
      </RadixDropDown.Root>
    </div>
  );
}

export function DropDownItem(props: DropDownItemProps) {
  const { content = null } = props;

  return (
    <RadixDropDown.Item className={styles.itemWrapper}>
      {content}
    </RadixDropDown.Item>
  );
}

export function DropDownDivider() {
  return <div className={styles.divider} />;
}

DropDown.displayName = "DropDown";
DropDownItem.displayName = "DropDownItem";
DropDownDivider.displayName = "DropDownDivider";
