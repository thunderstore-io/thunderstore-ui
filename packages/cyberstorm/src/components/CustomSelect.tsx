import React, { Dispatch, ReactNode, SetStateAction } from "react";
import styles from "./componentStyles/CustomSelect.module.css";
import { Button } from "./Button";
import { CustomSelectItem } from "./CustomSelectItem";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as Select from "@radix-ui/react-select";
import { SelectItem } from "@radix-ui/react-select";

export type SelectOption = {
  value: string;
  label?: string;
  leftIcon?: ReactNode;
};

type SelectProps = {
  colorScheme?: "default" | "defaultDark" | "primary";
  defaultOpen?: boolean;
  icon?: ReactNode;
  onChange: Dispatch<SetStateAction<string>>;
  options: SelectOption[];
  placeholder?: string;
  value: string;
};

export const CustomSelect: React.FC<SelectProps> = (props) => {
  const {
    colorScheme,
    defaultOpen,
    icon,
    options,
    onChange,
    placeholder,
    value,
  } = props;

  const selectItemElements = options
    ? mapSelectData(options, colorScheme)
    : null;

  return (
    <div className={styles.root}>
      <Select.Root
        defaultOpen={defaultOpen}
        value={value}
        onValueChange={onChange}
        disabled={options.length == 0}
      >
        <Select.Trigger asChild>
          <div>
            <Button
              colorScheme={colorScheme}
              rightIcon={icon}
              label={
                options?.find((o) => o.value === value)?.label ?? placeholder
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
  colorScheme: "default",
  defaultOpen: false,
  icon: (
    <FontAwesomeIcon fixedWidth icon={faChevronDown} className="selectIcon" />
  ),
  placeholder: "Choose",
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
  return options.map((option, index) => (
    <SelectItem value={option.value} key={index} asChild>
      <div>
        <CustomSelectItem
          colorScheme={colorScheme}
          leftIcon={option.leftIcon}
          label={option.label}
        />
      </div>
    </SelectItem>
  ));
};
