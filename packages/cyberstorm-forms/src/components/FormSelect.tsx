"use client";

import { z, ZodObject } from "zod";
import { ZodRawShape } from "zod/lib/types";
import { Path, useController } from "react-hook-form";
import styles from "./FormSelect.module.css";
import * as Select from "@radix-ui/react-select";
import React, { PropsWithChildren } from "react";
import { Icon } from "@thunderstore/cyberstorm";
import { faCaretDown, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
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
  defaultValue?: string;
  ariaLabel?: string;
};
export function FormSelect<Schema extends ZodObject<Z>, Z extends ZodRawShape>({
  name,
  defaultValue,
  options,
  ariaLabel,
}: FormSelectProps<Schema, Z>) {
  const {
    field,
    fieldState: { error },
    formState: { isSubmitting, disabled },
  } = useController({ name });

  if (defaultValue) {
    React.useEffect(() => {
      field.onChange(defaultValue);
    }, [defaultValue]);
  }

  return (
    <>
      <TempSelect
        {...field}
        options={options}
        ariaLabel={ariaLabel}
        disabled={isSubmitting || disabled}
        defaultValue={defaultValue}
      />
      {error && <span className={styles.errorMessage}>{error.message}</span>}
    </>
  );
}

FormSelect.displayName = "FormSelect";

interface TempSelectProps {
  options: { value: string; label: string }[];
  onChange: (val: string) => void;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  ariaLabel?: string;
  defaultValue?: string;
}

const TempSelect = React.forwardRef<HTMLButtonElement, TempSelectProps>(
  function SelectDemo(props, ref) {
    return (
      <Select.Root
        disabled={props.disabled}
        onValueChange={props.onChange}
        defaultValue={props.defaultValue}
      >
        <Select.Trigger
          className={styles.SelectTrigger}
          aria-label={props.ariaLabel}
        >
          <Select.Value placeholder={props.placeholder} ref={ref} />
          <Select.Icon className={styles.SelectIcon}>
            <Icon inline>
              <FontAwesomeIcon icon={faCaretDown} />
            </Icon>
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content position="popper" className={styles.SelectContent}>
            <Select.Viewport className={styles.SelectViewport}>
              {props.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    );
  }
);

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
    <Select.Item value={value} disabled={disabled} ref={forwardedRef}>
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className={styles.SelectItemIndicator}>
        <Icon inline>
          <FontAwesomeIcon icon={faCheckCircle} />
        </Icon>
      </Select.ItemIndicator>
    </Select.Item>
  );
});

SelectItem.displayName = "SelectItem";
