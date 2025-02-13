"use client";

import { z, ZodObject, ZodRawShape } from "zod";
import { Path, useController } from "react-hook-form";
import { NewTextInput, NewTextInputProps } from "@thunderstore/cyberstorm";
import styles from "./FormTextInput.module.css";
import React from "react";

export type FormTextInputProps<
  Schema extends ZodObject<Z>,
  Z extends ZodRawShape,
> = {
  // The schema is required to allow TS to infer valid values for the name field
  schema: Schema;
  name: Path<z.infer<Schema>>;
  placeholder?: string;
  existingValue?: string;
};
export function FormTextInput<
  Schema extends ZodObject<Z>,
  Z extends ZodRawShape,
>({
  name,
  placeholder,
  existingValue,
  clearValue,
  ...fProps
}: FormTextInputProps<Schema, Z> & NewTextInputProps) {
  const {
    field,
    fieldState: { isDirty, invalid, error },
    formState: { isSubmitting, disabled },
  } = useController({ name });

  if (existingValue) {
    React.useEffect(() => {
      field.onChange(existingValue);
    }, [existingValue]);
  }

  const clearFormValue = () => {
    field.onChange("");
    if (clearValue) clearValue();
  };

  return (
    <>
      <NewTextInput
        {...fProps}
        clearValue={clearFormValue}
        {...field}
        ref={field.ref}
        placeholder={placeholder}
        csModifiers={[
          isDirty || invalid ? (invalid ? "invalid" : "valid") : "",
          isSubmitting || disabled ? "disabled" : "",
        ]}
        disabled={isSubmitting || disabled}
      />
      {error && <span className={styles.errorMessage}>{error.message}</span>}
    </>
  );
}

FormTextInput.displayName = "FormTextInput";
