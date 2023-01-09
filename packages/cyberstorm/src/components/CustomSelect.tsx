import React, { ReactNode } from "react";
import styles from "./componentStyles/Select.module.css";
import { Button } from "./Button";
import { CustomSelectItem, SelectItemProps } from "./CustomSelectItem";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as Select from "@radix-ui/react-select";
import { SelectItem } from "@radix-ui/react-select";

export type SelectOption = {
  value: string;
  content: typeof CustomSelectItem;
  displayValue?: string;
};

type SelectProps = {
  colorScheme?: "default" | "defaultDark" | "primary";
  defaultOpen?: boolean;
  icon?: ReactNode;
  options?: SelectOption[];
  setValue: CallableFunction;
  value: string;
};

export const CustomSelect: React.FC<SelectProps> = (props) => {
  const { colorScheme, defaultOpen, icon, options, setValue, value } = props;

  const selectItemElements = options
    ? mapSelectData(options, colorScheme)
    : null;

  return (
    <div className={styles.root}>
      <Select.Root
        defaultOpen={defaultOpen}
        value={value}
        onValueChange={(newValue) =>
          setValue !== undefined ? setValue(newValue) : null
        }
      >
        <Select.Trigger asChild>
          <div>
            <Button
              colorScheme={colorScheme}
              rightIcon={icon}
              label={
                options?.find((o) => o.value === value)?.displayValue ?? ""
              }
            />
          </div>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className={`${styles.content} ${getContentStyle(colorScheme)}`}
          >
            <Select.Group className={styles.group}>
              {selectItemElements}
            </Select.Group>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};

CustomSelect.defaultProps = {
  defaultOpen: false,
  colorScheme: "default",
  icon: (
    <FontAwesomeIcon fixedWidth icon={faChevronDown} className="selectIcon" />
  ),
};

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
  const props = { colorScheme } as SelectItemProps;

  return options.map((option, index) => {
    return (
      <SelectItem value={option.value} key={index} asChild>
        <div>
          {React.isValidElement(option.content)
            ? React.cloneElement(option.content, props)
            : null}
        </div>
      </SelectItem>
    );
  });
};
