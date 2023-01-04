import React, { ReactElement, ReactNode, useState } from "react";
import styles from "./componentStyles/DropDown.module.css";
import { Button } from "./Button";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { DropDownItemProps } from "./DropDownItem";

type DropDownProps = {
  icon?: ReactNode;
  defaultOpen?: boolean;
  options?: DropDownOptions;
  colorScheme?: "default" | "defaultDark" | "primary";
  defaultSelectedOptionKey?: number;
};

export type DropDownOption = {
  label: string;
  content?: ReactElement<DropDownItemProps>;
};
export type DropDownOptions = Map<number | string, DropDownOption>;

export const DropDown: React.FC<DropDownProps> = (props) => {
  const { icon, colorScheme, defaultOpen, options, defaultSelectedOptionKey } =
    props;

  let initialValue: DropDownOption | null =
    options?.values().next().value ?? null;

  if (
    options &&
    defaultSelectedOptionKey &&
    options.get(defaultSelectedOptionKey)
  ) {
    initialValue = options.get(defaultSelectedOptionKey) ?? null;
  }

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
              label={value?.label ?? ""}
            />
          </div>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align={"start"}
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
    <FontAwesomeIcon
      fixedWidth={true}
      icon={faChevronDown}
      className={"dropDownIcon"}
    />
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
  options: DropDownOptions,
  colorScheme: "default" | "defaultDark" | "primary" | undefined,
  setValue: React.Dispatch<React.SetStateAction<DropDownOption | null>>
) => {
  const props = { colorScheme } as DropDownItemProps;

  const mappedOptions: Array<ReactElement> = [];
  options.forEach((option, index) => {
    mappedOptions.push(
      <DropdownMenu.Item onSelect={() => setValue(option)} key={index} asChild>
        <div>
          {React.isValidElement(option.content)
            ? React.cloneElement(option.content, props)
            : null}
        </div>
      </DropdownMenu.Item>
    );
  });
  return mappedOptions;
};
