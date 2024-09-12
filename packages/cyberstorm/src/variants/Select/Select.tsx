import React from "react";
import styles from "./Select.module.css";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Root, Content, Item, Portal, Trigger } from "@radix-ui/react-select";
import { classnames } from "../../utils/utils";
import { Container, Icon, NewButton } from "../..";

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
};

export type SelectProps<T extends string = string> = _SelectProps<T> &
  Omit<React.HTMLProps<HTMLDivElement>, keyof _SelectProps<T>>;

export function Select<T extends string>(props: SelectProps<T>) {
  const {
    defaultOpen = false,
    icon = (
      <Icon inline>
        <FontAwesomeIcon icon={faCaretDown} />
      </Icon>
    ),
    options,
    onChange,
    placeholder = "Select",
    value,
  } = props;

  const selectItemElements = options ? mapSelectData(options) : null;

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
          csColor="surface"
          csTextStyles={["fontSizeS", "fontWeightBold", "lineHeightAuto"]}
        >
          {options?.find((o) => o.value === value)?.label ?? placeholder}
          {icon}
        </NewButton>
      </Trigger>

      <Portal>
        <Content
          position="popper"
          sideOffset={4}
          className={classnames(styles.content)}
        >
          {selectItemElements}
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
        <Icon inline>{option.leftIcon}</Icon>
        {option.label}
        {!option.label && !option.leftIcon ? option.value : null}
      </Container>
    </Item>
  ));
};
