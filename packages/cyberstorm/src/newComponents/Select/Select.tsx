import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { type ReactElement, memo } from "react";

import type { SelectOption } from "../../utils/types";
import { classnames, componentClasses } from "../../utils/utils";
import { Button as NewButton } from "../Button/Button";
import {
  DropDown,
  DropDownRadioGroup,
  DropDownRadioItem,
} from "../DropDown/DropDown";
import { Icon as NewIcon } from "../Icon/Icon";
import "./Select.css";
import {
  type SelectModifiers,
  type SelectSizes,
  type SelectVariants,
} from "./Select.types";

type _SelectProps<T> = {
  variant?: "default" | "accent" | "wide";
  defaultOpen?: boolean;
  disabled?: boolean;
  icon?: ReactElement;
  onChange?: (val: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  value?: string;
  rootClasses?: string;
  csVariant?: SelectVariants;
  csSize?: SelectSizes;
  csModifiers?: SelectModifiers[];
};

export type SelectProps<T> = _SelectProps<T> &
  Omit<React.HTMLProps<HTMLDivElement>, keyof _SelectProps<T>>;

function SelectComponent<T extends string>(props: SelectProps<T>) {
  const {
    defaultOpen = false,
    disabled = false,
    icon = (
      <NewIcon csMode="inline" noWrapper>
        <FontAwesomeIcon icon={faCaretDown} />
      </NewIcon>
    ),
    options,
    onChange,
    placeholder = "Select",
    value,
    csVariant = "default",
    csSize = "medium",
    csModifiers,
    rootClasses,
    id,
    "aria-label": ariaLabel,
  } = props;

  const selectedOption = options.find((option) => option.value === value);
  const isDisabled =
    disabled || csModifiers?.includes("disabled") || options.length === 0;

  return (
    <DropDown
      defaultOpen={defaultOpen}
      disabled={isDisabled}
      rootClasses="select"
      trigger={
        <NewButton
          type="button"
          id={id}
          csVariant="secondary"
          csSize={csSize}
          aria-label={ariaLabel}
          disabled={isDisabled}
          rootClasses={classnames(
            "select__trigger",
            ...componentClasses(
              "select__trigger",
              csVariant,
              csSize,
              csModifiers
            ),
            rootClasses
          )}
        >
          {selectedOption?.leftIcon ? (
            <NewIcon csMode="inline" noWrapper csVariant="accent">
              {selectedOption.leftIcon}
            </NewIcon>
          ) : null}
          {selectedOption?.label ?? placeholder}
          {!selectedOption?.label && !selectedOption?.leftIcon
            ? selectedOption?.value
            : null}
          {icon}
        </NewButton>
      }
    >
      <DropDownRadioGroup
        value={value}
        onValueChange={(next) => onChange?.(next as T)}
      >
        {options.map((option, index) => (
          <DropDownRadioItem
            key={`${option.value}-${index}`}
            value={option.value}
            rootClasses="select__option"
          >
            <button type="button">
              {option.leftIcon ? (
                <NewIcon csMode="inline" noWrapper>
                  {option.leftIcon}
                </NewIcon>
              ) : null}
              {option.label}
              {!option.label && !option.leftIcon ? option.value : null}
            </button>
          </DropDownRadioItem>
        ))}
      </DropDownRadioGroup>
    </DropDown>
  );
}

SelectComponent.displayName = "Select";

export const Select = memo(SelectComponent) as typeof SelectComponent;
