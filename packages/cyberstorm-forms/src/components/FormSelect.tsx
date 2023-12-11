"use client";

import { z, ZodObject, ZodRawShape } from "zod";
import { Path, useController } from "react-hook-form";
import styles from "./FormSelect.module.css";
import * as RadixSelect from "@radix-ui/react-select";
import React, { PropsWithChildren } from "react";
import { Icon } from "@thunderstore/cyberstorm";
import { faCaretDown, faCheckCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export type FormSelectProps<
  Schema extends ZodObject<Z>,
  Z extends ZodRawShape
> = {
  // The schema is required to allow TS to infer valid values for the name field
  schema: Schema;
  name: Path<z.infer<Schema>>;
  options: { value: string; label: string }[];
  placeholder?: string;
  ariaLabel: string;
};
export function FormSelect<Schema extends ZodObject<Z>, Z extends ZodRawShape>({
  name,
  options,
  placeholder,
  ariaLabel,
}: FormSelectProps<Schema, Z>) {
  const {
    field,
    fieldState: { error },
    formState: { isSubmitting, disabled },
  } = useController({ name });

  return (
    <>
      <Select
        {...field}
        disabled={isSubmitting || disabled}
        options={options}
        placeholder={placeholder}
        ariaLabel={ariaLabel}
      />
      {error && <span className={styles.errorMessage}>{error.message}</span>}
    </>
  );
}

FormSelect.displayName = "FormSelect";

interface SelectProps {
  options: { value: string; label: string }[];
  onChange: (val: string) => void;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

/**
 * TODO: THIS COMPONENT SHOULD BE REMOVED AND REPLACED WHEN CYBERSTORM Select component SUPPORTS FORMS
 */
const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  function SelectDemo(props, ref) {
    return (
      <RadixSelect.Root
        disabled={props.disabled}
        onValueChange={props.onChange}
      >
        <RadixSelect.Trigger
          className={styles.trigger}
          aria-label={props.ariaLabel}
        >
          <RadixSelect.Value placeholder={props.placeholder} ref={ref} />
          <RadixSelect.Icon className={styles.icon}>
            <Icon inline>
              <FontAwesomeIcon icon={faCaretDown} />
            </Icon>
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content position="popper" className={styles.content}>
            <RadixSelect.Viewport className={styles.viewport}>
              {props.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    );
  }
);

Select.displayName = "Select";

interface SelectItemProps {
  value: string;
  disabled?: boolean;
}

const SelectItem = React.forwardRef<
  HTMLDivElement,
  PropsWithChildren<SelectItemProps>
>((props: PropsWithChildren<SelectItemProps>, forwardedRef) => {
  const { value, disabled = false, children } = props;
  return (
    <RadixSelect.Item value={value} disabled={disabled} ref={forwardedRef}>
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
      <RadixSelect.ItemIndicator className={styles.SelectItemIndicator}>
        <Icon inline>
          <FontAwesomeIcon icon={faCheckCircle} />
        </Icon>
      </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  );
});

SelectItem.displayName = "SelectItem";
