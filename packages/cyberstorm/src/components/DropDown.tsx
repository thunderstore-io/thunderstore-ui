import React, { ReactNode } from "react";
import styles from "./componentStyles/DropDown.module.css";
import { Button } from "./Button";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export interface DropDownProps {
  label?: string;
  icon?: ReactNode;
  defaultOpen: boolean;
  dropDownItems?: ReactNode[];
  colorScheme?: "default";
}

export const DropDown: React.FC<DropDownProps> = (props) => {
  const { label, icon, colorScheme, defaultOpen, dropDownItems } = props;

  console.log(dropDownItems);
  //console.log(dropDownItemElements);
  const dropDownItemElements = dropDownItems
    ? dropDownItems.map((value, index) => {
        return (
          <DropdownMenu.Item key={index} asChild>
            <span>{value}</span>
          </DropdownMenu.Item>
        );
      })
    : null;

  return (
    <div className={`${styles.root} ${getStyle(colorScheme)}`}>
      <DropdownMenu.Root defaultOpen={defaultOpen}>
        <DropdownMenu.Trigger asChild className={styles.trigger}>
          <span>
            <Button colorScheme={colorScheme} rightIcon={icon} label={label} />
          </span>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align={"start"}
            sideOffset={8}
            className={styles.content}
          >
            <DropdownMenu.Group className={styles.group}>
              {dropDownItemElements}
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};

DropDown.defaultProps = {
  dropDownItems: [],
  defaultOpen: true,
  colorScheme: "default",
  icon: (
    <FontAwesomeIcon
      fixedWidth={true}
      icon={faChevronDown}
      className={"dropDownIcon"}
    />
  ),
};

const getStyle = (scheme: DropDownProps["colorScheme"] = "default") => {
  return {
    default: styles.dropDown__default,
  }[scheme];
};
