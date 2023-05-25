"use client";
import React, { ReactNode } from "react";
import styles from "./Select.module.css";
import { Button } from "../Button/Button";
import { MenuItem } from "../MenuItem/MenuItem";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as RadixSelect from "@radix-ui/react-select";

export type SelectOption = {
  value: string;
  label?: string;
  leftIcon?: ReactNode;
};

type _SelectProps = {
  colorScheme?: "default" | "defaultDark" | "primary";
  defaultOpen?: boolean;
  icon?: ReactNode;
  onChange?: (val: string) => void;
  options: SelectOption[];
  placeholder?: string;
  value?: string;
};
export type SelectProps = _SelectProps &
  Omit<React.HTMLProps<HTMLDivElement>, keyof _SelectProps>;

export function Select(props: SelectProps) {
  const {
    colorScheme = "default",
    defaultOpen = false,
    icon = <FontAwesomeIcon fixedWidth icon={faChevronDown} />,
    options,
    onChange,
    placeholder = "Select",
    value,
    ...forwardedProps
  } = props;

  const selectItemElements = options
    ? mapSelectData(options, colorScheme)
    : null;

  return (
    <div {...forwardedProps} className={styles.root}>
      <RadixSelect.Root
        defaultOpen={defaultOpen}
        value={value}
        onValueChange={onChange}
        disabled={options.length === 0}
      >
        <RadixSelect.Trigger asChild>
          <Button
            colorScheme={colorScheme}
            rightIcon={icon}
            label={
              options?.find((o) => o.value === value)?.label ?? placeholder
            }
          />
        </RadixSelect.Trigger>

        <RadixSelect.Content
          position="popper"
          className={`${styles.content} ${getContentStyle(colorScheme)}`}
        >
          {selectItemElements}
        </RadixSelect.Content>
      </RadixSelect.Root>
    </div>
  );
}

Select.displayName = "Select";

const getContentStyle = (scheme: SelectProps["colorScheme"] = "default") => {
  return {
    default: styles.content__default,
    defaultDark: styles.content__defaultDark,
    primary: styles.content__primary,
  }[scheme];
};

const mapSelectData = (
  options: SelectOption[],
  colorScheme: "default" | "defaultDark" | "primary" | undefined
) => {
  return options.map((option, index) => (
    <RadixSelect.Item value={option.value} key={index} asChild>
      <MenuItem
        colorScheme={colorScheme}
        leftIcon={option.leftIcon}
        label={option.label}
      />
    </RadixSelect.Item>
  ));
};
