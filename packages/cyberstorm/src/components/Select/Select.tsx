"use client";
import React from "react";
import styles from "./Select.module.css";
import * as Button from "../Button/";
import * as MenuItem from "../MenuItem/";
import { faCaretDown } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Root, Content, Item, Portal, Trigger } from "@radix-ui/react-select";
import { classnames } from "../../utils/utils";

type SelectOption<T extends string = string> = {
  value: T;
  label?: string;
  leftIcon?: JSX.Element;
};

type _SelectProps<T extends string = string> = {
  variant?: "default" | "accent" | "wide";
  defaultOpen?: boolean;
  icon?: JSX.Element;
  onChange?: (val: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  value?: string;
  triggerFontSize?: "small" | "medium" | "large" | "huge";
};

export type SelectProps<T extends string = string> = _SelectProps<T> &
  Omit<React.HTMLProps<HTMLDivElement>, keyof _SelectProps<T>>;

export function Select<T extends string>(props: SelectProps<T>) {
  const {
    variant = "default",
    defaultOpen = false,
    icon = <FontAwesomeIcon icon={faCaretDown} />,
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
      <Root
        defaultOpen={defaultOpen}
        value={value}
        onValueChange={onChange}
        disabled={options.length === 0}
      >
        <Trigger asChild>
          <Button.Root
            iconAlignment="side"
            colorScheme="wideDarker"
            paddingSize="largeBorderCompensated"
          >
            <Button.ButtonLabel fontSize={triggerFontSize}>
              {options?.find((o) => o.value === value)?.label ?? placeholder}
            </Button.ButtonLabel>
            <Button.ButtonIcon iconColor="darker">{icon}</Button.ButtonIcon>
          </Button.Root>
        </Trigger>

        <Portal>
          <Content
            position="popper"
            sideOffset={4}
            className={classnames(styles.content, getContentStyle(variant))}
          >
            {selectItemElements}
          </Content>
        </Portal>
      </Root>
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
    <Item value={option.value} key={index} asChild>
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
    </Item>
  ));
};
