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
  onChangeParse: (
    selected: MultiSelectSearchOption[],
    // TODO: To Mythic. How do I get the right type for this? Tried to get it to be the zod fields value.
    //  You can check if it's correct in the UploadPackageForm.tsx's this component usages onChangeParse.
    onChange: (v: unknown) => void
  ) => void;
};
export function FormMultiSelectSearch<
  Schema extends ZodObject<Z>,
  Z extends ZodRawShape
>({
  name,
  placeholder,
  options,
  onChangeParse,
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
        onChange={(selected) => onChangeParse(selected, field.onChange)}
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
