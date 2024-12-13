"use client";

import { z, ZodObject, ZodRawShape } from "zod";
import { Path, useController } from "react-hook-form";
import { TextInput } from "@thunderstore/cyberstorm";
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
>({ name, placeholder, existingValue }: FormTextInputProps<Schema, Z>) {
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

  return (
    <>
      <TextInput
        {...field}
        ref={field.ref}
        placeholder={placeholder}
        color={isDirty || invalid ? (invalid ? "red" : "green") : undefined}
        disabled={isSubmitting || disabled}
      />
      {error && <span className={styles.errorMessage}>{error.message}</span>}
    </>
  );
}

FormTextInput.displayName = "FormTextInput";
