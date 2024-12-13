import React from "react";
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
import { classnames, componentClasses } from "../../utils/utils";
import { NewButton, NewIcon } from "../..";
import {
  SelectModifiers,
  SelectSizes,
  SelectVariants,
} from "@thunderstore/cyberstorm-theme/src/components";

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
  rootClasses?: string;
  csVariant?: SelectVariants;
  csSize?: SelectSizes;
  csModifiers?: SelectModifiers[];
};

export type SelectProps<T extends string = string> = _SelectProps<T> &
  Omit<React.HTMLProps<HTMLDivElement>, keyof _SelectProps<T>>;

// TODO: Rework to use regular select preferrably
// or atleast ensure a11y stuff works
export function Select<T extends string>(props: SelectProps<T>) {
  const {
    defaultOpen = false,
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
      disabled={options.length === 0}
    >
      <Trigger asChild>
        <NewButton
          csVariant="secondary"
          csSize="medium"
          aria-label={forwardedProps["aria-label"]}
          rootClasses={classnames(
            "ts-select__trigger",
            ...componentClasses(csVariant, csSize, csModifiers),
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
            "ts-select",
            ...componentClasses(csVariant, csSize, csModifiers)
          )}
        >
          <Viewport>{selectItemElements}</Viewport>
        </Content>
      </Portal>
    </Root>
  );
}

Select.displayName = "Select";

const mapSelectData = (
  options: SelectOption[],
  csVariant: SelectVariants,
  csSize: SelectSizes,
  csModifiers?: SelectModifiers[]
) => {
  return options.map((option, index) => (
    <Item value={option.value} key={index} asChild>
      <div
        className={classnames(
          "ts-select__item",
          ...componentClasses(csVariant, csSize, csModifiers)
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
};
