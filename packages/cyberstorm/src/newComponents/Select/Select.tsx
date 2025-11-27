import React, { memo, type ReactElement } from "react";
import "./Select.css";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  Root,
  Content,
  Item,
  Portal,
  Trigger,
  Viewport,
} from "@radix-ui/react-select";
import type { SelectOption } from "../../utils/types";
import { classnames, componentClasses } from "../../utils/utils";
import { NewButton, NewIcon } from "../..";
import {
  type SelectModifiers,
  type SelectSizes,
  type SelectVariants,
} from "@thunderstore/cyberstorm-theme/src/components";

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

// TODO: Rework to use regular select preferrably
// or atleast ensure a11y stuff works
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
    ...forwardedProps
  } = props;

  const selectItemElements = options
    ? mapSelectData(options, csVariant, csSize, csModifiers)
    : null;
  const selectedOption = options?.find((o) => o.value === value);

  return (
    <Root
      defaultOpen={defaultOpen}
      value={value}
      onValueChange={onChange}
      disabled={disabled || options.length === 0}
    >
      <Trigger asChild>
        <NewButton
          csVariant="secondary"
          csSize={csSize}
          aria-label={forwardedProps["aria-label"]}
          rootClasses={classnames(
            "select__trigger",
            ...componentClasses(
              "select__trigger",
              csVariant,
              csSize,
              csModifiers
            ),
            forwardedProps.rootClasses
          )}
        >
          {selectedOption?.leftIcon ? (
            <NewIcon csMode="inline" noWrapper csVariant="accent">
              {selectedOption?.leftIcon}
            </NewIcon>
          ) : null}
          {selectedOption?.label ?? placeholder}
          {!selectedOption?.label && !selectedOption?.leftIcon
            ? selectedOption?.value
            : null}
          {icon}
        </NewButton>
      </Trigger>

      <Portal>
        <Content
          position="popper"
          sideOffset={4}
          className={classnames(
            "select",
            ...componentClasses("select", csVariant, csSize, csModifiers)
          )}
        >
          <Viewport>{selectItemElements}</Viewport>
        </Content>
      </Portal>
    </Root>
  );
}

SelectComponent.displayName = "Select";

export const Select = memo(SelectComponent) as typeof SelectComponent;

function mapSelectData<T extends string>(
  options: SelectOption<T>[],
  csVariant: SelectVariants,
  csSize: SelectSizes,
  csModifiers?: SelectModifiers[]
) {
  return options.map((option, index) => (
    <Item value={option.value} key={index} asChild>
      <div
        className={classnames(
          "select__item",
          ...componentClasses("select__item", csVariant, csSize, csModifiers)
        )}
      >
        <NewIcon csMode="inline" noWrapper>
          {option.leftIcon}
        </NewIcon>
        {option.label}
        {!option.label && !option.leftIcon ? option.value : null}
      </div>
    </Item>
  ));
}
