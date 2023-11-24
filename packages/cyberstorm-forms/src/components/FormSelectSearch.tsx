"use client";

import { z, ZodObject } from "zod";
import { ZodRawShape } from "zod/lib/types";
import { Path, useController } from "react-hook-form";
import { SelectSearch } from "@thunderstore/cyberstorm";
import styles from "./FormTextInput.module.css";

export type FormSelectSearchProps<
  Schema extends ZodObject<Z>,
  Z extends ZodRawShape
> = {
  // The schema is required to allow TS to infer valid values for the name field
  schema: Schema;
  name: Path<z.infer<Schema>>;
  placeholder?: string;
  options: string[];
};
export function FormSelectSearch<
  Schema extends ZodObject<Z>,
  Z extends ZodRawShape
>({ name, placeholder, options }: FormSelectSearchProps<Schema, Z>) {
  const {
    field,
    fieldState: { isDirty, invalid, error },
    formState: { isSubmitting, disabled },
  } = useController({ name });

  return (
    <>
      <SelectSearch
        {...field}
        ref={field.ref}
        placeholder={placeholder}
        color={isDirty || invalid ? (invalid ? "red" : "green") : undefined}
        disabled={isSubmitting || disabled}
        options={options}
      />
      {error && <span className={styles.errorMessage}>{error.message}</span>}
    </>
  );
}

FormSelectSearch.displayName = "FormSelectSearch";
