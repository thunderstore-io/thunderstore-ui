import React, { ReactNode } from "react";
import styles from "./componentStyles/DropDown.module.css";

import * as RadixDropDown from "@radix-ui/react-dropdown-menu";

type DropDownProps = {
  colorScheme?: "default" | "defaultDark" | "primary";
  defaultOpen?: boolean;
  content?: ReactNode[];
  trigger: ReactNode;
  triggerColorScheme?: "default" | "defaultDark" | "primary";
};

export const DropDown: React.FC<DropDownProps> = (props) => {
  const { colorScheme, defaultOpen, content, trigger, triggerColorScheme } =
    props;

  return (
    <div className={styles.root}>
      <RadixDropDown.Root defaultOpen={defaultOpen}>
        <RadixDropDown.Trigger asChild disabled={!content}>
          {React.isValidElement(trigger)
            ? React.cloneElement(trigger, {
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
};

DropDown.displayName = "DropDown";
DropDown.defaultProps = {
  defaultOpen: false,
  colorScheme: "default",
};

const parseContent = (content: ReactNode[] | undefined) => {
  return content?.map((item, index) => (
    <RadixDropDown.Item className={styles.itemWrapper} key={index}>
      {React.isValidElement(item) ? React.cloneElement(item) : item}
    </RadixDropDown.Item>
  ));
};
