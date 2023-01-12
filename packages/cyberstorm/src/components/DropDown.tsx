import React, { ReactNode } from "react";
import styles from "./componentStyles/DropDown.module.css";

import * as RadixDropDown from "@radix-ui/react-dropdown-menu";
import { SelectItemProps } from "./SelectItem";

type DropDownProps = {
  colorScheme?: "default" | "defaultDark" | "primary";
  defaultOpen?: boolean;
  content?: ReactNode[];
  trigger: ReactNode;
};

export const DropDown: React.FC<DropDownProps> = (props) => {
  const { colorScheme, defaultOpen, content, trigger } = props;

  return (
    <div className={styles.root}>
      <RadixDropDown.Root defaultOpen={defaultOpen}>
        <RadixDropDown.Trigger asChild>
          <div>
            {React.isValidElement(trigger)
              ? React.cloneElement(trigger, props)
              : trigger}
          </div>
        </RadixDropDown.Trigger>

        <RadixDropDown.Portal>
          <RadixDropDown.Content
            align="start"
            sideOffset={8}
            className={`${styles.content} ${getContentStyle(colorScheme)}`}
          >
            {parseContent(content, colorScheme)}
          </RadixDropDown.Content>
        </RadixDropDown.Portal>
      </RadixDropDown.Root>
    </div>
  );
};

DropDown.defaultProps = {
  defaultOpen: false,
  colorScheme: "default",
};

const parseContent = (
  content: ReactNode[] | undefined,
  colorScheme: "default" | "defaultDark" | "primary" | undefined
) => {
  const props = { colorScheme } as SelectItemProps;
  return content?.map((item, index) => (
    <RadixDropDown.Item key={index} asChild>
      <div>
        {React.isValidElement(item) ? React.cloneElement(item, props) : item}
      </div>
    </RadixDropDown.Item>
  ));
};

const getContentStyle = (scheme: DropDownProps["colorScheme"] = "default") => {
  return {
    default: styles.content__default,
    defaultDark: styles.content__defaultDark,
    primary: styles.content__primary,
  }[scheme];
};
