"use client";

import { z, ZodObject } from "zod";
import { ZodRawShape } from "zod/lib/types";
import { Path, useController } from "react-hook-form";
import {
  MultiSelectSearch,
  MultiSelectSearchOption,
} from "@thunderstore/cyberstorm";
import styles from "./FormTextInput.module.css";

export type FormMultiSelectSearchProps<
  Schema extends ZodObject<Z>,
  Z extends ZodRawShape
> = {
  // The schema is required to allow TS to infer valid values for the name field
  schema: Schema;
  name: Path<z.infer<Schema>>;
  placeholder?: string;
  options: MultiSelectSearchOption[];
  parseBeforeOnChange?: (v: { value: string; label: string }[]) => void;
};
export function FormMultiSelectSearch<
  Schema extends ZodObject<Z>,
  Z extends ZodRawShape
>({
  name,
  placeholder,
  options,
  parseBeforeOnChange,
}: FormMultiSelectSearchProps<Schema, Z>) {
  const {
    field,
    fieldState: { isDirty, invalid, error },
    formState: { isSubmitting, disabled },
  } = useController({ name });

  return (
    <>
      <MultiSelectSearch
        {...field}
        parseBeforeOnChange={parseBeforeOnChange}
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

FormMultiSelectSearch.displayName = "FormMultiSelectSearch";
