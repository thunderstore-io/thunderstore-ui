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

export const DropDown: React.FC<DropDownProps> = React.forwardRef(
  (props, ref) => {
    const { colorScheme, defaultOpen, content, trigger } = props;

    return (
      <div className={styles.root} {...props} ref={ref}>
        <RadixDropDown.Root defaultOpen={defaultOpen}>
          <RadixDropDown.Trigger asChild>
            {React.isValidElement(trigger)
              ? React.cloneElement(trigger, props)
              : trigger}
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
  }
);

DropDown.displayName = "DropDown";
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
      {React.isValidElement(item) ? React.cloneElement(item, props) : item}
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
