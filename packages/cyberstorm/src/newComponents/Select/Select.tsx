import React from "react";
import styles from "./Select.module.css";
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
import { classnames } from "../../utils/utils";
import { Container, NewButton, NewIcon } from "../..";

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
};

export type SelectProps<T extends string = string> = _SelectProps<T> &
  Omit<React.HTMLProps<HTMLDivElement>, keyof _SelectProps<T>>;

// TODO: COLOR SYSTEM IMPLEMENTATION IS MISSING IN CSS
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
    ...forwardedProps
  } = props;

  const selectItemElements = options ? mapSelectData(options) : null;
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
          csSize="m"
          csColor="surface-alpha"
          csTextStyles={["fontSizeS", "fontWeightBold", "lineHeightAuto"]}
          aria-label={forwardedProps["aria-label"]}
          rootClasses={classnames(styles.trigger, forwardedProps.rootClasses)}
        >
          <span className={styles.iconAndLabel}>
            {selectedOption?.leftIcon ? (
              <NewIcon csMode="inline" noWrapper csVariant="accent">
                {selectedOption?.leftIcon}
              </NewIcon>
            ) : null}
            {selectedOption?.label ?? placeholder}
            {!selectedOption?.label && !selectedOption?.leftIcon
              ? selectedOption?.value
              : null}
          </span>
          {icon}
        </NewButton>
      </Trigger>

      <Portal>
        <Content
          position="popper"
          sideOffset={4}
          className={classnames(styles.content)}
        >
          <Viewport>{selectItemElements}</Viewport>
        </Content>
      </Portal>
    </Root>
  );
}

Select.displayName = "Select";

const mapSelectData = (options: SelectOption[]) => {
  return options.map((option, index) => (
    <Item value={option.value} key={index} asChild>
      <Container
        rootClasses={styles.item}
        csVariant="secondary"
        csColor="surface"
        csTextStyles={["fontSizeS", "fontWeightMedium"]}
      >
        <NewIcon csMode="inline" noWrapper>
          {option.leftIcon}
        </NewIcon>
        {option.label}
        {!option.label && !option.leftIcon ? option.value : null}
      </Container>
    </Item>
  ));
};
