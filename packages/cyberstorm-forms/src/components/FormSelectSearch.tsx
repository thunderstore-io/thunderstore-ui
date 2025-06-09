import { z, ZodObject, ZodRawShape } from "zod";
import { Path, useController } from "react-hook-form";
import { NewSelectSearch } from "@thunderstore/cyberstorm";
import styles from "./FormTextInput.module.css";
import { SelectOption } from "@thunderstore/cyberstorm/src/newComponents/SelectSearch/SelectSearch";
import { SelectSearchModifiers } from "@thunderstore/cyberstorm-theme/src/components";

export type FormSelectSearchProps<
  Schema extends ZodObject<Z>,
  Z extends ZodRawShape,
> = {
  // The schema is required to allow TS to infer valid values for the name field
  schema: Schema;
  name: Path<z.infer<Schema>>;
  placeholder?: string;
  options: SelectOption<string>[];
  multiple?: boolean;
};
export function FormSelectSearch<
  Schema extends ZodObject<Z>,
  Z extends ZodRawShape,
>({ name, placeholder, options, multiple }: FormSelectSearchProps<Schema, Z>) {
  const {
    field,
    fieldState: { isDirty, invalid, error },
    formState: { isSubmitting, disabled },
  } = useController({ name });

  let modifiers: SelectSearchModifiers[] = [];
  if (isDirty || invalid) {
    modifiers = ["invalid"];
  }

  return (
    <>
      <NewSelectSearch
        {...field}
        ref={field.ref}
        placeholder={placeholder}
        csModifiers={modifiers}
        disabled={isSubmitting || disabled}
        options={options}
        multiple={multiple}
      />
      {error && <span className={styles.errorMessage}>{error.message}</span>}
    </>
  );
}

FormSelectSearch.displayName = "FormSelectSearch";
