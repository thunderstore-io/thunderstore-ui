import React, { ReactNode } from "react";
import styles from "./componentStyles/CustomDropDown.module.css";
import { Button } from "./Button";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { SelectItemProps } from "./CustomSelectItem";

type DropDownProps = {
  colorScheme?: "default" | "defaultDark" | "primary";
  defaultOpen?: boolean;
  icon?: ReactNode;
  content?: ReactNode[];
  label?: string;
};

export const CustomDropDown: React.FC<DropDownProps> = (props) => {
  const { colorScheme, defaultOpen, icon, content, label } = props;

  return (
    <div className={styles.root}>
      <DropdownMenu.Root defaultOpen={defaultOpen}>
        <DropdownMenu.Trigger asChild>
          <div>
            <Button label={label} colorScheme={colorScheme} rightIcon={icon} />
          </div>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="start"
            sideOffset={8}
            className={`${styles.content} ${getContentStyle(colorScheme)}`}
          >
            <DropdownMenu.Group className={styles.group}>
              {parseContent(content, colorScheme)}
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};

CustomDropDown.defaultProps = {
  defaultOpen: false,
  colorScheme: "default",
  icon: (
    <FontAwesomeIcon fixedWidth icon={faChevronDown} className="selectIcon" />
  ),
  label: "...",
};

const parseContent = (
  content: ReactNode[] | undefined,
  colorScheme: "default" | "defaultDark" | "primary" | undefined
) => {
  const props = { colorScheme } as SelectItemProps;
  return content?.map((item, index) => (
    <DropdownMenu.Item key={index} asChild>
      <div>
        {React.isValidElement(item) ? React.cloneElement(item, props) : item}
      </div>
    </DropdownMenu.Item>
  ));
};

const getContentStyle = (scheme: DropDownProps["colorScheme"] = "default") => {
  return {
    default: styles.content__default,
    defaultDark: styles.content__defaultDark,
    primary: styles.content__primary,
  }[scheme];
};
