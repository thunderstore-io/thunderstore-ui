import React, { ReactNode, useState } from "react";
import styles from "./componentStyles/DropDown.module.css";
import { Button } from "./Button";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { DropDownItem, DropDownItemProps } from "./DropDownItem";

export type DropDownOption = {
  value: number | string;
  content: typeof DropDownItem;
  displayValue?: string;
};

type DropDownProps = {
  colorScheme?: "default" | "defaultDark" | "primary";
  defaultOpen?: boolean;
  defaultValue?: number | string;
  icon?: ReactNode;
  options?: DropDownOption[];
};

export const DropDown: React.FC<DropDownProps> = (props) => {
  const { colorScheme, defaultOpen, defaultValue, icon, options } = props;

  const initialValue =
    options?.find((o) => o.value === defaultValue) ??
    options?.values().next().value ?? // Default to first item if defaultValue isn't set
    null;

  const [value, setValue] = useState(initialValue);

  const dropDownItemElements = options
    ? mapDropDownData(options, colorScheme, setValue)
    : null;

  return (
    <div className={styles.root}>
      <DropdownMenu.Root defaultOpen={defaultOpen}>
        <DropdownMenu.Trigger asChild>
          <div>
            <Button
              colorScheme={colorScheme}
              rightIcon={icon}
              label={value?.displayValue ?? value?.value ?? ""}
            />
          </div>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="start"
            sideOffset={8}
            className={`${styles.content} ${getContentStyle(colorScheme)}`}
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
  defaultOpen: false,
  colorScheme: "default",
  icon: (
    <FontAwesomeIcon fixedWidth icon={faChevronDown} className="dropDownIcon" />
  ),
};

const getContentStyle = (scheme: DropDownProps["colorScheme"] = "default") => {
  return {
    default: styles.content__default,
    defaultDark: styles.content__defaultDark,
    primary: styles.content__primary,
  }[scheme];
};

const mapDropDownData = (
  options: DropDownOption[],
  colorScheme: "default" | "defaultDark" | "primary" | undefined,
  setValue: React.Dispatch<React.SetStateAction<DropDownOption | null>>
) => {
  const props = { colorScheme } as DropDownItemProps;

  return options.map((option, index) => {
    return (
      <DropdownMenu.Item onSelect={() => setValue(option)} key={index} asChild>
        <div>
          {React.isValidElement(option.content)
            ? React.cloneElement(option.content, props)
            : null}
        </div>
      </DropdownMenu.Item>
    );
  });
};
