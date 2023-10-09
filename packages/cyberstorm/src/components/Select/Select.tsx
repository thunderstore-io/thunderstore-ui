"use client";
import React, { ReactNode } from "react";
import styles from "./Select.module.css";
import * as Button from "../Button/";
import * as MenuItem from "../MenuItem/";
import { faCaretDown } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as RadixSelect from "@radix-ui/react-select";
import { Icon } from "../Icon/Icon";

export type SelectOption = {
  value: string;
  label?: string;
  leftIcon?: ReactNode;
};

type _SelectProps = {
  variant?: "default" | "accent" | "wide";
  defaultOpen?: boolean;
  icon?: ReactNode;
  onChange?: (val: string) => void;
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  triggerFontSize?: "small" | "medium" | "large" | "huge";
};
export type SelectProps = _SelectProps &
  Omit<React.HTMLProps<HTMLDivElement>, keyof _SelectProps>;

export function Select(props: SelectProps) {
  const {
    variant = "default",
    defaultOpen = false,
    icon = (
      <Icon>
        <FontAwesomeIcon icon={faCaretDown} />
      </Icon>
    ),
    options,
    onChange,
    placeholder = "Select",
    value,
    triggerFontSize = "large",
    ...forwardedProps
  } = props;

  const selectItemElements = options ? mapSelectData(options) : null;

  return (
    <div {...forwardedProps} className={styles.root}>
      <RadixSelect.Root
        defaultOpen={defaultOpen}
        value={value}
        onValueChange={onChange}
        disabled={options.length === 0}
      >
        <RadixSelect.Trigger asChild>
          <Button.Root
            iconAlignment="side"
            colorScheme="wideDarker"
            paddingSize="large"
          >
            <Button.ButtonLabel fontSize={triggerFontSize}>
              {options?.find((o) => o.value === value)?.label ?? placeholder}
            </Button.ButtonLabel>
            <Button.ButtonIcon iconColor="darker">{icon}</Button.ButtonIcon>
          </Button.Root>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={4}
            className={`${styles.content} ${getContentStyle(variant)}`}
          >
            {selectItemElements}
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </div>
  );
}

Select.displayName = "Select";

const getContentStyle = (scheme: SelectProps["variant"] = "default") => {
  return {
    default: styles.content__default,
    accent: styles.content__accent,
    wide: styles.content__wide,
  }[scheme];
};

const mapSelectData = (options: SelectOption[]) => {
  return options.map((option, index) => (
    <RadixSelect.Item value={option.value} key={index} asChild>
      <MenuItem.Root>
        {option.leftIcon ? (
          <MenuItem.MenuItemIcon>{option.leftIcon}</MenuItem.MenuItemIcon>
        ) : null}
        {option.label ? (
          <MenuItem.MenuItemLabel fontSize="small">
            {option.label}
          </MenuItem.MenuItemLabel>
        ) : null}
        {!option.label && !option.leftIcon ? (
          <MenuItem.MenuItemLabel fontSize="small">
            {option.value}
          </MenuItem.MenuItemLabel>
        ) : null}
      </MenuItem.Root>
    </RadixSelect.Item>
  ));
};
