"use client";
import React, { ReactNode, ReactElement } from "react";
import styles from "./DropDown.module.css";

import * as RadixDropDown from "@radix-ui/react-dropdown-menu";

type DropDownProps = {
  colorScheme?: "default" | "primary";
  defaultOpen?: boolean;
  content?: ReactNode[];
  trigger: ReactNode | ReactElement;
  triggerColorScheme?: "default" | "primary" | "transparentDefault";
};

export function DropDown(props: DropDownProps) {
  const {
    colorScheme = "default",
    defaultOpen = false,
    content,
    trigger,
    triggerColorScheme,
  } = props;

  return (
    <div className={styles.root}>
      <RadixDropDown.Root defaultOpen={defaultOpen}>
        <RadixDropDown.Trigger asChild disabled={!content}>
          {React.isValidElement(trigger)
            ? React.cloneElement(trigger as ReactElement, {
                colorScheme: triggerColorScheme ?? colorScheme,
              })
            : trigger}
        </RadixDropDown.Trigger>

        <RadixDropDown.Portal>
          <RadixDropDown.Content
            align="start"
            sideOffset={8}
            className={`${styles.content}`}
          >
            {parseContent(content)}
          </RadixDropDown.Content>
        </RadixDropDown.Portal>
      </RadixDropDown.Root>
    </div>
  );
}

DropDown.displayName = "DropDown";

const parseContent = (content: ReactNode[] | undefined) => {
  return content?.map((item, index) => (
    <RadixDropDown.Item className={styles.itemWrapper} key={index}>
      {React.isValidElement(item) ? React.cloneElement(item) : item}
    </RadixDropDown.Item>
  ));
};
