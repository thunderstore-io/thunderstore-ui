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

export const DropDown: React.FC<DropDownProps> = React.forwardRef(
  (props, ref) => {
    const {
      colorScheme,
      defaultOpen,
      content,
      trigger,
      triggerColorScheme,
      ...rest
    } = props;
    const triggerProps = Object.assign({}, rest, {
      colorScheme: triggerColorScheme ?? colorScheme,
    });

    return (
      <div className={styles.root} {...rest} ref={ref}>
        <RadixDropDown.Root defaultOpen={defaultOpen}>
          <RadixDropDown.Trigger asChild>
            {React.isValidElement(trigger)
              ? React.cloneElement(trigger, triggerProps)
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
  return content?.map((item, index) => (
    <RadixDropDown.Item key={index} asChild>
      {React.isValidElement(item)
        ? React.cloneElement(item, { colorScheme })
        : item}
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
