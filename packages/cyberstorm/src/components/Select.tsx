import React, { Dispatch, ReactNode, SetStateAction } from "react";
import styles from "./componentStyles/Select.module.css";
import { Button } from "./Button";
import { SelectItem } from "./SelectItem";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as RadixSelect from "@radix-ui/react-select";

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

export const Select: React.FC<SelectProps> = React.forwardRef((props, ref) => {
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
    <div {...props} ref={ref} className={styles.root}>
      <RadixSelect.Root
        defaultOpen={defaultOpen}
        value={value}
        onValueChange={onChange}
        disabled={options.length == 0}
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

        <RadixSelect.Portal>
          <RadixSelect.Content
            className={`${styles.content} ${getContentStyle(colorScheme)}`}
          >
            {selectItemElements}
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </div>
  );
});

Select.displayName = "Select";
Select.defaultProps = {
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
    <RadixSelect.Item value={option.value} key={index} asChild>
      <SelectItem
        colorScheme={colorScheme}
        leftIcon={option.leftIcon}
        label={option.label}
      />
    </RadixSelect.Item>
  ));
};
